from pathlib import Path
from bs4 import BeautifulSoup

def load_document(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    if path.suffix.lower() == '.pdf':
        try:
            import fitz # PyMuPDF
            doc = fitz.open(str(path))
            text = ""
            for page in doc:
                text += page.get_text("text") + "\n\n"
            return text
        except ImportError:
            raise ImportError("Please install PyMuPDF (fitz) to read PDF files.")
    
    elif path.suffix.lower() in ['.html', '.htm']:
        with open(path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            return soup.get_text(separator='\n')
            
    elif path.suffix.lower() in ['.txt', '.md']:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
            
    else:
        raise ValueError(f"Unsupported file format: {path.suffix}")
