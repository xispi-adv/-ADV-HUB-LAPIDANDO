import React, { useMemo } from 'react';
import WidgetCard from './shared/WidgetCard';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarTask, CalendarTaskCategory, CalendarTaskPriority } from '../../types';

const OptionsIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/60 hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> );

const PRIORITY_COLORS: Record<CalendarTaskPriority, string> = {
    URGENTE: 'bg-red-500',
    ALTA: 'bg-rose-500',
    MEDIA: 'bg-yellow-500',
    BAIXA: 'bg-sky-500',
};

const CATEGORY_COLORS: Record<CalendarTaskCategory, string> = {
    REUNIAO: 'bg-indigo-500',
    CAMPANHA: 'bg-purple-500',
    SOCIAL_MEDIA: 'bg-pink-500',
    CONTEUDO: 'bg-green-500',
    EMAIL: 'bg-blue-500',
    SEO: 'bg-teal-500',
    ADS: 'bg-orange-500',
    OUTRO: 'bg-gray-500',
};

const AgendaItem: React.FC<{ item: CalendarTask }> = ({ item }) => {
    const isMeeting = item.category === 'REUNIAO';
    const indicatorColor = isMeeting ? CATEGORY_COLORS.REUNIAO : PRIORITY_COLORS[item.priority];
    
    return (
        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors">
            <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${indicatorColor}`}></div>
            <div>
                <p className="text-sm font-medium text-white/90 line-clamp-1">{item.title}</p>
                <p className="text-xs text-white/60">
                    {isMeeting
                        ? new Date(item.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                        : `Prioridade: ${item.priority}`}
                </p>
            </div>
        </div>
    );
};

const AgendaWidget: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { tasks } = useCalendar();

    const itemsToShow = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        
        const urgentTasks = tasks.filter(t => 
            (t.priority === 'URGENTE' || t.priority === 'ALTA') && t.status !== 'CONCLUIDO'
        ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 2);

        const meetingsToday = tasks.filter(t => 
            t.dueDate === today && t.category === 'REUNIAO' && t.status !== 'CONCLUIDO'
        );

        const combined = [...meetingsToday, ...urgentTasks];
        
        // Remove duplicates and limit to 4 items total
        return combined.filter((item, index, self) => 
            index === self.findIndex(t => t.id === item.id)
        ).slice(0, 4);

    }, [tasks]);

    return (
        <WidgetCard onClick={() => setActiveView('Calendário')} className="min-h-[230px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Lembretes e Agenda</h3>
                <button onClick={(e) => e.stopPropagation()}><OptionsIcon /></button>
            </div>
            {itemsToShow.length > 0 ? (
                <div className="space-y-2">
                    {itemsToShow.map(item => <AgendaItem key={item.id} item={item} />)}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                    <p>Sua agenda está limpa.</p>
                </div>
            )}
        </WidgetCard>
    );
};

export default AgendaWidget;