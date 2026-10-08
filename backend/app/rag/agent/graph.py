import logging
import asyncio
import time
from langgraph.graph import StateGraph, END
from app.rag.agent.state import AgentState
from app.rag.query_understanding import classify_intent
from app.rag.retrieval import dense, sparse, fusion, reranker
from app.rag.verification import LEGAL_DISCLAIMER
from app.rag.llm import generate

logger = logging.getLogger(__name__)

async def _do_retrieve(query: str):
    t0 = time.perf_counter()
    dense_results = await asyncio.to_thread(dense.search, query=query, top_k=20)
    t1 = time.perf_counter()
    sparse_results = await asyncio.to_thread(sparse.search, query=query, top_k=20)
    t2 = time.perf_counter()
    
    fused_results = fusion.reciprocal_rank_fusion(dense_results, sparse_results)
    
    t3 = time.perf_counter()
    chunks = await asyncio.to_thread(reranker.rerank, query=query, chunks=fused_results, top_k=5)
    t4 = time.perf_counter()
    
    logger.info(f"Retrieve timings - dense: {t1-t0:.3f}s, sparse: {t2-t1:.3f}s, rerank: {t4-t3:.3f}s")
    return chunks

async def _do_classify(query: str, chat_history: list):
    t0 = time.perf_counter()
    result = await classify_intent(query, chat_history=chat_history)
    t1 = time.perf_counter()
    logger.info(f"Classify time: {t1-t0:.3f}s")
    return result

async def node_prepare(state: AgentState):
    logger.info(f"Agent: Preparing context for '{state['query']}'")
    
    # Run classify and retrieve concurrently
    t0 = time.perf_counter()
    classify_task = asyncio.create_task(_do_classify(state["query"], state.get("chat_history", [])))
    retrieve_task = asyncio.create_task(_do_retrieve(state["query"]))
    
    classification, chunks = await asyncio.gather(classify_task, retrieve_task)
    t1 = time.perf_counter()
    logger.info(f"Total concurrent prepare time: {t1-t0:.3f}s")
    
    return {
        "intent_domain": classification.get("domain", "general"),
        "is_in_scope": classification.get("in_scope", True),
        "retrieved_chunks": chunks
    }

async def node_generate(state: AgentState):
    logger.info("Agent: Generating answer")
    t0 = time.perf_counter()
    
    chunks = state.get("retrieved_chunks", [])
    
    context_blocks = []
    citations_metadata = []
    for i, chunk in enumerate(chunks):
        ref_id = i + 1
        context_blocks.append(f"[{ref_id}] {chunk['text']} (Source: {chunk['source_url']})")
        citations_metadata.append({
            "ref_id": ref_id,
            "text_snippet": chunk["text"][:100] + "...",
            "source_url": chunk["source_url"],
            "category": chunk["category"]
        })
        
    context_str = "\n\n".join(context_blocks)
    
    system_prompt = f"""You are StartupSage, an AI assistant for Indian startups.
You can use the Startup Profile and the Chat History to answer conversational questions about the user, their startup, or previous messages.
For all other questions, answer based ONLY on the provided Context. Cite sources using [1], [2], etc.
If you cannot answer the question from the Context, Startup Profile, or Chat History, explicitly say "I do not have enough information to answer this based on the available sources."
{state.get('profile_context', '')}
Context:
{context_str}"""

    answer = await generate(system_prompt, state["original_query"], chat_history=state.get("chat_history", []))
    t1 = time.perf_counter()
    logger.info(f"Generate LLM time: {t1-t0:.3f}s")
    
    return {"answer": answer, "citations": citations_metadata}

async def node_finalize(state: AgentState):
    logger.info("Agent: Finalizing output")
    output = state.get("answer", "")
    domain = state.get("intent_domain", "")
    if domain in ["legal", "contracts", "taxation", "registration"]:
        output += LEGAL_DISCLAIMER
    return {"final_output": output}

async def node_out_of_scope(state: AgentState):
    return {"final_output": "I'm sorry, but I can only assist with startup-related business, legal, and regulatory questions in India.", "citations": []}

async def node_insufficient(state: AgentState):
    return {"final_output": "I do not have enough information in my current knowledge base to confidently answer this question.", "citations": []}

def route_prepare(state: AgentState):
    if not state.get("is_in_scope", True):
        return "out_of_scope"
    if not state.get("retrieved_chunks"):
        return "insufficient"
    return "generate"

# Build Graph
builder = StateGraph(AgentState)

builder.add_node("prepare", node_prepare)
builder.add_node("generate", node_generate)
builder.add_node("finalize", node_finalize)
builder.add_node("out_of_scope", node_out_of_scope)
builder.add_node("insufficient", node_insufficient)

builder.set_entry_point("prepare")
builder.add_conditional_edges("prepare", route_prepare, {
    "out_of_scope": "out_of_scope", 
    "insufficient": "insufficient", 
    "generate": "generate"
})
builder.add_edge("generate", "finalize")
builder.add_edge("finalize", END)
builder.add_edge("out_of_scope", END)
builder.add_edge("insufficient", END)

agent_graph = builder.compile()
