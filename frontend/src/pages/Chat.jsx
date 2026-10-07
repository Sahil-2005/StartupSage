import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end pl-12 mb-6">
        <div className="max-w-[85%] bg-[#3b82f6] text-black border-[3px] border-black shadow-[4px_4px_0px_#000] p-4 font-bold text-sm leading-relaxed">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 pr-12 mb-8">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-[#ff8c00] border-[3px] border-black shadow-[2px_2px_0px_#000] flex items-center justify-center mt-1">
        <span className="font-black text-black text-lg">S</span>
      </div>
      
      {/* AI Message Container */}
      <div className="max-w-[85%] min-w-0">
        <div className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 overflow-x-auto">
          <div className="prose text-black text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>

          {msg.citations?.length > 0 && (
            <div className="mt-6 pt-4 border-t-[3px] border-black">
              <p className="text-black font-black uppercase text-xs mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Sources Referred
              </p>
              <div className="flex flex-wrap gap-2">
                {msg.citations.map((cit, j) => {
                  const formatCategory = (cat) => cat ? cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Source';
                  return (
                  <a key={j} href={cit.source_url} target="_blank" rel="noreferrer" title={cit.text_snippet}
                    className="inline-flex items-center gap-2 text-xs bg-[#ff8c00] text-black border-2 border-black font-bold px-3 py-1 shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all"
                  >
                    <span className="font-black">[{cit.ref_id}]</span>
                    <span className="max-w-[140px] truncate">{formatCategory(cit.category)}</span>
                  </a>
                )})}
              </div>
              
              {msg.ragMode && (
                <div className="mt-4 flex items-center gap-2 bg-[#111] text-white border-2 border-black px-3 py-1 inline-flex shadow-[2px_2px_0px_#000]">
                  <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-ping"></div>
                  <span className="font-black text-[10px] uppercase">{msg.ragMode} Pipeline Active</span>
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
    <div className="flex gap-4 pr-12 mb-8">
      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 border-[3px] border-black flex items-center justify-center mt-1">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#000] px-6 py-4 flex items-center gap-2">
        {[0, 150, 300].map(delay => (
          <div key={delay} className="w-2 h-2 bg-black rounded-full" style={{ animation: `bounce 1.4s infinite ease-in-out`, animationDelay: `${delay}ms` }}></div>
        ))}
      </div>
      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
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
    { text: 'How to get DPIIT recognition?', color: 'bg-[#a3e635]' },
    { text: 'GST registration for startups', color: 'bg-[#ff8c00]' },
    { text: 'Seed fund eligibility criteria', color: 'bg-[#3b82f6]' },
    { text: 'LLP vs Private Limited Company', color: 'bg-white' },
  ];

  return (
    <div className="absolute inset-0 flex bg-[#f4f0e6] font-sans">
      
      {/* History Sidebar */}
      <div className={`flex flex-col bg-white border-r-[3px] border-black transition-all duration-300 z-10 ${historyOpen ? 'w-[280px]' : 'w-0 border-r-0'}`} style={{ overflow: 'hidden', flexShrink: 0 }}>
        <div className="p-4 border-b-[3px] border-black flex items-center justify-between bg-[#ff8c00]">
          <h2 className="font-black uppercase text-sm text-black">Chat History</h2>
          <button onClick={startNewChat} className="bg-white border-[2px] border-black p-1 shadow-[2px_2px_0px_#000] hover:bg-black hover:text-white transition-colors" title="New Chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-[#f4f0e6]">
          {conversations.length === 0 ? (
            <div className="text-black font-bold text-xs uppercase text-center py-10 opacity-60">No Previous Chats</div>
          ) : (
            <div className="flex flex-col gap-3">
              {conversations.map(c => (
                <div key={c._id} onClick={() => loadConversation(c._id)}
                  className={`group flex items-center justify-between p-3 border-[3px] border-black cursor-pointer transition-all ${conversationId === c._id ? 'bg-[#a3e635] shadow-[4px_4px_0px_#000] -translate-y-1' : 'bg-white hover:shadow-[2px_2px_0px_#000]'}`}
                >
                  <div className="font-bold text-xs uppercase truncate pr-2 text-black">{c.title || 'New Conversation'}</div>
                  <button onClick={(e) => deleteConversation(e, c._id)} className="text-black opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f0e6] relative dot-pattern">
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b-[3px] border-black bg-white relative z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setHistoryOpen(!historyOpen)} className="p-2 border-[2px] border-black shadow-[2px_2px_0px_#000] bg-[#a3e635] hover:bg-[#ff8c00] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="12" y2="18"/></svg>
            </button>
            <div>
              <h1 className="font-black text-lg uppercase tracking-tight text-black flex items-center gap-2">
                StartupSage AI Advisor
                <span className="bg-[#111] text-[#a3e635] text-[10px] px-2 py-0.5 border border-black flex items-center gap-1 shadow-[2px_2px_0px_#000]">
                  <div className="w-1.5 h-1.5 bg-[#a3e635] rounded-full animate-pulse"></div>
                  ONLINE
                </span>
              </h1>
              <p className="text-xs font-bold uppercase text-[#555]">Grounded in 35+ Official Gov Documents</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 hidden sm:flex">
            {isProfileActive && (
              <div className="bg-[#a3e635] border-[2px] border-black text-black font-black uppercase text-xs px-3 py-1.5 shadow-[2px_2px_0px_#000] flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                CONTEXT ACTIVE
              </div>
            )}
            {messages.length > 0 && (
              <button onClick={startNewChat} className="btn-secondary py-1.5 px-4 text-xs bg-white">CLEAR CHAT</button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-10" data-lenis-prevent="true">
          <div className="flex flex-col max-w-4xl mx-auto">
            {loadingHistory ? (
              <div className="flex items-center justify-center pt-20">
                <div className="w-10 h-10 border-[4px] border-black border-t-[#ff8c00] rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pt-16">
                <div className="w-20 h-20 bg-[#ff8c00] border-[4px] border-black shadow-[6px_6px_0px_#000] flex items-center justify-center mb-8 transform -rotate-3">
                  <span className="font-black text-black text-4xl transform rotate-3">S</span>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">How can I help you build?</h2>
                <p className="text-lg font-bold text-black border-b-[4px] border-[#3b82f6] pb-2 mb-12">
                  Ask me anything about registering, funding, taxation, or compliance. I will cite my sources.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button key={i} onClick={() => { setInput(chip.text); inputRef.current?.focus(); }}
                      className={`text-left p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] font-black text-sm uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] transition-all ${chip.color} ${chip.color === 'bg-[#3b82f6]' ? 'text-white' : 'text-black'}`}
                    >
                      {chip.text}
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
        <div className="flex-shrink-0 p-4 lg:p-6 border-t-[3px] border-black bg-[#f4f0e6] relative z-20">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative">
            <div className="flex items-end bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-2 focus-within:shadow-[2px_2px_0px_#000] focus-within:translate-y-1 focus-within:translate-x-1 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="TYPE YOUR QUERY HERE..."
                rows={1}
                className="flex-1 bg-transparent p-3 text-black font-bold uppercase text-sm placeholder:text-gray-400 border-none outline-none resize-none min-h-[50px] max-h-[150px]"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border-[3px] border-black ml-2 transition-all ${(!input.trim() || loading) ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'bg-[#ff8c00] hover:bg-black hover:text-white shadow-[2px_2px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer'}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="transform rotate-90"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </div>
            
            <p className="text-center font-bold text-[10px] uppercase text-[#666] mt-4 tracking-widest">
              AI MAY MAKE MISTAKES. VERIFY CRITICAL DECISIONS WITH A PROFESSIONAL.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
