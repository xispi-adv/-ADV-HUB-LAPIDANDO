import React, { useMemo, useState, useCallback } from 'react';
import WidgetCard from './shared/WidgetCard';
import { useCalendar } from '../../context/CalendarContext';
import CalendarTaskModal from '../calendar/CalendarTaskModal';

const CalendarIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> );
const PlusIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> );

const CalendarWidget: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { tasks } = useCalendar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks
            .filter(t => new Date(t.dueDate + 'T00:00:00') >= today && t.status !== 'CONCLUIDO')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 3);
    }, [tasks]);

    const openModal = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsModalOpen(true);
    }, []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const categoryColors: Record<string, string> = {
        REUNIAO: 'bg-indigo-500', CAMPANHA: 'bg-purple-500', OUTRO: 'bg-gray-500',
    };

    return (
        <>
            <WidgetCard onClick={() => setActiveView('Calendário')}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Lembretes de Calendário</h3>
                    <button onClick={openModal} className="p-1.5 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition-colors"><PlusIcon /></button>
                </div>
                <div className="space-y-3 flex-grow">
                    {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-2 bg-black/40 rounded-md">
                            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${categoryColors[task.category] || 'bg-gray-500'}`}></div>
                            <div>
                                <p className="text-sm font-medium text-white/90 line-clamp-1">{task.title}</p>
                                <p className="text-xs text-white/60">
                                    {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="flex items-center justify-center h-full text-white/60">
                            <p>Nenhum compromisso futuro.</p>
                        </div>
                    )}
                </div>
            </WidgetCard>
            {isModalOpen && <CalendarTaskModal onClose={closeModal} dueDate={new Date().toISOString().split('T')[0]} />}
        </>
    );
};

export default CalendarWidget;
