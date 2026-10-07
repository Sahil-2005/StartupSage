import uuid
import time
import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.config import settings
from app.db.mongo import db
from app.rag.retrieval import dense, sparse, fusion, reranker
from app.rag.llm import generate
from app.api.routes.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    profile_id: Optional[str] = None
    document_context: Optional[str] = None
    document_name: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[dict]
    rag_mode: str
    conversation_id: str

class ConversationCreate(BaseModel):
    title: str = "New Conversation"

from fastapi import UploadFile, File
import io

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        content = await file.read()
        text = ""
        if file.filename.lower().endswith(".pdf"):
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        else:
            text = content.decode("utf-8", errors="ignore")
            
        # Limit text length to avoid token limits (e.g. ~10000 chars)
        text = text[:15000]
        return {"filename": file.filename, "extracted_text": text}
    except Exception as e:
        logger.error(f"File upload parsing failed: {e}")
        raise HTTPException(status_code=400, detail="Failed to parse document. Please upload a valid PDF or text file.")

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    start_time = time.time()
    user_message = request.message
    conv_id = request.conversation_id or str(uuid.uuid4())
    user_id = current_user["_id"]
    
    # Check for profile context globally first
    profile_context = ""
    if request.profile_id and db.db is not None:
        profile = await db.db.startup_profiles.find_one({"_id": request.profile_id})
        if profile:
            profile_context = f"""
STARTUP PROFILE (Context for your advice):
- Name: {profile.get('name')}
- Industry: {profile.get('industry')}
- Stage: {profile.get('stage')}
- Location: {profile.get('location')}
- Additional Notes: {profile.get('notes')}

Please tailor your advice specifically to this startup's context.
"""

    doc_context_prompt = ""
    if request.document_context:
        doc_context_prompt = f"""
UPLOADED DOCUMENT CONTEXT (File: {request.document_name}):
{request.document_context}

The user has attached the above document. Pay close attention to it. If the user asks about the document, summarize it, highlight important areas, or warn about risky clauses as requested.
"""
    
    # Fetch chat history for context
    chat_history = []
    if request.conversation_id and db.db is not None:
        cursor = db.db.messages.find({"conversation_id": conv_id}).sort("created_at", 1)
        msgs = await cursor.to_list(length=10) # Get last 10 messages
        for m in msgs:
            chat_history.append({"role": m["role"], "content": m["content"]})
            
    # Translate query for better vector search
    from app.rag.query_understanding import translate_query_if_needed
    translation_info = await translate_query_if_needed(user_message)
    search_query = translation_info.get("english_query", user_message)
    original_language = translation_info.get("original_language", "English")
    
    import asyncio
    if settings.RAG_MODE in ["basic", "hybrid"]:
        if settings.RAG_MODE == "basic":
            retrieved_chunks = await asyncio.to_thread(dense.search, query=search_query, top_k=5)
        elif settings.RAG_MODE == "hybrid":
            dense_results = await asyncio.to_thread(dense.search, query=search_query, top_k=20)
            sparse_results = await asyncio.to_thread(sparse.search, query=search_query, top_k=20)
            fused_results = fusion.reciprocal_rank_fusion(dense_results, sparse_results)
            retrieved_chunks = await asyncio.to_thread(reranker.rerank, query=search_query, chunks=fused_results, top_k=5)
            
        context_blocks = []
        citations_metadata = []
        for i, chunk in enumerate(retrieved_chunks):
            ref_id = i + 1
            context_blocks.append(f"[{ref_id}] {chunk['text']} (Source: {chunk['source_url']})")
            citations_metadata.append({
                "ref_id": ref_id,
                "text_snippet": chunk["text"][:100] + "...",
                "source_url": chunk["source_url"],
                "category": chunk["category"]
            })
                
        context_str = "\n\n".join(context_blocks) if context_blocks else "No relevant context found."
        
        system_prompt = f"""You are StartupSage, an AI assistant for Indian startups.
You can use the Startup Profile and the Chat History to answer conversational questions about the user, their startup, or previous messages.
For all other questions, answer based ONLY on the provided Context or the Uploaded Document. Cite sources using [1], [2], etc.
If you cannot answer the question from the Context, Uploaded Document, Startup Profile, or Chat History, explicitly say "I do not have enough information to answer this based on the available sources."
IMPORTANT: The user asked in {original_language}. You MUST write your entire response in {original_language}.
{profile_context}
{doc_context_prompt}
Context:
{context_str}
"""
        
        try:
            answer = await generate(system_prompt, user_message, chat_history=chat_history)
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
            
    elif settings.RAG_MODE == "agentic":
        from app.rag.agent.graph import agent_graph
        
        full_context = profile_context
        if doc_context_prompt:
            full_context += "\n" + doc_context_prompt
            
        full_context += f"\nIMPORTANT: Respond in {original_language}."
        
        state = {
            "query": search_query,
            "original_query": user_message,
            "profile_id": request.profile_id,
            "profile_context": full_context,
            "chat_history": chat_history,
            "retry_count": 0,
            "retrieved_chunks": [],
            "citations": []
        }
        
        try:
            result = await agent_graph.ainvoke(state)
            answer = result.get("final_output", "An error occurred.")
            citations_metadata = result.get("citations", [])
            retrieved_chunks = result.get("retrieved_chunks", [])
        except Exception as e:
            logger.error(f"Agentic generation failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=501, detail=f"RAG Mode '{settings.RAG_MODE}' not implemented yet.")
        
    # 4. Save to DB
    latency_ms = int((time.time() - start_time) * 1000)
    
    if db.db is not None:
        # Ensure conversation exists
        await db.db.conversations.update_one(
            {"_id": conv_id},
            {"$setOnInsert": {
                "created_at": datetime.utcnow(), 
                "title": user_message[:30] + ("..." if len(user_message) > 30 else ""),
                "user_id": user_id
            }},
            upsert=True
        )
        
        # Save user message
        user_msg_doc = {
            "conversation_id": conv_id,
            "role": "user",
            "content": user_message,
            "created_at": datetime.utcnow()
        }
        if request.document_name:
            user_msg_doc["document_name"] = request.document_name
            
        await db.db.messages.insert_one(user_msg_doc)
        
        # Save assistant message
        await db.db.messages.insert_one({
            "conversation_id": conv_id,
            "role": "assistant",
            "content": answer,
            "rag_mode": settings.RAG_MODE,
            "retrieved_chunk_ids": [c.get("id") for c in retrieved_chunks],
            "citations": citations_metadata,
            "latency_ms": latency_ms,
            "created_at": datetime.utcnow()
        })
        
    return ChatResponse(
        answer=answer,
        citations=citations_metadata,
        rag_mode=settings.RAG_MODE,
        conversation_id=conv_id
    )

@router.get("/conversations")
async def list_conversations(current_user: dict = Depends(get_current_user)):
    if db.db is None:
        return []
    cursor = db.db.conversations.find({"user_id": current_user["_id"]}).sort("created_at", -1).limit(50)
    convs = await cursor.to_list(length=50)
    for c in convs:
        c["_id"] = str(c["_id"])
    return convs

@router.post("/conversations")
async def create_conversation(req: ConversationCreate, current_user: dict = Depends(get_current_user)):
    conv_id = str(uuid.uuid4())
    if db.db is not None:
        await db.db.conversations.insert_one({
            "_id": conv_id,
            "title": req.title,
            "user_id": current_user["_id"],
            "created_at": datetime.utcnow()
        })
    return {"conversation_id": conv_id}

@router.get("/conversations/{conv_id}/messages")
async def get_messages(conv_id: str, current_user: dict = Depends(get_current_user)):
    if db.db is None:
        return []
    # Verify the conversation belongs to the user
    conv = await db.db.conversations.find_one({"_id": conv_id, "user_id": current_user["_id"]})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    cursor = db.db.messages.find({"conversation_id": conv_id}).sort("created_at", 1)
    msgs = await cursor.to_list(length=100)
    for m in msgs:
        m["_id"] = str(m["_id"])
    return msgs

@router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, current_user: dict = Depends(get_current_user)):
    if db.db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    
    # Verify the conversation belongs to the user
    conv = await db.db.conversations.find_one({"_id": conv_id, "user_id": current_user["_id"]})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    await db.db.conversations.delete_one({"_id": conv_id})
    await db.db.messages.delete_many({"conversation_id": conv_id})
    return {"status": "deleted"}
