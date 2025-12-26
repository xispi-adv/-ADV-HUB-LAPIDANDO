
import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useTheme } from '../../context/ThemeContext';
import type { CalendarTask, CalendarTaskCategory } from '../../types';

const CATEGORY_CONFIG: Record<CalendarTaskCategory, { color: string; label: string }> = {
    CAMPANHA: { color: '#a855f7', label: 'Campanha' }, // Purple
    SOCIAL_MEDIA: { color: '#ec4899', label: 'Social' }, // Pink
    CONTEUDO: { color: '#22c55e', label: 'Conteúdo' }, // Green
    EMAIL: { color: '#3b82f6', label: 'E-mail' }, // Blue
    SEO: { color: '#14b8a6', label: 'SEO' }, // Teal
    ADS: { color: '#f97316', label: 'Ads' }, // Orange
    REUNIAO: { color: '#6366f1', label: 'Reunião' }, // Indigo
    OUTRO: { color: '#71717a', label: 'Geral' }, // Zinc
};

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const CalendarTaskCard: React.FC<{ task: CalendarTask; onEdit: () => void }> = ({ task, onEdit }) => {
    const { moveOrReorderTask } = useCalendar();
    const { theme } = useTheme();
    const [isDragOver, setIsDragOver] = useState(false);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedTaskId = e.dataTransfer.getData('taskId');
        if (draggedTaskId && draggedTaskId !== task.id) {
            moveOrReorderTask(draggedTaskId, task.dueDate, task.id);
        }
        setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };
    
    const [isOver, setIsOver] = useState(false);

    const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.OUTRO;
    const isCompleted = task.status === 'CONCLUIDO';
    const isUrgent = task.priority === 'URGENTE';

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsOver(false)}
            onClick={onEdit}
            className={`
                relative group rounded-xl p-3 cursor-pointer transition-all duration-300
                border flex flex-col gap-2 overflow-hidden
                ${theme === 'light' 
                    ? 'bg-white border-slate-200 shadow-sm ring-1 ring-black/[0.03] hover:shadow-md hover:border-[var(--accent-color)]/30' 
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:bg-[var(--bg-elevation-2)] shadow-lg'
                }
                ${isOver ? 'border-t-4 border-t-[var(--accent-color)]' : ''}
                ${isCompleted ? 'opacity-50 grayscale-[0.5]' : ''}
                hover:-translate-y-0.5
            `}
        >
            {/* Category Indicator Strip */}
            <div 
                className="absolute top-0 bottom-0 left-0 w-1.5" 
                style={{ backgroundColor: config.color }}
            ></div>

            <div className="pl-2 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-opacity-10" style={{ color: config.color, backgroundColor: `${config.color}20` }}>
                        {config.label}
                    </span>
                    {isCompleted && (
                        <div className="bg-emerald-500/20 p-0.5 rounded-full text-emerald-500">
                            <CheckIcon />
                        </div>
                    )}
                </div>

                <p className={`text-sm font-bold leading-snug tracking-tight ${theme === 'light' ? 'text-slate-800' : 'text-white'} ${isCompleted ? 'line-through' : ''}`}>
                    {task.title}
                </p>

                <div className="flex items-center justify-between mt-1">
                    <span className={`text-[10px] font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                        09:00 AM
                    </span>
                    {task.assignedTo && (
                        <div className="w-5 h-5 rounded-full bg-[var(--bg-elevation-1)] text-[var(--text-secondary)] text-[9px] flex items-center justify-center font-bold border border-[var(--border-color)] shadow-sm">
                            {task.assignedTo.charAt(0)}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Urgent Glow */}
            {isUrgent && !isCompleted && (
                <div className="absolute top-0 right-0 w-8 h-8 -mr-4 -mt-4 bg-red-500/10 blur-xl animate-pulse"></div>
            )}
        </div>
    );
};

export default CalendarTaskCard;
