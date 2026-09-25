import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import './App.css'

const SOURCES = {
  "Registration & Incorporation": [
    { name: "Revised Guidelines for Recognition of Startups", source: "Startup India / DPIIT" },
    { name: "FAQs on SPICe+ and Linked Filings", source: "Ministry of Corporate Affairs" },
    { name: "Limited Liability Partnership Act, 2008", source: "Ministry of Corporate Affairs" },
    { name: "One Person Company - A Referencer", source: "ICSI" }
  ],
  "Taxation & GST": [
    { name: "New FAQs on GST", source: "CBIC" },
    { name: "Tax Incentives for Startups", source: "ICAI" }
  ],
  "MSME Udyam": [
    { name: "Udyam Registration - Gazette Notification", "source": "Ministry of MSME" },
    { name: "Clarification on Existing EM Part-II / UAM", "source": "Ministry of MSME" }
  ],
  "Funding & Investment": [
    { name: "Guidelines for Startup India Seed Fund Scheme", source: "DPIIT" },
    { name: "Consolidated FDI Policy Circular", source: "DPIIT" }
  ],
  "Contracts, IP & Labour": [
    { name: "Founder Employment Agreement Template", source: "Startup India" },
    { name: "Scheme for Facilitating Start-Ups IP Protection", source: "IP India" },
    { name: "Self-Certification of Compliance for Startups", source: "Labour Institute" },
    { name: "Digital Personal Data Protection Act, 2023", source: "MeitY" }
  ]
};

const KnowledgeBase = () => (
  <div className="max-w-5xl mx-auto p-6 mt-8 animate-fade-in-up">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Knowledge Base</h2>
      <p className="text-gray-500 max-w-2xl mx-auto">
        StartupSage AI is powered by an authoritative collection of official government policies, 
        legal acts, and professional guidelines to ensure accurate and grounded advice.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(SOURCES).map(([category, docs], idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{category}</h3>
          </div>
          <ul className="space-y-3">
            {docs.map((doc, i) => (
              <li key={i} className="flex items-start">
                <span className="text-indigo-400 mr-2 mt-0.5">•</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 leading-snug">{doc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.source}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
)

const About = () => (
  <div className="max-w-3xl mx-auto p-6 prose">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">About StartupSage</h2>
    <p className="text-gray-600 leading-relaxed mb-4">
      StartupSage AI is a decision-support and information tool for businesses in India.
    </p>
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-800">
      <strong>Disclaimer:</strong> This tool provides preliminary information based on curated sources. 
      It is not a substitute for professional legal or financial advice.
    </div>
  </div>
)

function App() {
  const location = useLocation();
  const [ragMode, setRagMode] = useState('basic');

  useEffect(() => {
    fetch('/api/v1/config/rag-mode')
      .then(res => res.json())
      .then(data => { if (data.mode) setRagMode(data.mode); })
      .catch(err => console.error("Could not fetch RAG mode", err));
  }, []);

  const handleModeChange = async (e) => {
    const newMode = e.target.value;
    setRagMode(newMode);
    try {
      await fetch('/api/v1/config/rag-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
    } catch (err) {
      console.error("Failed to update mode", err);
    }
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Premium Glassmorphic Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-sm group-hover:shadow-md transition-all transform group-hover:rotate-3">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-colors">
                StartupSage
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <select 
                  value={ragMode} 
                  onChange={handleModeChange}
                  className="appearance-none text-xs font-semibold uppercase tracking-wide border border-indigo-100 rounded-full py-1.5 pl-4 pr-8 bg-indigo-50/50 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-indigo-700 cursor-pointer transition-colors shadow-sm"
                >
                  <option value="basic">Basic RAG</option>
                  <option value="hybrid">Hybrid RAG</option>
                  <option value="agentic">Agentic Workflow</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-indigo-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <nav className="flex space-x-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                <Link to="/" className={getLinkClass('/')}>Chat</Link>
                <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
                <Link to="/knowledge-base" className={getLinkClass('/knowledge-base')}>Knowledge Base</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
