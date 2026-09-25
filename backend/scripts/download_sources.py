import os
import json
import logging
import urllib.request
import urllib.error
import re
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File paths
BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_FILE = BASE_DIR / "data" / "sources.json"
RAW_DATA_DIR = BASE_DIR / "data" / "raw"

def clean_filename(name):
    # Remove invalid characters for filenames
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def download_file(url, dest_path):
    try:
        # Use a user agent to avoid being blocked
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                with open(dest_path, 'wb') as f:
                    f.write(response.read())
                return True
    except urllib.error.HTTPError as e:
        logger.error(f"HTTP Error {e.code} for URL {url}")
    except Exception as e:
        logger.error(f"Failed to download {url}: {e}")
    return False

def main():
    if not SOURCES_FILE.exists():
        logger.error(f"Sources file not found at {SOURCES_FILE}")
        return

    with open(SOURCES_FILE, "r") as f:
        data = json.load(f)

    knowledge_base = data.get("startup_knowledge_base", {})
    total_docs = sum(len(docs) for docs in knowledge_base.values())
    logger.info(f"Found {total_docs} documents across {len(knowledge_base)} categories.")

    success_count = 0
    fail_count = 0

    for category, docs in knowledge_base.items():
        category_dir = RAW_DATA_DIR / category
        category_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"--- Processing Category: {category} ---")
        
        for doc in docs:
            name = doc.get("name", "Unknown")
            url = doc.get("url", "")
            
            if not url:
                continue
                
            # Determine extension
            ext = ".pdf" if ".pdf" in url.lower() else ".md" # Default to pdf if not sure for these links
            
            safe_name = clean_filename(name) + ext
            dest_path = category_dir / safe_name
            
            if dest_path.exists():
                logger.info(f"File already exists: {safe_name}")
                success_count += 1
                continue
                
            logger.info(f"Downloading: {name} ...")
            if download_file(url, dest_path):
                logger.info(f"  -> Successfully saved to {safe_name}")
                success_count += 1
            else:
                fail_count += 1

    logger.info("=========================================")
    logger.info(f"Download Summary: {success_count} succeeded, {fail_count} failed.")
    
    if success_count > 0:
        logger.info("To ingest these files into Qdrant, run:")
        logger.info("python scripts/ingest_corpus.py all")

if __name__ == "__main__":
    main()
