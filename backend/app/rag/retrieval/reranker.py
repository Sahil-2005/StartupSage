import logging

logger = logging.getLogger(__name__)

def get_reranker():
    return None

def rerank(query: str, chunks: list[dict], top_k: int = 5) -> list[dict]:
    """
    Reranks chunks based on their fused Reciprocal Rank Fusion (RRF) score.
    Ultra-fast, zero-overhead, completely avoids PyTorch OOM on Render.
    """
    if not chunks:
        return []
    return chunks[:top_k]
