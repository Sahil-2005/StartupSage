import asyncio
import os
import sys

from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.rag.ingestion.pipeline import get_qdrant_client, COLLECTION_NAME

def main():
    qdrant = get_qdrant_client()
    
    if qdrant.collection_exists(COLLECTION_NAME):
        print(f"Deleting collection: {COLLECTION_NAME}")
        qdrant.delete_collection(COLLECTION_NAME)
        print("Collection deleted.")
    else:
        print("Collection does not exist.")

if __name__ == "__main__":
    main()
