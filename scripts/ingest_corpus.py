import os
import sys
import asyncio
from pathlib import Path

# Add backend directory to sys.path so we can import from app
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_dir))

from app.rag.ingestion.pipeline import process_document
from app.db.mongo import connect_to_mongo, close_mongo_connection

async def main():
    if len(sys.argv) < 2:
        print("Usage: python ingest_corpus.py <category_folder_or_all>")
        sys.exit(1)
        
    target = sys.argv[1]
    data_dir = Path(__file__).parent.parent / "data" / "raw"
    
    await connect_to_mongo()
    
    categories = []
    if target == "all":
        categories = [d.name for d in data_dir.iterdir() if d.is_dir()]
    else:
        if (data_dir / target).exists():
            categories = [target]
        else:
            print(f"Category directory not found: {target}")
            sys.exit(1)
            
    total_chunks = 0
    total_docs = 0
    
    for category in categories:
        cat_dir = data_dir / category
        if not cat_dir.exists():
            continue
            
        print(f"\nProcessing category: {category}")
        for file_path in cat_dir.iterdir():
            if file_path.is_file() and file_path.suffix in ['.pdf', '.txt', '.md', '.html']:
                # Basic metadata fallback
                title = file_path.stem.replace('_', ' ').title()
                source_url = f"local://{file_path.name}"
                
                chunks = await process_document(
                    file_path=str(file_path),
                    category=category,
                    source_url=source_url,
                    title=title,
                    reliability_note="Local file"
                )
                total_chunks += chunks
                total_docs += 1
                
    await close_mongo_connection()
    print(f"\nIngestion complete! Processed {total_docs} documents resulting in {total_chunks} chunks.")

if __name__ == "__main__":
    asyncio.run(main())
