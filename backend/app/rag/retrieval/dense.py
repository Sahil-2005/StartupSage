import logging
from typing import Optional
from app.rag.embedding import get_embedder
from app.rag.ingestion.pipeline import get_qdrant_client, COLLECTION_NAME

logger = logging.getLogger(__name__)

def search(query: str, top_k: int = 10, category: Optional[str] = None) -> list[dict]:
    """
    Perform a dense vector search in Qdrant.
    Returns a list of chunk dictionaries with their scores.
    """
    embedder = get_embedder()
    query_vector = embedder.embed_query(query)
    qdrant = get_qdrant_client()
    
    # Optional metadata filtering by category
    from qdrant_client.http.models import Filter, FieldCondition, MatchValue
    
    query_filter = None
    if category:
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="category",
                    match=MatchValue(value=category)
                )
            ]
        )
        
    try:
        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            query_filter=query_filter,
            limit=top_k
        )
    except Exception as e:
        logger.error(f"Qdrant search failed: {e}")
        return []
    
    # Format the results
    chunks = []
    for hit in results.points:
        payload = hit.payload or {}
        chunks.append({
            "id": hit.id,
            "score": hit.score,
            "text": payload.get("chunk_text", ""),
            "document_id": payload.get("document_id", ""),
            "source_url": payload.get("source_url", ""),
            "category": payload.get("category", "")
        })
        
    return chunks
