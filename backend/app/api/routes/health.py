from fastapi import APIRouter
from app.core.config import settings
from app.db.mongo import db

router = APIRouter()

@router.get("/")
async def health_check():
    mongo_status = "connected" if db.client else "disconnected"
    return {
        "status": "ok",
        "rag_mode": settings.RAG_MODE,
        "mongo": mongo_status
    }
