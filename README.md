# 🚀 StartupSage AI

<div align="center">
  <p><strong>Your Context-Aware AI Co-Pilot for Navigating the Indian Startup Ecosystem</strong></p>
</div>

StartupSage is an advanced, context-aware AI advisor designed specifically for Indian startups. It uses state-of-the-art Agentic RAG (Retrieval-Augmented Generation) to guide founders through registration, taxation, MSME guidelines, funding schemes, IP protection, and compliance based strictly on official government policies.

## ✨ Key Features

* **Context-Aware Advice:** Users can create a personalized Startup Profile (Industry, Stage, Location). The AI dynamically adjusts its advice and logic based on this context.
* **Three Dynamic RAG Modes:**
  * ⚡ **Basic RAG:** Standard dense vector retrieval using Qdrant (Semantic Search).
  * 🔀 **Hybrid RAG:** Combines Dense (Semantic) and Sparse (BM25) search using Reciprocal Rank Fusion (RRF) for highly precise document retrieval and exact keyword matching.
  * 🤖 **Agentic Workflow (Default):** Powered by LangGraph. The agent autonomously classifies intents, routes queries, actively rewrites bad queries, verifies groundedness to prevent hallucinations, and automatically appends legal disclaimers for high-risk topics.
* **Document Attachment Analysis:** Users can upload PDF or TXT files directly in the chat. The application instantly extracts text and feeds it into the AI's context for highly specific, document-grounded answers.
* **🎙️ Voice-Based Chatting:** Features native real-time Web Speech API integration. Users can seamlessly dictate their complex queries without touching the keyboard.
* **🔐 Full Authentication & Dashboard:** Secure JWT-based login/register flow. Users have access to a dedicated dashboard overview displaying their activity metrics and dynamic charts.
* **Stunning Neo-Brutalist UI:** A massive frontend overhaul built with React, Vite, and TailwindCSS v4. It features a stunning neo-brutalist aesthetic with high-contrast borders, bold typography, hard shadows, vibrant amber/lime color palettes, and glassmorphism.
* **Enterprise-Grade Ingestion Pipeline:** Uses `PyMuPDF` to perfectly preserve tables, columns, and layouts from complex government documents. Features an intelligent chunking strategy (1500 chars, 300 overlap) to keep long legal clauses intact.
* **Ultra-Fast Backend Optimizations:** 
  * ML Models (Embedder & Reranker) are eagerly pre-warmed in background threads during FastAPI lifespan startup to eliminate cold-start freezes.
  * Uses blazing-fast ASCII heuristics (`_is_likely_english`) to instantly bypass unnecessary LLM language-translation overheads on standard English queries.
* **Multilingual Intelligence:** Ask questions in Hindi, Marathi, or English. The AI understands, retrieves English documents, and responds flawlessly in your preferred language.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, TailwindCSS v4, Framer Motion, Lenis (Smooth Scroll)
* **Backend:** FastAPI, Python, Motor (Async MongoDB)
* **Databases:** MongoDB (Profiles & Chat History), Qdrant (Vector Embeddings)
* **Ingestion:** PyMuPDF (fitz) for Layout-Aware Extraction, Langchain Text Splitters
* **AI & Machine Learning:** Google Gemini, Groq (Fallback), BAAI/bge-reranker-base (Cross-Encoder), LangGraph (Agentic Workflow), SentenceTransformers (BAAI/bge-base-en-v1.5)

## 🚀 Getting Started

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
   
   # Windows:
   .venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   
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
   ```

3. **Ingest Knowledge Base**
   Download required official PDFs into `backend/data/raw/` and run the ingestion pipeline:
   ```bash
   python backend/scripts/ingest_corpus.py all
   ```

4. **Run Backend Server**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Run Frontend Development Server**
   Open a new terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📜 License
This project is licensed under the MIT License.

---

## 👨‍💻 Author

<div align="left">
  <a href="https://github.com/Sahil-2005" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/sahil-gawade-920a0a242/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:gawadesahil.dev@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
  <a href="https://leetcode.com/u/sahilgawade4321/" target="_blank">
    <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" alt="LeetCode" />
  </a>
  <a href="https://sahil-gawade.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
  </a>
</div>
