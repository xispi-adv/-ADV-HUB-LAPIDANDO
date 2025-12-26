
import React, { useState, useMemo, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useTheme } from '../../context/ThemeContext';
import CalendarColumn from './CalendarColumn';
import CalendarListView from './CalendarListView';
import CalendarTaskModal from './CalendarTaskModal';
import type { CalendarTask, CalendarTaskCategory } from '../../types';
import { LayoutGrid, List, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const CATEGORIES: { id: CalendarTaskCategory | 'ALL', label: string }[] = [
    { id: 'ALL', label: 'Todas as Categorias' },
    { id: 'CAMPANHA', label: 'Campanhas' },
    { id: 'SOCIAL_MEDIA', label: 'Social Media' },
    { id: 'CONTEUDO', label: 'Conteúdo' },
    { id: 'REUNIAO', label: 'Reuniões' },
    { id: 'ADS', label: 'Ads / Tráfego' },
    { id: 'SEO', label: 'SEO' },
    { id: 'EMAIL', label: 'Email Marketing' },
];

const MarketingOpsCalendarView: React.FC = () => {
    const { theme } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<CalendarTask | null>(null);
    const [newTaskDate, setNewTaskDate] = useState<string | null>(null);
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CalendarTaskCategory | 'ALL'>('ALL');

    const weekDays = useMemo(() => {
        const start = getWeekStart(currentDate);
        return Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    }, [currentDate]);

    const handlePrevWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
    const handleNextWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
    const handleToday = () => setCurrentDate(new Date());

    const openModalForNewTask = useCallback((date: string) => {
        setEditingTask(null);
        setNewTaskDate(date);
        setIsModalOpen(true);
    }, []);
    
    const openModalForEditing = useCallback((task: CalendarTask) => {
        setNewTaskDate(null);
        setEditingTask(task);
        setIsModalOpen(true);
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setNewTaskDate(null);
    };

    const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[var(--border-color)]">
                <div>
                    <h1 className="text-3xl font-light text-[var(--text-primary)] tracking-tight">
                        Calendário <span className="text-[var(--text-muted)] font-thin">/</span> <span className="capitalize">{month}</span> {year}
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Orquestração de datas e janelas estratégicas.</p>
                </div>

                <div className="flex items-center gap-4">
                     <div className="flex bg-[var(--bg-elevation-1)] p-1 rounded-xl border border-[var(--border-color)]">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--bg-card)] text-[var(--accent-color)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                            title="Ver Grade"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--bg-card)] text-[var(--accent-color)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                            title="Ver Lista"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevation-1)] border border-[var(--border-color)]">
                        <button onClick={handlePrevWeek} className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-white rounded-lg transition-all"><ChevronLeft size={16} /></button>
                        <button onClick={handleToday} className="px-4 h-9 flex items-center justify-center text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] rounded-lg">Hoje</button>
                        <button onClick={handleNextWeek} className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-white rounded-lg transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </header>

            <div className={`flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-2 mb-6 rounded-2xl border ${theme === 'light' ? 'bg-white shadow-sm border-slate-200' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}`}>
                <div className="flex flex-grow items-center gap-3">
                    <div className="relative group w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-[var(--text-muted)]" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-xl sm:text-sm focus:outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white'}`}
                            placeholder="Pesquisar agenda..."
                        />
                    </div>

                    <div className="relative w-full md:w-56">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-[var(--text-muted)]" />
                        </div>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as CalendarTaskCategory | 'ALL')}
                            className={`block w-full pl-10 pr-3 py-2 border rounded-xl appearance-none cursor-pointer sm:text-sm focus:outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-white'}`}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[var(--bg-card)]">{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={`flex-grow overflow-hidden relative rounded-[2rem] border ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-[var(--border-color)] border-[var(--border-color)] shadow-2xl shadow-black/10'}`}>
                {viewMode === 'grid' ? (
                    <div className="h-full grid grid-cols-7 gap-px overflow-hidden">
                        {weekDays.map((day, index) => (
                            <CalendarColumn 
                                key={day.toISOString()} 
                                day={day} 
                                isLast={index === weekDays.length - 1}
                                onNewTask={openModalForNewTask}
                                onEditTask={openModalForEditing}
                                filterQuery={searchQuery}
                                filterCategory={selectedCategory}
                            />
                        ))}
                    </div>
                ) : (
                    <CalendarListView 
                        weekDays={weekDays}
                        onEditTask={openModalForEditing}
                        onNewTask={openModalForNewTask}
                        filterQuery={searchQuery}
                        filterCategory={selectedCategory}
                    />
                )}
            </div>

            {isModalOpen && <CalendarTaskModal task={editingTask} dueDate={newTaskDate} onClose={closeModal} />}
        </div>
    );
};

export default MarketingOpsCalendarView;
