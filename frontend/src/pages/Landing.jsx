import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🎯',
    title: 'Context-Aware Advice',
    desc: 'Create your startup profile and get advice tailored to your industry, stage, and location — not generic answers.',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: '🔍',
    title: 'Hybrid RAG Retrieval',
    desc: 'Combines dense semantic search with keyword-based BM25 retrieval for the most relevant document matches.',
    gradient: 'from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: '🤖',
    title: 'Agentic AI Workflow',
    desc: 'Our LangGraph-powered agent classifies intent, rewrites queries, retrieves, generates, and self-verifies — in one loop.',
    gradient: 'from-indigo-500/10 to-cyan-500/10',
    border: 'border-indigo-500/20',
  },
  {
    icon: '📄',
    title: 'Grounded Answers',
    desc: 'Every answer cites its sources from official DPIIT, MCA, CBIC, MeitY documents. No hallucinations.',
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: '⚡',
    title: 'Gemini + Groq',
    desc: 'Powered by Google Gemini Flash as primary model with Groq as automatic fallback for zero downtime.',
    gradient: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: '🛡️',
    title: 'Legal Disclaimer System',
    desc: 'Automatically appends legal disclaimers on high-risk topics like taxation and contracts.',
    gradient: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-500/20',
  },
];

const CATEGORIES = [
  { title: 'Registration & Incorporation', count: '15 docs', icon: '🏛️' },
  { title: 'Taxation & GST', count: '5 docs', icon: '📊' },
  { title: 'MSME / Udyam', count: '5 docs', icon: '🏭' },
  { title: 'Funding & Investment', count: '9 docs', icon: '💰' },
  { title: 'IP & Contracts', count: '6 docs', icon: '⚖️' },
  { title: 'Labour & HR', count: '5 docs', icon: '👥' },
  { title: 'Data Protection', count: '2 docs', icon: '🔐' },
  { title: 'Public Procurement', count: '6 docs', icon: '🛒' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-lg bg-[#0a0a0f]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg">StartupSage</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#knowledge" className="text-gray-400 hover:text-white text-sm transition-colors">Knowledge Base</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">How it works</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-40">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-indigo-300 text-sm font-medium">Powered by Agentic RAG + LangGraph</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Your AI advisor for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              building in India
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Navigate startup registration, taxation, MSME, and funding with confidence.
            Grounded answers from 50+ official government sources, personalized to your startup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 text-lg"
            >
              Start for free →
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {['DPIIT', 'Ministry of Corporate Affairs', 'CBIC', 'MeitY', 'IP India'].map(org => (
              <div key={org} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                <span>{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for serious founders</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Not another chatbot. A sophisticated AI system that thinks, retrieves, verifies, and cites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className={`bg-gradient-to-br ${f.gradient} border ${f.border} rounded-2xl p-6 hover:scale-[1.02] transition-all`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-[#0f0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How the Agentic Workflow works</h2>
            <p className="text-gray-400 text-lg">Your query goes through a 6-step intelligent pipeline</p>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Intent Classification', desc: 'The agent classifies your query into a domain (tax, registration, MSME, etc.) and checks if it\'s in scope.' },
              { step: '02', title: 'Query Rewriting', desc: 'If needed, the agent rewrites your query with better keywords optimized for vector search.' },
              { step: '03', title: 'Hybrid Retrieval', desc: 'Runs dense semantic search + BM25 sparse search, then fuses them with Reciprocal Rank Fusion.' },
              { step: '04', title: 'Answer Generation', desc: 'Gemini Flash generates a grounded answer using only the retrieved chunks, with citation markers.' },
              { step: '05', title: 'Groundedness Verification', desc: 'The agent self-verifies: is this answer actually supported by the retrieved context? If not, it retries.' },
              { step: '06', title: 'Legal Disclaimer', desc: 'For legal, tax, or contract topics, the agent automatically appends a professional disclaimer.' },
            ].map((item, i) => (
              <div key={item.step} className="flex items-start space-x-5 p-6 bg-white/3 border border-white/5 rounded-2xl">
                <div className="text-indigo-500 font-mono text-sm font-bold flex-shrink-0 mt-0.5">{item.step}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section id="knowledge" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built on official sources</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">35+ PDFs ingested from India's most authoritative government portals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5 text-center hover:border-indigo-500/20 transition-all">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="text-white font-medium text-sm mb-1">{cat.title}</h3>
                <p className="text-gray-500 text-xs">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to build smarter?</h2>
            <p className="text-gray-400 text-lg mb-8">Join founders using StartupSage to navigate India's regulatory landscape with confidence.</p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/25 text-lg"
            >
              Create free account →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-gray-400 font-medium">StartupSage</span>
          </div>
          <p className="text-gray-600 text-sm text-center">
            For informational purposes only. Not a substitute for professional legal or financial advice.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 text-gray-600 text-sm">
            <span>© 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
