
import React, { useState } from 'react';
import type { Client, ClientObjective, ClientKeyResult } from '../../types';
import { useClients } from '../../context/ClientContext';
import { Target, Trophy, Zap, Activity, ChevronRight } from 'lucide-react';

// --- ICONS ---
const PlusIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const CheckIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const TrashIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

interface ClientObjectivesViewProps {
    client: Client;
}

const ClientObjectivesView: React.FC<ClientObjectivesViewProps> = ({ client: propClient }) => {
    const { updateClient, getClientById } = useClients();
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
                <div className="bg-gradient-to-br from-[#1a1b23] to-black border border-white/5 rounded-[2rem] p-8 flex items-center gap-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                            <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--bg-elevation-2)" strokeWidth="8" />
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
                            <span className="text-2xl font-black text-white">{overallProgress}%</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <Activity size={14} className="text-emerald-500" />
                             <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Momentum</h3>
                        </div>
                        <p className="text-xl font-black text-white tracking-tighter">GLOBAL SUCCESS</p>
                        <p className="text-xs text-white/30 font-medium mt-1 uppercase tracking-widest">Score de Entrega</p>
                    </div>
                </div>

                {/* ATIVAS CARD */}
                <div className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group">
                     <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                        <Target size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/10 shadow-inner">
                            <Target size={24} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Pipeline</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">{totalObjectives}</span>
                        <span className="text-sm font-bold text-white/20 uppercase tracking-widest">Iniciativas</span>
                    </div>
                </div>

                {/* DELIVERABLES CARD */}
                <div className="bg-[#1a1b23] border border-white/5 rounded-[2rem] p-8 flex flex-col justify-center shadow-lg relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                        <Trophy size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/10 shadow-inner">
                            <Zap size={24} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Velocity</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">{completedKeyResults}</span>
                        <span className="text-sm font-bold text-white/20 uppercase tracking-widest">/ {totalKeyResults} KR'S</span>
                    </div>
                </div>
            </div>

            {/* HEADER DA SEÇÃO */}
            <div className="flex items-center justify-between pt-10 border-t border-white/5">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Arquitetura de Objetivos</h2>
                    <p className="text-sm text-white/40 mt-1 font-medium">Metas OKR e marcos de performance vinculados à conta.</p>
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
                    <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] text-white/20">
                        <Target size={64} className="opacity-10 mb-6" />
                        <p className="text-lg font-bold uppercase tracking-[0.2em] mb-4">Nenhuma Meta Detectada</p>
                        <button onClick={() => setIsAddObjOpen(true)} className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Definir Primeiro OKR</button>
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
        <div className="bg-[#1a1b23] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-rose-500/30 transition-all shadow-md group animate-fade-in-up">
            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                             <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                            <h3 className="text-2xl font-black text-white tracking-tighter truncate uppercase">{objective.title}</h3>
                            {objective.deadline && (
                                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10 font-mono font-bold text-white/40 tracking-widest">
                                    TARGET: {new Date(objective.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex-1 h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-sm font-black text-white w-12 text-right tabular-nums">{Math.round(progress)}%</span>
                        </div>
                    </div>
                    <button onClick={onDelete} className="text-white/10 hover:text-red-500 p-3 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="p-8 bg-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyResults.map(kr => (
                        <div key={kr.id} onClick={() => onToggleKR(kr.id)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${kr.isCompleted ? 'bg-white/[0.02] border-transparent opacity-30 grayscale' : 'bg-white/[0.03] border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5'}`}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${kr.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10 bg-black/20'}`}>
                                {kr.isCompleted && <CheckIcon className="w-4 h-4" />}
                            </div>
                            <span className={`text-sm font-bold tracking-tight flex-1 ${kr.isCompleted ? 'line-through decoration-emerald-500/50' : 'text-white'}`}>{kr.title}</span>
                        </div>
                    ))}
                </div>

                {isAddingKR ? (
                    <form onSubmit={handleNewKRSubmit} className="mt-6 flex gap-4 animate-fade-in">
                        <input autoFocus value={newKR} onChange={e => setNewKR(e.target.value)} placeholder="Defina a métrica de sucesso (KR)..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-3 text-sm font-bold text-white focus:outline-none focus:border-rose-500 transition-all" />
                        <button type="submit" className="bg-emerald-600 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:bg-emerald-500">Salvar KR</button>
                        <button type="button" onClick={() => setIsAddingKR(false)} className="text-white/20 hover:text-white text-xs font-black uppercase tracking-widest px-2 transition-colors">X</button>
                    </form>
                ) : (
                    <button onClick={() => setIsAddingKR(true)} className="mt-6 w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-white/20 hover:text-rose-500 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <PlusIcon className="w-4 h-4" /> Adicionar Milestone
                    </button>
                )}
            </div>
        </div>
    );
}

export default ClientObjectivesView;
