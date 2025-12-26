
import React, { useState, useEffect, useRef } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import type { Task, TaskStatus } from '../types';

// --- Icons ---
const ChevronDownIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const LayersIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);
const FolderIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="relative" ref={wrapperRef}>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 ml-1">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 min-w-[200px] justify-between
                    ${isOpen ? 'bg-[var(--bg-card)] border-[var(--accent-color)] text-[var(--text-primary)] shadow-[var(--shadow-card)]' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:border-[var(--text-muted)]'}
                `}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
                    <span className={`truncate ${selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDownIcon />
            </button>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-2 w-full min-w-[240px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.length > 0 ? (
                            options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group
                                        ${value === option.id ? 'bg-[var(--accent-glow)] text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevation-1)] hover:text-[var(--text-primary)]'}
                                    `}
                                >
                                    <span>{option.label}</span>
                                    {value === option.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></div>}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-xs text-[var(--text-muted)] text-center">Sem opções</div>
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);
    
    // Local state for filtering the Project Dropdown
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

    // Initialize: If a project is globally selected, ensure the Group Dropdown matches it
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
        // When group changes, reset project selection to prompt user, or select first available
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

    // Derived Data
    const filteredProjects = activeGroupId 
        ? projects.filter(p => p.groupId === activeGroupId)
        : [];

    const filteredTasks = tasks.filter(task => task.projectId === selectedProjectId);
    const selectedProjectData = projects.find(p => p.id === selectedProjectId);

    const groupOptions = projectGroups.map(g => ({ id: g.id, label: g.name }));
    const projectOptions = filteredProjects.map(p => ({ id: p.id, label: p.name }));

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Header Area - Fixed Height */}
            <header className="flex-shrink-0 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[var(--border-color)]">
                    
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-light text-[var(--text-primary)] tracking-tight">Gestão Ágil</h1>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Selecione o contexto para visualizar o quadro.</p>
                    </div>

                    {/* Selectors (The "Breadcrumb" Replacement) */}
                    <div className="flex flex-wrap items-end gap-4">
                        <DropdownSelect 
                            label="Grupo de Projetos"
                            placeholder="Selecione o Grupo"
                            options={groupOptions}
                            value={activeGroupId}
                            onChange={handleGroupChange}
                            icon={<LayersIcon />}
                        />

                        {/* Divider arrow */}
                        <div className="hidden md:flex pb-4 text-[var(--text-muted)] opacity-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </div>

                        <div className={`${!activeGroupId ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity`}>
                            <DropdownSelect 
                                label="Projeto Ativo"
                                placeholder={activeGroupId ? "Selecione o Projeto" : "..."}
                                options={projectOptions}
                                value={selectedProjectId}
                                onChange={handleProjectChange}
                                icon={<FolderIcon />}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area - Flex Grow */}
            <div className="flex-1 min-h-0 flex flex-col">
                {selectedProjectId && selectedProjectData ? (
                    <>
                         {/* Project Context Header (Optional, minimal) */}
                         <div className="flex items-center justify-between mb-4 flex-shrink-0 px-1">
                            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
                                BOARD: {selectedProjectData.name}
                            </span>
                             <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Online
                            </div>
                         </div>
                        
                        <TaskBoard 
                            tasks={filteredTasks} 
                            onEditTask={handleEditTask} 
                            onNewTask={handleNewTask} 
                        />
                    </>
                ) : (
                    // Empty State
                    <div className="flex-grow flex flex-col items-center justify-center bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-color)] rounded-2xl animate-fade-in">
                        <div className="w-16 h-16 bg-[var(--bg-elevation-1)] rounded-full flex items-center justify-center mb-4 text-[var(--text-muted)]">
                            <FolderIcon />
                        </div>
                        <h3 className="text-xl font-light text-[var(--text-primary)] mb-2">Nenhum Projeto Selecionado</h3>
                        <p className="text-[var(--text-muted)] text-center max-w-md">
                            Utilize os seletores acima para escolher um Grupo e um Projeto para carregar o quadro de tarefas.
                        </p>
                    </div>
                )}
            </div>

             {isModalOpen && <TaskModal task={editingTask} status={newTaskStatus ? newTaskStatus : undefined} onClose={closeModal} />}
        </div>
    );
}

export default TarefasView;
