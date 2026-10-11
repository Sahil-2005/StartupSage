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
    # Connect to MongoDB
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="StartupSage AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

# Serve the raw PDF documents so citations can link directly to them
docs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "raw")
if os.path.exists(docs_path):
    app.mount("/api/v1/documents", StaticFiles(directory=docs_path), name="documents")

app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
app.include_router(config_router.router, prefix="/api/v1/config", tags=["config"])

@app.get("/")
@app.head("/")
async def root():
    return {"status": "ok", "message": "StartupSage API is running"}

