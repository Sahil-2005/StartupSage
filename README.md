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

---

## 🧠 Concept: What is StartupSage?

**The Problem:**
Navigating the Indian startup ecosystem is a bureaucratic maze. Founders struggle to understand DPIIT recognition, GST filing, MCA compliance, and government grants (like the Startup India Seed Fund). Hiring legal and financial experts is incredibly expensive, and using generic AI (like ChatGPT) is dangerous because it confidently hallucinates laws or gives American advice instead of Indian legal truths.

**The Solution:**
**StartupSage** is an AI-powered legal and operational co-pilot built exclusively for Indian founders. It doesn't guess; it retrieves answers strictly from a curated, live database of official Indian government PDFs (Gazettes, Acts, and Schemes). 

**Core Conceptual Features:**
*   **Context-Aware:** It remembers your startup's profile (e.g., *SaaS, Seed-stage, Maharashtra*). When you ask about funding, it filters the laws to only show grants relevant to a tech company in Maharashtra.
*   **Zero Hallucinations:** Every answer generated is backed by a specific chunk of text from an official document, complete with source citations.
*   **Accessibility:** It supports Document Uploads (to chat with your own legal files), Multilingual support, and instant Text-To-Speech (Read Aloud) so founders can consume information effortlessly.
*   **Neo-Brutalist Design:** A bold, modern, highly interactive UI that feels premium and blazing fast.

## 🏗️ Technical Architecture: How it Works

StartupSage is a modern, full-stack AI application utilizing an **Agentic RAG (Retrieval-Augmented Generation)** architecture. 

#### **Frontend (User Interface)**
*   **Tech Stack:** React (Vite), TailwindCSS, React Router.
*   **Design Language:** Neo-Brutalism (heavy borders, vibrant contrasting colors, sharp shadows) paired with **Lenis** for buttery-smooth scrolling.
*   **Features:** Markdown rendering for AI responses, native Web Speech API integration for TTS (Text-to-Speech), and dynamic components (like Animated Counters).

#### **Backend (API & Logic)**
*   **Tech Stack:** FastAPI (Python), Uvicorn.
*   **Authentication:** JWT-based secure authentication. 
*   **Endpoints:** Asynchronous streaming endpoints to stream the AI's response token-by-token to the frontend, making the app feel instantaneous.

#### **The AI Engine (Agentic RAG Pipeline)**
This is the heart of the project. We didn't just build a wrapper around an API; we built a complex AI agent using **LangGraph** and **LangChain**.
1.  **Vector Database (Qdrant):** We took 48+ massive Indian government PDFs, split them into thousands of small chunks, generated dense vectors using an Embedding Model (`BAAI/bge-base-en`), and stored them in Qdrant.
2.  **Query Rewriting & Translation:** When a user asks a question (even in Hinglish), the AI first translates it and extracts optimized keywords (e.g., *"Mere company ko fund kaise kare"* becomes *"Seed fund scheme government grants"*).
3.  **Context Injection:** The backend injects the user's Startup Profile into the system prompt.
4.  **Retrieval & Verification:** The system searches Qdrant for the most relevant PDF chunks. **LangGraph** acts as a "Supervisor Agent"—it reads the retrieved chunks and verifies if they actually contain the answer. If they don't, it re-routes the search.
5.  **Generation (Groq / Llama 3.1):** We use Groq's LPUs running Llama-3.1 to generate the final response at blazing speeds (often over 800 tokens per second). 

## 🎤 How to Pitch StartupSage

When pitching to a panel (whether they are investors, professors, or hackathon judges), your goal is to make them realize the **pain point** and then wow them with your **technical sophistication**. 

Here is a 4-step structure to deliver a killer pitch:

#### **Step 1: The Hook (The Problem)**
> *"Every year, thousands of brilliant Indian startups fail—not because their product was bad, but because they drowned in compliance, missed out on unadvertised government grants, or couldn't afford expensive lawyers. If you ask generic AI for help, it hallucinates laws or gives you American tax advice, which is legally dangerous."*

#### **Step 2: The Reveal (The Solution)**
> *"Enter StartupSage: India’s first Agentic AI Co-pilot for Founders. StartupSage doesn’t guess. It is hard-wired directly into official Indian Government Gazettes, DPIIT guidelines, and MCA laws. We bring top-tier, legally grounded advisory to every founder, for free."*

#### **Step 3: The "Magic" Demo (Show, Don't Tell)**
*   **The Context:** *"Notice how I set my profile as an Agri-Tech startup in Maharashtra. When I ask 'What grants can I get?', the AI doesn't give me generic answers. It specifically reads the Maharashtra state policies and Agri-tech schemes."*
*   **The Citations:** *"This is the most important part. See these citations at the bottom? StartupSage proves it's not hallucinating by giving me a direct link to the exact government PDF it used to generate the answer."*
*   **The Accessibility:** *"And because we want to reach founders in Tier 2 and Tier 3 cities, we built in native Text-To-Speech. (Click the Read Aloud button). It instantly reads complex legal jargon out loud."*

#### **Step 4: The Technical Flex (For the Engineers/Judges)**
> *"Under the hood, this isn't a basic ChatGPT wrapper. We built a highly sophisticated **Agentic RAG architecture** using FastAPI, LangGraph, and Qdrant. Before the AI even types a word, a supervisor agent translates the query, runs a vector similarity search across thousands of embedded legal chunks, and self-verifies the context. We then use Groq's inference engine to stream the answer back in milliseconds. All of this is wrapped in a high-performance React frontend featuring a bold, brutalist design."*
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

6. **Setup Environment Variables**
   Create a `.env` file in the `backend` folder and add your keys:
   ```env
   MONGODB_URI=your_mongodb_uri
   QDRANT_URL=your_qdrant_url
   QDRANT_API_KEY=your_qdrant_api_key
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

7. **Download Government Documents**
   Run the scraping script to fetch all the required official PDFs and markdown files:
   ```bash
   python scripts/download_sources.py
   ```

8. **Ingest Knowledge Base**
   Run the embedding pipeline to chunk and vectorize the 48+ documents into Qdrant:
   ```bash
   python -m scripts.ingest_corpus all
   ```

9. **Start the Backend Server**
   ```bash
   uvicorn app.main:app --reload
   ```

10. **Start Frontend Development Server**
    Open a completely new terminal window, navigate to the frontend folder, and start the app:
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
