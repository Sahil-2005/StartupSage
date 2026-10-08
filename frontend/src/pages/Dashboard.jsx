import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QUICK_ACTIONS = [
  { label: 'Register a Private Limited Company', icon: '🏢', color: 'bg-[#ff8c00]' },
  { label: 'GST requirements for startups', icon: '📊', color: 'bg-[#a3e635]' },
  { label: 'Apply for DPIIT recognition', icon: '🎯', color: 'bg-[#3b82f6]' },
  { label: 'Startup India Seed Fund', icon: '💰', color: 'bg-white' },
];

const TOPIC_CARDS = [
  { title: 'REGISTRATION', desc: 'SPICe+, LLP, OPC', icon: '🏛️', count: '15', color: 'card-orange' },
  { title: 'TAXATION & GST', desc: 'Registration, 80-IAC', icon: '📋', count: '5', color: 'bg-white' },
  { title: 'MSME / UDYAM', desc: 'Benefits, registration', icon: '🏭', count: '5', color: 'card-green' },
  { title: 'FUNDING', desc: 'SISFS, FDI policy', icon: '💸', count: '9', color: 'card-blue' },
  { title: 'IP & CONTRACTS', desc: 'Trademarks, patents', icon: '⚖️', count: '6', color: 'bg-white' },
  { title: 'LABOUR & HR', desc: 'POSH, EPFO', icon: '👥', count: '5', color: 'card-orange' },
];

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [knowledgeStats, setKnowledgeStats] = useState({ docs: '...', topics: '...' });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/config/knowledge')
      .then(res => res.json())
      .then(data => {
        setKnowledgeStats({
          docs: data.total_docs || '35+',
          topics: Object.keys(data.categories || {}).length || '8'
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const profileId = localStorage.getItem('startup_profile_id');
    if (profileId) {
      authFetch(`/api/v1/profiles/${profileId}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => setProfile(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [authFetch]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'GOOD MORNING';
    if (h < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      
      {/* Welcome Header & Hero Image */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div className="flex-1">
          <div className="inline-block bg-[#a3e635] border-[3px] border-black shadow-[4px_4px_0px_#000] px-4 py-2 font-black uppercase text-xs mb-6 transform -rotate-2">
            Made for India 🇮🇳
          </div>
          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter text-black mb-4">
            {greeting()},<br/>
            <span className="text-[#3b82f6] underline decoration-8 underline-offset-8 decoration-black">{user?.full_name?.split(' ')[0] || 'FOUNDER'}</span>
          </h1>
          <p className="text-xl font-bold text-black border-l-[4px] border-[#ff8c00] pl-4 mt-8">
            Here's your startup intelligence dashboard. <span className="animate-pulse inline-block">👏</span>
          </p>
        </div>
        
        {/* Right side illustration block */}
        <div className="hidden lg:block w-72 h-48 bg-white border-[3px] border-black shadow-[8px_8px_0px_#000] relative overflow-hidden transform rotate-2">
           <img src="/hero_gateway.png" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" alt="Gateway" />
           <div className="absolute top-2 left-2 bg-[#ff8c00] border-2 border-black font-black text-xs px-2 py-1">AI ONLINE</div>
        </div>
      </div>

      {/* Profile Banner */}
      {!loading && !profile && (
        <div className="bg-[#ff8c00] border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 transform -rotate-1">
          <div>
            <h3 className="font-black text-2xl uppercase text-black mb-2">Setup Your Startup Profile</h3>
            <p className="font-bold text-black text-lg">Enable context-aware advice tailored to your industry, stage, and location.</p>
          </div>
          <Link to="/dashboard/profile" className="btn-secondary whitespace-nowrap px-8 py-3 text-lg bg-white">
            COMPLETE PROFILE →
          </Link>
        </div>
      )}

      {/* Active Profile Card */}
      {profile && (
        <div className="bg-[#ff8c00] border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center text-3xl font-black text-black">
              {profile.name?.[0] || '🚀'}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-1">
                <h3 className="font-black text-2xl uppercase text-black">{profile.name}</h3>
                <div className="bg-[#a3e635] border-2 border-black text-black font-black uppercase text-xs px-2 py-1 shadow-[2px_2px_0px_#000] flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                  CONTEXT ACTIVE
                </div>
              </div>
              <p className="font-bold text-black uppercase text-sm">{profile.industry} • {profile.stage} • {profile.location}</p>
            </div>
          </div>
          <Link to="/dashboard/profile" className="btn-secondary bg-white font-black px-6 py-2">
            EDIT PROFILE
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Stats & Topics) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'KNOWLEDGE DOCS', value: knowledgeStats.docs, color: 'bg-white' },
              { label: 'TOPIC AREAS', value: knowledgeStats.topics, color: 'bg-[#a3e635]' },
              { label: 'AI MODELS', value: '2', color: 'bg-[#3b82f6]' },
              { label: 'GOVT SOURCES', value: '48+', color: 'bg-[#ff8c00]' },
            ].map((stat, i) => (
              <div key={i} className={`border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 ${stat.color} ${stat.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}>
                <div className="font-black text-3xl mb-1">{stat.value}</div>
                <div className="font-bold text-xs uppercase opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Knowledge Areas */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-black uppercase text-black">Knowledge Grid</h2>
              <Link to="/dashboard/knowledge" className="font-bold uppercase text-sm border-b-2 border-black pb-1 hover:text-[#ff8c00]">View All →</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TOPIC_CARDS.map((card, i) => (
                <Link
                  key={i}
                  to="/dashboard/knowledge"
                  className={`border-[3px] border-black shadow-[4px_4px_0px_#000] p-5 block hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all ${card.color === 'bg-white' ? 'bg-white' : card.color}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl bg-white border-[2px] border-black p-2 shadow-[2px_2px_0px_#000]">{card.icon}</span>
                    <span className="font-black text-xs uppercase bg-black text-white px-3 py-1 border-[2px] border-black">
                      {card.count} DOCS
                    </span>
                  </div>
                  <h3 className="font-black text-lg mb-1">{card.title}</h3>
                  <p className="font-bold text-sm opacity-80">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Quick Actions) */}
        <div>
          <h2 className="text-2xl font-black uppercase text-black mb-6 border-b-[3px] border-black pb-2">Ask AI Advisor</h2>
          <div className="flex flex-col gap-4">
            {QUICK_ACTIONS.map((q, i) => (
              <Link
                key={i}
                to={`/dashboard/chat?q=${encodeURIComponent(q.label)}`}
                className={`flex items-start gap-4 p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all ${q.color} ${q.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}
              >
                <span className="text-2xl bg-white border-[2px] border-black w-10 h-10 flex items-center justify-center flex-shrink-0">{q.icon}</span>
                <span className="font-black text-sm uppercase pt-1 leading-snug">{q.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 bg-[#111] text-white border-[3px] border-black shadow-[4px_4px_0px_#000] p-6">
            <h3 className="font-black text-xl uppercase mb-4 text-[#a3e635]">Multilingual Support</h3>
            <p className="font-bold text-sm mb-4">Query the AI in English, Hindi, or Marathi.</p>
            <div className="flex flex-wrap gap-2">
               <span className="border-2 border-white px-3 py-1 font-black text-xs uppercase">ENG</span>
               <span className="border-2 border-white px-3 py-1 font-black text-xs uppercase bg-white text-black">HIN</span>
               <span className="border-2 border-white px-3 py-1 font-black text-xs uppercase">MAR</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
