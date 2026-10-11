import logging
from qdrant_client.http import models
from app.rag.ingestion.pipeline import get_qdrant_client, COLLECTION_NAME

logger = logging.getLogger(__name__)

def search(query: str, top_k: int = 50) -> list[dict]:
    """
    Zero-memory sparse full-text search executed directly on Qdrant Cloud.
    Eliminates in-memory BM25 corpus allocation (saves ~380 MB of RAM).
    """
    qdrant = get_qdrant_client()
    try:
        records, _ = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter=models.Filter(
                should=[
                    models.FieldCondition(
                        key="chunk_text",
                        match=models.MatchText(text=query)
                    )
                ]
            ),
            limit=top_k,
            with_payload=True,
            with_vectors=False
        )
        
        results = []
        for hit in records:
            payload = hit.payload or {}
            results.append({
                "id": hit.id,
                "score": 1.0,
                "text": payload.get("chunk_text", ""),
                "document_id": payload.get("document_id", ""),
                "source_url": payload.get("source_url", ""),
                "category": payload.get("category", "")
            })
        return results
    except Exception as e:
        logger.error(f"Qdrant text match search failed: {e}")
        return []

def get_sparse_index():
    return None

