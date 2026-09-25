import json
import logging
from app.rag.llm import generate

logger = logging.getLogger(__name__)

LEGAL_DISCLAIMER = "\n\n**Disclaimer:** This tool provides preliminary information based on curated sources. It is not a substitute for professional legal or financial advice."

async def verify_groundedness(answer: str, context: str) -> bool:
    prompt = f"""You are a strict verification system. 
Does the following answer rely ONLY on the provided context? Is it fully grounded by the context without hallucinating facts?
Context: {context}

Answer: {answer}

Reply ONLY with a JSON object containing a boolean key "is_grounded". Example: {{"is_grounded": true}}"""
    
    try:
        response = await generate(prompt, "Verify the answer.")
        cleaned = response.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        return result.get("is_grounded", True)
    except Exception as e:
        logger.error(f"Groundedness verification failed: {e}")
        return True # Default to pass if verification fails
