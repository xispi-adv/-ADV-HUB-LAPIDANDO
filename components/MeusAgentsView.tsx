
import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import AgentGroupCard from './AgentGroupCard';
import ChatView from './ChatView';
import CreateAgentModal from './CreateAgentModal';
import CreateAgentGroupModal from './CreateAgentGroupModal';
import { useAgents } from '../context/AgentContext';
import { useTheme } from '../context/ThemeContext';
import type { AgentCardData, AgentGroup } from '../types';
import { Plus, ChevronLeft, UserPlus, Users, ShieldCheck } from 'lucide-react';

interface MeusAgentsViewProps {
    initialAgentId?: string;
    initialGroupId?: string;
}

const MeusAgentsView: React.FC<MeusAgentsViewProps> = ({ initialAgentId, initialGroupId }) => {
    const { agents, groups } = useAgents();
    const { theme } = useTheme();
    const [selectedGroup, setSelectedGroup] = useState<AgentGroup | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<AgentCardData | null>(null);
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    useEffect(() => {
        if (initialAgentId) {
            const agent = agents.find(a => a.id === initialAgentId);
            if (agent) setSelectedAgent(agent);
        }
    }, [initialAgentId, agents]);

    useEffect(() => {
        if (initialGroupId) {
            const group = groups.find(g => g.id === initialGroupId);
            if (group) setSelectedGroup(group);
        }
    }, [initialGroupId, groups]);

    if (selectedAgent) {
        return <ChatView agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
    }

    // View inside a specific squad
    if (selectedGroup) {
        const groupAgents = agents.filter(a => a.groupId === selectedGroup.id);

        return (
            <div className={`animate-fade-in-up h-full flex flex-col ${theme === 'light' ? 'bg-slate-50 -m-10 p-10' : ''}`}>
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-shrink-0">
                    <div className="flex items-center gap-6">
                         <button 
                            onClick={() => setSelectedGroup(null)} 
                            className={`p-3 transition-all rounded-2xl shadow-sm ${theme === 'light' ? 'bg-white text-slate-400 hover:text-rose-600 border border-slate-200' : 'bg-[var(--bg-elevation-2)] text-gray-500 hover:text-white border border-white/5'}`}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck size={14} className="text-rose-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">SQUAD OPERACIONAL</span>
                            </div>
                            <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedGroup.name}</h1>
                            <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                                {groupAgents.length} especialistas prontos para execução de alta performance.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCreateAgentModalOpen(true)}
                        className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-2xl hover:bg-[var(--accent-hover)] transition-all flex items-center gap-3 shadow-xl shadow-[var(--accent-glow)] transform active:scale-95"
                    >
                        <UserPlus size={20} />
                        <span className="font-bold uppercase tracking-widest text-sm">Recrutar Agente</span>
                    </button>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        <button 
                            onClick={() => setIsCreateAgentModalOpen(true)}
                            className={`
                                group relative h-full min-h-[220px] rounded-[2rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-6 cursor-pointer
                                ${theme === 'light' 
                                    ? 'border-slate-200 bg-white/50 hover:border-rose-400 hover:bg-white hover:shadow-xl' 
                                    : 'border-white/10 bg-white/5 hover:border-rose-500/50 hover:bg-white/10'
                                }
                            `}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-90 ${theme === 'light' ? 'bg-slate-100 text-slate-400 group-hover:bg-rose-600 group-hover:text-white' : 'bg-white/5 text-gray-500 group-hover:bg-rose-600 group-hover:text-white'}`}>
                                <Plus size={24} />
                            </div>
                            <h3 className={`text-base font-bold mb-1 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Slot Disponível</h3>
                            <p className={`text-center text-[10px] px-4 font-medium leading-relaxed ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>
                                Adicione um novo especialista para este squad.
                            </p>
                        </button>

                        {groupAgents.map((agent) => (
                            <AgentCard 
                                key={agent.id} 
                                {...agent} 
                                onSelect={() => setSelectedAgent(agent)} 
                            />
                        ))}
                     </div>
                </div>

                 {isCreateAgentModalOpen && (
                    <CreateAgentModal groupId={selectedGroup.id} onClose={() => setIsCreateAgentModalOpen(false)} />
                )}
            </div>
        );
    }

    // Main Teams Grid
    return (
        <div className={`animate-fade-in-up h-full flex flex-col ${theme === 'light' ? 'bg-slate-50 -m-10 p-10' : ''}`}>
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-shrink-0">
                <div>
                    <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        Minhas Equipes de IA
                    </h1>
                    <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                        Orquestre seus squads de inteligência especializada e escale sua operação.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsCreateAgentModalOpen(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white hover:border-[var(--accent-color)]'}`}
                    >
                        <UserPlus size={18} /> Novo Agente
                    </button>
                    <button 
                        onClick={() => setIsCreateGroupModalOpen(true)}
                        className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-2xl hover:bg-[var(--accent-hover)] transition-all flex items-center gap-3 shadow-xl shadow-[var(--accent-glow)] transform active:scale-95"
                    >
                        <Users size={20} />
                        <span className="font-bold uppercase tracking-widest text-sm">Nova Equipe</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <AgentGroupCard 
                            key={group.id} 
                            group={group} 
                            onSelect={() => setSelectedGroup(group)} 
                        />
                    ))}
                </div>
            </div>

            {isCreateGroupModalOpen && (
                <CreateAgentGroupModal onClose={() => setIsCreateGroupModalOpen(false)} />
            )}
            
            {isCreateAgentModalOpen && (
                <CreateAgentModal onClose={() => setIsCreateAgentModalOpen(false)} />
            )}
        </div>
    );
};

export default MeusAgentsView;
