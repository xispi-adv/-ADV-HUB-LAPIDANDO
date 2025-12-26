
import React from 'react';
import type { ProjectGroup } from '../types';
import { useTaskManager } from '../context/TaskManagerContext';
import { useClients } from '../context/ClientContext';
import { useTheme } from '../context/ThemeContext';
import { Folder, ArrowRight, Edit3, Pin } from 'lucide-react';

interface ProjectGroupCardProps {
    group: ProjectGroup;
    onSelect: () => void;
    onEdit: () => void;
    onTogglePin: () => void;
}

const ProjectGroupCard: React.FC<ProjectGroupCardProps> = ({ group, onSelect, onEdit, onTogglePin }) => {
    const { projects } = useTaskManager();
    const { getClientById } = useClients();
    const { theme } = useTheme();
    
    const projectCount = projects.filter(p => p.groupId === group.id).length;
    const client = group.clientId ? getClientById(group.clientId) : null;

    return (
        <div className="relative group">
            <div 
                className={`
                    relative z-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-8 
                    transition-all duration-500 ease-out cursor-pointer h-full flex flex-col
                    hover:-translate-y-1.5 hover:shadow-2xl
                    ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'hover:border-[var(--accent-color)]'}
                    ${group.isPinned ? 'ring-1 ring-rose-500/20' : ''}
                `}
            >
                <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600' : 'bg-white/5 border-white/5 text-gray-500 group-hover:bg-rose-500/10 group-hover:text-rose-500'}`}>
                        <Folder className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className={`text-[12px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-elevation-1)] ${theme === 'light' ? 'text-slate-600' : 'text-[var(--text-muted)]'}`}>
                            {projectCount} {projectCount === 1 ? 'Projeto' : 'Projetos'}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                            className={`p-2 rounded-lg transition-all active:scale-90 ${group.isPinned ? 'bg-rose-500 text-white' : 'text-[var(--text-muted)] hover:text-rose-500'}`}
                        >
                            <Pin className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div onClick={onSelect} className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        {client && (
                            <span className="text-[11px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                                {client.name}
                            </span>
                        )}
                        <span className={`text-[11px] font-bold ${theme === 'light' ? 'text-slate-300' : 'text-white/10'} uppercase tracking-[0.2em]`}>CLUSTER</span>
                    </div>
                    <h3 className={`text-2xl font-bold tracking-tight mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-[var(--accent-color)] transition-colors line-clamp-1`}>
                        {group.name}
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-2 ${theme === 'light' ? 'text-slate-600' : 'text-[var(--text-secondary)]'}`}>
                        {group.description || 'Nenhuma descrição estratégica definida.'}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-wider transition-all ${theme === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar</span>
                    </button>

                    <button 
                        onClick={onSelect}
                        className="flex items-center gap-2 text-[var(--accent-color)] font-black text-[12px] uppercase tracking-[0.2em] transition-all hover:translate-x-1"
                    >
                        <span>Explorar</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectGroupCard;
