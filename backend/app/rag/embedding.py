from fastembed import TextEmbedding
import logging

logger = logging.getLogger(__name__)

class Embedder:
    def __init__(self, model_name: str = "BAAI/bge-base-en-v1.5"):
        logger.info(f"Loading lightweight ONNX embedding model: {model_name}")
        self.model = TextEmbedding(model_name=model_name)
        
    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        embeddings = list(self.model.embed(texts))
        return [e.tolist() for e in embeddings]

    def embed_query(self, query: str) -> list[float]:
        query_text = f"Represent this sentence for searching relevant passages: {query}"
        embeddings = list(self.model.embed([query_text]))
        return embeddings[0].tolist()

# Singleton instance to avoid reloading the model
embedder = None

def get_embedder():
    global embedder
    if embedder is None:
        embedder = Embedder()
    return embedder
