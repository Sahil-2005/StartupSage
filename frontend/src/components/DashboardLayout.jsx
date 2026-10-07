import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'DASHBOARD', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  )},
  { to: '/dashboard/chat', label: 'AI ADVISOR', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  )},
  { to: '/dashboard/profile', label: 'STARTUP PROFILE', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
  { to: '/dashboard/knowledge', label: 'KNOWLEDGE BASE', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  )},
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ragMode, setRagMode] = useState('hybrid');

  useEffect(() => {
    fetch('/api/v1/config/rag-mode')
      .then(r => r.json())
      .then(d => d.mode && setRagMode(d.mode))
      .catch(() => {});
  }, []);

  const handleModeChange = async (e) => {
    const mode = e.target.value;
    setRagMode(mode);
    await fetch('/api/v1/config/rag-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    }).catch(() => {});
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  const initials = user?.avatar_initials || user?.full_name?.slice(0, 2).toUpperCase() || 'US';

  return (
    <div className="min-h-screen flex bg-[#f4f0e6] font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto w-[280px] bg-white border-r-[3px] border-black`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b-[3px] border-black">
          <div className="w-10 h-10 bg-[#ff8c00] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center">
            <span className="text-black font-black text-xl">S</span>
          </div>
          <div>
            <div className="font-black text-lg uppercase tracking-wider">StartupSage</div>
            <div className="text-xs font-bold uppercase text-[#ff8c00] tracking-widest">AI Advisor</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to} to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-black text-sm transition-all border-[3px] border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]
                  ${isActive(item.to) ? 'bg-[#ff8c00] text-black' : 'bg-white text-black'}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* RAG Mode Selector */}
        <div className="p-6 border-t-[3px] border-black bg-[#f4f0e6]">
          <div className="text-black font-black uppercase text-xs mb-3">AI Mode</div>
          <div className="relative">
            <select value={ragMode} onChange={handleModeChange} className="w-full bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] px-4 py-3 font-bold text-sm uppercase appearance-none cursor-pointer">
              <option value="basic">⚡ Basic RAG</option>
              <option value="hybrid">🔀 Hybrid RAG</option>
              <option value="agentic">🤖 Agentic Workflow</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-6 border-t-[3px] border-black">
          <div className="flex items-center gap-3 border-[3px] border-black p-3 shadow-[4px_4px_0px_#000] bg-white">
            <div className="w-10 h-10 border-[2px] border-black bg-[#a3e635] flex items-center justify-center text-black font-black">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm uppercase truncate text-black">{user?.full_name || 'User'}</div>
              <div className="font-bold text-xs truncate text-[#555]">{user?.email}</div>
            </div>
            <button onClick={handleLogout} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors" title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-w-0 dot-pattern">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b-[3px] border-black bg-white relative z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 border-[3px] border-black shadow-[2px_2px_0px_#000]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff8c00] border-[2px] border-black flex items-center justify-center">
              <span className="text-black font-black text-sm">S</span>
            </div>
            <span className="font-black text-lg uppercase">StartupSage</span>
          </div>
          <div className="w-8 h-8 border-[2px] border-black bg-[#a3e635] flex items-center justify-center text-black font-black text-xs">
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
