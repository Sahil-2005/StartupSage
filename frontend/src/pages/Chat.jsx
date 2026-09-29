import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-indigo-600 text-white rounded-2xl rounded-br-sm px-5 py-4 shadow-lg shadow-indigo-500/10">
          <p className="leading-relaxed">{msg.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 mt-1">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="max-w-[75%]">
        <div className="bg-[#0f0f1a] border border-white/8 text-gray-200 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm">
          <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>

          {msg.citations?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/8">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Sources</p>
              <div className="flex flex-wrap gap-2">
                {msg.citations.map((cit, j) => (
                  <a
                    key={j} href={cit.source_url} target="_blank" rel="noreferrer"
                    className="group relative inline-flex items-center space-x-1 text-xs bg-white/5 hover:bg-indigo-500/15 border border-white/10 hover:border-indigo-500/30 text-gray-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-lg transition-all duration-200"
                    title={cit.text_snippet}
                  >
                    <span className="font-semibold text-indigo-400">[{cit.ref_id}]</span>
                    <span className="max-w-[120px] truncate">{cit.category || 'Source'}</span>
                  </a>
                ))}
              </div>
              {msg.ragMode && (
                <div className="mt-3 flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{msg.ragMode}</span>
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
    <div className="flex justify-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 opacity-60">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="bg-[#0f0f1a] border border-white/8 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center space-x-2">
        {[0, 150, 300].map(delay => (
          <div
            key={delay}
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          ></div>
        ))}
      </div>
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
  
  // Chat History States
  const [conversations, setConversations] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(true); // Toggle history sidebar
  const [loadingHistory, setLoadingHistory] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch all conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await authFetch('/api/v1/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversation = async (id) => {
    if (loading) return;
    setConversationId(id);
    setLoadingHistory(true);
    setSearchParams({}); // Clear query params if any
    try {
      const res = await authFetch(`/api/v1/chat/conversations/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error("Failed to load conversation");
        startNewChat();
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    
    try {
      const res = await authFetch(`/api/v1/chat/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Conversation deleted");
        setConversations(prev => prev.filter(c => c._id !== id));
        if (conversationId === id) {
          startNewChat();
        }
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setSearchParams({});
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle pre-filled query from Dashboard quick actions
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      inputRef.current?.focus();
    }
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
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationId,
          profile_id: profileId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'API error');
      }

      const data = await res.json();
      if (!conversationId) {
        setConversationId(data.conversation_id);
        fetchConversations(); // Refresh list to show new conversation
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        ragMode: data.rag_mode,
      }]);
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please check your backend server is running.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTION_CHIPS = [
    'How to get DPIIT recognition?',
    'GST registration for startups',
    'Seed fund eligibility criteria',
    'LLP vs Private Limited Company',
  ];

  return (
    <div className="flex h-[calc(100vh-0px)] lg:h-screen w-full relative">
      {/* History Sidebar */}
      <div className={`${historyOpen ? 'w-64 border-r' : 'w-0 overflow-hidden'} flex-shrink-0 transition-all duration-300 border-white/5 bg-[#0a0a0f] flex flex-col relative z-10`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Chat History</h2>
          <button onClick={startNewChat} className="text-gray-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-gray-500 text-xs text-center py-4">No previous chats</div>
          ) : (
            conversations.map(c => (
              <div 
                key={c._id} 
                onClick={() => loadConversation(c._id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all text-sm ${conversationId === c._id ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 border' : 'hover:bg-white/5 text-gray-400 border border-transparent'}`}
              >
                <div className="truncate pr-2">{c.title || 'New Conversation'}</div>
                <button onClick={(e) => deleteConversation(e, c._id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 p-1 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
      {/* Chat Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f0f1a]/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <button onClick={() => setHistoryOpen(!historyOpen)} className="text-gray-400 hover:text-white transition-colors lg:block hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
          </button>
          <div>
            <h1 className="text-white font-semibold">AI Advisor</h1>
            <p className="text-gray-500 text-xs mt-0.5">Grounded in 35+ official government documents</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isProfileActive && (
            <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Context Active</span>
            </div>
          )}
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              className="text-gray-500 hover:text-gray-300 text-xs border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-all hidden sm:block"
            >
              New Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-6 transform rotate-3">
              <span className="text-white font-bold text-3xl transform -rotate-3">S</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">StartupSage AI</h2>
            <p className="text-gray-400 mb-8">
              Ask me anything about registering, funding, taxation, or compliance for your Indian startup. I'll cite my sources.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {SUGGESTION_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); inputRef.current?.focus(); }}
                  className="text-left px-4 py-3 bg-[#0f0f1a] border border-white/8 hover:border-indigo-500/30 hover:bg-indigo-500/5 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all"
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

      {/* Input Bar */}
      <div className="flex-shrink-0 px-4 lg:px-8 py-4 border-t border-white/5 bg-[#0f0f1a]/50 backdrop-blur-sm">
        <form onSubmit={sendMessage} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-500"></div>
          <div className="relative flex items-end bg-[#0f0f1a] border border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about startup registration, GST, MSME, funding..."
              rows={1}
              className="flex-1 bg-transparent px-5 py-4 text-white placeholder-gray-500 focus:outline-none resize-none text-sm leading-relaxed"
              style={{ minHeight: '56px', maxHeight: '160px' }}
              disabled={loading}
            />
            <div className="px-3 py-3 flex-shrink-0">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
        <p className="text-center text-xs text-gray-600 mt-2">
          AI may make mistakes. Always verify critical legal or financial decisions with a professional.
        </p>
      </div>
      </div>
    </div>
  );
}
