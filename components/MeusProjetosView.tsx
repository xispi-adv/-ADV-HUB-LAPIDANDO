
import React, { useState, useMemo } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useTheme } from '../context/ThemeContext';
import type { ProjectGroup, Project } from '../types';
import ProjectModal from './ProjectModal';
import ProjectGroupModal from './ProjectGroupModal';
import ProjectCard from './ProjectCard';
import ProjectGroupCard from './ProjectGroupCard';
import { Plus, ChevronLeft, FolderPlus, Pin, ShieldCheck, Search, X } from 'lucide-react';

const MeusProjetosView: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { projectGroups, projects, selectProject, togglePinProject, togglePinProjectGroup } = useTaskManager();
    const { theme } = useTheme();
    const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);

    const handleVisitProject = (projectId: string) => {
        selectProject(projectId);
        setActiveView('Tarefas');
    };

    // Filter Logic: Search in Group Name/Desc AND Project Name/Summary
    const filteredGroups = useMemo(() => {
        if (!searchQuery) return projectGroups;
        const query = searchQuery.toLowerCase();
        
        return projectGroups.filter(group => {
            const groupMatch = group.name.toLowerCase().includes(query) || 
                              group.description?.toLowerCase().includes(query);
            
            const projectMatch = projects.some(p => 
                p.groupId === group.id && (
                    p.name.toLowerCase().includes(query) || 
                    p.summary.toLowerCase().includes(query) ||
                    p.purpose.toLowerCase().includes(query)
                )
            );

            return groupMatch || projectMatch;
        });
    }, [projectGroups, projects, searchQuery]);

    const groupListContent = useMemo(() => {
        return {
            pinned: filteredGroups.filter(g => g.isPinned),
            regular: filteredGroups.filter(g => !g.isPinned)
        };
    }, [filteredGroups]);

    const projectListContent = useMemo(() => {
        if (!selectedGroup) return { pinned: [], regular: [] };
        const query = searchQuery.toLowerCase();
        
        const filtered = projects.filter(p => {
            const isFromGroup = p.groupId === selectedGroup.id;
            if (!isFromGroup) return false;
            if (!query) return true;
            
            return p.name.toLowerCase().includes(query) || 
                   p.summary.toLowerCase().includes(query) ||
                   p.purpose.toLowerCase().includes(query);
        });

        return {
            pinned: filtered.filter(p => p.isPinned),
            regular: filtered.filter(p => !p.isPinned)
        };
    }, [projects, selectedGroup, searchQuery]);

    // VIEW: Main Groups Grid
    if (!selectedGroup) {
        return (
            <div className="h-full flex flex-col animate-fade-in-up">
                 <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-[var(--border-color)] flex-shrink-0">
                    <div>
                        <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            Grupos de Projetos
                        </h1>
                        <p className={`text-base mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                            Clusters estratégicos para organização granular da sua operação.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all group-focus-within:scale-110 ${theme === 'light' ? 'text-slate-600' : 'text-white/30'}`}>
                                <Search size={18} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Pesquisar grupos ou projetos..."
                                className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm transition-all outline-none font-medium ${theme === 'light' ? 'bg-white border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400' : 'bg-[var(--bg-elevation-1)] border-white/10 focus:border-[var(--accent-color)] text-white placeholder-white/20'}`}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <button onClick={() => setIsProjectModalOpen(true)} className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border font-bold text-sm transition-all ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white hover:border-[var(--accent-color)]'}`}>
                                <Plus size={18} /> <span className="sm:hidden lg:inline">Novo Projeto</span>
                            </button>
                            <button onClick={() => setIsGroupModalOpen(true)} className="flex-1 sm:flex-none bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-[var(--accent-glow)] flex items-center justify-center gap-3">
                                <FolderPlus size={20} /> <span className="sm:hidden lg:inline">Novo Grupo</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
                    {filteredGroups.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 opacity-20 h-64 border-2 border-dashed border-[var(--border-color)] rounded-[3rem]">
                            <Search size={48} className="mb-4" />
                            <p className="text-xl font-bold uppercase tracking-widest text-center px-6">Nenhum resultado para "{searchQuery}"</p>
                        </div>
                    )}

                    {groupListContent.pinned.length > 0 && (
                        <div className="mb-12">
                             <div className="flex items-center gap-4 mb-8">
                                <Pin className="w-4 h-4 text-rose-500" />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Atalhos Críticos</h2>
                                <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {groupListContent.pinned.map(group => (
                                    <ProjectGroupCard key={group.id} group={group} onSelect={() => setSelectedGroup(group)} onEdit={() => { setEditingGroup(group); setIsGroupModalOpen(true); }} onTogglePin={() => togglePinProjectGroup(group.id)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {groupListContent.regular.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
                                    {groupListContent.pinned.length > 0 ? 'Demais Clusters' : 'Estrutura Geral'}
                                </h2>
                                <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {groupListContent.regular.map(group => (
                                    <ProjectGroupCard key={group.id} group={group} onSelect={() => setSelectedGroup(group)} onEdit={() => { setEditingGroup(group); setIsGroupModalOpen(true); }} onTogglePin={() => togglePinProjectGroup(group.id)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isGroupModalOpen && <ProjectGroupModal onClose={() => { setIsGroupModalOpen(false); setEditingGroup(null); }} group={editingGroup} />}
                {isProjectModalOpen && <ProjectModal onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }} project={editingProject} />}
            </div>
        );
    }

    // VIEW: Group Drill-down (Projects Grid)
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-[var(--border-color)] flex-shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={() => { setSelectedGroup(null); setSearchQuery(''); }} className={`p-3 transition-all rounded-2xl shadow-sm ${theme === 'light' ? 'bg-white text-slate-400 hover:text-rose-600 border border-slate-200' : 'bg-[var(--bg-elevation-2)] text-gray-500 hover:text-white border border-white/5'}`}>
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <ShieldCheck size={14} className="text-rose-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">GRUPO ATIVO</span>
                        </div>
                        <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedGroup.name}</h1>
                        <p className={`text-sm mt-1 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-secondary)]'} max-w-3xl leading-relaxed truncate`}>{selectedGroup.description}</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all group-focus-within:scale-110 ${theme === 'light' ? 'text-slate-600' : 'text-white/30'}`}>
                            <Search size={18} strokeWidth={2.5} />
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar projetos neste grupo..."
                            className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm transition-all outline-none font-medium ${theme === 'light' ? 'bg-white border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400' : 'bg-[var(--bg-elevation-1)] border-white/10 focus:border-[var(--accent-color)] text-white placeholder-white/20'}`}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button onClick={() => setIsProjectModalOpen(true)} className="w-full sm:w-auto bg-[var(--accent-color)] text-white px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-[var(--accent-glow)] flex items-center justify-center gap-3 transition-all">
                        <Plus size={20} /> Novo Projeto
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6">
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

                {(projectListContent.regular.length > 0 || projectListContent.pinned.length > 0) ? (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
                                {projectListContent.pinned.length > 0 ? 'Frentes Adicionais' : 'Todos os Projetos do Grupo'}
                            </h2>
                            <div className="flex-grow h-px bg-[var(--border-color)] opacity-10"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {projectListContent.regular.map(p => (
                                <ProjectCard key={p.id} project={p} onVisit={handleVisitProject} onEdit={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }} onTogglePin={() => togglePinProject(p.id)} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-[var(--border-color)] rounded-[3rem]">
                        <Search size={48} className="mb-4" />
                        <p className="text-xl font-bold uppercase tracking-widest">Nenhum projeto encontrado</p>
                    </div>
                )}
            </div>
            {isProjectModalOpen && <ProjectModal groupId={selectedGroup.id} onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }} project={editingProject} />}
        </div>
    );
};

export default MeusProjetosView;
