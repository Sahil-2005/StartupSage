def reciprocal_rank_fusion(dense_results: list[dict], sparse_results: list[dict], k: int = 60) -> list[dict]:
    """
    Combines results from dense and sparse retrievers using RRF.
    """
    fused_scores = {}
    chunk_map = {}
    
    # Process dense results
    for rank, chunk in enumerate(dense_results):
        chunk_id = chunk["id"]
        chunk_map[chunk_id] = chunk
        fused_scores[chunk_id] = fused_scores.get(chunk_id, 0.0) + 1.0 / (k + rank + 1)
        
    # Process sparse results
    for rank, chunk in enumerate(sparse_results):
        chunk_id = chunk["id"]
        if chunk_id not in chunk_map:
            chunk_map[chunk_id] = chunk
        fused_scores[chunk_id] = fused_scores.get(chunk_id, 0.0) + 1.0 / (k + rank + 1)
        
    # Sort by fused score
    sorted_chunks = sorted(fused_scores.items(), key=lambda item: item[1], reverse=True)
    
    fused_results = []
    for chunk_id, score in sorted_chunks:
        chunk = chunk_map[chunk_id].copy()
        chunk["score"] = score # Overwrite with fused score
        fused_results.append(chunk)
        
    return fused_results
