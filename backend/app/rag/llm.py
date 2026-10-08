import logging
from app.core.config import settings
from google import genai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

# Configure Gemini
if settings.GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
else:
    gemini_client = None

# Configure Groq client (using OpenAI compatible endpoint)
if settings.GROQ_API_KEY:
    groq_client = AsyncOpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
else:
    groq_client = None

async def generate(system_prompt: str, user_message: str, chat_history: list = None, fast: bool = False) -> str:
    """
    Generates a response using Gemini first. If Gemini fails or API key is missing,
    falls back to Groq. Incorporates previous chat history if provided.
    """
    if chat_history is None:
        chat_history = []
        
    # 1. Try Groq First
    if settings.GROQ_API_KEY and groq_client:
        try:
            logger.info("Attempting generation with Groq")
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(chat_history)
            messages.append({"role": "user", "content": user_message})
            
            model_name = "llama-3.1-8b-instant" if fast else "openai/gpt-oss-120b"
            response = await groq_client.chat.completions.create(
                model=model_name,
                messages=messages,
                max_tokens=1024,
                timeout=20,
                extra_body={"reasoning_effort": "low"}
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation failed: {e}. Falling back to Gemini.")
    else:
        logger.info("Groq API key not configured, attempting Gemini.")

    # 2. Fallback to Gemini
    if gemini_client:
        try:
            logger.info("Attempting generation with Gemini")
            history_str = ""
            for msg in chat_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_str += f"{role}: {msg['content']}\n\n"
            
            # Gemini prompt combining system, history, and user
            if history_str:
                prompt = f"{system_prompt}\n\nPrevious Conversation:\n{history_str}User: {user_message}"
            else:
                prompt = f"{system_prompt}\n\nUser: {user_message}"
            
            response = await gemini_client.aio.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            raise Exception("Both primary (Groq) and fallback (Gemini) LLMs failed.")
            
    raise Exception("No LLM API keys configured.")
