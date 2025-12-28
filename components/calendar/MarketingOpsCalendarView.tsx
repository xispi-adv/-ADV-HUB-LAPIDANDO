
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
            {/* CLEANER HEADER */}
            <header className="mb-6 pb-6 border-b border-[var(--border-color)]">
                <h1 className={`text-4xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    Calendário <span className="text-[var(--text-muted)] font-thin">/</span> <span className="capitalize">{month}</span> {year}
                </h1>
                <p className={`text-sm mt-1 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>Orquestração de datas e janelas estratégicas.</p>
            </header>

            {/* UNIFIED OPERATIONS BAR */}
            <div className={`flex flex-wrap items-center justify-between gap-4 p-3 mb-6 rounded-[1.5rem] border transition-all
                ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}`}
            >
                {/* 1. FILTERS (LEFT) */}
                <div className="flex items-center gap-3">
                    <div className="relative group w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className={`h-4 w-4 ${theme === 'light' ? 'text-slate-400' : 'text-[var(--text-muted)]'}`} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none transition-all
                                ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[var(--bg-elevation-1)] border-white/5 text-white'}`}
                            placeholder="Pesquisar agenda..."
                        />
                    </div>

                    <div className="relative w-48">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className={`h-4 w-4 ${theme === 'light' ? 'text-slate-400' : 'text-[var(--text-muted)]'}`} />
                        </div>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as CalendarTaskCategory | 'ALL')}
                            className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl appearance-none cursor-pointer text-sm focus:outline-none transition-all
                                ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[var(--bg-elevation-1)] border-white/5 text-white'}`}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-[var(--bg-card)]">{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. VIEW TOGGLE (CENTER) */}
                <div className={`flex p-1 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[var(--bg-elevation-1)] border-white/5'}`}>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                            ${viewMode === 'grid' 
                                ? (theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'bg-[var(--bg-card)] text-[var(--accent-color)] shadow-sm') 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                        <LayoutGrid size={16} /> Grade
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
                            ${viewMode === 'list' 
                                ? (theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'bg-[var(--bg-card)] text-[var(--accent-color)] shadow-sm') 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                        <List size={16} /> Lista
                    </button>
                </div>

                {/* 3. NAVIGATION (RIGHT) */}
                <div className={`flex items-center gap-1 p-1 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[var(--bg-elevation-1)] border-white/5'}`}>
                    <button 
                        onClick={handlePrevWeek} 
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${theme === 'light' ? 'text-slate-400 hover:bg-white hover:text-blue-600' : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button 
                        onClick={handleToday} 
                        className={`px-4 h-9 flex items-center justify-center text-[10px] font-black uppercase tracking-wider transition-all rounded-lg
                            ${theme === 'light' ? 'text-slate-700 hover:bg-white' : 'text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)]'}`}
                    >
                        Hoje
                    </button>
                    <button 
                        onClick={handleNextWeek} 
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${theme === 'light' ? 'text-slate-400 hover:bg-white hover:text-blue-600' : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* CALENDAR MAIN AREA */}
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
