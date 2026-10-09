import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { title: 'REGISTRATION', desc: 'DPIIT, MCA, Startup India', color: 'bg-[#ff8c00]', icon: '📄' },
  { title: 'FUNDING', desc: 'Schemes, Investors, Grants', color: 'bg-[#3b82f6]', icon: '💰' },
  { title: 'TAX & COMPLIANCE', desc: 'GST, ITR, Legal', color: 'bg-[#a3e635]', icon: '🛡️' },
  { title: 'MSME', desc: 'Schemes & Benefits', color: 'bg-[#f4f0e6]', icon: '🏭' },
  { title: 'IPR', desc: 'Patents, Trademarks', color: 'bg-[#ff8c00]', icon: '💡' },
  { title: 'BUSINESS OPERATIONS', desc: 'Licenses, Labour, Policies', color: 'bg-[#3b82f6]', icon: '⚙️' },
];

function AnimatedCounter({ target, delay = 0 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target.toString().replace(/,/g, ''));
    if (isNaN(end)) return;
    const duration = 1500;
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    
    setTimeout(() => {
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(start);
      }, 30);
      return () => clearInterval(timer);
    }, delay);
  }, [target, delay]);
  return <span>{count.toLocaleString()}{target.toString().includes('+') ? '+' : ''}</span>;
}

export default function Landing() {
  const [stats, setStats] = useState({ docs: 48, chunks: 3400, topics: 8 });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/config/knowledge')
      .then(res => res.json())
      .then(data => {
        setStats({
          docs: data.total_docs || 48,
          chunks: data.total_chunks || 3400,
          topics: Object.keys(data.categories || {}).length || 8
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative dot-pattern">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-[#f4f0e6] border-b-[3px] border-black shadow-[0_4px_0px_#000]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-[#ff8c00] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center transform hover:rotate-12 transition-transform">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <span className="text-black font-black text-xl uppercase tracking-wider">StartupSage</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Product', 'Knowledge', 'How it works'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                 className="text-black font-bold uppercase text-sm hover:underline decoration-[3px] underline-offset-4 decoration-[#ff8c00] transition-all">
                {item}
              </a>
            ))}
            <div className="flex items-center gap-2 text-[10px] font-black uppercase border-[3px] border-black px-3 py-1 bg-white shadow-[2px_2px_0px_#000]">
              <div className="w-2 h-2 bg-[#a3e635] border border-black animate-ping"></div>
              AI System Online
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-secondary py-2 px-6 bg-white font-black hover:bg-[#f4f0e6]">Sign in</Link>
            <Link to="/register" className="bg-[#a3e635] text-black border-[3px] border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all flex items-center gap-2">
              Get started <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10" id="product">
        <div>
          <div className="inline-block transform -rotate-2 mb-8">
            <div className="bg-[#ff8c00] border-[3px] border-black shadow-[4px_4px_0px_#000] px-4 py-2 text-black font-black uppercase text-sm flex items-center gap-2">
              Made for India <span className="text-xl">🇮🇳</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(4rem,9vw,6rem)] font-black leading-[0.9] text-black uppercase tracking-tighter mb-8">
            India's Startup <br/>
            <span className="text-[#3b82f6] underline decoration-[8px] underline-offset-[12px] decoration-black">Knowledge Engine</span>
          </h1>
          
          <p className="text-2xl font-black text-black mb-6 bg-white inline-block border-[3px] border-black px-4 py-2 shadow-[4px_4px_0px_#000]">
            Your AI co-pilot for building in India.
          </p>
          <p className="text-lg font-bold text-[#333] mb-12 max-w-lg leading-relaxed">
            Navigate startup registration, taxation, MSME guidelines, and funding with absolute confidence. Grounded answers retrieved directly from live official government sources, perfectly personalized to your startup's profile.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-16">
            <Link to="/register" className="bg-black text-white border-[3px] border-black px-8 py-4 font-black uppercase text-lg shadow-[6px_6px_0px_#ff8c00] hover:shadow-[8px_8px_0px_#ff8c00] hover:-translate-y-1 transition-all flex items-center gap-3">
              Ask StartupSage <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Dynamic Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 transform hover:-translate-y-2 transition-transform">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-black"><AnimatedCounter target={stats.docs} /></h3>
                <span className="text-2xl">🏛️</span>
              </div>
              <p className="text-[10px] font-black uppercase text-[#555] tracking-wider">Official Govt PDFs</p>
            </div>
            <div className="bg-[#a3e635] border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 transform hover:-translate-y-2 transition-transform delay-75">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-black"><AnimatedCounter target={stats.chunks} delay={300} /></h3>
                <span className="text-2xl">🧬</span>
              </div>
              <p className="text-[10px] font-black uppercase text-black tracking-wider">Data Vector Chunks</p>
            </div>
            <div className="bg-[#3b82f6] border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 transform hover:-translate-y-2 transition-transform delay-150">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-white"><AnimatedCounter target={stats.topics} delay={600} /></h3>
                <span className="text-2xl">🗂️</span>
              </div>
              <p className="text-[10px] font-black uppercase text-white tracking-wider">Knowledge Domains</p>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="relative h-[650px] hidden lg:block overflow-visible">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border-[4px] border-black bg-white shadow-[12px_12px_0px_#000]">
            <img src="/hero_gateway.png" alt="Gateway of India" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
            
            {/* Overlay Elements */}
            <div className="absolute -top-6 -right-6 bg-[#ff8c00] border-[4px] border-black p-6 shadow-[8px_8px_0px_#000] transform rotate-6 w-64">
              <h4 className="font-black uppercase text-2xl mb-4 border-b-[3px] border-black pb-2 text-black">Agentic RAG</h4>
              <ul className="space-y-4 font-black text-sm uppercase">
                <li className="flex items-center gap-3"><div className="w-3 h-3 bg-black"></div> Dynamic Routing</li>
                <li className="flex items-center gap-3"><div className="w-3 h-3 bg-black"></div> LangGraph Graph</li>
                <li className="flex items-center gap-3"><div className="w-3 h-3 bg-black"></div> Auto-Verification</li>
                <li className="flex items-center gap-3"><div className="w-3 h-3 bg-black"></div> Reciprocal Rank</li>
              </ul>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-[#3b82f6] border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 transform -rotate-3">
               <div className="flex gap-3 mb-2">
                 <span className="bg-white text-black font-black text-xs px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">English</span>
                 <span className="bg-[#111] text-white font-black text-xs px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">हिंदी</span>
                 <span className="bg-[#111] text-white font-black text-xs px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_#000]">मराठी</span>
               </div>
               <h4 className="font-black uppercase text-xl text-white">Full Multilingual Intelligence</h4>
            </div>

            {/* Read Aloud Badge */}
            <div className="absolute top-1/4 -left-10 bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-4 transform -rotate-6 w-56 z-20">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="font-black uppercase text-sm text-black">Read Aloud</h4>
                 <div className="bg-[#a3e635] rounded-full p-2 border-2 border-black animate-pulse">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                 </div>
               </div>
               <p className="font-bold text-[10px] uppercase text-gray-600">Listen to responses instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="h-4 bg-black w-full border-y-[4px] border-black shadow-[0_4px_0px_#ff8c00]"></div>

      {/* ===== FEATURES ===== */}
      <section className="bg-[#a3e635] border-b-[4px] border-black py-24" id="features">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
             <div className="inline-block bg-white border-[4px] border-black shadow-[6px_6px_0px_#000] px-6 py-2 transform rotate-2 mb-6">
                <h2 className="text-4xl font-black uppercase text-black">Core Capabilities</h2>
             </div>
             <p className="text-xl font-bold text-black max-w-2xl mx-auto">Everything you need to navigate the Indian startup ecosystem, packed into one powerful agent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: 'Startup Context', desc: 'Personalized answers based on your specific industry, stage, and location.', icon: '🎯', color: 'bg-white' },
               { title: 'Read Aloud', desc: 'Listen to the AI responses instantly with built-in voice synthesis.', icon: '🗣️', color: 'bg-[#ff8c00]' },
               { title: 'Source Citations', desc: 'Every claim is backed by a direct link to the official PDF source.', icon: '🔗', color: 'bg-[#3b82f6]' },
               { title: 'Document Upload', desc: 'Upload your own legal documents to analyze and chat with them securely.', icon: '📄', color: 'bg-white' }
             ].map((feature, i) => (
                <div key={i} className={`border-[4px] border-black shadow-[6px_6px_0px_#000] p-6 ${feature.color} transform transition-transform hover:-translate-y-2`}>
                   <div className="text-4xl mb-4 bg-white border-[3px] border-black inline-block p-2 shadow-[2px_2px_0px_#000]">
                     {feature.icon}
                   </div>
                   <h3 className={`font-black text-xl uppercase mb-2 ${feature.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}>{feature.title}</h3>
                   <p className={`font-bold text-sm ${feature.color === 'bg-[#3b82f6]' ? 'text-blue-100' : 'text-gray-800'}`}>{feature.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white border-b-[4px] border-black py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black mb-16 text-center">
            How <span className="bg-[#ff8c00] px-4 py-1 border-[4px] border-black shadow-[6px_6px_0px_#000] inline-block transform -rotate-2">StartupSage</span> Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[4px] bg-black -translate-y-1/2 z-0"></div>

            <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_#000] relative z-10 transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#a3e635] border-[4px] border-black rounded-full flex items-center justify-center font-black text-3xl mb-6 shadow-[4px_4px_0px_#000]">1</div>
              <h3 className="font-black text-2xl uppercase mb-4">Set Your Context</h3>
              <p className="font-bold text-gray-700">Tell us your industry, stage, and state. StartupSage dynamically alters its search parameters to only retrieve laws and schemes relevant to your exact situation.</p>
            </div>

            <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_#000] relative z-10 transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#3b82f6] border-[4px] border-black rounded-full flex items-center justify-center font-black text-white text-3xl mb-6 shadow-[4px_4px_0px_#000]">2</div>
              <h3 className="font-black text-2xl uppercase mb-4">Agentic Retrieval</h3>
              <p className="font-bold text-gray-700">The LangGraph agent classifies your intent, rewrites your query for maximum vector similarity, and performs a Hybrid RRF search across thousands of government document chunks.</p>
            </div>

            <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_#000] relative z-10 transform transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#ff8c00] border-[4px] border-black rounded-full flex items-center justify-center font-black text-3xl mb-6 shadow-[4px_4px_0px_#000]">3</div>
              <h3 className="font-black text-2xl uppercase mb-4">Verified Generation</h3>
              <p className="font-bold text-gray-700">The LLM streams back a synthesized answer, strictly grounded in the retrieved context. It automatically appends citations linking directly to the source PDFs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KNOWLEDGE BASE PREVIEW ===== */}
      <section className="bg-[#f4f0e6] border-b-[4px] border-black py-24" id="knowledge">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-black mb-6">Built on Government Truth</h2>
              <p className="text-2xl font-bold text-[#444] border-l-[6px] border-[#a3e635] pl-6 py-2">
                Stop relying on hallucinated legal advice. StartupSage's brain is wired directly into official Gazette Notifications, Acts, and Schemes.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link to="/register" className="bg-white text-black border-[3px] border-black px-8 py-4 font-black uppercase text-lg shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all flex items-center gap-3">
                Explore Knowledge Base <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className={`border-[4px] border-black shadow-[6px_6px_0px_#000] ${cat.color} p-8 h-48 flex flex-col justify-between transform transition-transform hover:-translate-y-2`}>
                <div className="flex justify-between items-start">
                  <div className={`p-3 border-[3px] border-black shadow-[4px_4px_0px_#000] bg-white`}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                </div>
                <div>
                  <h3 className={`font-black text-2xl uppercase ${cat.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'} mb-1`}>{cat.title}</h3>
                  <p className={`font-black text-xs uppercase ${cat.color === 'bg-[#3b82f6]' ? 'text-blue-100' : 'text-[#333]'}`}>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-black py-32 border-b-[4px] border-black">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8">
            Ready to <span className="text-[#a3e635]">Scale?</span>
          </h2>
          <p className="text-2xl font-bold text-gray-300 mb-12">
            Join thousands of Indian founders navigating the ecosystem with AI.
          </p>
          <Link to="/register" className="inline-flex bg-[#ff8c00] text-black border-[4px] border-black px-12 py-6 font-black uppercase text-2xl shadow-[8px_8px_0px_#fff] hover:shadow-[12px_12px_0px_#fff] hover:-translate-y-2 transition-all items-center gap-4">
            START FOR FREE <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f4f0e6] py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ff8c00] border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
              <span className="text-black font-black text-2xl">S</span>
            </div>
            <span className="text-black font-black text-xl uppercase tracking-widest">StartupSage</span>
          </div>
          
          <p className="text-black font-black text-[10px] sm:text-xs uppercase text-center border-[3px] border-black bg-white px-6 py-4 shadow-[4px_4px_0px_#000] max-w-lg">
            For informational purposes only. Not a substitute for professional legal or financial advice. We do not store personal PII in LLMs.
          </p>
          
          <div className="text-black font-black uppercase text-sm flex flex-col items-end">
            <span>© 2026 StartupSage</span>
            <span className="text-[#ff8c00]">Build in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
