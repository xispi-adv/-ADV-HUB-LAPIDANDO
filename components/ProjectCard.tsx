
import React from 'react';
import type { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

const PinIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" />
    </svg>
);

const EditIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

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
            group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 h-full border relative
            ${theme === 'light' 
                ? `bg-white border-slate-200 shadow-sm hover:shadow-2xl hover:border-rose-500/20 ${project.isPinned ? 'ring-2 ring-rose-500/10' : ''}` 
                : `bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-2xl ${project.isPinned ? 'ring-1 ring-rose-500/50' : ''}`
            }
        `}>
            <div className={`h-1.5 w-full transition-all ${isLate ? 'bg-rose-500' : 'bg-emerald-500'} ${project.isPinned ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}></div>
            
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div className="min-w-0">
                        <span className={`text-[9px] font-black tracking-widest uppercase mb-1 block ${theme === 'light' ? 'text-slate-400' : 'text-rose-500'}`}>Cliente</span>
                        <h3 className={`text-xl font-bold leading-tight truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{project.client}</h3>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                        className={`p-2 rounded-xl transition-all active:scale-90 ${project.isPinned ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-rose-500'}`}
                    >
                        <PinIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-8">
                    <h4 className={`text-2xl font-bold mb-3 tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-white/90'}`}>{project.name}</h4>
                    <p className={`text-xs leading-relaxed line-clamp-3 ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-secondary)]'}`}>{project.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
                    <div className={`p-4 rounded-3xl border transition-colors ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-1">Status</span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">Em Execução</span>
                    </div>
                    <div className={`p-4 rounded-3xl border transition-colors ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                        <span className="text-[9px] font-black uppercase text-[var(--text-muted)] block mb-1">Prazo</span>
                        <span className={`text-xs font-bold ${isLate ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                            {new Date(project.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)]">
                    <button onClick={() => onEdit(project)} className="p-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-500 hover:text-white transition-all">
                        <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onVisit(project.id)} className="flex-grow py-3 rounded-2xl bg-[var(--accent-color)] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg transition-all hover:brightness-110 active:scale-95">
                        Acessar Quadro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
