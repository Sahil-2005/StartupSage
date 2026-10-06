import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STAGES = ['Idea Stage', 'Pre-revenue', 'Early-stage (Revenue generating)', 'Growth Stage', 'Series A+'];

export default function ProfilePage() {
  const { authFetch } = useAuth();
  const [profile, setProfile] = useState({ name: '', industry: '', stage: '', location: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profileId = localStorage.getItem('startup_profile_id');
    if (profileId) {
      authFetch(`/api/v1/profiles/${profileId}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => d && setProfile({ name: d.name || '', industry: d.industry || '', stage: d.stage || '', location: d.location || '', notes: d.notes || '' }))
        .catch(() => {});
    }
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/v1/profiles/', {
        method: 'POST',
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('startup_profile_id', data.profile_id);
        toast.success('Profile saved! Context is now active.');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(data.detail || 'Failed to save');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px' }}>Startup Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>This context powers personalized advice in the AI Advisor.</p>
      </div>

      <div className="card" style={{ padding: '32px', cursor: 'default' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Startup Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Startup Name</label>
            <input type="text" required value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} placeholder="e.g., Acme Technologies" className="input-field" />
          </div>

          {/* Industry & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Industry / Sector</label>
              <input type="text" required value={profile.industry} onChange={e => setProfile(p => ({...p, industry: e.target.value}))} placeholder="e.g., FinTech, SaaS" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>State / City</label>
              <input type="text" required value={profile.location} onChange={e => setProfile(p => ({...p, location: e.target.value}))} placeholder="e.g., Bengaluru, Karnataka" className="input-field" />
            </div>
          </div>

          {/* Stage */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>Current Stage</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {STAGES.map(s => (
                <button key={s} type="button" onClick={() => setProfile(p => ({...p, stage: s}))}
                  style={{
                    padding: '12px 14px', borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 600, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                    ...(profile.stage === s ? {
                      background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent-light)',
                    } : {
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                    }),
                  }}
                  onMouseOver={e => { if (profile.stage !== s) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                  onMouseOut={e => { if (profile.stage !== s) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Additional Context <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              rows={4} value={profile.notes}
              onChange={e => setProfile(p => ({...p, notes: e.target.value}))}
              placeholder="e.g., 'Bootstrapped SaaS startup looking to register as MSME and apply for SISFS seed funding.'"
              className="input-field" style={{ resize: 'none' }}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '14px', marginTop: '4px', opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? (
              <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#09090b', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> Saving...</>
            ) : saved ? '✓ Profile Saved!' : 'Save Profile & Activate Context'}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </div>

      {localStorage.getItem('startup_profile_id') && (
        <div className="badge badge-success" style={{ marginTop: '16px', padding: '12px 18px', fontSize: '13px', width: '100%', justifyContent: 'flex-start' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent3)', animation: 'pulse-glow 2s infinite' }}></div>
          Profile is active. AI Advisor will use this context for all responses.
        </div>
      )}
    </div>
  );
}
