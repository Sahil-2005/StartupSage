import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: '48px' }}>
        <div style={{ maxWidth: '75%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#09090b', borderRadius: '20px 20px 6px 20px', padding: '14px 20px', fontWeight: 500, fontSize: '14px', lineHeight: 1.6, boxShadow: '0 4px 15px rgba(245,158,11,0.2)' }}>
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px', paddingRight: '48px' }}>
      <div className="flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-tertiary))', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      </div>
      <div style={{ maxWidth: '75%', minWidth: 0 }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px 20px 20px 6px', padding: '16px 20px', overflowX: 'auto' }}>
          <div className="prose" style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-primary)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>

          {msg.citations?.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Sources</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {msg.citations.map((cit, j) => {
                  const formatCategory = (cat) => cat ? cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Source';
                  return (
                  <a key={j} href={cit.source_url} target="_blank" rel="noreferrer" title={cit.text_snippet}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent-light)', padding: '6px 12px', borderRadius: 'var(--radius-full)', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span style={{ fontWeight: 700 }}>[{cit.ref_id}]</span>
                    <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatCategory(cit.category)}</span>
                  </a>
                )})}
              </div>
              {msg.ragMode && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent3)' }}></div>
                  <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{msg.ragMode}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '20px 20px 20px 6px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[0, 150, 300].map(delay => (
          <div key={delay} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', animation: `bounce 1.4s infinite ease-in-out`, animationDelay: `${delay}ms` }}></div>
        ))}
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

export default function ChatPage() {
  const { authFetch } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  const [conversations, setConversations] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { fetchConversations(); }, []);

  const fetchConversations = async () => {
    try {
      const res = await authFetch('/api/v1/chat/conversations');
      if (res.ok) setConversations(await res.json());
    } catch (e) { console.error(e); }
  };

  const loadConversation = async (id) => {
    if (loading) return;
    setConversationId(id);
    setLoadingHistory(true);
    setSearchParams({});
    try {
      const res = await authFetch(`/api/v1/chat/conversations/${id}/messages`);
      if (res.ok) setMessages(await res.json());
      else { toast.error("Failed to load conversation"); startNewChat(); }
    } catch (e) { toast.error("Network error"); }
    finally { setLoadingHistory(false); }
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    try {
      const res = await authFetch(`/api/v1/chat/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Deleted");
        setConversations(prev => prev.filter(c => c._id !== id));
        if (conversationId === id) startNewChat();
      }
    } catch (err) { toast.error("Failed to delete"); }
  };

  const startNewChat = () => { setMessages([]); setConversationId(null); setSearchParams({}); };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) { setInput(q); inputRef.current?.focus(); }
  }, [searchParams]);

  const profileId = localStorage.getItem('startup_profile_id');
  const isProfileActive = !!profileId;

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const res = await authFetch('/api/v1/chat/', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage, conversation_id: conversationId, profile_id: profileId }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'API error');
      const data = await res.json();
      if (!conversationId) { setConversationId(data.conversation_id); fetchConversations(); }
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, citations: data.citations, ragMode: data.rag_mode }]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Something went wrong. Please check your backend server.' }]);
    } finally { setLoading(false); }
  };

  const SUGGESTION_CHIPS = [
    'How to get DPIIT recognition?',
    'GST registration for startups',
    'Seed fund eligibility criteria',
    'LLP vs Private Limited Company',
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative' }}>
      {/* History Sidebar */}
      <div style={{ width: historyOpen ? '260px' : '0', overflow: 'hidden', flexShrink: 0, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderRight: historyOpen ? '1px solid var(--border)' : 'none', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.01em' }}>Chat History</h2>
          <button onClick={startNewChat} style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div data-lenis-prevent="true" style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {conversations.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No previous chats</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {conversations.map(c => (
                <div key={c._id} onClick={() => loadConversation(c._id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s', ...(conversationId === c._id ? { background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent-light)' } : { border: '1px solid transparent', color: 'var(--text-secondary)' }) }}
                  onMouseOver={e => { if (conversationId !== c._id) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                  onMouseOut={e => { if (conversationId !== c._id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px', fontWeight: 500 }}>{c.title || 'New Conversation'}</div>
                  <button onClick={(e) => deleteConversation(e, c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', opacity: 0.4, transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#f43f5e'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setHistoryOpen(!historyOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="12" y2="18"/></svg>
            </button>
            <div>
              <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>AI Advisor</h1>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>Grounded in 35+ official government documents</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isProfileActive && (
              <div className="badge badge-success" style={{ padding: '4px 12px', fontSize: '10px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent3)' }}></div>
                Context Active
              </div>
            )}
            {messages.length > 0 && (
              <button onClick={startNewChat} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}>New Chat</button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div data-lenis-prevent="true" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loadingHistory ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '100px' }}>
                <div style={{ width: '32px', height: '32px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '480px', margin: '0 auto', paddingTop: '80px' }}>
                <div className="animate-pulse-glow" style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', transform: 'rotate(3deg)' }}>
                  <span style={{ color: '#09090b', fontWeight: 800, fontSize: '28px', transform: 'rotate(-3deg)' }}>S</span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>StartupSage AI</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
                  Ask me anything about registering, funding, taxation, or compliance for your Indian startup. I'll cite my sources.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ width: '100%' }}>
                  {SUGGESTION_CHIPS.map(chip => (
                    <button key={chip} onClick={() => { setInput(chip); inputRef.current?.focus(); }}
                      className="card" style={{ textAlign: 'left', padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', border: '1px solid var(--border)', fontWeight: 500 }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => <MessageBubble key={msg._id || i} msg={msg} />)}
                {loading && <TypingIndicator />}
                <div ref={endRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div style={{ flexShrink: 0, padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={sendMessage} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'border-color 0.3s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about startup registration, GST, MSME, funding..."
                rows={1}
                style={{ flex: 1, background: 'transparent', padding: '16px 20px', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', border: 'none', outline: 'none', resize: 'none', minHeight: '52px', maxHeight: '150px', lineHeight: 1.6 }}
                disabled={loading}
              />
              <div style={{ padding: '10px 12px', flexShrink: 0 }}>
                <button type="submit" disabled={loading || !input.trim()}
                  style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: (loading || !input.trim()) ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: (loading || !input.trim()) ? 0.3 : 1 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={(!input.trim() || loading) ? 'var(--text-muted)' : '#09090b'} strokeWidth="2.5" strokeLinecap="round" style={{ transform: 'rotate(90deg)' }}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </div>
            </div>
          </form>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
            AI may make mistakes. Always verify critical legal or financial decisions with a professional.
          </p>
        </div>
      </div>
    </div>
  );
}
