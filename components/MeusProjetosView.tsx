
import React, { useState, useMemo } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useTheme } from '../context/ThemeContext';
import type { ProjectGroup, Project } from '../types';
import ProjectModal from './ProjectModal';
import ProjectGroupModal from './ProjectGroupModal';
import ProjectCard from './ProjectCard';
import ProjectGroupCard from './ProjectGroupCard';

const PlusIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const HomeIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.12 0l8.955 8.955M3 10.5v.75a3 3 0 003 3h12a3 3 0 003-3v-.75M9 21v-6a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" />
    </svg>
);

const PinIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" />
    </svg>
);

const MeusProjetosView: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { projectGroups, projects, selectProject, togglePinProject, togglePinProjectGroup } = useTaskManager();
    const { theme } = useTheme();
    const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
    
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);

    const handleVisitProject = (projectId: string) => {
        selectProject(projectId);
        setActiveView('Tarefas');
    };

    const groupListContent = useMemo(() => {
        return {
            pinned: projectGroups.filter(g => g.isPinned),
            regular: projectGroups.filter(g => !g.isPinned)
        };
    }, [projectGroups]);

    const projectListContent = useMemo(() => {
        if (!selectedGroup) return { pinned: [], regular: [] };
        const filtered = projects.filter(p => p.groupId === selectedGroup.id);
        return {
            pinned: filtered.filter(p => p.isPinned),
            regular: filtered.filter(p => !p.isPinned)
        };
    }, [projects, selectedGroup]);

    // VIEW: Main Groups Grid
    if (!selectedGroup) {
        return (
            <div className={`h-full flex flex-col animate-fade-in-up ${theme === 'light' ? 'bg-slate-50 -m-10 p-10' : ''}`}>
                 <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 flex-shrink-0">
                    <div>
                        <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            Grupos de Projetos
                        </h1>
                        <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                            Seus ecossistemas de produção organizados por clusters estratégicos.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setIsProjectModalOpen(true)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white hover:border-[var(--accent-color)]'}`}>
                            <PlusIcon className="w-5 h-5" /> Novo Projeto
                        </button>
                        <button onClick={() => setIsGroupModalOpen(true)} className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-[var(--accent-glow)] flex items-center gap-3">
                            <PlusIcon className="w-5 h-5" /> Novo Grupo
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto pb-20 custom-scrollbar pr-4">
                    {/* Pinned Groups */}
                    {groupListContent.pinned.length > 0 && (
                        <div className="mb-12">
                             <div className="flex items-center gap-3 mb-6">
                                <PinIcon className="w-4 h-4 text-rose-500" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Grupos em Destaque</h2>
                                <div className="flex-grow h-px bg-[var(--border-color)] opacity-20"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {groupListContent.pinned.map(group => (
                                    <ProjectGroupCard 
                                        key={group.id} 
                                        group={group} 
                                        onSelect={() => setSelectedGroup(group)} 
                                        onEdit={() => { setEditingGroup(group); setIsGroupModalOpen(true); }}
                                        onTogglePin={() => togglePinProjectGroup(group.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Groups */}
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                            {groupListContent.pinned.length > 0 ? 'Demais Grupos' : 'Todos os Grupos'}
                        </h2>
                        <div className="flex-grow h-px bg-[var(--border-color)] opacity-20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {groupListContent.regular.map(group => (
                            <ProjectGroupCard 
                                key={group.id} 
                                group={group} 
                                onSelect={() => setSelectedGroup(group)} 
                                onEdit={() => { setEditingGroup(group); setIsGroupModalOpen(true); }}
                                onTogglePin={() => togglePinProjectGroup(group.id)}
                            />
                        ))}
                    </div>
                </div>

                {isGroupModalOpen && <ProjectGroupModal onClose={() => { setIsGroupModalOpen(false); setEditingGroup(null); }} group={editingGroup} />}
                {isProjectModalOpen && <ProjectModal onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }} project={editingProject} />}
            </div>
        );
    }

    // VIEW: Group Drill-down (Projects Grid)
    return (
        <div className={`h-full flex flex-col animate-fade-in-up ${theme === 'light' ? 'bg-slate-50 -m-10 p-10' : ''}`}>
            <header className="mb-10 pb-6 border-b border-[var(--border-color)] flex-shrink-0">
                <button onClick={() => setSelectedGroup(null)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rose-500 mb-4 hover:opacity-70 transition-opacity">
                    <HomeIcon className="w-4 h-4" /> Voltar para Grupos
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className={`text-4xl font-bold tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedGroup.name}</h1>
                        <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-secondary)]'} max-w-2xl`}>{selectedGroup.description}</p>
                    </div>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-3">
                        <PlusIcon className="w-5 h-5" /> Novo Projeto
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto pb-20 custom-scrollbar pr-4">
                {projectListContent.pinned.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <PinIcon className="w-4 h-4 text-rose-500" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Projetos Críticos</h2>
                            <div className="flex-grow h-px bg-[var(--border-color)] opacity-20"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {projectListContent.pinned.map(p => (
                                <ProjectCard key={p.id} project={p} onVisit={handleVisitProject} onEdit={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }} onTogglePin={() => togglePinProject(p.id)} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        {projectListContent.pinned.length > 0 ? 'Demais Projetos' : 'Todos os Projetos'}
                    </h2>
                    <div className="flex-grow h-px bg-[var(--border-color)] opacity-20"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projectListContent.regular.map(p => (
                        <ProjectCard key={p.id} project={p} onVisit={handleVisitProject} onEdit={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }} onTogglePin={() => togglePinProject(p.id)} />
                    ))}
                </div>
            </div>
            {isProjectModalOpen && <ProjectModal groupId={selectedGroup.id} onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }} project={editingProject} />}
        </div>
    );
};

export default MeusProjetosView;
