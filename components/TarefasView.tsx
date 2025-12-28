
import React, { useState, useEffect, useRef } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useTheme } from '../context/ThemeContext';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import type { Task, TaskStatus } from '../types';

// --- Icons ---
const ChevronDownIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const LayersIcon: React.FC = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);
const FolderIcon: React.FC = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

// --- Components ---

interface DropdownOption {
    id: string;
    label: string;
}

interface DropdownProps {
    label: string;
    value: string | null;
    options: DropdownOption[];
    onChange: (id: string) => void;
    placeholder: string;
    icon?: React.ReactNode;
}

const DropdownSelect: React.FC<DropdownProps> = ({ label, value, options, onChange, placeholder, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative w-full sm:w-auto" ref={wrapperRef}>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2 ml-1 opacity-60">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 w-full sm:min-w-[220px] justify-between
                    ${isOpen 
                        ? 'bg-[var(--bg-card)] border-[var(--accent-color)] text-[var(--text-primary)] shadow-2xl' 
                        : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--text-muted)]'}
                `}
            >
                <div className="flex items-center gap-3 truncate">
                    {icon && <span className="text-[var(--text-muted)] opacity-50">{icon}</span>}
                    <span className={`truncate text-sm font-bold tracking-tight ${selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDownIcon />
            </button>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-3 w-full min-w-[260px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-xl">
                    <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                        {options.length > 0 ? (
                            options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group mb-1 last:mb-0
                                        ${value === option.id 
                                            ? 'bg-[var(--accent-color)] text-white' 
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevation-1)] hover:text-[var(--text-primary)]'}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {value === option.id && <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-xs text-[var(--text-muted)] text-center font-medium italic">Nenhum registro encontrado</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main View ---

const TarefasView: React.FC = () => {
    const { tasks, selectedProjectId, projects, projectGroups, selectProject } = useTaskManager();
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);
    
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedProjectId) {
            const project = projects.find(p => p.id === selectedProjectId);
            if (project) {
                setActiveGroupId(project.groupId);
            }
        }
    }, [selectedProjectId, projects]);

    const handleGroupChange = (groupId: string) => {
        setActiveGroupId(groupId);
        selectProject(''); 
    };

    const handleProjectChange = (projectId: string) => {
        selectProject(projectId);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setNewTaskStatus(null);
        setIsModalOpen(true);
    };

    const handleNewTask = (status: TaskStatus) => {
        setEditingTask(null);
        setNewTaskStatus(status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setNewTaskStatus(null);
    };

    const filteredProjects = activeGroupId 
        ? projects.filter(p => p.groupId === activeGroupId)
        : [];

    const filteredTasks = tasks.filter(task => task.projectId === selectedProjectId);
    const selectedProjectData = projects.find(p => p.id === selectedProjectId);

    const groupOptions = projectGroups.map(g => ({ id: g.id, label: g.name }));
    const projectOptions = filteredProjects.map(p => ({ id: p.id, label: p.name }));

    return (
        <div className="h-full flex flex-col animate-fade-in-up px-2 md:px-0">
            <header className="flex-shrink-0 mb-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-8 border-b border-[var(--border-color)]">
                    
                    <div className="max-w-2xl">
                        <h1 className={`text-4xl lg:text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            Gestão Ágil
                        </h1>
                        <p className={`text-sm lg:text-base mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                            Selecione o contexto estratégico para orquestrar as frentes de trabalho.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
                        <DropdownSelect 
                            label="Squad / Grupo"
                            placeholder="Selecione o Grupo"
                            options={groupOptions}
                            value={activeGroupId}
                            onChange={handleGroupChange}
                            icon={<LayersIcon />}
                        />

                        <div className="hidden sm:flex self-end mb-4 text-[var(--text-muted)] opacity-30">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>

                        <div className={`w-full sm:w-auto transition-all duration-500 ${!activeGroupId ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100 scale-100'}`}>
                            <DropdownSelect 
                                label="Projeto Ativo"
                                placeholder={activeGroupId ? "Selecione o Projeto" : "Aguardando grupo..."}
                                options={projectOptions}
                                value={selectedProjectId}
                                onChange={handleProjectChange}
                                icon={<FolderIcon />}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0 flex flex-col">
                {selectedProjectId && selectedProjectData ? (
                    <>
                         <div className="flex items-center justify-between mb-6 flex-shrink-0 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]"></div>
                                <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.4em]">
                                    BOARD ATIVO: {selectedProjectData.name}
                                </span>
                            </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Sincronizado
                            </div>
                         </div>
                        
                        <TaskBoard 
                            tasks={filteredTasks} 
                            onEditTask={handleEditTask} 
                            onNewTask={handleNewTask} 
                        />
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center bg-black/5 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] animate-fade-in opacity-80">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-[var(--border-color)] ${theme === 'light' ? 'bg-white shadow-xl' : 'bg-[var(--bg-elevation-1)]'}`}>
                            <FolderIcon className="text-[var(--text-muted)] w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-light text-[var(--text-primary)] mb-2 tracking-tight">Nenhum Contexto Selecionado</h3>
                        <p className="text-[var(--text-secondary)] text-center max-w-sm text-sm leading-relaxed">
                            Utilize os seletores acima para carregar o workflow e as prioridades do squad.
                        </p>
                    </div>
                )}
            </div>

             {isModalOpen && <TaskModal task={editingTask} status={newTaskStatus ? newTaskStatus : undefined} onClose={closeModal} />}
        </div>
    );
}

export default TarefasView;
