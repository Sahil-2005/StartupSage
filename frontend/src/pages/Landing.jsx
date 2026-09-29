import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
    ),
    title: 'Multilingual Intelligence',
    desc: 'Ask in Hindi, Marathi, or any language — our AI translates, retrieves English docs, and responds in your language.',
    tag: 'New',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    ),
    title: 'Context-Aware Advice',
    desc: 'Your startup profile shapes every answer. Industry, stage, location — the AI tailors advice specifically for you.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    ),
    title: 'Hybrid RAG Engine',
    desc: 'Dense semantic + BM25 sparse search, fused with Reciprocal Rank Fusion and cross-encoder reranking.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4"/></svg>
    ),
    title: 'Agentic Workflow',
    desc: 'A LangGraph agent that classifies, rewrites, retrieves, generates, and self-verifies — autonomously.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
    title: 'Grounded & Cited',
    desc: 'Every answer backed by official DPIIT, MCA, CBIC sources. No hallucinations — just verified facts with citations.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    ),
    title: 'Dual LLM Fallback',
    desc: 'Lightning-fast Groq as primary, Google Gemini as fallback. Zero-downtime architecture for instant responses.',
  },
];

const CATEGORIES = [
  { title: 'Registration', count: '15', icon: '🏛️' },
  { title: 'Taxation & GST', count: '5', icon: '📊' },
  { title: 'MSME / Udyam', count: '5', icon: '🏭' },
  { title: 'Funding', count: '9', icon: '💰' },
  { title: 'IP & Contracts', count: '6', icon: '⚖️' },
  { title: 'Labour & HR', count: '5', icon: '👥' },
  { title: 'Data Protection', count: '2', icon: '🔐' },
  { title: 'Procurement', count: '6', icon: '🛒' },
];

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Tell us your startup\'s stage, industry, and location to get personalized advice.' },
  { num: '02', title: 'Ask Anything', desc: 'Type your question in any language — about registration, tax, funding, compliance.' },
  { num: '03', title: 'AI Retrieves & Verifies', desc: 'Our Agentic RAG pipeline searches 35+ official documents, verifies groundedness, and cites sources.' },
  { num: '04', title: 'Get Actionable Answers', desc: 'Receive precise, cited, legally-disclaimed answers tailored to your startup\'s context.' },
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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ===== HEADER ===== */}
      <header className="glass fixed top-0 left-0 right-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <span style={{ color: '#09090b', fontWeight: 800, fontSize: '14px' }}>S</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>StartupSage</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Knowledge'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
                onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
              >{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>Sign in</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 22px', fontSize: '13px' }}>Get started</Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute animate-float" style={{ top: '10%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', borderRadius: '50%' }}></div>
          <div className="absolute animate-float" style={{ top: '30%', right: '15%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(244,63,94,0.06), transparent 70%)', borderRadius: '50%', animationDelay: '2s' }}></div>
          <div className="absolute animate-float" style={{ bottom: '10%', left: '40%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(20,184,166,0.05), transparent 70%)', borderRadius: '50%', animationDelay: '4s' }}></div>
          <div className="grid-bg absolute inset-0 opacity-40"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Badge */}
          <div className="badge badge-accent animate-fade-in-up" style={{ marginBottom: '32px', animationDelay: '0ms' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-glow 2s infinite' }}></div>
            Agentic RAG · LangGraph · Multilingual
          </div>

          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '24px', animationDelay: '100ms' }}>
            Your AI co-pilot for<br />
            <span className="text-gradient-gold">building in India</span>
          </h1>

          <p className="animate-fade-in-up" style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px', animationDelay: '200ms' }}>
            Navigate startup registration, taxation, MSME, and funding with confidence. 
            Grounded answers from 50+ official government sources, personalized to your startup.
          </p>

          <div className="animate-fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '64px', animationDelay: '300ms' }}>
            <Link to="/register" className="btn-primary" style={{ padding: '16px 36px', fontSize: '15px', borderRadius: 'var(--radius-xl)' }}>
              Start for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '15px', borderRadius: 'var(--radius-xl)' }}>
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px', animationDelay: '400ms' }}>
            {[['50', 'Govt. Sources'], ['35', 'Documents Ingested'], ['8', 'Topic Areas'], ['∞', 'Languages']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent-light)' }}>
                  {num === '∞' ? '∞' : <AnimatedCounter target={num + '+'} />}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="badge badge-accent mb-4">Capabilities</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Not another chatbot.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>A sophisticated AI system that thinks, retrieves, verifies, and cites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: '28px' }}>
                <div className="flex items-start justify-between mb-5">
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
                    {f.icon}
                  </div>
                  {f.tag && (
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', padding: '3px 10px', borderRadius: 'var(--radius-full)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.tag}</span>
                  )}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ padding: '100px 0' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="badge badge-accent mb-4">Process</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Four steps to answers.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>From question to cited, verified answer in seconds.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STEPS.map((item, i) => (
              <div key={item.num} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '24px 28px' }}>
                <div className="font-mono flex-shrink-0" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dim)', width: '40px', height: '40px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-border)' }}>{item.num}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KNOWLEDGE BASE ===== */}
      <section id="knowledge" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <div className="badge badge-accent mb-4">Knowledge</div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Built on official sources.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>35+ PDFs from India's most authoritative government portals.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="card text-center" style={{ padding: '24px 16px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{cat.title}</h3>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>{cat.count} docs</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '100px 0' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="glass-accent" style={{ padding: '60px 40px', borderRadius: 'var(--radius-2xl)', position: 'relative', overflow: 'hidden' }}>
            <div className="dot-pattern absolute inset-0 opacity-50"></div>
            <div className="relative">
              <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Ready to build smarter?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Join founders using StartupSage to navigate India's regulatory landscape.
              </p>
              <Link to="/register" className="btn-primary" style={{ padding: '16px 40px', fontSize: '15px', borderRadius: 'var(--radius-xl)' }}>
                Create free account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#09090b', fontWeight: 800, fontSize: '12px' }}>S</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '14px' }}>StartupSage</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center' }}>
            For informational purposes only. Not a substitute for professional legal or financial advice.
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>© 2024 StartupSage</span>
        </div>
      </footer>
    </div>
  );
}
