import { useState, useEffect } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    stage: '',
    location: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const profileId = localStorage.getItem('startup_profile_id');
      if (profileId) {
        try {
          const res = await fetch(`/api/v1/profiles/${profileId}`);
          if (res.ok) {
            const data = await res.json();
            // Populate form with existing data
            setProfile({
              name: data.name || '',
              industry: data.industry || '',
              stage: data.stage || '',
              location: data.location || '',
              notes: data.notes || ''
            });
          }
        } catch (error) {
          console.error("Failed to load profile", error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/v1/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('startup_profile_id', data.profile_id);
        setMessage({ text: 'Profile saved successfully! Context will be used in Chat.', type: 'success' });
      } else {
        setMessage({ text: data.detail || 'Failed to save profile.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-10 relative z-10 animate-fade-in-up">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 transform rotate-3">
            <svg className="w-7 h-7 text-white transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Startup Profile</h2>
            <p className="text-gray-500 mt-1">
              Personalize the AI's advice to your specific stage and industry.
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 mb-8 rounded-xl text-sm font-semibold flex items-center shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Startup Name</label>
            <input
              type="text"
              name="name"
              required
              value={profile.name}
              onChange={handleChange}
              className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Industry</label>
              <input
                type="text"
                name="industry"
                required
                value={profile.industry}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="e.g., FinTech, SaaS"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">State / Location</label>
              <input
                type="text"
                name="location"
                required
                value={profile.location}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="e.g., Karnataka, Delhi"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Current Stage</label>
            <div className="relative">
              <select
                name="stage"
                required
                value={profile.stage}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm appearance-none"
              >
                <option value="" disabled>Select Stage</option>
                <option value="Idea Stage">Idea Stage</option>
                <option value="Pre-revenue">Pre-revenue</option>
                <option value="Early-stage (Revenue generating)">Early-stage (Revenue generating)</option>
                <option value="Growth Stage">Growth Stage</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Additional Notes</label>
            <textarea
              name="notes"
              value={profile.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm resize-none"
              placeholder="Any specific context you want the advisor to know? (e.g., 'We are bootstrapped', 'Looking to register as an MSME')"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform hover:-translate-y-0.5"
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving Profile...
              </span>
            ) : 'Save & Update Context'}
          </button>
        </form>
      </div>
    </div>
  );
}
