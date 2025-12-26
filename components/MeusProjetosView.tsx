
import React, { useState, useMemo } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useTheme } from '../context/ThemeContext';
import type { ProjectGroup, Project } from '../types';
import ProjectModal from './ProjectModal';
import ProjectGroupModal from './ProjectGroupModal';
import ProjectCard from './ProjectCard';
import ProjectGroupCard from './ProjectGroupCard';
import { Plus, ChevronLeft, FolderPlus, Pin, ShieldCheck } from 'lucide-react';

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
                 <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-[var(--border-color)] flex-shrink-0">
                    <div>
                        <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            Grupos de Projetos
                        </h1>
                        <p className={`text-base mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                            Clusters estratégicos para organização granular da sua operação.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsProjectModalOpen(true)} 
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white hover:border-[var(--accent-color)]'}`}
                        >
                            <Plus size={18} /> Novo Projeto
                        </button>
                        <button 
                            onClick={() => setIsGroupModalOpen(true)} 
                            className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-[var(--accent-glow)] flex items-center gap-3 transform active:scale-95"
                        >
                            <FolderPlus size={20} /> Novo Grupo
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                    {/* Pinned Groups */}
                    {groupListContent.pinned.length > 0 && (
                        <div className="mb-12">
                             <div className="flex items-center gap-4 mb-8">
                                <Pin className="w-4 h-4 text-rose-500" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Atalhos Críticos</h2>
                                <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
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
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
                            {groupListContent.pinned.length > 0 ? 'Demais Clusters' : 'Estrutura Geral'}
                        </h2>
                        <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-24">
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
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-[var(--border-color)] flex-shrink-0">
                <div className="flex flex-col gap-6">
                    <button 
                        onClick={() => setSelectedGroup(null)} 
                        className={`flex items-center gap-3 px-4 py-2 w-fit rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${theme === 'light' ? 'bg-white border border-slate-200 text-slate-400 hover:text-rose-600 shadow-sm' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                        <ChevronLeft size={16} strokeWidth={3} /> Explorar Grupos
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <ShieldCheck size={14} className="text-rose-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">GRUPO ATIVO</span>
                        </div>
                        <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedGroup.name}</h1>
                        <p className={`text-base mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-secondary)]'} max-w-3xl leading-relaxed`}>{selectedGroup.description}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsProjectModalOpen(true)} 
                    className="bg-[var(--accent-color)] text-white px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-[var(--accent-glow)] flex items-center gap-3 transition-all hover:brightness-110 active:scale-95"
                >
                    <Plus size={20} /> Novo Projeto
                </button>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                {projectListContent.pinned.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <Pin className="w-4 h-4 text-rose-500" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Projetos de Prioridade Máxima</h2>
                            <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {projectListContent.pinned.map(p => (
                                <ProjectCard key={p.id} project={p} onVisit={handleVisitProject} onEdit={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }} onTogglePin={() => togglePinProject(p.id)} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
                        {projectListContent.pinned.length > 0 ? 'Frentes Adicionais' : 'Todos os Projetos do Grupo'}
                    </h2>
                    <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-24">
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
