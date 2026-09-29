import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QUICK_ACTIONS = [
  { label: 'How do I register a Private Limited Company?', icon: '🏢' },
  { label: 'What are the GST requirements for startups?', icon: '📊' },
  { label: 'How to apply for DPIIT recognition?', icon: '🎯' },
  { label: 'What is the Startup India Seed Fund?', icon: '💰' },
];

const TOPIC_CARDS = [
  { title: 'Registration & Incorporation', desc: 'SPICe+, LLP, OPC, Pvt Ltd', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/20', icon: '🏛️', count: '15 docs' },
  { title: 'Taxation & GST', desc: 'GST registration, tax incentives, 80-IAC', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', icon: '📋', count: '5 docs' },
  { title: 'MSME / Udyam', desc: 'Classification, benefits, registration', color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/20', icon: '🏭', count: '5 docs' },
  { title: 'Funding & Investment', desc: 'SISFS, FDI policy, seed funds', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/20', icon: '💸', count: '9 docs' },
  { title: 'IP & Contracts', desc: 'Trademarks, patents, SIPP scheme', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/20', icon: '⚖️', count: '6 docs' },
  { title: 'Labour & Compliance', desc: 'POSH, EPFO, self-certification', color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/20', icon: '👥', count: '5 docs' },
];

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          {greeting()}, {user?.full_name?.split(' ')[0] || 'Founder'} 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your startup intelligence dashboard.</p>
      </div>

      {/* Profile Banner (if no profile set) */}
      {!loading && !profile && (
        <div className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Set up your Startup Profile</h3>
            <p className="text-gray-400 text-sm">Enable context-aware advice tailored to your industry, stage, and location.</p>
          </div>
          <Link to="/dashboard/profile" className="flex-shrink-0 ml-4 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Active Profile Card */}
      {profile && (
        <div className="mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {profile.name?.[0] || '🚀'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold">{profile.name}</h3>
                <div className="flex items-center space-x-1 bg-green-500/15 border border-green-500/20 rounded-full px-2 py-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Context Active</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-0.5">{profile.industry} · {profile.stage} · {profile.location}</p>
            </div>
          </div>
          <Link to="/dashboard/profile" className="flex-shrink-0 ml-4 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            Edit →
          </Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Knowledge Docs', value: '35+', icon: '📚', color: 'text-blue-400' },
          { label: 'Topic Areas', value: '8', icon: '🗂️', color: 'text-purple-400' },
          { label: 'AI Models', value: '2', icon: '🤖', color: 'text-indigo-400' },
          { label: 'Govt. Sources', value: '50+', icon: '🏛️', color: 'text-green-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0f0f1a] border border-white/5 rounded-2xl p-5">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(q => (
            <Link
              key={q.label}
              to={`/dashboard/chat?q=${encodeURIComponent(q.label)}`}
              className="flex items-center space-x-3 bg-[#0f0f1a] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 rounded-xl p-4 transition-all group"
            >
              <span className="text-xl">{q.icon}</span>
              <span className="text-gray-300 group-hover:text-white text-sm transition-colors flex-1">{q.label}</span>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Knowledge Areas */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Knowledge Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_CARDS.map(card => (
            <Link
              key={card.title}
              to="/dashboard/knowledge"
              className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 hover:scale-[1.02] transition-all group`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded-full">{card.count}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{card.title}</h3>
              <p className="text-gray-400 text-xs">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
