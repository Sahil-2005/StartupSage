import logging
from app.core.config import settings
import google.generativeai as genai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Configure Groq client (using OpenAI compatible endpoint)
if settings.GROQ_API_KEY:
    groq_client = AsyncOpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
else:
    groq_client = None

async def generate(system_prompt: str, user_message: str) -> str:
    """
    Generates a response using Gemini first. If Gemini fails or API key is missing,
    falls back to Groq.
    """
    
    # 1. Try Gemini
    if settings.GEMINI_API_KEY:
        try:
            logger.info("Attempting generation with Gemini")
            # Use gemini-1.5-flash as default, robust and fast
            model = genai.GenerativeModel('gemini-3.5-flash')
            # Gemini prompt combining system and user
            prompt = f"{system_prompt}\n\nUser: {user_message}"
            
            response = await model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}. Falling back to Groq.")
    else:
        logger.info("Gemini API key not configured, attempting Groq.")

    # 2. Fallback to Groq
    if settings.GROQ_API_KEY and groq_client:
        try:
            logger.info("Attempting generation with Groq")
            response = await groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation failed: {e}")
            raise Exception("Both primary (Gemini) and fallback (Groq) LLMs failed.")
            
    raise Exception("No LLM API keys configured.")
