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
      const res = await authFetch('/api/v1/profiles', {
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

  const Field = ({ label, children }) => (
    <div className="group">
      <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm";

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Startup Profile</h1>
        <p className="text-gray-400 mt-1 text-sm">This context powers personalized advice in the AI Advisor.</p>
      </div>

      <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Startup Name">
            <input type="text" required value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} placeholder="e.g., Acme Technologies" className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Industry / Sector">
              <input type="text" required value={profile.industry} onChange={e => setProfile(p => ({...p, industry: e.target.value}))} placeholder="e.g., FinTech, SaaS" className={inputCls} />
            </Field>
            <Field label="State / City">
              <input type="text" required value={profile.location} onChange={e => setProfile(p => ({...p, location: e.target.value}))} placeholder="e.g., Bengaluru, Karnataka" className={inputCls} />
            </Field>
          </div>

          <Field label="Current Stage">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {STAGES.map(s => (
                <button
                  key={s} type="button"
                  onClick={() => setProfile(p => ({...p, stage: s}))}
                  className={`px-3 py-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    profile.stage === s
                      ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                      : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:text-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Additional Context (optional)">
            <textarea
              rows={4} value={profile.notes}
              onChange={e => setProfile(p => ({...p, notes: e.target.value}))}
              placeholder="e.g., 'Bootstrapped SaaS startup looking to register as MSME and apply for SISFS seed funding.'"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <button
            type="submit" disabled={saving}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {saving ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Saving...</span></>
            ) : saved ? (
              <><span>✓</span><span>Profile Saved!</span></>
            ) : (
              <span>Save Profile & Activate Context</span>
            )}
          </button>
        </form>
      </div>

      {localStorage.getItem('startup_profile_id') && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Profile is active. AI Advisor will use this context for all responses.</span>
        </div>
      )}
    </div>
  );
}
