import re

def clean_text(text: str) -> str:
    # Normalize whitespace
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    # Remove basic boilerplate or repetitive headers if necessary
    return text.strip()
