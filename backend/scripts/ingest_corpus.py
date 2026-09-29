import os
import json
import asyncio
import logging
import argparse
from pathlib import Path
from app.rag.ingestion.pipeline import process_document

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_FILE = BASE_DIR / "data" / "sources.json"
RAW_DATA_DIR = BASE_DIR / "data" / "raw"

async def ingest_category(category: str, docs: list):
    logger.info(f"--- Ingesting Category: {category} ---")
    category_dir = RAW_DATA_DIR / category
    
    if not category_dir.exists():
        logger.warning(f"Directory {category_dir} does not exist. Did you run download_sources.py?")
        return

    for doc in docs:
        name = doc.get("name", "Unknown")
        url = doc.get("url", "")
        
        if not url:
            continue
            
        ext = ".pdf" if ".pdf" in url.lower() else ".md"
        safe_name = name.replace("/", "").replace("\\", "").replace(":", "").replace("*", "").replace("?", "").replace('"', "").replace("<", "").replace(">", "").replace("|", "").replace(" ", "_") + ext
        file_path = category_dir / safe_name
        
        if not file_path.exists():
            logger.warning(f"File not found: {file_path}. Skipping.")
            continue
            
        logger.info(f"Starting ingestion for: {name}")
        try:
            num_chunks = await process_document(
                file_path=str(file_path),
                category=category,
                source_url=url,
                title=name
            )
            logger.info(f"Ingested {num_chunks} chunks for '{name}'")
        except Exception as e:
            logger.error(f"Failed to ingest '{name}': {e}")

async def main():
    parser = argparse.ArgumentParser(description="Ingest downloaded corpus into Qdrant.")
    parser.add_argument("category", nargs="?", default="all", help="Category to ingest, or 'all'")
    args = parser.parse_args()

    if not SOURCES_FILE.exists():
        logger.error(f"Sources file not found at {SOURCES_FILE}")
        return

    with open(SOURCES_FILE, "r") as f:
        data = json.load(f)

    knowledge_base = data.get("startup_knowledge_base", {})
    
    if args.category == "all":
        for cat, docs in knowledge_base.items():
            await ingest_category(cat, docs)
    else:
        if args.category in knowledge_base:
            await ingest_category(args.category, knowledge_base[args.category])
        else:
            logger.error(f"Category '{args.category}' not found in sources.json")

if __name__ == "__main__":
    asyncio.run(main())
