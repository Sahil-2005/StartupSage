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
