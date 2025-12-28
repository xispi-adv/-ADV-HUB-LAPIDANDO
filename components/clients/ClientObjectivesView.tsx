
import React, { useState } from 'react';
import type { Client, ClientObjective, ClientKeyResult } from '../../types';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { Target, Trophy, Zap, Activity, Trash2 } from 'lucide-react';

// --- ICONS ---
const PlusIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const CheckIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

interface ClientObjectivesViewProps {
    client: Client;
}

const ClientObjectivesView: React.FC<ClientObjectivesViewProps> = ({ client: propClient }) => {
    const { updateClient, getClientById } = useClients();
    const { theme } = useTheme();
    const [isAddObjOpen, setIsAddObjOpen] = useState(false);
    const [newObjTitle, setNewObjTitle] = useState('');
    const [newObjDate, setNewObjDate] = useState('');

    const client = getClientById(propClient.id) || propClient;
    const objectives = client.objectives || [];

    const totalObjectives = objectives.length;
    const totalKeyResults = objectives.reduce((acc, obj) => acc + (obj.keyResults ? obj.keyResults.length : 0), 0);
    const completedKeyResults = objectives.reduce((acc, obj) => acc + (obj.keyResults ? obj.keyResults.filter(k => k.isCompleted).length : 0), 0);
    const overallProgress = totalKeyResults > 0 ? Math.round((completedKeyResults / totalKeyResults) * 100) : 0;

    const handleAddObjective = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newObjTitle.trim()) return;

        const newObjective: ClientObjective = {
            id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: newObjTitle,
            deadline: newObjDate,
            status: 'EM_ANDAMENTO',
            keyResults: []
        };

        const updatedObjectives = [...objectives, newObjective];
        updateClient(client.id, { objectives: updatedObjectives });
        
        setNewObjTitle('');
        setNewObjDate('');
        setIsAddObjOpen(false);
    };

    const handleDeleteObjective = (objId: string) => {
        if (confirm("Confirmar deleção do objetivo estratégico?")) {
            const updatedObjectives = objectives.filter(o => o.id !== objId);
            updateClient(client.id, { objectives: updatedObjectives });
        }
    };

    const handleAddKeyResult = (objId: string, krTitle: string) => {
        const updatedObjectives = objectives.map(obj => {
            if (obj.id === objId) {
                return {
                    ...obj,
                    keyResults: [...(obj.keyResults || []), { 
                        id: `kr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
                        title: krTitle, 
                        isCompleted: false 
                    }]
                };
            }
            return obj;
        });
        updateClient(client.id, { objectives: updatedObjectives });
    };

    const handleToggleKeyResult = (objId: string, krId: string) => {
        const updatedObjectives = objectives.map(obj => {
            if (obj.id === objId) {
                const newKRs = (obj.keyResults || []).map(kr => 
                    kr.id === krId ? { ...kr, isCompleted: !kr.isCompleted } : kr
                );
                return { ...obj, keyResults: newKRs };
            }
            return obj;
        });
        updateClient(client.id, { objectives: updatedObjectives });
    };

    return (
        <div className="space-y-10 animate-fade-in">
            
            {/* TELEMETRY DASHBOARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* GLOBAL SUCCESS CARD */}
                <div className={`border rounded-[2rem] p-8 flex items-center gap-8 shadow-2xl relative overflow-hidden group transition-all duration-500
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-gradient-to-br from-[#1a1b23] to-black border-white/5'}`}
                >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke={theme === 'light' ? '#f1f5f9' : 'var(--bg-elevation-2)'} strokeWidth="8" />
                            <circle 
                                cx="50" cy="50" r="42" 
                                fill="transparent" 
                                stroke="#10b981" 
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={263.8} 
                                strokeDashoffset={263.8 - (263.8 * overallProgress) / 100}
                                className="transition-all duration-[1.5s] ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{overallProgress}%</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <Activity size={14} className="text-emerald-500" />
                             <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>Momentum</h3>
                        </div>
                        <p className={`text-xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>GLOBAL SUCCESS</p>
                        <p className={`text-xs font-medium mt-1 uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-white/30'}`}>Score de Entrega</p>
                    </div>
                </div>

                {/* ATIVAS CARD */}
                <div className={`border rounded-[2rem] p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group transition-all duration-500
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1a1b23] border-white/5'}`}
                >
                     <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                        <Target size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl border transition-all shadow-inner ${theme === 'light' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-rose-500/10 text-rose-500 border-rose-500/10'}`}>
                            <Target size={24} strokeWidth={1.5} />
                        </div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>Pipeline</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{totalObjectives}</span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`}>Iniciativas</span>
                    </div>
                </div>

                {/* DELIVERABLES CARD */}
                <div className={`border rounded-[2rem] p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group transition-all duration-500
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1a1b23] border-white/5'}`}
                >
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                        <Trophy size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl border transition-all shadow-inner ${theme === 'light' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-blue-500/10 text-blue-500 border-blue-500/10'}`}>
                            <Zap size={24} strokeWidth={1.5} />
                        </div>
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>Velocity</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{completedKeyResults}</span>
                        <span className={`text-sm font-bold uppercase tracking-widest ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`}>/ {totalKeyResults} KR'S</span>
                    </div>
                </div>
            </div>

            {/* HEADER DA SEÇÃO */}
            <div className={`flex items-center justify-between pt-10 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                <div>
                    <h2 className={`text-2xl font-black uppercase tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Arquitetura de Objetivos</h2>
                    <p className={`text-sm mt-1 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-white/40'}`}>Metas OKR e marcos de performance vinculados à conta.</p>
                </div>
                <button 
                    onClick={() => setIsAddObjOpen(true)}
                    className="flex items-center gap-3 bg-[var(--accent-color)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-[var(--accent-glow)] transform active:scale-95 transition-all"
                >
                    <PlusIcon className="w-5 h-5" /> Novo Objetivo
                </button>
            </div>

            {/* GRID DE OBJETIVOS */}
            <div className="space-y-8 pb-10">
                {objectives.length > 0 ? objectives.map(obj => (
                    <ObjectiveCard 
                        key={obj.id} 
                        objective={obj} 
                        onAddKR={(title) => handleAddKeyResult(obj.id, title)}
                        onToggleKR={(krId) => handleToggleKeyResult(obj.id, krId)}
                        onDelete={() => handleDeleteObjective(obj.id)}
                    />
                )) : (
                    <div className={`flex flex-col items-center justify-center py-20 border-4 border-dashed rounded-[3rem] transition-colors
                        ${theme === 'light' ? 'border-slate-100 bg-slate-50 text-slate-300' : 'border-white/5 bg-white/[0.02] text-white/20'}`}
                    >
                        <Target size={64} className="opacity-10 mb-6" />
                        <p className="text-lg font-bold uppercase tracking-[0.2em] mb-4">Nenhuma Meta Detectada</p>
                        <button onClick={() => setIsAddObjOpen(true)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all
                            ${theme === 'light' ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-900' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}
                        >Definir Primeiro OKR</button>
                    </div>
                )}
            </div>

            {/* MODAL DE NOVO OBJETIVO */}
            {isAddObjOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[70] animate-fade-in" onClick={() => setIsAddObjOpen(false)}>
                    <div className="bg-[#0f1014] border border-white/10 w-full max-w-sm p-10 rounded-[2.5rem] shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500"><Target size={20} /></div>
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase">Novo Objetivo</h3>
                        </div>
                        <form onSubmit={handleAddObjective} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Título da Iniciativa</label>
                                <input autoFocus value={newObjTitle} onChange={e => setNewObjTitle(e.target.value)} placeholder="Ex: Dominância Digital Q4" className="w-full bg-transparent border-b-2 border-white/10 py-3 text-lg font-bold text-white focus:border-rose-500 outline-none transition-all placeholder-white/5" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Prazo Estimado</label>
                                <input type="date" value={newObjDate} onChange={e => setNewObjDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-bold text-white focus:border-rose-500 outline-none transition-all" />
                            </div>
                            <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                                <button type="button" onClick={() => setIsAddObjOpen(false)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Abortar</button>
                                <button type="submit" className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white shadow-lg transition-all">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const ObjectiveCard: React.FC<{ objective: ClientObjective, onAddKR: (title: string) => void, onToggleKR: (id: string) => void, onDelete: () => void }> = ({ objective, onAddKR, onToggleKR, onDelete }) => {
    const { theme } = useTheme();
    const [newKR, setNewKR] = useState('');
    const [isAddingKR, setIsAddingKR] = useState(false);
    const keyResults = objective.keyResults || [];
    const total = keyResults.length;
    const completed = keyResults.filter(k => k.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const handleNewKRSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newKR.trim()) { onAddKR(newKR); setNewKR(''); setIsAddingKR(false); }
    }

    return (
        <div className={`border rounded-[2.5rem] overflow-hidden transition-all shadow-md group animate-fade-in-up
            ${theme === 'light' ? 'bg-white border-slate-200 hover:border-rose-500/20 shadow-sm' : 'bg-[#1a1b23] border-white/5 hover:border-rose-500/30'}`}
        >
            <div className={`p-8 border-b ${theme === 'light' ? 'bg-slate-50/30 border-slate-100' : 'bg-white/[0.01] border-white/5'}`}>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                             <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                            <h3 className={`text-2xl font-black tracking-tighter truncate uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{objective.title}</h3>
                            {objective.deadline && (
                                <span className={`text-[10px] px-3 py-1 rounded-full border font-mono font-bold tracking-widest
                                    ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                                    TARGET: {new Date(objective.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                            <div className={`flex-1 h-2.5 rounded-full overflow-hidden shadow-inner ${theme === 'light' ? 'bg-slate-200' : 'bg-black/40'}`}>
                                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className={`text-sm font-black w-12 text-right tabular-nums ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{Math.round(progress)}%</span>
                        </div>
                    </div>
                    <button onClick={onDelete} className={`p-3 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 ${theme === 'light' ? 'text-slate-300 hover:text-red-500' : 'text-white/10 hover:text-red-500'}`}><Trash2 className="w-5 h-5" /></button>
                </div>
            </div>

            <div className={`p-8 ${theme === 'light' ? 'bg-white' : 'bg-black/20'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyResults.map(kr => (
                        <div key={kr.id} onClick={() => onToggleKR(kr.id)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 
                            ${kr.isCompleted 
                                ? (theme === 'light' ? 'bg-emerald-50/20 border-transparent opacity-40 grayscale' : 'bg-white/[0.02] border-transparent opacity-30 grayscale') 
                                : (theme === 'light' ? 'bg-slate-50/50 border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50/10' : 'bg-white/[0.03] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5')
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${kr.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-white shadow-sm'}`}>
                                {kr.isCompleted && <CheckIcon className="w-4 h-4" />}
                            </div>
                            <span className={`text-sm font-bold tracking-tight flex-1 ${kr.isCompleted ? 'line-through decoration-emerald-500/50' : (theme === 'light' ? 'text-slate-700' : 'text-white')}`}>{kr.title}</span>
                        </div>
                    ))}
                </div>

                {isAddingKR ? (
                    <form onSubmit={handleNewKRSubmit} className="mt-6 flex gap-4 animate-fade-in">
                        <input autoFocus value={newKR} onChange={e => setNewKR(e.target.value)} placeholder="Defina a métrica de sucesso (KR)..." className={`flex-1 border rounded-xl px-6 py-3 text-sm font-bold transition-all focus:border-rose-500 outline-none
                            ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-black/40 border-white/10 text-white placeholder-white/5'}`} />
                        <button type="submit" className="bg-emerald-600 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:bg-emerald-500">Salvar KR</button>
                        <button type="button" onClick={() => setIsAddingKR(false)} className="text-[var(--text-muted)] hover:text-rose-500 text-xs font-black uppercase tracking-widest px-2 transition-colors">X</button>
                    </form>
                ) : (
                    <button onClick={() => setIsAddingKR(true)} className={`mt-6 w-full py-4 border-2 border-dashed rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3
                        ${theme === 'light' ? 'border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-50/30' : 'border-white/5 text-white/20 hover:text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/5'}`}>
                        <PlusIcon className="w-4 h-4" /> Adicionar Milestone
                    </button>
                )}
            </div>
        </div>
    );
}

export default ClientObjectivesView;
