import json
import logging
from app.rag.llm import generate

logger = logging.getLogger(__name__)

async def classify_intent(query: str, chat_history: list = None) -> dict:
    prompt = """You are an intent classifier for a Startup advisory AI.
Classify the user's query into one of these domains: registration, taxation, msme, contracts, general.
Also determine if the query is "in_scope" (related to business, startups, legal, tax, the AI itself, general greetings, questions about the user's profile, or questions about the conversation/chat history).
Return ONLY a raw JSON object with keys: "domain" (string) and "in_scope" (boolean).
Example: {"domain": "taxation", "in_scope": true}"""
    
    try:
        response = await generate(prompt, query, chat_history=chat_history, fast=True)
        cleaned = response.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Intent classification failed: {e}")
        return {"domain": "general", "in_scope": True}

async def rewrite_query(query: str, chat_history: list = None) -> str:
    prompt = """Rewrite the user's query to make it highly optimized for a vector search engine.
Extract the core keywords, entities, and intent. Expand acronyms if obvious.
Return ONLY the rewritten query text, nothing else."""
    try:
        response = await generate(prompt, query, chat_history=chat_history)
        return response.strip()
    except Exception as e:
        logger.error(f"Query rewrite failed: {e}")
        return query

def _is_likely_english(text: str) -> bool:
    """Fast heuristic: if >85% of characters are ASCII, the text is almost certainly English.
    This avoids a costly LLM roundtrip for every standard English query."""
    if not text:
        return True
    ascii_count = sum(1 for c in text if ord(c) < 128)
    return (ascii_count / len(text)) > 0.85

async def translate_query_if_needed(query: str) -> dict:
    # Fast path: skip LLM call entirely for English queries
    if _is_likely_english(query):
        return {"original_language": "English", "english_query": query}
    
    # Slow path: use LLM only for non-English (Devanagari, Arabic, CJK, etc.)
    prompt = """Analyze the following query.
1. Identify the language.
2. Translate it to English.
Return ONLY a raw JSON object with keys: "original_language" (string), "english_query" (string).
Example: {"original_language": "Hindi", "english_query": "How to register a startup?"}"""
    try:
        response = await generate(prompt, query, fast=True)
        cleaned = response.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        return {"original_language": "English", "english_query": query}
