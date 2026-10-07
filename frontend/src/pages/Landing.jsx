import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { title: 'REGISTRATION', desc: 'DPIIT, MCA, Startup India', color: 'card-orange', icon: '📄' },
  { title: 'FUNDING', desc: 'Schemes, Investors, Grants', color: 'card-blue', icon: '💰' },
  { title: 'TAX & COMPLIANCE', desc: 'GST, ITR, Legal', color: 'card-green', icon: '🛡️' },
  { title: 'MSME', desc: 'Schemes & Benefits', color: 'card-secondary', icon: '🏭' },
  { title: 'IPR', desc: 'Patents, Trademarks', color: 'card-orange', icon: '💡' },
  { title: 'BUSINESS OPERATIONS', desc: 'Licenses, Labour, Policies', color: 'card-blue', icon: '⚙️' },
];

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) return;
    const duration = 1500;
    const step = Math.max(1, Math.floor(end / (duration / 30)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{target.includes('+') ? '+' : ''}</span>;
}

export default function Landing() {
  return (
    <div className="min-h-screen relative dot-pattern">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-[#f4f0e6] border-b-[3px] border-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-[#ff8c00] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <span className="text-black font-black text-xl uppercase tracking-wider">StartupSage</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Product', 'Knowledge', 'How it works'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                 className="text-black font-bold uppercase text-sm hover:underline decoration-[2px] underline-offset-4">
                {item}
              </a>
            ))}
            <div className="flex items-center gap-2 text-xs font-bold uppercase border-2 border-black rounded-full px-3 py-1 bg-white shadow-[2px_2px_0px_#000]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] border border-black animate-pulse"></div>
              AI System Online
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-secondary py-2 px-6">Sign in</Link>
            <Link to="/register" className="btn-primary py-2 px-6 flex items-center gap-2">
              Get started <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block transform -rotate-2 mb-6">
            <div className="bg-[#a3e635] border-[3px] border-black shadow-[4px_4px_0px_#000] px-4 py-2 text-black font-black uppercase text-sm flex items-center gap-2">
              Made for India <span className="text-xl">🇮🇳</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(3.5rem,8vw,5.5rem)] font-black leading-[0.9] text-black uppercase tracking-tight mb-8">
            India's Startup <br/>
            <span className="text-[#ff8c00]">Knowledge Engine</span>
          </h1>
          
          <p className="text-2xl font-bold text-black mb-4">
            Your AI co-pilot for building in India.
          </p>
          <p className="text-lg font-medium text-[#333] mb-10 max-w-lg">
            Navigate startup registration, taxation, MSME, and funding with confidence. Grounded answers from 50+ official government sources, personalized to your startup.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-16">
            <Link to="/register" className="btn-primary py-4 px-8 text-lg flex items-center gap-2">
              Ask StartupSage <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#features" className="btn-secondary py-4 px-8 text-lg">
              Learn More
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card bg-white p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-black"><AnimatedCounter target="50+" /></h3>
                <span className="text-2xl">🏛️</span>
              </div>
              <p className="text-xs font-bold uppercase text-[#555]">Government Sources</p>
            </div>
            <div className="card bg-white p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-black"><AnimatedCounter target="35+" /></h3>
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-xs font-bold uppercase text-[#555]">Documents Ingested</p>
            </div>
            <div className="card bg-white p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-4xl font-black text-black"><AnimatedCounter target="8+" /></h3>
                <span className="text-2xl">🗂️</span>
              </div>
              <p className="text-xs font-bold uppercase text-[#555]">Topic Areas</p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4">
            <span className="font-bold text-sm uppercase text-black">Multilingual Support</span>
            <div className="flex gap-2">
              <span className="badge badge-accent shadow-[2px_2px_0px_#000] border-2 border-black">English</span>
              <span className="badge bg-[#333] text-white shadow-[2px_2px_0px_#000] border-2 border-black">हिंदी</span>
              <span className="badge bg-[#333] text-white shadow-[2px_2px_0px_#000] border-2 border-black">मराठी</span>
            </div>
          </div>
        </div>

        {/* Abstract Hero Image Area (Neo-Brutalist Illustration) */}
        <div className="relative h-[600px] hidden lg:block overflow-visible">
          {/* Background Illustration */}
          <img src="/hero_gateway.png" alt="Gateway of India" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none h-auto object-contain mix-blend-multiply pointer-events-none z-10" />
          
          {/* Post-it Notes */}
          <div className="absolute top-10 right-0 bg-[#a3e635] border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 w-64 transform rotate-3 z-20">
            <h4 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2">Agentic RAG</h4>
            <ul className="space-y-3 font-bold">
              <li className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg> RAG</li>
              <li className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg> LangGraph</li>
              <li className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Multilingual</li>
              <li className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Verified Sources</li>
            </ul>
          </div>
          
          <div className="absolute bottom-20 left-10 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-4 transform -rotate-2 z-30">
            <div className="text-3xl font-black mb-2 text-[#ff8c00]">DREAM</div>
            <div className="text-3xl font-black mb-2 text-[#3b82f6]">BUILD</div>
            <div className="text-3xl font-black text-black">SCALE</div>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="h-4 bg-black w-full border-y-[3px] border-black"></div>

      {/* ===== KNOWLEDGE BASE PREVIEW ===== */}
      <section className="bg-white border-b-[3px] border-black py-20" id="features">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black uppercase tracking-tight text-black mb-4">Your Complete Startup Support</h2>
              <p className="text-xl font-medium text-[#444]">
                From idea to scale — get expert guidance on every step of your journey.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link to="/register" className="btn-secondary py-3 px-6">Explore Knowledge Base <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className={`card ${cat.color === 'card-secondary' ? 'bg-[#f4f0e6]' : cat.color} p-6 h-40 flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 border-[3px] border-black shadow-[2px_2px_0px_#000] bg-white`}>
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_#000]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase text-black">{cat.title}</h3>
                  <p className="font-bold text-sm text-[#222]">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#111] text-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#ff8c00] border-2 border-black flex items-center justify-center text-black shadow-[4px_4px_0px_#fff]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <h4 className="font-black uppercase text-xl text-[#ff8c00]">Powered by Advanced AI</h4>
                <p className="font-bold text-sm text-gray-300">Agentic RAG • LangGraph • Grounded in Government Sources</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 px-6 py-3 border-2 border-dashed border-[#ff8c00] text-[#ff8c00] font-black uppercase flex items-center gap-4">
              Built for the Indian Startup Ecosystem <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#f4f0e6] py-10 border-t-[3px] border-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff8c00] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
              <span className="text-black font-black text-sm">S</span>
            </div>
            <span className="text-black font-black uppercase">StartupSage</span>
          </div>
          <p className="text-black font-bold text-xs uppercase text-center border-2 border-black bg-white px-4 py-2 shadow-[2px_2px_0px_#000]">
            For informational purposes only. Not a substitute for professional legal or financial advice.
          </p>
          <span className="text-black font-black uppercase text-sm">© 2026 StartupSage</span>
        </div>
      </footer>
    </div>
  );
}
