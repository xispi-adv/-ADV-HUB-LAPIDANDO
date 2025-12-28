
import React, { useState } from 'react';
import { useEmail } from '../../context/EmailContext';
import type { Email } from '../../types';
import { Sparkles, Reply, Forward, Trash2, ChevronLeft, Paperclip, Loader2 } from 'lucide-react';

interface EmailViewPanelProps {
    email: Email | null;
    onBack?: () => void;
}

const EmailViewPanel: React.FC<EmailViewPanelProps> = ({ email, onBack }) => {
    const { summarizeEmail } = useEmail();
    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleSummarize = async () => {
        if (!email) return;
        setIsSummarizing(true);
        const text = await summarizeEmail(email.id);
        setSummary(text);
        setIsSummarizing(false);
    };

    if (!email) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-white/10 select-none animate-fade-in">
                <Sparkles size={80} strokeWidth={0.5} className="mb-6 opacity-5" />
                <h3 className="text-xl font-light tracking-widest uppercase">Select Thread</h3>
                <p className="text-[10px] mt-2 font-black tracking-[0.4em] opacity-30">ADV-HUB PROTOCOL V1.0</p>
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
        <div className="h-full flex flex-col bg-[var(--bg-main)] animate-fade-in">
            {/* Header / Actions Bar */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4 min-w-0">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white lg:hidden">
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-white tracking-tight truncate pr-4">{email.subject}</h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleSummarize}
                        disabled={isSummarizing}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {summary ? 'Atualizar Resumo' : 'Sumarizar com Alita'}
                    </button>
                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
                    <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Reply size={18} /></button>
                    <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Forward size={18} /></button>
                    <button className="p-2.5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    
                    {/* Sender Identity */}
                    <div className="flex items-center gap-4 pb-8 border-b border-white/5">
                        <img 
                            src={email.from.avatar || `https://ui-avatars.com/api/?name=${email.from.name.replace(' ', '+')}&background=1F2937&color=fff&bold=true`} 
                            className="w-12 h-12 rounded-2xl border-2 border-white/5" 
                            alt={email.from.name} 
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-1">
                                <h4 className="text-base font-bold text-white">{email.from.name}</h4>
                                <time className="text-[10px] font-mono text-white/20">{formattedDate}</time>
                            </div>
                            <p className="text-xs text-white/40">{email.from.email}</p>
                        </div>
                    </div>

                    {/* AI SUMMARY CARD */}
                    {summary && (
                        <div className="bg-rose-600/5 border border-rose-500/20 rounded-[2rem] p-8 animate-fade-in-up relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={40} className="text-rose-500" />
                            </div>
                            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Neural Summary by Alita</h3>
                            <div className="text-sm text-rose-100/80 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none prose-sm">
                                {summary}
                            </div>
                        </div>
                    )}

                    {/* Email Body */}
                    <div 
                        className="text-[15px] leading-relaxed text-white/70 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: email.body }} 
                    />

                    {/* Attachments Section */}
                    {email.attachments.length > 0 && (
                        <div className="pt-10 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Anexos Vinculados</h3>
                            <div className="flex flex-wrap gap-3">
                                {email.attachments.map(att => (
                                    <div key={att.id} className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-white/20 rounded-xl p-3 cursor-pointer transition-all group">
                                        <div className="p-2 bg-white/5 rounded-lg group-hover:text-rose-500 transition-colors">
                                            <Paperclip size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{att.filename}</p>
                                            <p className="text-[10px] text-white/20">{(att.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Reply Bar */}
            <footer className="p-6 border-t border-white/5 bg-[var(--bg-elevation-1)]">
                <div className="max-w-4xl mx-auto flex items-center gap-4 bg-black/20 border border-white/5 rounded-2xl p-2 px-4 focus-within:border-rose-500/50 transition-all">
                    <input 
                        type="text" 
                        placeholder="Resposta rápida para este cliente..."
                        className="flex-1 bg-transparent border-none py-2 text-sm text-white focus:outline-none placeholder-white/20"
                    />
                    <button className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                        Enviar
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default EmailViewPanel;
