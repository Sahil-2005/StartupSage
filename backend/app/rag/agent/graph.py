import logging
from langgraph.graph import StateGraph, END
from app.rag.agent.state import AgentState
from app.rag.query_understanding import classify_intent, rewrite_query
from app.rag.retrieval import dense, sparse, fusion, reranker
from app.rag.verification import verify_groundedness, LEGAL_DISCLAIMER
from app.rag.llm import generate

logger = logging.getLogger(__name__)

async def node_classify(state: AgentState):
    logger.info(f"Agent: Classifying intent for '{state['query']}'")
    classification = await classify_intent(state["query"], chat_history=state.get("chat_history", []))
    return {
        "intent_domain": classification.get("domain", "general"),
        "is_in_scope": classification.get("in_scope", True)
    }

async def node_retrieve(state: AgentState):
    logger.info(f"Agent: Retrieving for '{state['query']}'")
    import asyncio
    query = state["query"]
    dense_results = await asyncio.to_thread(dense.search, query=query, top_k=20)
    sparse_results = await asyncio.to_thread(sparse.search, query=query, top_k=20)
    fused_results = fusion.reciprocal_rank_fusion(dense_results, sparse_results)
    chunks = await asyncio.to_thread(reranker.rerank, query=query, chunks=fused_results, top_k=5)
    return {"retrieved_chunks": chunks}

async def node_rewrite(state: AgentState):
    logger.info("Agent: Rewriting query")
    new_query = await rewrite_query(state["query"], chat_history=state.get("chat_history", []))
    return {
        "query": new_query,
        "retry_count": state.get("retry_count", 0) + 1
    }

async def node_generate(state: AgentState):
    logger.info("Agent: Generating answer")
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
    
    # Check if we have no chunks
    if not chunks:
        return {"answer": "I do not have enough information to answer this based on the available sources.", "citations": []}
    
    system_prompt = f"""You are StartupSage, an AI assistant for Indian startups.
You can use the Startup Profile and the Chat History to answer conversational questions about the user, their startup, or previous messages.
For all other questions, answer based ONLY on the provided Context. Cite sources using [1], [2], etc.
If you cannot answer the question from the Context, Startup Profile, or Chat History, explicitly say "I do not have enough information to answer this based on the available sources."
{state.get('profile_context', '')}
Context:
{context_str}"""

    answer = await generate(system_prompt, state["original_query"], chat_history=state.get("chat_history", []))
    return {"answer": answer, "citations": citations_metadata}

async def node_verify(state: AgentState):
    logger.info("Agent: Verifying groundedness")
    chunks = state.get("retrieved_chunks", [])
    # We no longer instantly fail if no chunks are retrieved, because the answer might rely entirely on the profile_context
        
    context_str = "\n".join([c["text"] for c in chunks])
    chat_history_str = "\n".join([f"{m['role']}: {m['content']}" for m in state.get("chat_history", [])])
    is_grounded = await verify_groundedness(state["answer"], context_str, state.get("profile_context", ""), chat_history_str)
    
    # Also check if the LLM explicitly abstained
    if "I do not have enough information" in state["answer"]:
        is_grounded = False

    return {"is_verified": is_grounded}

async def node_finalize(state: AgentState):
    logger.info("Agent: Finalizing output")
    output = state["answer"]
    domain = state.get("intent_domain", "")
    if domain in ["legal", "contracts", "taxation", "registration"]:
        output += LEGAL_DISCLAIMER
    return {"final_output": output}

def route_scope(state: AgentState):
    if not state.get("is_in_scope", True):
        return "out_of_scope"
    # Basic pleasantry check could bypass retrieval if needed, but for now route to retrieve
    return "retrieve"

def route_evidence(state: AgentState):
    if not state.get("retrieved_chunks"):
        if state.get("retry_count", 0) < 2:
            return "rewrite"
        return "insufficient"
    return "generate"

def route_verification(state: AgentState):
    if state.get("is_verified"):
        return "finalize"
    if state.get("retry_count", 0) < 2:
        return "rewrite"
    return "insufficient"

# Build Graph
builder = StateGraph(AgentState)

builder.add_node("classify", node_classify)
builder.add_node("retrieve", node_retrieve)
builder.add_node("rewrite", node_rewrite)
builder.add_node("generate", node_generate)
builder.add_node("verify", node_verify)
builder.add_node("finalize", node_finalize)

async def node_out_of_scope(state: AgentState):
    return {"final_output": "I'm sorry, but I can only assist with startup-related business, legal, and regulatory questions in India.", "citations": []}

async def node_insufficient(state: AgentState):
    return {"final_output": "I do not have enough information in my current knowledge base to confidently answer this question.", "citations": []}

builder.add_node("out_of_scope", node_out_of_scope)
builder.add_node("insufficient", node_insufficient)

builder.set_entry_point("classify")
builder.add_conditional_edges("classify", route_scope, {"out_of_scope": "out_of_scope", "retrieve": "retrieve"})
builder.add_conditional_edges("retrieve", route_evidence, {"rewrite": "rewrite", "insufficient": "insufficient", "generate": "generate"})
builder.add_edge("generate", "verify")
builder.add_conditional_edges("verify", route_verification, {"finalize": "finalize", "rewrite": "rewrite", "insufficient": "insufficient"})
builder.add_edge("rewrite", "retrieve")
builder.add_edge("finalize", END)
builder.add_edge("out_of_scope", END)
builder.add_edge("insufficient", END)

agent_graph = builder.compile()
