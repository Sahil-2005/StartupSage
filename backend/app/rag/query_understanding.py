import json
import logging
from app.rag.llm import generate

logger = logging.getLogger(__name__)

async def classify_intent(query: str) -> dict:
    prompt = """You are an intent classifier for a Startup advisory AI.
Classify the user's query into one of these domains: registration, taxation, msme, contracts, general.
Also determine if the query is "in_scope" (related to business, startups, legal, tax, or the AI itself).
Return ONLY a raw JSON object with keys: "domain" (string) and "in_scope" (boolean).
Example: {"domain": "taxation", "in_scope": true}"""
    
    try:
        response = await generate(prompt, query)
        cleaned = response.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Intent classification failed: {e}")
        return {"domain": "general", "in_scope": True}

async def rewrite_query(query: str) -> str:
    prompt = """Rewrite the user's query to make it highly optimized for a vector search engine.
Extract the core keywords, entities, and intent. Expand acronyms if obvious.
Return ONLY the rewritten query text, nothing else."""
    try:
        response = await generate(prompt, query)
        return response.strip()
    except Exception as e:
        logger.error(f"Query rewrite failed: {e}")
        return query
