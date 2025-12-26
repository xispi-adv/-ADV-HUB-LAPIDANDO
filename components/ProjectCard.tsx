
import React from 'react';
import type { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Pin, Edit2, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onVisit: (projectId: string) => void;
    onEdit: (project: Project) => void;
    onTogglePin: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onVisit, onEdit, onTogglePin }) => {
    const { theme } = useTheme();
    const isLate = new Date(project.deadline) < new Date();
    
    return (
        <div className={`
            group flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 h-full border relative
            ${theme === 'light' 
                ? `bg-white border-slate-200 shadow-sm hover:shadow-2xl hover:border-rose-500/20 ${project.isPinned ? 'ring-1 ring-rose-500/10' : ''}` 
                : `bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-2xl ${project.isPinned ? 'ring-1 ring-rose-500/30' : ''}`
            }
        `}>
            <div className={`h-1.5 w-full transition-all ${isLate ? 'bg-rose-500' : 'bg-emerald-500'} ${project.isPinned ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}></div>
            
            <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="min-w-0">
                        <span className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1 block ${theme === 'light' ? 'text-slate-400' : 'text-rose-500'}`}>Cliente</span>
                        <h3 className={`text-xl font-bold leading-tight truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{project.client}</h3>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                        className={`p-2 rounded-lg transition-all active:scale-90 ${project.isPinned ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 text-slate-300 hover:text-rose-500'}`}
                    >
                        <Pin className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-grow">
                    <h4 className={`text-2xl font-bold mb-3 tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-white/90'}`}>{project.name}</h4>
                    <p className={`text-sm leading-relaxed line-clamp-2 ${theme === 'light' ? 'text-slate-600' : 'text-[var(--text-secondary)]'}`}>{project.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-8">
                    <div className={`p-4 rounded-2xl border transition-colors ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block mb-1 tracking-wider">Status</span>
                        <span className="text-[13px] font-bold text-[var(--text-primary)]">Em Execução</span>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-colors ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block mb-1 tracking-wider">Prazo</span>
                        <span className={`text-[13px] font-bold ${isLate ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                            {new Date(project.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)]">
                    <button onClick={() => onEdit(project)} className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onVisit(project.id)} 
                        className="flex-grow py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-bold text-[12px] uppercase tracking-[0.2em] shadow-lg transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span>Abrir Quadro</span>
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
