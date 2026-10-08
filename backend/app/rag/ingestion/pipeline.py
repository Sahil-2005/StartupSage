import uuid
import logging
from typing import Optional
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from app.core.config import settings
from app.db.mongo import db
from app.rag.ingestion.loaders import load_document
from app.rag.ingestion.cleaning import clean_text
from app.rag.ingestion.chunking import chunk_text
from app.rag.embedding import get_embedder

logger = logging.getLogger(__name__)

COLLECTION_NAME = "startupsage_chunks"

def get_qdrant_client():
    if settings.QDRANT_URL:
        return QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
    else:
        # Fallback to local persistent storage if no URL provided
        import os
        from app.core.config import BASE_DIR
        local_db_path = os.path.join(BASE_DIR, "local_qdrant")
        return QdrantClient(path=local_db_path)

async def process_document(
    file_path: str, 
    category: str, 
    source_url: str, 
    title: str,
    reliability_note: str = ""
):
    logger.info(f"Processing document: {title} from {file_path}")
    
    # 1. Load
    raw_text = load_document(file_path)
    
    # 2. Clean
    cleaned_text = clean_text(raw_text)
    
    # 3. Chunk
    chunks = chunk_text(cleaned_text)
    
    # 3.5 Save chunks to disk for visibility
    import json
    import os
    from app.core.config import BASE_DIR
    chunks_dir = os.path.join(BASE_DIR, "data", "chunks", category)
    os.makedirs(chunks_dir, exist_ok=True)
    
    import re
    safe_title = re.sub(r'[\\/*?:"<>|]', "", title).replace(" ", "_")
    chunk_file_path = os.path.join(chunks_dir, f"{safe_title}.json")
    
    with open(chunk_file_path, "w", encoding="utf-8") as f:
        json.dump({
            "title": title,
            "source_url": source_url,
            "category": category,
            "num_chunks": len(chunks),
            "chunks": chunks
        }, f, indent=2)
        
    logger.info(f"Saved {len(chunks)} chunks to {chunk_file_path}")
    
    # 4. Embed
    embedder = get_embedder()
    embeddings = embedder.embed_texts(chunks)
    
    # 5. Insert into MongoDB `documents`
    doc_id = str(uuid.uuid4())
    doc_record = {
        "_id": doc_id,
        "title": title,
        "source_url": source_url,
        "category": category,
        "reliability_note": reliability_note,
        "chunk_count": len(chunks)
    }
    
    if db.db is not None:
        await db.db.documents.update_one(
            {"source_url": source_url}, 
            {"$set": doc_record},
            upsert=True
        )
        # Fetch the actual doc id in case of update
        db_doc = await db.db.documents.find_one({"source_url": source_url})
        doc_id = db_doc["_id"] if isinstance(db_doc["_id"], str) else str(db_doc["_id"])
    
    # 6. Insert into Qdrant
    qdrant = get_qdrant_client()
    
    # Ensure collection exists
    if not qdrant.collection_exists(COLLECTION_NAME):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE)
        )
        
    points = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        # Use deterministic UUID based on source_url and chunk index
        # This ensures re-ingesting the same document overwrites instead of duplicating
        chunk_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{source_url}_{i}"))
        points.append(
            PointStruct(
                id=chunk_id,
                vector=embedding,
                payload={
                    "document_id": doc_id,
                    "chunk_text": chunk,
                    "category": category,
                    "source_url": source_url,
                    "title": title
                }
            )
        )
        
    if points:
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
    
    logger.info(f"Successfully processed and embedded {len(chunks)} chunks for {title}")
    return len(chunks)
