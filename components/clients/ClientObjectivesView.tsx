
import React, { useState } from 'react';
import type { Client, ClientObjective, ClientKeyResult } from '../../types';
import { useClients } from '../../context/ClientContext';

// --- ICONS ---
const TargetIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const PlusIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const CheckIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const TrashIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const TrophyIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m11.372-.52a6.002 6.002 0 01-1.53 4.448m3.253-4.968c-.963-.203-1.935-.377-2.916-.52M19.5 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.726 6.726 0 01-2.749 1.35" /></svg>;

interface ClientObjectivesViewProps {
    client: Client;
}

const ClientObjectivesView: React.FC<ClientObjectivesViewProps> = ({ client: propClient }) => {
    const { updateClient, getClientById } = useClients();
    const [isAddObjOpen, setIsAddObjOpen] = useState(false);
    const [newObjTitle, setNewObjTitle] = useState('');
    const [newObjDate, setNewObjDate] = useState('');

    // Ensure we are working with the latest state from context to prevent overwrites
    const client = getClientById(propClient.id) || propClient;
    
    // Guard clause for safety
    const objectives = client.objectives || [];

    // --- Statistics ---
    const totalObjectives = objectives.length;
    const totalKeyResults = objectives.reduce((acc, obj) => acc + (obj.keyResults ? obj.keyResults.length : 0), 0);
    const completedKeyResults = objectives.reduce((acc, obj) => acc + (obj.keyResults ? obj.keyResults.filter(k => k.isCompleted).length : 0), 0);
    
    // Fixed calculation for overall progress
    const overallProgress = totalKeyResults > 0 ? Math.round((completedKeyResults / totalKeyResults) * 100) : 0;

    // --- Handlers ---

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
        if (confirm("Tem certeza que deseja excluir este objetivo?")) {
            const updatedObjectives = objectives.filter(o => o.id !== objId);
            updateClient(client.id, { objectives: updatedObjectives });
        }
    };

    // Add Key Result directly updates state
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

    // Toggle Key Result directly updates state
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
        <div className="space-y-8 animate-fade-in">
            
            {/* 1. Progress Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Progress Chart - Fixed Clipping Issues */}
                <div className="md:col-span-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[var(--accent-color)] opacity-[0.03] pointer-events-none"></div>
                    
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 z-10">Performance Global</h3>
                    
                    <div className="relative w-40 h-40 z-10">
                        {/* viewBox 0 0 100 100 ensures no clipping. Center at 50,50. Radius 40 leaves 10px padding for stroke width */}
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Background Circle */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-elevation-2)" strokeWidth="8" />
                            {/* Progress Circle */}
                            <circle 
                                cx="50" cy="50" r="40" 
                                fill="transparent" 
                                stroke="var(--accent-color)" 
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={251.2} // 2 * PI * 40
                                strokeDashoffset={251.2 - (251.2 * overallProgress) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-[var(--text-primary)]">{overallProgress}%</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-wide">Concluído</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent-color)] transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[var(--bg-elevation-2)] rounded-lg text-[var(--accent-color)]">
                                    <TargetIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Objetivos Ativos</h4>
                            </div>
                            <span className="text-4xl font-light text-[var(--text-primary)]">{totalObjectives}</span>
                        </div>
                        <div className="absolute bottom-0 right-0 opacity-5 transform translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-500">
                            <TargetIcon className="w-32 h-32" />
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <TrophyIcon className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Metas Atingidas</h4>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-light text-[var(--text-primary)]">{completedKeyResults}</span>
                                <span className="text-sm text-[var(--text-muted)]">/ {totalKeyResults}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 opacity-5 transform translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-500">
                            <TrophyIcon className="w-32 h-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Header & Add Button */}
            <div className="flex items-center justify-between pt-4 border-b border-[var(--border-color)] pb-4">
                <h2 className="text-xl font-light text-[var(--text-primary)]">Planejamento Estratégico</h2>
                <button 
                    onClick={() => setIsAddObjOpen(true)}
                    className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-[var(--accent-glow)] transition-all active:scale-95"
                >
                    <PlusIcon className="w-4 h-4" /> Novo Objetivo
                </button>
            </div>

            {/* 3. Objectives List */}
            <div className="space-y-6 pb-10">
                {objectives.length > 0 ? objectives.map(obj => (
                    <ObjectiveCard 
                        key={obj.id} 
                        objective={obj} 
                        onAddKR={(title) => handleAddKeyResult(obj.id, title)}
                        onToggleKR={(krId) => handleToggleKeyResult(obj.id, krId)}
                        onDelete={() => handleDeleteObjective(obj.id)}
                    />
                )) : (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-elevation-1)]/30">
                        <div className="w-16 h-16 bg-[var(--bg-elevation-1)] rounded-full flex items-center justify-center mb-4 text-[var(--text-muted)]">
                            <TargetIcon className="w-8 h-8" />
                        </div>
                        <p className="text-[var(--text-secondary)] font-medium mb-2">Nenhum objetivo definido</p>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs text-center mb-6">
                            Defina metas claras para acompanhar o sucesso e o progresso deste cliente.
                        </p>
                        <button 
                            onClick={() => setIsAddObjOpen(true)} 
                            className="text-[var(--accent-color)] text-sm font-bold hover:underline"
                        >
                            Criar Primeiro Objetivo
                        </button>
                    </div>
                )}
            </div>

            {/* Add Objective Modal */}
            {isAddObjOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[70] animate-fade-in" onClick={() => setIsAddObjOpen(false)}>
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-light text-[var(--text-primary)] mb-8">Definir Objetivo</h3>
                        <form onSubmit={handleAddObjective} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Título do Objetivo</label>
                                <input 
                                    autoFocus
                                    value={newObjTitle}
                                    onChange={e => setNewObjTitle(e.target.value)}
                                    placeholder="Ex: Aumentar retenção em 20%..."
                                    className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Prazo (Deadline)</label>
                                <input 
                                    type="date"
                                    value={newObjDate}
                                    onChange={e => setNewObjDate(e.target.value)}
                                    className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                                <button type="button" onClick={() => setIsAddObjOpen(false)} className="px-5 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2.5 bg-[var(--accent-color)] text-white text-sm font-bold rounded-lg hover:bg-[var(--accent-hover)] shadow-lg">Criar Objetivo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Component: ObjectiveCard ---
const ObjectiveCard: React.FC<{
    objective: ClientObjective, 
    onAddKR: (title: string) => void, 
    onToggleKR: (id: string) => void,
    onDelete: () => void
}> = ({ objective, onAddKR, onToggleKR, onDelete }) => {
    const [newKR, setNewKR] = useState('');
    const [isAddingKR, setIsAddingKR] = useState(false);

    const keyResults = objective.keyResults || [];
    const total = keyResults.length;
    const completed = keyResults.filter(k => k.isCompleted).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const handleNewKRSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newKR.trim()) {
            onAddKR(newKR);
            setNewKR('');
            setIsAddingKR(false);
        }
    }

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-all hover:border-[var(--accent-color)]/50 hover:shadow-lg shadow-black/20 group animate-fade-in-up">
            {/* Header Section */}
            <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-elevation-1)] to-[var(--bg-card)]">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{objective.title}</h3>
                            {objective.deadline && (
                                <span className="text-[10px] bg-[var(--bg-elevation-2)] px-2 py-0.5 rounded text-[var(--text-secondary)] border border-[var(--border-color)] font-mono">
                                    {new Date(objective.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-[var(--bg-elevation-2)] rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--accent-color)] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-[var(--text-secondary)] w-10 text-right">{Math.round(progress)}%</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                        className="text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Excluir Objetivo"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Key Results Section */}
            <div className="p-6 bg-[var(--bg-card)]">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Resultados Chave (Key Results)</h4>
                
                <div className="space-y-3">
                    {keyResults.length > 0 ? keyResults.map(kr => (
                        <div 
                            key={kr.id} 
                            onClick={(e) => { e.stopPropagation(); onToggleKR(kr.id); }}
                            className={`
                                flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                                ${kr.isCompleted 
                                    ? 'bg-[var(--bg-elevation-1)] border-transparent opacity-60' 
                                    : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-elevation-2)]'}
                            `}
                        >
                            {/* Custom Checkbox */}
                            <div className={`
                                w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0
                                ${kr.isCompleted 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-[var(--text-muted)] bg-transparent group-hover:border-[var(--accent-color)]'}
                            `}>
                                {kr.isCompleted && <CheckIcon className="w-3.5 h-3.5" />}
                            </div>
                            
                            <span className={`text-sm flex-1 ${kr.isCompleted ? 'text-[var(--text-muted)] line-through decoration-emerald-500/30' : 'text-[var(--text-primary)]'}`}>
                                {kr.title}
                            </span>
                        </div>
                    )) : (
                        <p className="text-sm text-[var(--text-muted)] italic py-2">Nenhuma meta definida ainda.</p>
                    )}
                </div>

                {/* Add New KR Form */}
                {isAddingKR ? (
                    <form onSubmit={handleNewKRSubmit} className="mt-4 flex gap-2 animate-fade-in">
                        <input 
                            autoFocus
                            value={newKR}
                            onChange={e => setNewKR(e.target.value)}
                            placeholder="Escreva uma nova meta..."
                            className="flex-1 bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                        />
                        <button type="submit" className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 rounded-lg text-xs font-bold transition-colors">Salvar</button>
                        <button type="button" onClick={() => setIsAddingKR(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2">Cancelar</button>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsAddingKR(true)}
                        className="mt-4 w-full py-2 border border-dashed border-[var(--border-color)] rounded-lg text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-3.5 h-3.5" /> Adicionar Meta
                    </button>
                )}
            </div>
        </div>
    );
}

export default ClientObjectivesView;
