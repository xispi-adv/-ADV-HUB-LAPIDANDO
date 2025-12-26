import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { CalendarTask } from '../types';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const generateId = () => `cal-task-${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;

const createMockTasks = (): CalendarTask[] => {
    const today = new Date();
    const tasksByDate: Record<string, CalendarTask[]> = {};
    const priorities = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];
    const categories = ['CAMPANHA', 'SOCIAL_MEDIA', 'CONTEUDO', 'EMAIL', 'SEO', 'ADS', 'REUNIAO', 'OUTRO'];
    const statuses = ['A_FAZER', 'EM_PROGRESSO', 'REVISAO', 'CONCLUIDO'];
    const assignees = ['Carlos', 'Ana', 'Beatriz', 'Daniel'];

    for (let i = -5; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = toYYYYMMDD(date);
        tasksByDate[dateStr] = [];
        const numTasks = Math.floor(Math.random() * 4);
        
        for (let j = 0; j < numTasks; j++) {
            const now = new Date().toISOString();
            tasksByDate[dateStr].push({
                id: generateId(),
                title: `Tarefa para ${dateStr} #${j + 1}`,
                description: `Descrição detalhada para a tarefa.`,
                dueDate: dateStr,
                priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
                category: categories[Math.floor(Math.random() * categories.length)] as any,
                status: statuses[Math.floor(Math.random() * statuses.length)] as any,
                assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
                createdAt: now,
                updatedAt: now,
                order: j,
            });
        }
    }
    return Object.values(tasksByDate).flat();
};


interface CalendarContextState {
    tasks: CalendarTask[];
    getTasksForDate: (date: string) => CalendarTask[];
    addTask: (taskData: Omit<CalendarTask, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
    updateTask: (taskId: string, taskData: Partial<Omit<CalendarTask, 'id'>>) => void;
    deleteTask: (taskId: string) => void;
    moveOrReorderTask: (draggedTaskId: string, newDueDate: string, targetTaskId: string | null) => void;
}

const CalendarContext = createContext<CalendarContextState | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<CalendarTask[]>(createMockTasks());

    const getTasksForDate = useCallback((date: string) => {
        return tasks.filter(task => task.dueDate === date).sort((a, b) => a.order - b.order);
    }, [tasks]);

    const addTask = useCallback((taskData: Omit<CalendarTask, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
        const now = new Date().toISOString();
        setTasks(prev => {
            const maxOrder = Math.max(-1, ...prev.filter(t => t.dueDate === taskData.dueDate).map(t => t.order));
            const newTask: CalendarTask = {
                ...taskData,
                id: generateId(),
                order: maxOrder + 1,
                createdAt: now,
                updatedAt: now,
            };
            return [...prev, newTask];
        });
    }, []);
    
    const updateTask = useCallback((taskId: string, taskData: Partial<Omit<CalendarTask, 'id'>>) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
        ));
    }, []);

    const deleteTask = useCallback((taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }, []);

    const moveOrReorderTask = useCallback((draggedTaskId: string, newDueDate: string, targetTaskId: string | null) => {
        setTasks(currentTasks => {
            const tasks = [...currentTasks];
            const draggedTaskIndex = tasks.findIndex(t => t.id === draggedTaskId);
            if (draggedTaskIndex === -1) {
                return currentTasks;
            }
    
            const draggedTask = { ...tasks[draggedTaskIndex] };
            const originalDueDate = draggedTask.dueDate;
            
            // Temporarily remove the dragged task
            tasks.splice(draggedTaskIndex, 1);
    
            // Update its due date
            draggedTask.dueDate = newDueDate;
            draggedTask.updatedAt = new Date().toISOString();
    
            // Handle Destination Column
            let destColumnTasks = tasks.filter(t => t.dueDate === newDueDate).sort((a, b) => a.order - b.order);
            const targetIndex = targetTaskId ? destColumnTasks.findIndex(t => t.id === targetTaskId) : -1;
    
            if (targetIndex !== -1) {
                destColumnTasks.splice(targetIndex, 0, draggedTask);
            } else {
                destColumnTasks.push(draggedTask);
            }
            
            destColumnTasks.forEach((task, index) => { task.order = index; });
    
            // Handle Original Column (if different)
            let sourceColumnTasks: CalendarTask[] = [];
            if (originalDueDate !== newDueDate) {
                sourceColumnTasks = tasks.filter(t => t.dueDate === originalDueDate).sort((a, b) => a.order - b.order);
                sourceColumnTasks.forEach((task, index) => { task.order = index; });
            }
    
            // Rebuild the final array
            const otherTasks = tasks.filter(t => t.dueDate !== originalDueDate && t.dueDate !== newDueDate);
            
            return [...otherTasks, ...sourceColumnTasks, ...destColumnTasks];
        });
    }, []);


    return (
        <CalendarContext.Provider value={{ tasks, getTasksForDate, addTask, updateTask, deleteTask, moveOrReorderTask }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = (): CalendarContextState => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};