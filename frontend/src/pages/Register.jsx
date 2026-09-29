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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between" style={{ background: 'var(--bg-secondary)', padding: '48px' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float" style={{ position: 'absolute', top: '30%', left: '25%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(244,63,94,0.07), transparent 70%)', borderRadius: '50%' }}></div>
          <div className="animate-float" style={{ position: 'absolute', bottom: '20%', right: '20%', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)', borderRadius: '50%', animationDelay: '3s' }}></div>
          <div className="grid-bg absolute inset-0 opacity-30"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#09090b', fontWeight: 800, fontSize: '16px' }}>S</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>StartupSage</span>
          </Link>
        </div>

        <div className="relative z-10" style={{ maxWidth: '440px' }}>
          <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Join founders<br />
            <span className="text-gradient-gold">building smarter</span><br />
            in India
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
            Get personalized, context-aware guidance on registering, funding, and scaling your startup — for free.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🎯', text: 'Personalized advice based on your startup profile' },
              { icon: '📄', text: 'Sourced from 50+ official government documents' },
              { icon: '⚡', text: 'Agentic AI that thinks, verifies, and cites' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{icon}</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          {['DPIIT', 'MCA', 'CBIC', 'MeitY'].map(org => (
            <div key={org} style={{ padding: '6px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{org}</div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center" style={{ padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="lg:hidden flex items-center gap-2.5" style={{ marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#09090b', fontWeight: 800, fontSize: '14px' }}>S</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>StartupSage</span>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Create your account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
              <input type="text" required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Rahul Sharma" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Work Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@startup.com" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 8 characters" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '14px', marginTop: '4px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#09090b', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> Creating account...</>
              ) : 'Create free account'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
