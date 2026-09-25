import logging
from sentence_transformers import CrossEncoder

logger = logging.getLogger(__name__)

class Reranker:
    _instance = None
    
    def __init__(self):
        logger.info("Loading BAAI/bge-reranker-base model...")
        self.model = CrossEncoder('BAAI/bge-reranker-base')
        logger.info("Reranker loaded.")

def get_reranker():
    if Reranker._instance is None:
        Reranker._instance = Reranker()
    return Reranker._instance.model

def rerank(query: str, chunks: list[dict], top_k: int = 5) -> list[dict]:
    if not chunks:
        return []
        
    model = get_reranker()
    pairs = [[query, chunk["text"]] for chunk in chunks]
    
    scores = model.predict(pairs)
    
    # Update scores and sort
    for i, chunk in enumerate(chunks):
        chunk["score"] = float(scores[i])
        
    # Sort descending
    reranked_chunks = sorted(chunks, key=lambda x: x["score"], reverse=True)
    
    return reranked_chunks[:top_k]
