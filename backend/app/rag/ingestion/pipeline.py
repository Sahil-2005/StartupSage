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
        # Fallback to in-memory for testing if no URL provided
        return QdrantClient(":memory:")

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
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
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
