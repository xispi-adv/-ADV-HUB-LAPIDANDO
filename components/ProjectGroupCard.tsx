
import React from 'react';
import type { ProjectGroup } from '../types';
import { useTaskManager } from '../context/TaskManagerContext';
import { useClients } from '../context/ClientContext';
import { useTheme } from '../context/ThemeContext';

const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const PinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" />
    </svg>
);

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
        <div className="relative group perspective-1000">
            {/* Main Card Container - No overflow-hidden here to allow scale/shadow to breathe */}
            <div 
                className={`
                    relative z-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-8 
                    transition-all duration-500 ease-out cursor-pointer
                    hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                    ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'hover:border-[var(--accent-color)]'}
                    ${group.isPinned ? 'ring-2 ring-rose-500/20' : ''}
                `}
            >
                {/* Visual Accent - Background Decorative Circle */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:opacity-15 pointer-events-none"></div>

                <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-[var(--bg-elevation-1)] rounded-2xl border border-[var(--border-color)] group-hover:border-[var(--accent-color)]/30 group-hover:bg-[var(--accent-color)]/5 transition-all duration-300">
                        <FolderIcon className={`w-8 h-8 ${theme === 'light' ? 'text-slate-400' : 'text-[var(--text-secondary)]'} group-hover:text-[var(--accent-color)] transition-colors`} />
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                            className={`p-2 rounded-xl transition-all active:scale-90 shadow-sm ${group.isPinned ? 'bg-rose-500 text-white' : 'bg-[var(--bg-elevation-1)] text-[var(--text-muted)] hover:text-rose-500'}`}
                        >
                            <PinIcon className="w-4 h-4" />
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-elevation-1)] ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                            {projectCount} {projectCount === 1 ? 'Projeto' : 'Projetos'}
                        </span>
                    </div>
                </div>

                <div onClick={onSelect} className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        {client && (
                            <span className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-sm border border-blue-500/10 uppercase tracking-widest">
                                {client.name}
                            </span>
                        )}
                        <span className={`text-[9px] font-bold ${theme === 'light' ? 'text-slate-300' : 'text-white/10'} uppercase tracking-[0.2em]`}>CLUSTER</span>
                    </div>
                    <h3 className={`text-2xl font-bold tracking-tight mb-3 ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-[var(--accent-color)] transition-colors line-clamp-1`}>
                        {group.name}
                    </h3>
                    <p className={`text-sm leading-relaxed line-clamp-2 ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-secondary)]'}`}>
                        {group.description || 'Nenhuma descrição técnica definida para este cluster.'}
                    </p>
                </div>

                <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all px-4 py-2 rounded-xl ${theme === 'light' ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-50' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'}`}
                    >
                        <EditIcon className="w-4 h-4" />
                        <span>Editar</span>
                    </button>

                    <button 
                        onClick={onSelect}
                        className="flex items-center gap-2 text-[var(--accent-color)] font-black text-xs uppercase tracking-[0.2em] transition-all hover:translate-x-1 group-hover:text-[var(--accent-hover)]"
                    >
                        <span>Explorar</span>
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            {/* Underlay Shadow - Enhances the hover effect without clipping */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-black/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none -z-10 translate-y-4"></div>
        </div>
    );
};

export default ProjectGroupCard;
