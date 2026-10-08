from fastapi import APIRouter
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

class RagModeConfig(BaseModel):
    mode: str

@router.get("/rag-mode")
def get_rag_mode():
    return {"mode": settings.RAG_MODE}

@router.post("/rag-mode")
def set_rag_mode(config: RagModeConfig):
    if config.mode not in ["basic", "hybrid", "agentic"]:
        return {"error": "Invalid mode"}
    settings.RAG_MODE = config.mode
    return {"message": f"RAG mode updated to {config.mode}", "mode": settings.RAG_MODE}

@router.get("/knowledge")
async def get_knowledge_stats():
    from app.db.mongo import db
    if db.db is None:
        return {"total_docs": 0, "total_chunks": 0, "categories": {}}
    
    docs = await db.db.documents.find().to_list(1000)
    
    total_chunks = sum(d.get("chunk_count", 0) for d in docs)
    total_docs = len(docs)
    
    categories = {}
    for d in docs:
        cat = d.get("category", "Uncategorized")
        # Format category string beautifully
        display_cat = cat.replace("_", " ").title()
        if display_cat not in categories:
            categories[display_cat] = []
        categories[display_cat].append({
            "name": d.get("title", "Unknown Document"),
            "source": d.get("source_url", ""),
            "chunks": d.get("chunk_count", 0)
        })
        
    return {
        "total_docs": total_docs,
        "total_chunks": total_chunks,
        "categories": categories
    }
