from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, chat, profiles, config_router, auth
from app.db.mongo import connect_to_mongo, close_mongo_connection
import asyncio
import contextlib
import logging

logger = logging.getLogger(__name__)

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Connect to MongoDB
    await connect_to_mongo()

    # 2. Pre-warm ML models in background threads so the first user query is instant
    logger.info("Pre-warming ML models in background...")
    async def _warm_models():
        from app.rag.embedding import get_embedder
        from app.rag.retrieval.reranker import get_reranker
        # Load both models in parallel background threads
        await asyncio.gather(
            asyncio.to_thread(get_embedder),
            asyncio.to_thread(get_reranker)
        )
        logger.info("✅ All ML models pre-warmed and ready.")
    asyncio.create_task(_warm_models())

    yield
    await close_mongo_connection()

app = FastAPI(title="StartupSage AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
app.include_router(config_router.router, prefix="/api/v1/config", tags=["config"])
