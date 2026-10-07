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
    <div className="p-8 max-w-3xl mx-auto pb-20">
      <div className="mb-8 border-b-[3px] border-black pb-4">
        <h1 className="text-4xl font-black uppercase text-black mb-2">Startup Profile</h1>
        <p className="font-bold text-black border-l-[4px] border-[#3b82f6] pl-3">This context powers personalized advice in the AI Advisor.</p>
      </div>

      <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Startup Name */}
          <div>
            <label className="block font-black uppercase text-sm mb-2 text-black">Startup Name</label>
            <input type="text" required value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} placeholder="e.g. Acme Technologies" className="input-field w-full text-lg py-3" />
          </div>

          {/* Industry & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-black uppercase text-sm mb-2 text-black">Industry / Sector</label>
              <input type="text" required value={profile.industry} onChange={e => setProfile(p => ({...p, industry: e.target.value}))} placeholder="e.g. FinTech, SaaS" className="input-field w-full py-3" />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2 text-black">State / City</label>
              <input type="text" required value={profile.location} onChange={e => setProfile(p => ({...p, location: e.target.value}))} placeholder="e.g. Bengaluru, Karnataka" className="input-field w-full py-3" />
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="block font-black uppercase text-sm mb-3 text-black">Current Stage</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {STAGES.map(s => (
                <button key={s} type="button" onClick={() => setProfile(p => ({...p, stage: s}))}
                  className={`text-left p-4 border-[3px] border-black font-black uppercase text-xs transition-all ${profile.stage === s ? 'bg-[#ff8c00] text-black shadow-[4px_4px_0px_#000] -translate-y-1' : 'bg-gray-100 text-black hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-black uppercase text-sm mb-2 text-black">Additional Context <span className="opacity-60 text-xs">(optional)</span></label>
            <textarea
              rows={4} value={profile.notes}
              onChange={e => setProfile(p => ({...p, notes: e.target.value}))}
              placeholder="e.g. 'Bootstrapped SaaS startup looking to register as MSME and apply for SISFS seed funding.'"
              className="input-field w-full py-3 resize-none"
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-lg mt-4" style={{ opacity: saving ? 0.7 : 1 }}>
            {saving ? 'SAVING...' : saved ? '✓ PROFILE SAVED' : 'SAVE PROFILE & ACTIVATE CONTEXT'}
          </button>
        </form>
      </div>

      {localStorage.getItem('startup_profile_id') && (
        <div className="mt-8 bg-[#a3e635] border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 flex items-center gap-3">
          <div className="w-3 h-3 bg-black rounded-full animate-ping"></div>
          <span className="font-black uppercase text-black text-sm">Profile is active. AI Advisor will use this context for all responses.</span>
        </div>
      )}
    </div>
  );
}
