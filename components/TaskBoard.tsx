
import React from 'react';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { useTaskManager } from '../context/TaskManagerContext';

const STATUS_CONFIG: Record<TaskStatus, { label: string, color: string, border: string, bg: string }> = {
  A_FAZER: { label: 'A Fazer', color: 'text-zinc-400', border: 'border-zinc-500/50', bg: 'bg-zinc-500/5' },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-500/5' },
  CONCLUIDO: { label: 'Concluído', color: 'text-green-400', border: 'border-green-500/50', bg: 'bg-green-500/5' },
};

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

interface TaskColumnProps {
  status: TaskStatus;
  children: React.ReactNode;
  count: number;
  onNewTask: (status: TaskStatus) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, children, count, onNewTask }) => {
  const { updateTaskStatus } = useTaskManager();
  const [isOver, setIsOver] = React.useState(false);
  const config = STATUS_CONFIG[status];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
    setIsOver(false);
  };

  return (
    <div 
        className={`flex flex-col h-full rounded-2xl transition-all duration-300 border border-transparent ${isOver ? 'bg-[var(--bg-card-hover)] ring-2 ring-[var(--accent-color)]/50' : 'bg-[var(--bg-elevation-1)]'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
    >
        {/* Header */}
        <div className={`p-4 flex justify-between items-center border-b border-[var(--border-color)]`}>
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full border-2 ${config.border}`}></div>
                <h2 className={`text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)]`}>{config.label}</h2>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-card)] text-xs font-mono text-[var(--text-muted)] border border-[var(--border-color)]">{count}</span>
            </div>
            <button 
                onClick={() => onNewTask(status)} 
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)]"
                aria-label={`Adicionar tarefa em ${config.label}`}
            >
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>

        {/* Tasks Container */}
        <div className="flex-grow overflow-y-auto p-3 space-y-3 custom-scrollbar">
            {children}
            {children && React.Children.count(children) === 0 && (
                <div className="h-32 border-2 border-dashed border-[var(--border-color)] rounded-xl flex items-center justify-center text-[var(--text-muted)] text-sm">
                    Arraste itens aqui
                </div>
            )}
        </div>
    </div>
  );
};


interface TaskBoardProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onNewTask: (status: TaskStatus) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onEditTask, onNewTask }) => {
  const { deleteTask } = useTaskManager();
  const columns: TaskStatus[] = ['A_FAZER', 'EM_ANDAMENTO', 'CONCLUIDO'];

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Você tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
        deleteTask(task.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0 pb-4">
      {columns.map(status => {
          const columnTasks = tasks.filter(task => task.status === status);
          return (
            <TaskColumn 
                key={status} 
                status={status} 
                count={columnTasks.length}
                onNewTask={onNewTask}
            >
              {columnTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={() => onEditTask(task)} 
                    onDelete={() => handleDeleteTask(task)}
                  />
                ))
              }
            </TaskColumn>
          )
      })}
    </div>
  );
};

export default TaskBoard;
