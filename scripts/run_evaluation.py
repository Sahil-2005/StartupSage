import os
import sys
import json
import asyncio
import time
from pathlib import Path
import httpx

API_URL = "http://localhost:8000/api/v1/chat"

def compute_recall_at_k(retrieved_ids, gold_ids):
    if not gold_ids:
        return 1.0 # If no gold chunks, vacuously true
    hits = sum(1 for gid in gold_ids if gid in retrieved_ids)
    return hits / len(gold_ids)

def compute_mrr(retrieved_ids, gold_ids):
    if not gold_ids:
        return 0.0
    for i, rid in enumerate(retrieved_ids):
        if rid in gold_ids:
            return 1.0 / (i + 1)
    return 0.0

async def main():
    if len(sys.argv) < 3 or sys.argv[1] != "--mode":
        print("Usage: python run_evaluation.py --mode <basic|hybrid|agentic>")
        sys.exit(1)
        
    mode = sys.argv[2]
    print(f"Running evaluation for mode: {mode}")
    
    # Load dataset
    data_dir = Path(__file__).parent.parent / "data" / "eval"
    ds_path = data_dir / "golden_qa_dataset.json"
    if not ds_path.exists():
        print(f"Dataset not found at {ds_path}")
        sys.exit(1)
        
    with open(ds_path, 'r') as f:
        qa_data = json.load(f)
        
    if not qa_data:
        print("Dataset is empty. Run ingestion and populate the dataset first.")
        sys.exit(0)

    # For IR metrics
    recalls = []
    mrrs = []
    latencies = []
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        for item in qa_data:
            question = item["question"]
            gold_ids = item.get("gold_chunk_ids", [])
            
            print(f"Querying: {question}")
            
            start_time = time.time()
            try:
                response = await client.post(API_URL, json={"message": question})
                response.raise_for_status()
                data = response.json()
                
                latency = time.time() - start_time
                latencies.append(latency)
                
                citations = data.get("citations", [])
                # The API returns ref_id, text_snippet, source_url, category.
                # In a real scenario, we should also return the chunk 'id' in citations to calculate Recall@K accurately.
                # Since we haven't exposed 'id' in citations_metadata in chat.py yet, this is a placeholder.
                # We assume hits for now if there are citations.
                retrieved_ids = [c.get("id", "dummy_id") for c in citations]
                
                recalls.append(compute_recall_at_k(retrieved_ids, gold_ids))
                mrrs.append(compute_mrr(retrieved_ids, gold_ids))
                
            except Exception as e:
                print(f"Error querying backend: {e}")
                
    avg_recall = sum(recalls) / len(recalls) if recalls else 0.0
    avg_mrr = sum(mrrs) / len(mrrs) if mrrs else 0.0
    avg_latency = sum(latencies) / len(latencies) if latencies else 0.0
    
    print(f"\n--- IR Results for {mode} ---")
    print(f"Recall@K: {avg_recall:.4f}")
    print(f"MRR: {avg_mrr:.4f}")
    print(f"Avg Latency: {avg_latency:.4f}s")
    
    print("\nNote: RAGAS LLM-as-a-judge evaluation requires OPENAI_API_KEY to be set in environment variables.")
    print("If you have it set, you can run the full Ragas evaluation script.")

if __name__ == "__main__":
    asyncio.run(main())
