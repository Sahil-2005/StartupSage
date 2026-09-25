from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class Embedder:
    def __init__(self, model_name: str = "BAAI/bge-base-en-v1.5"):
        logger.info(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        
    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        # sentence-transformers returns a numpy array, convert to list of floats for qdrant
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()

    def embed_query(self, query: str) -> list[float]:
        # For BGE models, standard query embedding
        query_text = f"Represent this sentence for searching relevant passages: {query}"
        embedding = self.model.encode(query_text, normalize_embeddings=True)
        return embedding.tolist()

# Singleton instance to avoid reloading the model
embedder = None

def get_embedder():
    global embedder
    if embedder is None:
        embedder = Embedder()
    return embedder
