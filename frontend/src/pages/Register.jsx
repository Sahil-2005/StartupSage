import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.full_name, form.email, form.password);
      toast.success('Account created! Welcome to StartupSage 🚀');
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f4f0e6] font-sans">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r-[3px] border-black p-12 bg-white relative overflow-hidden">
        {/* Background Illustration */}
        <img src="/hero_rocket.png" alt="Rocket Launch" className="absolute inset-0 w-full h-full object-contain object-bottom opacity-90 mix-blend-multiply pointer-events-none z-0 p-8" />
        
        {/* Top left sticker */}
        <div className="absolute top-1/4 left-10 bg-[#ff8c00] text-black font-black uppercase text-xl border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 transform -rotate-6 z-10 w-48 text-center">
            Dream<br/>Build<br/>Scale
        </div>

        <div className="relative z-20">
          <Link to="/" className="flex items-center gap-3 no-underline inline-flex bg-white p-2 border-[3px] border-black shadow-[4px_4px_0px_#000]">
            <div className="w-10 h-10 bg-[#ff8c00] border-[3px] border-black flex items-center justify-center">
              <span className="text-black font-black text-xl">S</span>
            </div>
            <span className="text-black font-black text-xl uppercase tracking-wider pr-2">StartupSage</span>
          </Link>
        </div>

        <div className="relative z-20 max-w-md bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_#000] mt-auto mb-10 transform -rotate-2">
          <h1 className="text-6xl font-black uppercase leading-[0.9] text-black mb-4 tracking-tighter">
            START<br/>YOUR<br/>JOURNEY.
          </h1>
          <p className="text-lg font-bold text-black border-l-[4px] border-[#ff8c00] pl-4">
            AI-powered guidance<br/>for India's founders.
          </p>
        </div>

        <div className="relative z-20 flex gap-4 text-black font-black uppercase">
          <div className="border-2 border-black bg-[#a3e635] px-3 py-1 shadow-[2px_2px_0px_#000]">DPIIT</div>
          <div className="border-2 border-black bg-[#3b82f6] text-white px-3 py-1 shadow-[2px_2px_0px_#000]">MCA</div>
          <div className="border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0px_#000]">CBIC</div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative dot-pattern overflow-y-auto">
        <div className="w-full max-w-md bg-[#f4f0e6] relative z-10 py-8">
          
          <div className="mb-8">
            <Link to="/" className="inline-block text-black font-bold uppercase text-sm mb-12 hover:underline decoration-2">
              ← Back
            </Link>
            <h2 className="text-4xl font-black uppercase text-black mb-2 tracking-tight">Create Account.</h2>
            <p className="text-black font-bold">Start building.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-black font-black uppercase text-sm mb-2">Full Name</label>
              <input type="text" required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Rahul Sharma" className="input-field" />
            </div>
            
            <div>
              <label className="block text-black font-black uppercase text-sm mb-2">Work Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@startup.com" className="input-field" />
            </div>

            <div>
              <label className="block text-black font-black uppercase text-sm mb-2">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" className="input-field" />
            </div>

            <div>
              <label className="block text-black font-black uppercase text-sm mb-2">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-4" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'CREATING...' : <>SIGN UP <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="mt-8 text-center text-black font-bold text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff8c00] hover:underline decoration-2">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
