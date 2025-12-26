
import React, { useState, useMemo } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useTheme } from '../../context/ThemeContext';
import CalendarTaskCard from './CalendarTaskCard';
import type { CalendarTask, CalendarTaskCategory } from '../../types';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

interface CalendarColumnProps {
    day: Date;
    isLast: boolean;
    onNewTask: (date: string) => void;
    onEditTask: (task: CalendarTask) => void;
    filterQuery: string;
    filterCategory: CalendarTaskCategory | 'ALL';
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ 
    day, 
    onNewTask, 
    onEditTask,
    filterQuery,
    filterCategory
}) => {
    const { getTasksForDate, moveOrReorderTask } = useCalendar();
    const { theme } = useTheme();
    const [isOver, setIsOver] = useState(false);
    
    const dateString = toYYYYMMDD(day);
    const allTasks = getTasksForDate(dateString);
    
    const filteredTasks = useMemo(() => {
        return allTasks.filter(task => {
            const matchesSearch = filterQuery === '' || 
                task.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(filterQuery.toLowerCase()));
            
            const matchesCategory = filterCategory === 'ALL' || task.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [allTasks, filterQuery, filterCategory]);

    const dayName = day.toLocaleString('pt-BR', { weekday: 'short' }).replace('.', '');
    const isToday = toYYYYMMDD(new Date()) === dateString;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            moveOrReorderTask(taskId, dateString, null);
        }
        setIsOver(false);
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                flex flex-col transition-all duration-300 min-h-[400px] relative group border-r border-[var(--border-color)] last:border-r-0
                ${isOver ? 'bg-[var(--accent-glow)]' : isWeekend && theme === 'light' ? 'bg-slate-100/50' : 'bg-[var(--bg-elevation-1)]'}
            `}
        >
            {/* Header */}
            <div className={`
                p-5 flex flex-col items-center border-b border-[var(--border-color)] relative transition-colors
                ${isToday ? 'bg-[var(--bg-card)]' : ''}
            `}>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-[var(--accent-color)]' : 'text-[var(--text-muted)]'}`}>
                    {dayName}
                </span>
                
                <div className={`
                    mt-2 w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all
                    ${isToday 
                        ? 'bg-[var(--accent-color)] text-white font-bold shadow-lg shadow-[var(--accent-glow)] scale-110' 
                        : 'text-[var(--text-primary)] font-light'
                    }
                `}>
                    {day.getDate()}
                </div>

                {/* Ghost Slot for Hover */}
                <button 
                    onClick={() => onNewTask(dateString)} 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--accent-color)] p-1 rounded-md hover:bg-[var(--bg-elevation-2)]"
                    title="Adicionar Tarefa"
                >
                    <PlusIcon />
                </button>
            </div>

            {/* Tasks Area */}
            <div className="flex-grow p-3 space-y-3 overflow-y-auto custom-scrollbar">
                {filteredTasks.map(task => (
                    <CalendarTaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
                ))}
                
                {/* Empty State Slot Preview (On Hover) */}
                {filteredTasks.length === 0 && (
                    <div 
                        onClick={() => onNewTask(dateString)}
                        className="h-20 border-2 border-dashed border-transparent group-hover:border-[var(--accent-color)]/20 group-hover:bg-[var(--accent-color)]/5 rounded-xl cursor-pointer transition-all flex items-center justify-center"
                    >
                        <PlusIcon className="opacity-0 group-hover:opacity-20 text-[var(--accent-color)]" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarColumn;
