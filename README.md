# StartupSage AI

StartupSage is an advanced, context-aware AI advisor designed specifically for Indian startups. It uses state-of-the-art Agentic RAG (Retrieval-Augmented Generation) to guide founders through registration, taxation, MSME guidelines, funding schemes, IP protection, and compliance based strictly on official government policies.

## Features

* **Context-Aware Advice:** Users can create a Startup Profile (Industry, Stage, Location). The AI dynamically adjusts its advice based on this context.
* **Three RAG Modes:**
  * **Basic RAG:** Standard dense vector retrieval using Qdrant.
  * **Hybrid RAG:** Combines Dense (Semantic) and Sparse (BM25) search using Reciprocal Rank Fusion (RRF) for highly precise document retrieval.
  * **Agentic RAG:** Powered by LangGraph. The agent classifies intents, routes queries, actively rewrites bad queries, verifies groundedness to prevent hallucinations, and automatically appends legal disclaimers for high-risk topics.
* **Premium UI:** A beautiful, responsive frontend built with React, Vite, and TailwindCSS featuring glassmorphism, animated states, and citation hover cards.
* **Authoritative Knowledge Base:** Ingests and chunks real-world PDF documents from DPIIT, MCA, CBIC, MeitY, and more.

## Tech Stack

* **Frontend:** React, Vite, TailwindCSS
* **Backend:** FastAPI, Python, Motor (Async MongoDB)
* **Databases:** MongoDB (Profiles & Chat History), Qdrant (Vector Embeddings)
* **AI & LLMs:** Google Gemini (Primary), Groq (Fallback), Sentence-Transformers (Local Embeddings), LangGraph (Agent Workflow)

## Getting Started

### Prerequisites
* Python 3.10+
* Node.js 18+
* MongoDB URI
* Qdrant (Local or Cloud)
* Gemini API Key

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
2. **Environment Variables**
   Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_uri
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   RAG_MODE=agentic
   ```

3. **Ingest Knowledge Base**
   Download PDFs into `backend/data/raw/` and run:
   ```bash
   python backend/scripts/ingest_corpus.py all
   ```

4. **Run Backend Server**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Run Frontend Development Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## License
MIT License
