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
    Generates a response using Groq first. If Groq fails or API key is missing,
    falls back to Gemini. Incorporates previous chat history if provided.
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
            
            # Use active models on Groq
            model_name = "qwen/qwen3.8-27b"
            response = await groq_client.chat.completions.create(
                model=model_name,
                messages=messages,
                max_tokens=1024,
                timeout=20
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation failed: {e}. Falling back to Gemini.")
    else:
        logger.info("Groq API key not configured, attempting Gemini.")

    # 2. Fallback to Gemini
    if gemini_client:
        history_str = ""
        for msg in chat_history:
            role = "User" if msg["role"] == "user" else "Assistant"
            history_str += f"{role}: {msg['content']}\n\n"
        
        prompt = f"{system_prompt}\n\nPrevious Conversation:\n{history_str}User: {user_message}" if history_str else f"{system_prompt}\n\nUser: {user_message}"
        
        # Try primary model then backup model in case of transient 503 high-demand spike
        for g_model in ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"]:
            try:
                logger.info(f"Attempting generation with Gemini ({g_model})")
                response = await gemini_client.aio.models.generate_content(
                    model=g_model,
                    contents=prompt
                )
                return response.text
            except Exception as e:
                logger.warning(f"Gemini ({g_model}) failed: {e}")
                continue
                
        raise Exception("Both primary (Groq) and fallback (Gemini) LLMs failed.")
            
    raise Exception("No LLM API keys configured.")

async def generate_stream(system_prompt: str, user_message: str, chat_history: list = None, fast: bool = False):
    if chat_history is None:
        chat_history = []
        
    if settings.GROQ_API_KEY and groq_client:
        try:
            messages = [{"role": "system", "content": system_prompt}]
            messages.extend(chat_history)
            messages.append({"role": "user", "content": user_message})
            
            model_name = "qwen/qwen3.8-27b"
            response = await groq_client.chat.completions.create(
                model=model_name,
                messages=messages,
                max_tokens=1024,
                timeout=20,
                stream=True
            )
            async for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            return
        except Exception as e:
            logger.error(f"Groq streaming failed: {e}. Falling back to Gemini.")

    if gemini_client:
        history_str = ""
        for msg in chat_history:
            role = "User" if msg["role"] == "user" else "Assistant"
            history_str += f"{role}: {msg['content']}\n\n"
        
        prompt = f"{system_prompt}\n\nPrevious Conversation:\n{history_str}User: {user_message}" if history_str else f"{system_prompt}\n\nUser: {user_message}"
        
        for g_model in ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"]:
            try:
                response = await gemini_client.aio.models.generate_content_stream(
                    model=g_model,
                    contents=prompt
                )
                async for chunk in response:
                    if chunk.text:
                        yield chunk.text
                return
            except Exception as e:
                logger.warning(f"Gemini streaming ({g_model}) failed: {e}")
                continue
                
        raise Exception("Both primary (Groq) and fallback (Gemini) LLMs failed.")
            
    raise Exception("No LLM API keys configured.")
