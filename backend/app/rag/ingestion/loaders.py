from pathlib import Path
from bs4 import BeautifulSoup

def load_document(file_path: str) -> str:
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    
    if path.suffix.lower() == '.pdf':
        try:
            from pypdf import PdfReader
            reader = PdfReader(str(path))
            return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
        except ImportError:
            raise ImportError("Please install pypdf to read PDF files.")
    
    elif path.suffix.lower() in ['.html', '.htm']:
        with open(path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            return soup.get_text(separator='\n')
            
    elif path.suffix.lower() in ['.txt', '.md']:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
            
    else:
        raise ValueError(f"Unsupported file format: {path.suffix}")
