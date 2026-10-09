import React, { useEffect, useState } from 'react';

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

export default function KnowledgePage() {
  const [stats, setStats] = useState({ total_docs: 0, total_chunks: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/config/knowledge')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalDocs = stats.total_docs || 0;
  const totalCats = Object.keys(stats.categories || {}).length;
  const totalChunks = stats.total_chunks || 0;

  // Define some static icons/colors for standard categories
  const categoryMeta = {
    "Registration And Incorporation": { icon: '🏛️', color: 'bg-[#ff8c00]' },
    "Taxation And Gst": { icon: '📊', color: 'bg-[#a3e635]' },
    "Msme / Udyam": { icon: '🏭', color: 'bg-[#3b82f6]' },
    "Funding And Investment": { icon: '💰', color: 'bg-[#fbbf24]' },
    "Ip And Contracts": { icon: '⚖️', color: 'bg-white' },
    "Labour And Hr Compliance": { icon: '👥', color: 'bg-[#ff8c00]' },
    "Data Protection And Ecommerce": { icon: '🔐', color: 'bg-white' },
    "Public Procurement Gem": { icon: '🛒', color: 'bg-[#a3e635]' },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-12 border-b-[3px] border-black pb-6">
        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-black mb-4">Live Knowledge Base</h1>
        <p className="text-xl font-bold text-black border-l-[4px] border-[#3b82f6] pl-4">
          StartupSage is dynamically powered by <span className="text-[#3b82f6] underline decoration-4 underline-offset-4">{totalDocs} official documents</span> across <span className="text-[#3b82f6] underline decoration-4 underline-offset-4">{totalCats} domains</span>, securely vectorized into {totalChunks.toLocaleString()} chunks.
        </p>
      </div>

      {loading ? (
        <div className="font-black text-2xl uppercase animate-pulse">Loading live stats...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Documents', value: totalDocs, color: 'bg-white' },
              { label: 'Total Vector Chunks', value: totalChunks.toLocaleString(), color: 'bg-[#a3e635]' },
              { label: 'Knowledge Domains', value: totalCats, color: 'bg-[#3b82f6]' },
              { label: 'Embedding Model', value: 'BGE-Base', color: 'bg-[#ff8c00]' },
            ].map(s => (
              <div key={s.label} className={`border-[3px] border-black shadow-[4px_4px_0px_#000] p-6 ${s.color} ${s.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}>
                <div className="font-black text-3xl md:text-4xl mb-2 truncate" title={s.value}>
                  {typeof s.value === 'number' || !isNaN(parseInt(s.value.toString().replace(/,/g, ''))) 
                    ? <AnimatedCounter target={s.value} /> 
                    : s.value}
                </div>
                <div className="font-bold text-xs uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(stats.categories || {}).map(([category, docs]) => {
              const meta = categoryMeta[category] || { icon: '📄', color: 'bg-white' };
              return (
                <div key={category} className={`border-[3px] border-black shadow-[6px_6px_0px_#000] p-8 ${meta.color}`}>
                  <div className="flex items-center gap-4 mb-6 border-b-[3px] border-black pb-4">
                    <div className="text-4xl bg-white border-[3px] border-black p-2 shadow-[2px_2px_0px_#000]">
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-2xl uppercase text-black leading-none mb-2 truncate max-w-[250px]" title={category}>{category}</h3>
                      <span className="font-black text-[10px] uppercase bg-black text-white px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_#fff]">
                        {docs.length} DOCUMENTS
                      </span>
                    </div>
                  </div>
                  
                  <ul className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {docs.map((doc, i) => (
                      <li key={i} className="flex flex-col gap-1 bg-white/80 p-3 border-[2px] border-black hover:bg-white transition-colors group">
                        <div className="flex items-start gap-2">
                          <div className="w-2.5 h-2.5 bg-black mt-1 flex-shrink-0"></div>
                          <a href={doc.source} target="_blank" rel="noreferrer" className="font-black text-sm text-black leading-tight group-hover:underline decoration-2">
                            {doc.name}
                          </a>
                        </div>
                        <div className="pl-4.5 font-bold text-[10px] uppercase text-[#444] flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{doc.source.replace('https://', '').split('/')[0]}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div className="mt-12 bg-[#111] text-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6">
        <strong className="font-black text-[#ff8c00] text-xl uppercase block mb-2">Disclaimer</strong>
        <p className="font-bold text-sm">
          This knowledge base is dynamically generated from real-time database stats. All sources are indexed from official government portals. Always verify critical legal or financial decisions with a qualified professional.
        </p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-left: 2px solid black;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: black;
        }
      `}</style>
    </div>
  );
}
