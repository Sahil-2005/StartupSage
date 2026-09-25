import os
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get absolute path to the backend directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    QDRANT_URL: str = ""
    QDRANT_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    RAG_MODE: str = "basic"

    model_config = SettingsConfigDict(env_file=ENV_PATH, env_file_encoding="utf-8", extra="ignore")

settings = Settings()
