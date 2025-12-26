
import React from 'react';
import type { Task, TaskPriority } from '../types';

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-yellow-500',
  BAIXA: 'bg-sky-500',
};

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const TaskCard: React.FC<{ task: Task, onEdit: () => void, onDelete: () => void }> = ({ task, onEdit, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'CONCLUIDO';
  const formattedDate = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null;
  
  const priorityColor = PRIORITY_COLORS[task.priority];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    // Optional: Customize drag image or effect
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onEdit}
      className="group relative bg-[var(--bg-elevation-2)] hover:bg-[var(--bg-card-hover)] p-3 rounded-lg border border-[var(--border-color)] hover:border-[var(--border-hover)] shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Priority Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityColor}`}></div>

      <div className="pl-3 flex flex-col gap-2">
          {/* Header */}
          <div className="flex justify-between items-start">
             <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-wide uppercase">{task.priority}</span>
             <button 
                onClick={handleDeleteClick}
                className="text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <h4 className="text-sm font-medium text-[var(--text-primary)] leading-snug">{task.title}</h4>
          
          {/* Footer Metadata */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]">
             {formattedDate ? (
                 <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-400 font-semibold' : 'text-[var(--text-muted)]'}`}>
                     <CalendarIcon className="w-3.5 h-3.5" />
                     <span>{formattedDate}</span>
                 </div>
             ) : (
                 <span></span>
             )}
             
             {task.assignee && (
                 <div className="w-5 h-5 rounded-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] flex items-center justify-center text-[9px] font-bold text-[var(--text-secondary)]" title={task.assignee}>
                     {task.assignee.substring(0,1)}
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default TaskCard;
