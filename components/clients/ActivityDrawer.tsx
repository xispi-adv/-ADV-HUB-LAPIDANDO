
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
    X, Calendar, Phone, AlertTriangle, FileText, 
    XCircle, Send, Paperclip, Clock, Pin
} from 'lucide-react';
import type { ActivityType } from '../../types';

interface ActivityDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
}

const TYPE_OPTIONS: { id: ActivityType, label: string, icon: any, color: string }[] = [
    { id: 'MEETING', label: 'Reunião', icon: Calendar, color: 'blue' },
    { id: 'CALL', label: 'Ligação', icon: Phone, color: 'emerald' },
    { id: 'COMPLAINT', label: 'Reclamação', icon: AlertTriangle, color: 'orange' },
    { id: 'NOTE', label: 'Nota Interna', icon: FileText, color: 'slate' },
    { id: 'INCIDENT', label: 'Incidente', icon: XCircle, color: 'rose' },
];

const ActivityDrawer: React.FC<ActivityDrawerProps> = ({ isOpen, onClose, clientName }) => {
    const { theme } = useTheme();
    const [selectedType, setSelectedType] = useState<ActivityType>('MEETING');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isPinned, setIsPinned] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de salvamento será integrada via Context/API futuramente
        console.log({ selectedType, title, description, date, isPinned });
        onClose();
    };

    const activeColor = TYPE_OPTIONS.find(t => t.id === selectedType)?.color || 'rose';

    return (
        <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`
                absolute top-0 right-0 h-full w-full max-w-lg shadow-2xl transition-transform duration-500 ease-out flex flex-col
                ${theme === 'light' ? 'bg-white' : 'bg-[#0F1014]'}
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <header className={`p-8 border-b flex justify-between items-center ${theme === 'light' ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-white/[0.02]'}`}>
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Novo Registro</h2>
                        <p className={`text-xs mt-1 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-white/30'}`}>Timeline Operacional: {clientName}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full hover:bg-white/5 transition-all ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* TYPE SELECTION */}
                    <section>
                        <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Natureza do Evento</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {TYPE_OPTIONS.map(opt => {
                                const IsActive = selectedType === opt.id;
                                const Icon = opt.icon;
                                return (
                                    <button 
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setSelectedType(opt.id)}
                                        className={`
                                            flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300
                                            ${IsActive 
                                                ? `bg-${opt.color}-500/10 border-${opt.color}-500/50 shadow-lg scale-[1.02]` 
                                                : `bg-transparent ${theme === 'light' ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}
                                        `}
                                    >
                                        <div className={`p-2.5 rounded-xl ${IsActive ? `bg-${opt.color}-500 text-white` : `${theme === 'light' ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-white/30'}`}`}>
                                            <Icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${IsActive ? `text-${opt.color}-500` : 'text-[var(--text-muted)]'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* MAIN INFO */}
                    <section className="space-y-6">
                        <div className="group">
                            <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Título do Registro</label>
                            <input 
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Resumo curto da atividade..."
                                className={`
                                    w-full bg-transparent border-b-2 py-3 text-lg font-bold outline-none transition-all
                                    ${theme === 'light' ? 'border-slate-200 focus:border-blue-500 text-slate-900' : 'border-white/5 focus:border-rose-500 text-white'}
                                `}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Data do Ocorrido</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input 
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className={`
                                            w-full pl-12 pr-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all
                                            ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5 text-white'}
                                        `}
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Prioridade</label>
                                <button 
                                    type="button"
                                    onClick={() => setIsPinned(!isPinned)}
                                    className={`
                                        w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all
                                        ${isPinned ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-transparent border-white/5 text-white/40'}
                                    `}
                                >
                                    <Pin size={16} /> {isPinned ? 'Destacado' : 'Normal'}
                                </button>
                            </div>
                        </div>

                        <div className="group">
                            <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Relatório de Atividade</label>
                            <textarea 
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={6}
                                placeholder="Descreva os detalhes, decisões tomadas e próximos passos..."
                                className={`
                                    w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-sm leading-relaxed outline-none transition-all font-medium resize-none
                                    ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500 text-slate-700' : 'focus:border-rose-500 text-white'}
                                `}
                            />
                        </div>
                    </section>

                    <section>
                         <label className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 block ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Evidências (Anexos)</label>
                         <button type="button" className={`
                            w-full py-10 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all opacity-40 hover:opacity-100
                            ${theme === 'light' ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-white/5 bg-white/[0.02] text-white/30'}
                         `}>
                            <Paperclip size={32} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload de arquivos</span>
                         </button>
                    </section>
                </form>

                <footer className={`p-8 border-t flex justify-end gap-4 ${theme === 'light' ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-white/[0.01]'}`}>
                    <button 
                        type="button" 
                        onClick={onClose}
                        className={`px-8 py-3 text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors`}
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className={`
                            px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all transform active:scale-95 flex items-center gap-3
                            ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/40'}
                        `}
                    >
                        <Send size={16} /> Efetivar Registro
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ActivityDrawer;
