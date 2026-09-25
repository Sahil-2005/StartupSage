from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db = MongoDB()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    # Initialize connection only if MONGODB_URI is properly set
    # Using a try block because the empty/placeholder URI in dev might fail
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db.db = db.client.StartupSage
        logger.info("Connected to MongoDB.")
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB: {e}")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db.client:
        db.client.close()
    logger.info("MongoDB connection closed.")
