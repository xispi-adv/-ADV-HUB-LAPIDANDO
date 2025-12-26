import React from 'react';
import { useTaskManager } from '../../context/TaskManagerContext';

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const WeeklyCalendar: React.FC = () => {
    const { tasks } = useTaskManager();
    const today = new Date();
    const week: Date[] = [];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    
    const isSameDay = (d1: Date, d2: Date) => d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];

    return (
        <div className="p-6 bg-black/40 rounded-xl border border-white/20 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-white">Calendário Semanal</h2>
            </div>
            <div className="space-y-4 flex-grow">
                {week.map((day, index) => {
                    const dayString = day.toISOString().split('T')[0];
                    const tasksForDay = tasks.filter(t => t.dueDate === dayString);
                    const isToday = isSameDay(day, today);

                    return (
                        <div key={index}>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-sm font-bold w-10 ${isToday ? 'text-red-400' : 'text-white/70'}`}>{weekDays[day.getDay()]}</span>
                                <span className={`text-2xl font-light w-8 ${isToday ? 'text-white' : 'text-white/60'}`}>{day.getDate()}</span>
                                <div className="flex-grow">
                                    {tasksForDay.length > 0 ? (
                                        <div className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded">
                                            {tasksForDay.length} {tasksForDay.length === 1 ? 'tarefa' : 'tarefas'}
                                        </div>
                                    ) : (
                                         <div className="w-full border-t border-white/10"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklyCalendar;