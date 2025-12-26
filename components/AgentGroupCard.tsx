
import React from 'react';
import type { AgentGroup } from '../types';
import { useAgents } from '../context/AgentContext';
import { useTheme } from '../context/ThemeContext';
import { Boxes, ChevronRight } from 'lucide-react';

interface AgentGroupCardProps {
    group: AgentGroup;
    onSelect: () => void;
}

const AgentGroupCard: React.FC<AgentGroupCardProps> = ({ group, onSelect }) => {
    const { agents } = useAgents();
    const { theme } = useTheme();
    const agentCount = agents.filter(a => a.groupId === group.id).length;

    return (
        <div 
            onClick={onSelect}
            className={`
                group relative flex flex-col rounded-[2rem] transition-all duration-500 cursor-pointer border animate-fade-in-up
                ${theme === 'light' 
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-rose-500/20' 
                    : 'bg-[#1A1B23] border-white/5 hover:border-rose-500/30 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black'
                }
            `}
        >
            {/* Gradient Edge Hint */}
            <div className={`absolute top-6 left-0 w-1 h-10 rounded-r-full bg-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>

            <div className="p-6 flex flex-col h-full relative z-10">
                {/* Header: Command Icon + Pill */}
                <div className="flex items-start justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-lg ${theme === 'light' ? 'bg-rose-50 text-rose-600 shadow-rose-200/50' : 'bg-rose-500/10 text-rose-500 shadow-rose-900/20'}`}>
                        <Boxes size={24} strokeWidth={1.5} />
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-600' : 'bg-white/5 border-white/5 text-gray-400 group-hover:text-rose-400'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        <span>{agentCount} {agentCount === 1 ? 'Agente' : 'Agentes'}</span>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-grow">
                    <h3 className={`text-xl font-bold tracking-tight mb-2 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-rose-400`}>
                        {group.name}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                        {group.description}
                    </p>
                </div>
                
                {/* Visual Action Indicator */}
                <div className={`mt-6 pt-5 border-t flex items-center justify-between transition-colors ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme === 'light' ? 'text-slate-400 group-hover:text-rose-600' : 'text-gray-500 group-hover:text-rose-500'}`}>
                        Gestão de Squad
                    </span>
                    <div className={`p-1.5 rounded-lg transition-all duration-300 transform group-hover:translate-x-1 ${theme === 'light' ? 'bg-slate-50 text-slate-400 group-hover:bg-rose-600 group-hover:text-white' : 'bg-white/5 text-gray-500 group-hover:bg-rose-600 group-hover:text-white'}`}>
                        <ChevronRight size={14} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentGroupCard;
