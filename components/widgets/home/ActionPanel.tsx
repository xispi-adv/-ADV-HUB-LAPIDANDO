import React, { useMemo, useCallback } from 'react';
import { useTaskManager } from '../../../context/TaskManagerContext';
import type { Task, Project } from '../../../types';

// --- Icons ---
const AlertIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> );
const ClockIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );

// --- Child Components ---
const TaskRow: React.FC<{ task: Task; project?: Project; onToggleComplete: (taskId: string, currentStatus: Task['status']) => void; }> = ({ task, project, onToggleComplete }) => {
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggleComplete(task.id, task.status);
    };

    return (
        <div className="flex items-center gap-3 px-2 py-2.5 hover:bg-white/5 rounded-lg transition-colors duration-200 group">
            <input 
                type="checkbox"
                checked={task.status === 'CONCLUIDO'}
                onChange={handleCheckboxChange}
                onClick={e => e.stopPropagation()}
                className="form-checkbox h-5 w-5 bg-transparent border-white/40 rounded text-red-600 focus:ring-red-500 cursor-pointer"
            />
            <div className="flex-grow">
                <p className="text-white/90">{task.title}</p>
                <p className="text-xs text-white/60">{project?.name || 'Projeto não encontrado'}</p>
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'ALTA' ? 'bg-red-500' : task.priority === 'MEDIA' ? 'bg-yellow-500' : 'bg-sky-500'}`} title={`Prioridade ${task.priority}`}></div>
        </div>
    );
};

const ProgressRing: React.FC<{ progress: number }> = ({ progress }) => {
    const stroke = 4, radius = 18, normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
            <circle stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
            <circle stroke="rgb(239 68 68)" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset }} strokeLinecap="round" fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
    );
};

// --- Main Component ---
const ImmediateActionPanel: React.FC = () => {
    const { tasks, projects, updateTaskStatus } = useTaskManager();

    const handleToggleComplete = useCallback((taskId: string, currentStatus: Task['status']) => {
        const newStatus = currentStatus === 'CONCLUIDO' ? 'EM_ANDAMENTO' : 'CONCLUIDO';
        updateTaskStatus(taskId, newStatus);
    }, [updateTaskStatus]);

    const { todayTasks, overdueTasks, completedTodayCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = new Date().toISOString().split('T')[0];
        
        const overdue: Task[] = [];
        const todayActive: Task[] = [];
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
        return { todayTasks: todayActive, overdueTasks: overdue, completedTodayCount: completedToday };
    }, [tasks]);

    const totalToday = todayTasks.length + completedTodayCount;
    const progress = totalToday > 0 ? (completedTodayCount / totalToday) * 100 : 0;

    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl h-full flex flex-col p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">Painel de Ação Imediata</h2>
                    <p className="text-white/60">Suas tarefas mais urgentes estão aqui.</p>
                </div>
                <div className="flex items-center gap-3">
                     <span className="font-bold text-lg text-white">{Math.round(progress)}%</span>
                     <ProgressRing progress={progress} />
                </div>
            </div>

            <div className="flex-grow space-y-6 overflow-y-auto pr-2">
                {overdueTasks.length > 0 && (
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertIcon />
                            <h3 className="font-bold">{overdueTasks.length} {overdueTasks.length > 1 ? "Tarefas Atrasadas" : "Tarefa Atrasada"}</h3>
                        </div>
                        <div className="space-y-1">
                            {overdueTasks.map(task => <TaskRow key={task.id} task={task} project={projects.find(p => p.id === task.projectId)} onToggleComplete={handleToggleComplete} />)}
                        </div>
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-2 text-white/80 mb-2">
                        <ClockIcon />
                        <h3 className="font-bold">Tarefas para Hoje</h3>
                    </div>
                    {todayTasks.length > 0 ? (
                        <div className="space-y-1">
                           {todayTasks.map(task => <TaskRow key={task.id} task={task} project={projects.find(p => p.id === task.projectId)} onToggleComplete={handleToggleComplete} />)}
                        </div>
                    ) : (
                         <div className="text-center py-6 text-white/60">
                            <p>Nenhuma tarefa pendente para hoje. Bom trabalho!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImmediateActionPanel;