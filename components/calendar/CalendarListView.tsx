
import React, { useMemo } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import type { CalendarTask, CalendarTaskCategory } from '../../types';
import { Clock, MoreHorizontal, AlertCircle, Search, Plus } from 'lucide-react';

interface CalendarListViewProps {
    weekDays: Date[];
    onEditTask: (task: CalendarTask) => void;
    onNewTask: (date: string) => void;
    filterQuery: string;
    filterCategory: CalendarTaskCategory | 'ALL';
}

const CATEGORY_COLORS: Record<string, string> = {
    CAMPANHA: 'bg-purple-500',
    SOCIAL_MEDIA: 'bg-pink-500',
    CONTEUDO: 'bg-green-500',
    EMAIL: 'bg-blue-500',
    SEO: 'bg-teal-500',
    ADS: 'bg-orange-500',
    REUNIAO: 'bg-indigo-500',
    OUTRO: 'bg-gray-500',
};

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const CalendarListView: React.FC<CalendarListViewProps> = ({ 
    weekDays, 
    onEditTask, 
    onNewTask,
    filterQuery, 
    filterCategory 
}) => {
    const { getTasksForDate } = useCalendar();
    const { getClientById } = useClients();
    const { theme } = useTheme();

    const groupedData = useMemo(() => {
        return weekDays.map(day => {
            const dateStr = toYYYYMMDD(day);
            const tasks = getTasksForDate(dateStr);
            
            const filtered = tasks.filter(task => {
                const matchesSearch = filterQuery === '' || 
                    task.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(filterQuery.toLowerCase()));
                
                const matchesCategory = filterCategory === 'ALL' || task.category === filterCategory;
                
                return matchesSearch && matchesCategory;
            });

            return {
                day,
                dateStr,
                tasks: filtered,
                dayName: day.toLocaleString('pt-BR', { weekday: 'long' }),
                formattedDate: day.toLocaleString('pt-BR', { day: '2-digit', month: 'long' })
            };
        }).filter(group => group.tasks.length > 0 || filterQuery === '');
    }, [weekDays, getTasksForDate, filterQuery, filterCategory]);

    const hasAnyResults = groupedData.some(g => g.tasks.length > 0);

    if (filterQuery !== '' && !hasAnyResults) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-[var(--bg-card)] rounded-2xl animate-fade-in text-[var(--text-muted)]">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg">Nenhum compromisso encontrado.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[var(--bg-main)] rounded-2xl">
            <div className="flex flex-col gap-px">
                {groupedData.map((group) => (
                    <div key={group.dateStr} className="relative">
                        {/* Day Header - Dark Blue High Contrast Ruler */}
                        <div className={`
                            sticky top-0 z-10 backdrop-blur-md px-6 py-3 flex items-center justify-between group/header border-b
                            ${theme === 'light' ? 'bg-[#0F172A] border-slate-800' : 'bg-[#0A0F1E] border-white/5'}
                        `}>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.35em] flex items-center gap-4">
                                <span className="text-white">
                                    {group.dayName}
                                </span>
                                <span className="text-blue-500/30 font-thin">|</span>
                                <span className="text-blue-200/50 font-medium">
                                    {group.formattedDate}
                                </span>
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${theme === 'light' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    {group.tasks.length} {group.tasks.length === 1 ? 'TASK' : 'TASKS'}
                                </span>
                                <button 
                                    onClick={() => onNewTask(group.dateStr)}
                                    className="p-1.5 rounded-lg transition-all opacity-0 group-hover/header:opacity-100 hover:bg-white/10 text-blue-400"
                                    title="Adicionar tarefa neste dia"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className={`divide-y ${theme === 'light' ? 'divide-slate-100' : 'divide-white/5'}`}>
                            {group.tasks.length > 0 ? (
                                group.tasks.map((task) => {
                                    const client = task.clientId ? getClientById(task.clientId) : null;
                                    const isCompleted = task.status === 'CONCLUIDO';
                                    
                                    return (
                                        <div 
                                            key={task.id}
                                            onClick={() => onEditTask(task)}
                                            className={`
                                                group flex items-center gap-6 px-8 py-5 transition-all cursor-pointer
                                                ${theme === 'light' ? 'bg-white hover:bg-slate-50/40' : 'hover:bg-white/5'}
                                                ${isCompleted ? 'opacity-40' : ''}
                                            `}
                                        >
                                            {/* Time Column */}
                                            <div className="w-24 flex-shrink-0 flex flex-col items-start gap-0.5">
                                                <div className="flex items-center gap-1.5 text-[var(--text-muted)] scale-90 origin-left">
                                                    <Clock size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Schedule</span>
                                                </div>
                                                <span className={`text-[13px] font-mono font-bold ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                                                    09:00 <span className="text-[10px] opacity-40 font-normal">AM</span>
                                                </span>
                                            </div>

                                            {/* Category Indicator */}
                                            <div className={`w-1 h-12 rounded-full flex-shrink-0 ${CATEGORY_COLORS[task.category] || 'bg-gray-500'} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                            {/* Main Content */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {client && (
                                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter ${theme === 'light' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-white/5 text-[var(--accent-color)] border-white/10'}`}>
                                                            {client.name}
                                                        </span>
                                                    )}
                                                     <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm ${theme === 'light' ? 'text-slate-400 bg-slate-100' : 'text-gray-500 bg-white/5'} uppercase tracking-widest`}>
                                                        {task.category}
                                                    </div>
                                                </div>
                                                <h4 className={`text-[15px] font-bold tracking-tight truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'} ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
                                                    {task.title}
                                                </h4>
                                                <p className={`text-xs mt-0.5 truncate leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>
                                                    {task.description || 'Nenhuma nota estratégica vinculada.'}
                                                </p>
                                            </div>

                                            {/* Action & Meta */}
                                            <div className="flex items-center gap-5">
                                                {task.priority === 'URGENTE' && !isCompleted && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 border border-red-100 animate-pulse">
                                                        <AlertCircle size={14} className="text-red-600" />
                                                        <span className="text-[9px] font-black text-red-700 uppercase">Urgent</span>
                                                    </div>
                                                )}
                                                
                                                <div className={`
                                                    hidden sm:flex px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-colors
                                                    ${task.priority === 'ALTA' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                                      task.priority === 'MEDIA' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                      'bg-slate-50 text-slate-500 border-slate-200'}
                                                `}>
                                                    {task.priority}
                                                </div>
                                                
                                                {task.assignedTo && (
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-110 ${theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-[var(--bg-elevation-2)] border-[var(--border-color)] text-[var(--text-primary)]'}`} title={task.assignedTo}>
                                                        {task.assignedTo.charAt(0)}
                                                    </div>
                                                )}
                                                
                                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-8 py-8 text-sm text-slate-400 font-light italic flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                    Calendário livre para este dia.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarListView;
