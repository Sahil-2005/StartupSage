import logging
from rank_bm25 import BM25Okapi
from app.rag.ingestion.pipeline import get_qdrant_client, COLLECTION_NAME

logger = logging.getLogger(__name__)

class SparseIndex:
    _instance = None

    def __init__(self):
        self.bm25 = None
        self.chunks = []
        self._build_index()

    def _build_index(self):
        logger.info("Building BM25 sparse index from Qdrant...")
        qdrant = get_qdrant_client()
        try:
            # Fetch all points (assuming small MVP dataset)
            records, _ = qdrant.scroll(
                collection_name=COLLECTION_NAME,
                limit=10000,
                with_payload=True,
                with_vectors=False
            )
            
            self.chunks = []
            tokenized_corpus = []
            
            for hit in records:
                payload = hit.payload or {}
                text = payload.get("chunk_text", "")
                self.chunks.append({
                    "id": hit.id,
                    "score": 0.0,
                    "text": text,
                    "document_id": payload.get("document_id", ""),
                    "source_url": payload.get("source_url", ""),
                    "category": payload.get("category", "")
                })
                tokenized_corpus.append(text.lower().split(" "))
                
            if tokenized_corpus:
                self.bm25 = BM25Okapi(tokenized_corpus)
                logger.info(f"BM25 index built with {len(self.chunks)} chunks.")
            else:
                logger.warning("No chunks found in Qdrant to build BM25 index.")
                
        except Exception as e:
            logger.error(f"Failed to build BM25 index: {e}")

    def search(self, query: str, top_k: int = 50) -> list[dict]:
        if not self.bm25 or not self.chunks:
            return []
            
        tokenized_query = query.lower().split(" ")
        doc_scores = self.bm25.get_scores(tokenized_query)
        
        # Get top_k indices
        top_n_indices = sorted(range(len(doc_scores)), key=lambda i: doc_scores[i], reverse=True)[:top_k]
        
        results = []
        for idx in top_n_indices:
            chunk = self.chunks[idx].copy()
            chunk["score"] = doc_scores[idx]
            results.append(chunk)
            
        return results

def get_sparse_index():
    if SparseIndex._instance is None:
        SparseIndex._instance = SparseIndex()
    return SparseIndex._instance

def search(query: str, top_k: int = 50) -> list[dict]:
    index = get_sparse_index()
    return index.search(query, top_k)
