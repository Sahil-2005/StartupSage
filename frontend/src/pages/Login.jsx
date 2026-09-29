import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between" style={{ background: 'var(--bg-secondary)', padding: '48px' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float" style={{ position: 'absolute', top: '20%', left: '25%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', borderRadius: '50%' }}></div>
          <div className="animate-float" style={{ position: 'absolute', bottom: '20%', right: '20%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(244,63,94,0.06), transparent 70%)', borderRadius: '50%', animationDelay: '3s' }}></div>
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
          <div className="badge badge-accent" style={{ marginBottom: '20px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}></div>
            Powered by Agentic AI
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Your AI-powered<br />
            <span className="text-gradient-gold">startup advisor</span><br />
            for India
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
            Navigate registration, taxation, MSME, and funding — grounded in official government sources.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            {[['50+', 'Sources'], ['3', 'RAG Modes'], ['8', 'Topics']].map(([num, label]) => (
              <div key={label} className="card" style={{ padding: '16px 20px', textAlign: 'center', flex: 1, cursor: 'default' }}>
                <div className="font-mono" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-light)' }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{label}</div>
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center" style={{ padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="lg:hidden flex items-center gap-2.5" style={{ marginBottom: '40px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#09090b', fontWeight: 800, fontSize: '14px' }}>S</span>
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px' }}>StartupSage</span>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Email address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@startup.com"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '14px', marginTop: '4px', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? (
                <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#09090b', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div> Signing in...</>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600, textDecoration: 'none' }}>Create one for free</Link>
          </p>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
