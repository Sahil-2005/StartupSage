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
  { title: 'Registration & Incorporation', desc: 'SPICe+, LLP, OPC, Pvt Ltd', icon: '🏛️', count: '15' },
  { title: 'Taxation & GST', desc: 'GST registration, tax incentives, 80-IAC', icon: '📋', count: '5' },
  { title: 'MSME / Udyam', desc: 'Classification, benefits, registration', icon: '🏭', count: '5' },
  { title: 'Funding & Investment', desc: 'SISFS, FDI policy, seed funds', icon: '💸', count: '9' },
  { title: 'IP & Contracts', desc: 'Trademarks, patents, SIPP scheme', icon: '⚖️', count: '6' },
  { title: 'Labour & Compliance', desc: 'POSH, EPFO, self-certification', icon: '👥', count: '5' },
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
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px' }}>
          {greeting()}, {user?.full_name?.split(' ')[0] || 'Founder'} <span style={{ display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>👋</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Here's your startup intelligence dashboard.</p>
      </div>

      {/* Profile Banner */}
      {!loading && !profile && (
        <div className="glass-accent" style={{ marginBottom: '24px', padding: '24px 28px', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Set up your Startup Profile</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Enable context-aware advice tailored to your industry, stage, and location.</p>
          </div>
          <Link to="/dashboard/profile" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', flexShrink: 0 }}>
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Active Profile Card */}
      {profile && (
        <div className="glass-accent" style={{ marginBottom: '24px', padding: '24px 28px', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
              {profile.name?.[0] || '🚀'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px' }}>{profile.name}</h3>
                <div className="badge badge-success" style={{ padding: '3px 10px', fontSize: '10px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent3)', animation: 'pulse-glow 2s infinite' }}></div>
                  Context Active
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>{profile.industry} · {profile.stage} · {profile.location}</p>
            </div>
          </div>
          <Link to="/dashboard/profile" style={{ color: 'var(--accent-light)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Edit →</Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Knowledge Docs', value: '35+', icon: '📚', color: 'var(--accent-light)' },
          { label: 'Topic Areas', value: '8', icon: '🗂️', color: '#f43f5e' },
          { label: 'AI Models', value: '2', icon: '🤖', color: '#14b8a6' },
          { label: 'Govt. Sources', value: '50+', icon: '🏛️', color: '#a78bfa' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '20px', cursor: 'default' }}>
            <div className="font-mono" style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.01em' }}>Quick Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(q => (
            <Link
              key={q.label}
              to={`/dashboard/chat?q=${encodeURIComponent(q.label)}`}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', textDecoration: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '20px' }}>{q.icon}</span>
              <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>{q.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Knowledge Areas */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.01em' }}>Knowledge Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPIC_CARDS.map(card => (
            <Link
              key={card.title}
              to="/dashboard/knowledge"
              className="card"
              style={{ padding: '24px', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '28px' }}>{card.icon}</span>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-border)' }}>{card.count} docs</span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{card.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
