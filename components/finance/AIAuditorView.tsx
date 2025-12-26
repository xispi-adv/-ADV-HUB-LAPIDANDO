
import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { GoogleGenAI } from "@google/genai";

// Icons
const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);
const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AIAuditorView: React.FC = () => {
  const { chatHistory, sendFinancialMessage, isAiThinking } = useFinance();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if(scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [chatHistory, isAiThinking]);

  const handleSend = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isAiThinking) return;
      
      const msg = input;
      setInput('');
      await sendFinancialMessage(msg);
  };

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-elevation-1)] backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-purple-700 flex items-center justify-center shadow-lg">
                <BotIcon className="text-white w-6 h-6" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">CFO Virtual</h2>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online • Acesso Total aos Dados
                </p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--bg-card)]/50" ref={scrollRef}>
            {chatHistory.map((msg) => {
                const isAi = msg.role === 'ai';
                return (
                    <div key={msg.id} className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}>
                        <div className={`
                            max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative
                            ${isAi 
                                ? 'bg-[var(--bg-elevation-1)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-color)]' 
                                : 'bg-[var(--accent-color)] text-white rounded-tr-none'}
                        `}>
                            <div className="whitespace-pre-wrap">
                                {msg.text.split('\n').map((line, i) => (
                                    <p key={i} className="min-h-[1em] mb-1 last:mb-0">{line}</p>
                                ))}
                            </div>
                            <span className={`text-[10px] opacity-50 block text-right mt-1 ${isAi ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                            </span>
                        </div>
                    </div>
                );
            })}
            
            {isAiThinking && (
                 <div className="flex justify-start">
                    <div className="bg-[var(--bg-elevation-1)] p-4 rounded-2xl rounded-tl-none border border-[var(--border-color)] flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce"></div>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[var(--bg-elevation-1)] border-t border-[var(--border-color)]">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pergunte sobre seus gastos, saldo ou peça uma análise..."
                    className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
                    disabled={isAiThinking}
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isAiThinking}
                    className="p-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-[var(--accent-glow)]"
                >
                    <SendIcon />
                </button>
            </form>
            <div className="flex gap-2 mt-2 px-1 overflow-x-auto no-scrollbar">
                {['Resumo do mês', 'Maiores gastos?', 'Previsão caixa'].map(suggestion => (
                    <button 
                        key={suggestion}
                        onClick={() => { setInput(suggestion); }}
                        className="text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] px-3 py-1 rounded-full hover:bg-[var(--bg-elevation-2)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AIAuditorView;
