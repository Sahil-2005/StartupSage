import json
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_FILE = BASE_DIR / "data" / "sources.json"
RAW_DATA_DIR = BASE_DIR / "data" / "raw"

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).replace(" ", "_")

def main():
    with open(SOURCES_FILE, "r") as f:
        data = json.load(f)

    knowledge_base = data.get("startup_knowledge_base", {})
    new_kb = {}
    
    for cat, docs in knowledge_base.items():
        new_docs = []
        cat_dir = RAW_DATA_DIR / cat
        if not cat_dir.exists():
            continue
            
        for doc in docs:
            name = doc.get("name", "")
            url = doc.get("url", "")
            ext = ".pdf" if ".pdf" in url.lower() else ".md"
            safe_name = clean_filename(name) + ext
            
            if (cat_dir / safe_name).exists():
                new_docs.append(doc)
                
        if new_docs:
            new_kb[cat] = new_docs
            
    data["startup_knowledge_base"] = new_kb
    
    with open(SOURCES_FILE, "w") as f:
        json.dump(data, f, indent=2)
        
    print("Cleaned sources.json to match downloaded files.")

if __name__ == "__main__":
    main()
