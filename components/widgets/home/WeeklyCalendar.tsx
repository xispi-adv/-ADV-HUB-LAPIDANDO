import React, { useMemo, useState, useCallback } from 'react';
import { useCalendar } from '../../../context/CalendarContext';
import CalendarTaskModal from '../../calendar/CalendarTaskModal';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const SmartCalendarWidget: React.FC = () => {
    const { tasks } = useCalendar();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks
            .filter(t => new Date(t.dueDate + 'T00:00:00') >= today && t.status !== 'CONCLUIDO')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5); // Get the next 5 upcoming tasks
    }, [tasks]);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);
    
    const categoryColors: Record<string, string> = {
        CAMPANHA: 'bg-purple-500', SOCIAL_MEDIA: 'bg-pink-500', CONTEUDO: 'bg-green-500',
        EMAIL: 'bg-blue-500', SEO: 'bg-teal-500', ADS: 'bg-orange-500',
        REUNIAO: 'bg-indigo-500', OUTRO: 'bg-gray-500',
    };

    return (
        <>
            <div className="p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Agenda Inteligente</h2>
                     <button 
                        onClick={openModal}
                        className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 text-white/80 font-semibold py-1.5 px-3 rounded-lg transition-colors">
                        <PlusIcon className="w-4 h-4" />
                        <span>Rápido</span>
                    </button>
                </div>
                <div className="flex-grow space-y-3 overflow-y-auto pr-2">
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-2 bg-black/40 rounded-md">
                                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${categoryColors[task.category] || 'bg-gray-500'}`}></div>
                                <div>
                                    <p className="text-sm font-semibold text-white/90 line-clamp-1">{task.title}</p>
                                    <p className="text-xs text-white/60">
                                        {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="flex items-center justify-center h-full text-white/60">
                            <p>Nenhum compromisso futuro.</p>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && <CalendarTaskModal onClose={closeModal} dueDate={new Date().toISOString().split('T')[0]} />}
        </>
    );
};

export default SmartCalendarWidget;