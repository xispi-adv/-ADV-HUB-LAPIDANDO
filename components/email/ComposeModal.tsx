
import React, { useState, useRef } from 'react';
import { Paperclip, X, Layout, FileText, Send, Trash2, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Attachment {
    id: string;
    file: File;
    name: string;
    size: string;
}

interface ComposeModalProps {
    onClose: () => void;
}

const TEMPLATES = [
    {
        name: 'Newsletter Semanal',
        html: `<h2>Newsletter AdVerge - Edição [Data]</h2><p>Olá [Nome],</p><p>Aqui estão as principais atualizações da semana em marketing digital:</p><ul><li>Tópico 1</li><li>Tópico 2</li></ul><p>Atenciosamente,<br>Equipe AdVerge</p>`
    },
    {
        name: 'Proposta Comercial',
        html: `<h1>Proposta de Serviços - IA Marketing</h1><hr/><p>Prezado [Cliente],</p><p>Conforme conversamos, segue o detalhamento estratégico para a conta:</p><p><b>Investimento Sugerido:</b> R$ [Valor]</p><p><b>KPI Principal:</b> [Objetivo]</p>`
    },
    {
        name: 'Follow-up de Reunião',
        html: `<p>Olá,</p><p>Obrigado pelo tempo hoje. Segue o resumo dos próximos passos discutidos:</p><ol><li>Ação A</li><li>Ação B</li></ol><p>Fico no aguardo do seu retorno.</p>`
    }
];

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({ to: '', subject: '', body: '' });
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // FIX: Explicitly type 'file' as 'File' to avoid 'unknown' type errors (lines 44 and 45)
            const newFiles = Array.from(e.target.files).map((file: File) => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB'
            }));
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

    const applyTemplate = (html: string) => {
        setFormData(prev => ({ ...prev, body: html }));
        setIsTemplateMenuOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Enviando email:", { ...formData, attachments });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[70] animate-fade-in" onClick={onClose}>
            <div className={`w-full max-w-4xl m-4 h-[85vh] rounded-[2.5rem] border overflow-hidden flex flex-col shadow-2xl relative
                ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0F0F11] border-white/5'}`} 
                onClick={e => e.stopPropagation()}
            >
                {/* Header Decoration */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-blue-400' : 'from-red-800 to-red-600'}`}></div>

                <header className="p-6 flex justify-between items-center border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-red-500/10 text-red-500'}`}>
                            <FileText size={20} />
                         </div>
                         <h2 className={`text-xl font-bold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Nova Mensagem</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/5 text-white/40'}`}>
                        <X size={20}/>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
                    <div className="px-6 py-4 space-y-4">
                        <div className="flex items-center border-b border-[var(--border-color)] pb-2 group">
                            <label className={`text-xs font-bold uppercase tracking-widest w-16 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>Para</label>
                            <input 
                                type="email" 
                                value={formData.to}
                                onChange={e => setFormData({...formData, to: e.target.value})}
                                required
                                className={`flex-1 bg-transparent border-none text-sm outline-none font-medium ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                            />
                        </div>
                        <div className="flex items-center border-b border-[var(--border-color)] pb-2 group">
                            <label className={`text-xs font-bold uppercase tracking-widest w-16 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>Assunto</label>
                            <input 
                                type="text"
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                                required
                                className={`flex-1 bg-transparent border-none text-sm outline-none font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                            />
                        </div>
                    </div>

                    {/* Attachments List */}
                    {attachments.length > 0 && (
                        <div className="px-6 py-2 flex flex-wrap gap-2 animate-fade-in">
                            {attachments.map(att => (
                                <div key={att.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold
                                    ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    <Paperclip size={12} className="opacity-50" />
                                    <span className="truncate max-w-[150px]">{att.name}</span>
                                    <span className="opacity-30">{att.size}</span>
                                    <button onClick={() => removeAttachment(att.id)} className="hover:text-red-500 transition-colors">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex-grow p-6">
                        <textarea
                            value={formData.body}
                            onChange={e => setFormData({...formData, body: e.target.value})}
                            placeholder="Escreva sua mensagem ou escolha um modelo..."
                            className={`w-full h-full bg-transparent border-none text-base outline-none resize-none font-medium
                                ${theme === 'light' ? 'text-slate-700 placeholder-slate-300' : 'text-white/80 placeholder-white/10'}`}
                        />
                    </div>

                    <footer className={`p-6 border-t flex justify-between items-center ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                        <div className="flex gap-2 relative">
                            {/* Attachment Button */}
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                <Paperclip size={14} />
                                <span>Anexar</span>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />

                            {/* Templates Button */}
                            <div className="relative">
                                <button 
                                    type="button" 
                                    onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                        ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                                >
                                    <Layout size={14} />
                                    <span>Modelos</span>
                                    <ChevronDown size={12} className={`transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isTemplateMenuOpen && (
                                    <div className={`absolute bottom-full left-0 mb-2 w-56 rounded-2xl border shadow-2xl overflow-hidden animate-fade-in-up z-50 backdrop-blur-xl
                                        ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#18181b] border-white/10'}`}>
                                        <div className="p-3 border-b border-[var(--border-color)]">
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Selecione um Layout</p>
                                        </div>
                                        {TEMPLATES.map(temp => (
                                            <button
                                                key={temp.name}
                                                type="button"
                                                onClick={() => applyTemplate(temp.html)}
                                                className={`w-full text-left px-4 py-3 text-xs font-bold transition-all hover:translate-x-1
                                                    ${theme === 'light' ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-white/5 text-white/70'}`}
                                            >
                                                {temp.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button type="button" onClick={onClose} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-white/30 hover:text-white'}`}>Descartar</button>
                            <button 
                                type="submit" 
                                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl transform active:scale-95
                                    ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-700 text-white hover:bg-red-600'}`}
                            >
                                <Send size={14} />
                                <span>Enviar</span>
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ComposeModal;
