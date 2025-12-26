
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Project, Task, TaskStatus, TaskPriority, ProjectGroup } from '../types';

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const MOCK_PROJECT_GROUPS: ProjectGroup[] = [
    { id: 'group-nubank', name: 'Campanhas Nubank', description: 'Performance e branding premium.', clientId: 'cli-1', isPinned: true },
    { id: 'group-mcd', name: 'Social McDonald\'s', description: 'Comunidade e sazonais.', clientId: 'cli-2' },
    { id: 'group-internal', name: 'Operação Interna', description: 'Desenvolvimento e cultura AdVerge.' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 'proj-1', groupId: 'group-nubank', name: 'Ultravioleta Q4', purpose: 'Adesão premium.', focus: 'Performance', client: 'Nubank', summary: 'Lançamento do novo benefício de cashback.', deadline: '2024-12-20', isPinned: true },
  { id: 'proj-2', groupId: 'group-internal', name: 'Nexus v2', purpose: 'Evolução do HUB.', focus: 'Engenharia', client: 'AdVerge', summary: 'Nova engine de sincronização contábil.', deadline: '2024-11-15' },
];

interface TaskManagerContextState {
  projectGroups: ProjectGroup[];
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string | null;
  selectProject: (projectId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addProjectGroup: (groupData: Omit<ProjectGroup, 'id'>) => void;
  updateProjectGroup: (groupId: string, groupData: Partial<Omit<ProjectGroup, 'id'>>) => void;
  addProject: (projectData: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, projectData: Partial<Omit<Project, 'id' | 'groupId'>>) => void;
  addTask: (taskData: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, taskData: Partial<Omit<Task, 'id' | 'projectId'>>) => void;
  deleteTask: (taskId: string) => void;
  togglePinProject: (projectId: string) => void;
  togglePinProjectGroup: (groupId: string) => void;
}

const TaskManagerContext = createContext<TaskManagerContextState | undefined>(undefined);

export const TaskManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>(MOCK_PROJECT_GROUPS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectProject = (id: string) => setSelectedProjectId(id);

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addProjectGroup = (data: Omit<ProjectGroup, 'id'>) => {
    setProjectGroups(prev => [...prev, { ...data, id: generateId(), isPinned: false }]);
  };

  const updateProjectGroup = (id: string, data: Partial<ProjectGroup>) => {
    setProjectGroups(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const addProject = (data: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...data, id: generateId(), isPinned: false }]);
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const togglePinProject = useCallback((id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
  }, []);

  const togglePinProjectGroup = useCallback((id: string) => {
    setProjectGroups(prev => prev.map(g => g.id === id ? { ...g, isPinned: !g.isPinned } : g));
  }, []);

  const addTask = (data: Omit<Task, 'id'>) => setTasks(prev => [...prev, { ...data, id: generateId() }]);
  const updateTask = (id: string, data: Partial<Task>) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <TaskManagerContext.Provider value={{ 
        projectGroups, projects, tasks, selectedProjectId, selectProject, updateTaskStatus,
        addProjectGroup, updateProjectGroup, addProject, updateProject, addTask, updateTask, deleteTask, togglePinProject, togglePinProjectGroup
    }}>
      {children}
    </TaskManagerContext.Provider>
  );
};

export const useTaskManager = () => {
  const context = useContext(TaskManagerContext);
  if (!context) throw new Error('useTaskManager must be used within TaskManagerProvider');
  return context;
};
