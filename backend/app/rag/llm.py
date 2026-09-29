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

async def generate(system_prompt: str, user_message: str, chat_history: list = None) -> str:
    """
    Generates a response using Gemini first. If Gemini fails or API key is missing,
    falls back to Groq. Incorporates previous chat history if provided.
    """
    if chat_history is None:
        chat_history = []
        
    # 1. Try Gemini
    if settings.GEMINI_API_KEY:
        try:
            logger.info("Attempting generation with Gemini")
            # Use gemini-1.5-flash as default, robust and fast
            model = genai.GenerativeModel('gemini-3.8-flash')
            
            history_str = ""
            for msg in chat_history:
                role = "User" if msg["role"] == "user" else "Assistant"
                history_str += f"{role}: {msg['content']}\n\n"
            
            # Gemini prompt combining system, history, and user
            if history_str:
                prompt = f"{system_prompt}\n\nPrevious Conversation:\n{history_str}User: {user_message}"
            else:
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
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(chat_history)
            messages.append({"role": "user", "content": user_message})
            
            response = await groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation failed: {e}")
            raise Exception("Both primary (Gemini) and fallback (Groq) LLMs failed.")
            
    raise Exception("No LLM API keys configured.")
