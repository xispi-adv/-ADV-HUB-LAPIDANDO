
import React, { useMemo, useCallback } from 'react';
import WidgetCard from './shared/WidgetCard';
import { useTaskManager } from '../../context/TaskManagerContext';
import type { Task } from '../../types';

const InfoIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg> );

const TaskOverviewWidget: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { tasks, updateTaskStatus } = useTaskManager();

    const handleToggleComplete = useCallback((e: React.MouseEvent, taskId: string, currentStatus: Task['status']) => {
        e.stopPropagation();
        const newStatus = currentStatus === 'CONCLUIDO' ? 'EM_ANDAMENTO' : 'CONCLUIDO';
        updateTaskStatus(taskId, newStatus);
    }, [updateTaskStatus]);

    const { todayTasks, overdueTasks, completedTodayCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = new Date().toISOString().split('T')[0];
        
        const overdue: Task[] = [];
        let todayActive: Task[] = [];
        let completedToday = 0;

        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate + 'T00:00:00');
            if (task.dueDate === todayString) {
                if(task.status === 'CONCLUIDO') completedToday++;
                else todayActive.push(task);
            } else if (dueDate < today && task.status !== 'CONCLUIDO') {
                overdue.push(task);
            }
        });
        todayActive = todayActive.sort((a,b) => (b.priority === 'ALTA' ? 1 : -1) - (a.priority === 'ALTA' ? 1 : -1) );
        return { todayTasks: todayActive, overdueTasks: overdue, completedTodayCount: completedToday };
    }, [tasks]);

    const totalToday = todayTasks.length + completedTodayCount;
    const progress = totalToday > 0 ? (completedTodayCount / totalToday) * 100 : 100;

    const tasksToShow = [...overdueTasks, ...todayTasks].slice(0, 3);
    
    return (
        <WidgetCard onClick={() => setActiveView('Tarefas')}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Visão Geral de Tarefas</h3>
                    <div className="flex items-center gap-4 text-sm mt-1">
                        <span className="text-red-400 font-bold">{overdueTasks.length} Vencidas</span>
                        <span className="text-yellow-500 font-bold">{tasks.filter(t => t.status === 'EM_ANDAMENTO').length} Em Atraso</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-[var(--text-primary)]">{Math.round(progress)}% Concluído Hoje</p>
                    <div className="w-full bg-[var(--bg-elevation-1)] rounded-full h-1.5 mt-1">
                        <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="space-y-2 flex-grow">
                {tasksToShow.length > 0 ? tasksToShow.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-[var(--bg-card-hover)] rounded-md transition-colors">
                        <input
                            type="checkbox"
                            checked={task.status === 'CONCLUIDO'}
                            onClick={(e) => handleToggleComplete(e, task.id, task.status)}
                            className="form-checkbox h-5 w-5 bg-transparent border-[var(--border-color)] rounded text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
                        />
                        <p className="flex-grow text-[var(--text-secondary)] text-sm truncate">{task.title}</p>
                        <InfoIcon />
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
                        <p>Nenhuma tarefa crítica no momento.</p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
};

export default TaskOverviewWidget;
