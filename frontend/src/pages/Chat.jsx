import { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const profileId = localStorage.getItem('startup_profile_id');
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          conversation_id: conversationId,
          profile_id: profileId
        })
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      
      if (!conversationId) setConversationId(data.conversation_id);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        ragMode: data.rag_mode
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error: Could not reach the server. Make sure the FastAPI backend is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isProfileActive = !!localStorage.getItem('startup_profile_id');

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full p-4 relative">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

      {isProfileActive && (
        <div className="z-10 bg-white/80 backdrop-blur-md border border-indigo-100/50 text-indigo-700 px-4 py-2.5 rounded-xl mb-4 text-sm font-medium flex items-center shadow-[0_4px_20px_-4px_rgba(79,70,229,0.1)] self-center">
          <span className="flex h-2 w-2 relative mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Chatting in the context of your Startup Profile
        </div>
      )}
      
      <div className="z-10 flex-grow bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center transform transition-all hover:scale-105 duration-500">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-6 shadow-xl shadow-blue-500/30 flex items-center justify-center transform rotate-3">
                <span className="text-white font-bold text-4xl transform -rotate-3">S</span>
              </div>
              <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">StartupSage AI</h2>
              <p className="text-gray-500 font-medium">Your expert advisor for registering and scaling in India.</p>
              {!isProfileActive && (
                <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 p-4 rounded-xl border border-amber-100/50 inline-block shadow-sm">
                  <span className="font-semibold">✨ Pro Tip:</span> Go to the <strong>Profile</strong> tab to set your startup context!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mr-3 mt-1 shadow-md shadow-indigo-200">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm shadow-blue-200' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  <div className={`whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                    {msg.content}
                  </div>
                  
                  {/* Citations & Metadata */}
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Sources</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cit, j) => (
                          <a 
                            key={j} 
                            href={cit.source_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="group relative text-xs bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-gray-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg transition-all duration-200 flex items-center"
                          >
                            <span className="font-semibold mr-1">[{cit.ref_id}]</span> 
                            <span className="truncate max-w-[150px]">{cit.category || "Document"}</span>
                            
                            {/* Custom Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-xl">
                              <p className="font-semibold text-indigo-300 mb-1">Excerpt:</p>
                              {cit.text_snippet}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </a>
                        ))}
                      </div>
                      {msg.ragMode && (
                        <div className="mt-3 text-[10px] text-gray-400 flex items-center font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></div>
                          Mode: <span className="uppercase ml-1 tracking-wider text-gray-500">{msg.ragMode}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mr-3 mt-1 opacity-50">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-5 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="z-10 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm p-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about startup regulations..."
            className="flex-grow p-4 bg-transparent border-none focus:ring-0 text-gray-700 outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 mr-1"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
}
