
import React, { useState, useRef } from 'react';
import { useEmail } from '../../context/EmailContext';
import { useTheme } from '../../context/ThemeContext';
import type { Email } from '../../types';
import { Sparkles, Reply, Forward, Trash2, ChevronLeft, Paperclip, Loader2, Send, X } from 'lucide-react';

interface EmailViewPanelProps {
    email: Email | null;
    onBack?: () => void;
}

const EmailViewPanel: React.FC<EmailViewPanelProps> = ({ email, onBack }) => {
    const { summarizeEmail } = useEmail();
    const { theme } = useTheme();
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    
    // Quick Reply States
    const [replyText, setReplyText] = useState('');
    const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSummarize = async () => {
        if (!email) return;
        setIsSummarizing(true);
        const text = await summarizeEmail(email.id);
        setSummary(text);
        setIsSummarizing(false);
    };

    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setReplyAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeReplyAttachment = (index: number) => {
        setReplyAttachments(prev => prev.filter((_, i) => i !== index));
    };

    if (!email) {
        return (
            <div className={`h-full flex flex-col items-center justify-center select-none animate-fade-in
                ${theme === 'light' ? 'bg-white' : 'bg-[#05010F]'}`}>
                <Sparkles size={80} strokeWidth={0.5} className={`mb-6 opacity-10 ${theme === 'light' ? 'text-blue-600' : 'text-white'}`} />
                <h3 className={`text-xl font-light tracking-widest uppercase ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Select Thread</h3>
                <p className={`text-[10px] mt-2 font-black tracking-[0.4em] opacity-30 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>ADV-HUB PROTOCOL V1.0</p>
            </div>
        );
    }

    const formattedDate = new Date(email.date).toLocaleString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={`h-full flex flex-col animate-fade-in ${theme === 'light' ? 'bg-white' : 'bg-[#121214]'}`}>
            {/* Header / Actions Bar */}
            <header className={`p-6 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-20
                ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-[#121214]/80 border-white/5'}`}>
                <div className="flex items-center gap-4 min-w-0">
                    {onBack && (
                        <button onClick={onBack} className={`p-2 -ml-2 transition-all lg:hidden ${theme === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-white/40 hover:text-white'}`}>
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <h2 className={`text-xl font-bold tracking-tight truncate pr-4 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{email.subject}</h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border
                            ${theme === 'light' 
                                ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white' 
                                : 'bg-rose-600/10 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white'}`}
                    >
                        {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        <span>{summary ? 'Atualizar' : 'Sumarizar'}</span>
                    </button>
                    <div className={`h-6 w-px mx-2 hidden md:block ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`}></div>
                    <button className={`p-2.5 rounded-xl transition-all ${theme === 'light' ? 'text-slate-400 hover:bg-slate-100' : 'text-white/40 hover:bg-white/5'}`}><Reply size={18} /></button>
                    <button className={`p-2.5 rounded-xl transition-all ${theme === 'light' ? 'text-slate-400 hover:bg-slate-100' : 'text-white/40 hover:bg-white/5'}`}><Forward size={18} /></button>
                    <button className={`p-2.5 rounded-xl transition-all ${theme === 'light' ? 'text-red-400 hover:bg-red-50' : 'text-rose-500/40 hover:bg-rose-500/5'}`}><Trash2 size={18} /></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    
                    {/* Sender Identity */}
                    <div className={`flex items-center gap-4 pb-8 border-b ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                        <img 
                            src={email.from.avatar || `https://ui-avatars.com/api/?name=${email.from.name.replace(' ', '+')}&background=${theme === 'light' ? 'EFF6FF' : '1F2937'}&color=${theme === 'light' ? '2563EB' : 'fff'}&bold=true`} 
                            className={`w-12 h-12 rounded-2xl border-2 ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`} 
                            alt={email.from.name} 
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                                <h4 className={`text-base font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{email.from.name}</h4>
                                <time className={`text-[10px] font-bold font-mono ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>{formattedDate}</time>
                            </div>
                            <p className={`text-xs font-medium ${theme === 'light' ? 'text-slate-500' : 'text-white/40'}`}>{email.from.email}</p>
                        </div>
                    </div>

                    {/* AI SUMMARY CARD */}
                    {summary && (
                        <div className={`rounded-[2rem] p-8 animate-fade-in-up relative overflow-hidden group border
                            ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-rose-600/5 border-rose-500/20'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={40} className={theme === 'light' ? 'text-blue-600' : 'text-rose-500'} />
                            </div>
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'light' ? 'text-blue-600' : 'text-rose-500'}`}>Neural Summary by Alita</h3>
                            <div className={`text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none
                                ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-rose-100/80 prose-invert'}`}>
                                {summary}
                            </div>
                        </div>
                    )}

                    {/* Email Body */}
                    <div 
                        className={`text-[15px] leading-relaxed prose max-w-none
                            ${theme === 'light' ? 'text-slate-700 font-medium' : 'text-white/80 prose-invert'}`}
                        dangerouslySetInnerHTML={{ __html: email.body }} 
                    />

                    {/* Attachments */}
                    {email.attachments.length > 0 && (
                        <div className={`pt-10 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Anexos</h3>
                            <div className="flex flex-wrap gap-3">
                                {email.attachments.map(att => (
                                    <div key={att.id} className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all group
                                        ${theme === 'light' ? 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                        <div className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-white text-slate-400 group-hover:text-blue-600' : 'bg-white/5 text-white/40 group-hover:text-rose-500'}`}>
                                            <Paperclip size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-bold truncate ${theme === 'light' ? 'text-slate-700' : 'text-white'}`}>{att.filename}</p>
                                            <p className={`text-[10px] ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>{(att.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Reply Bar - Enhanced with Attachments */}
            <footer className={`p-6 border-t ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Reply Attachments Queue */}
                    {replyAttachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 animate-fade-in-up">
                            {replyAttachments.map((file, i) => (
                                <div key={i} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold border
                                    ${theme === 'light' ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                    <button onClick={() => removeReplyAttachment(i)} className="hover:text-red-500 transition-colors">
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`flex items-center gap-4 border rounded-2xl p-2 px-4 transition-all
                        ${theme === 'light' 
                            ? 'bg-white border-slate-300 focus-within:border-blue-500 shadow-sm' 
                            : 'bg-black/40 border-white/10 focus-within:border-rose-500/50'}`}>
                        
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'text-slate-400 hover:bg-slate-100 hover:text-blue-600' : 'text-white/30 hover:bg-white/5 hover:text-rose-500'}`}
                        >
                            <Paperclip size={18} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileAttach} multiple className="hidden" />

                        <input 
                            type="text" 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Resposta rápida..."
                            className={`flex-1 bg-transparent border-none py-2 text-sm focus:outline-none 
                                ${theme === 'light' ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-white/20'}`}
                        />
                        
                        <button className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2
                            ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-black hover:bg-rose-500 hover:text-white'}`}>
                            <Send size={14} />
                            <span>Enviar</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default EmailViewPanel;
