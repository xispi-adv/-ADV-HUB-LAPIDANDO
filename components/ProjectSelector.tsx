
import React, { useState, useRef, useEffect } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';

const ChevronDownIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface ProjectSelectorProps {
    groupId?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ groupId }) => {
    const { projects, selectedProjectId, selectProject } = useTaskManager();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Filter projects if groupId is provided, otherwise show all
    const filteredProjects = groupId 
        ? projects.filter(p => p.groupId === groupId) 
        : projects;

    const selectedProject = projects.find(p => p.id === selectedProjectId);

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
    
    const handleSelect = (projectId: string) => {
        selectProject(projectId);
        setIsOpen(false);
    }

    return (
        <div className="relative w-full md:w-72" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white transition-all backdrop-blur-sm"
            >
                <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Projeto Atual</span>
                    <span className="font-medium truncate w-full text-left">{selectedProject ? selectedProject.name : 'Selecione um Projeto'}</span>
                </div>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="absolute z-20 top-full mt-2 w-full bg-[#0F0F11] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-fade-in">
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(project => (
                                <li key={project.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleSelect(project.id);
                                        }}
                                        className={`block px-4 py-3 text-sm border-l-2 transition-colors duration-200 ${selectedProjectId === project.id ? 'bg-white/5 border-red-500 text-white' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {project.name}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-xs text-white/40">Nenhum projeto encontrado neste grupo.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProjectSelector;
