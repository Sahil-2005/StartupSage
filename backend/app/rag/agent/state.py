from typing import TypedDict, List, Optional

class AgentState(TypedDict):
    query: str
    original_query: str
    profile_id: Optional[str]
    profile_context: str
    intent_domain: str
    is_in_scope: bool
    retrieved_chunks: List[dict]
    answer: str
    citations: List[dict]
    retry_count: int
    is_verified: bool
    final_output: str
