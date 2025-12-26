
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AgentCardData, Message } from '../types';
import { useAgents } from '../context/AgentContext';
import { GoogleGenAI } from "@google/genai";

// --- SVG Icons ---
const BackIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8284 12L17.4142 17.5858L16 19L9 12L16 5L17.4142 6.41421L11.8284 12Z" fill="currentColor"/>
      <path d="M7 12L12.5858 17.5858L11.1716 19L4.17157 12L11.1716 5L12.5858 6.41421L7 12Z" fill="currentColor"/>
    </svg>
);
const SendIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
    </svg>
);
const BotIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h1.5m12 0h1.5m-1.5 3.75h1.5m-1.5 3.75H3m1.5-3.75H3m15.75 4.5V3m-15.75 18V3m-9 9h1.5M12 8.25a3 75 0 00-3 3v3a3 3 0 003 3m0-6a3 3 0 013 3v3a3 3 0 01-3 3m0-6h.008v.008H12V8.25zm0 6h.008v.008H12V14.25z" />
    </svg>
);

// --- Child Components ---
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
        <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div
                className={`px-5 py-3.5 rounded-2xl shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                isUser
                    ? 'bg-[var(--accent-color)] text-white rounded-br-none'
                    : 'bg-[var(--bg-elevation-2)] text-[var(--text-primary)] backdrop-blur-sm border border-[var(--border-color)] rounded-bl-none'
                }`}
            >
                {message.text}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mt-1 px-1">
                {message.timestamp || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start animate-fade-in mb-4">
    <div className="px-4 py-3 bg-[var(--bg-elevation-2)] rounded-2xl rounded-bl-none border border-[var(--border-color)] flex items-center gap-1">
      <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce"></div>
    </div>
  </div>
);

interface ChatViewProps {
  agent: AgentCardData;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ agent, onBack }) => {
  const { addMessageToHistory } = useAgents();
  const [messages, setMessages] = useState<Message[]>(agent.chatHistory || []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    const userMessage: Message = {
        id: Date.now(),
        text: userText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    addMessageToHistory(agent.id, userMessage);
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const historyContext = messages.map(m => `${m.sender === 'user' ? 'User' : 'Model'}: ${m.text}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userText }] 
                }
            ],
            config: {
                systemInstruction: `
                    ${agent.systemInstruction}
                    
                    HISTÓRICO RECENTE DA CONVERSA:
                    ${historyContext}
                `,
            }
        });

        const aiText = response.text;
        
        if (aiText) {
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: aiText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, aiMessage]);
            addMessageToHistory(agent.id, aiMessage);
        }

    } catch (error) {
        console.error("Error generating response:", error);
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Desculpe, tive um problema ao processar sua solicitação. Verifique sua conexão ou chave de API.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-elevation-1)]">
        <button onClick={onBack} className="mr-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-[var(--bg-elevation-2)] rounded-full">
          <BackIcon />
        </button>
        
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${agent.isHighlighted ? 'bg-[var(--accent-color)]' : 'bg-[var(--bg-elevation-2)] text-[var(--text-secondary)]'}`}>
            {agent.icon ? <agent.icon className="w-6 h-6 text-white" /> : <BotIcon className="w-6 h-6" />}
        </div>

        <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] leading-tight">{agent.title}</h2>
            <p className="text-xs text-[var(--text-muted)]">IA Especializada • Gemini Flash Lite</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 bg-[var(--bg-main)] relative" ref={chatContainerRef}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <span className="text-9xl font-black text-[var(--text-primary)]">AI</span>
        </div>

        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevation-2)] flex items-center justify-center mb-4">
                     {agent.icon ? <agent.icon className="w-8 h-8" /> : <BotIcon className="w-8 h-8" />}
                </div>
                <p>Comece uma conversa com {agent.title}</p>
            </div>
        )}

        {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-elevation-1)] border-t border-[var(--border-color)]">
        <div className="relative bg-[var(--input-bg)] rounded-xl border border-[var(--border-color)] focus-within:border-[var(--accent-color)] focus-within:ring-1 focus-within:ring-[var(--accent-color)] transition-all flex items-end p-2">
            <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Digite sua mensagem para ${agent.title}...`}
                className="flex-grow bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] px-3 py-2 max-h-[120px] resize-none focus:outline-none text-sm"
                rows={1}
            />
            <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={`p-2 rounded-lg mb-0.5 ml-2 transition-all ${inputValue.trim() ? 'bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)]' : 'bg-[var(--bg-elevation-2)] text-[var(--text-muted)] cursor-not-allowed'}`}
            >
                <SendIcon />
            </button>
        </div>
        <div className="text-center mt-2">
             <p className="text-[10px] text-[var(--text-muted)]">Respostas geradas por IA (Gemini 2.5 Flash Lite). Verifique informações importantes.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
