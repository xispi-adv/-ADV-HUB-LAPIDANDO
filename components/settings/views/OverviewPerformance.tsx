
import React, { useMemo, useState } from 'react';
import WidgetCard from '../../dashboard/shared/WidgetCard';
import { useTaskManager } from '../../../context/TaskManagerContext';
import { useClients } from '../../../context/ClientContext';
import { useFinance } from '../../../context/FinanceContext';
import { useCalendar } from '../../../context/CalendarContext';

// --- ICONS ---
const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ChipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m11.372-.52a6.002 6.002 0 01-1.53 4.448m3.253-4.968c-.963-.203-1.935-.377-2.916-.52M19.5 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.726 6.726 0 01-2.749 1.35" /></svg>;

// --- SUB-COMPONENTS ---

const KpiCard: React.FC<{ 
    title: string; 
    value: string | number; 
    subtext: string; 
    icon: React.ReactNode; 
    trend?: 'up' | 'down' | 'neutral'; 
    colorClass: string;
    onClick?: () => void;
}> = ({ title, value, subtext, icon, trend, colorClass, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-xl p-5 flex items-start justify-between 
            hover:border-opacity-50 hover:shadow-lg transition-all duration-300 group
            ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''}
        `}
    >
        <div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</h4>
            <p className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-[var(--text-secondary)]'}`}>
                {subtext}
            </p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 group-hover:bg-opacity-20 transition-colors ${colorClass.replace('text-', 'bg-')}`}>
            <span className={colorClass}>{icon}</span>
        </div>
    </div>
);

const ProgressBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)] font-medium">{label}</span>
                <span className="text-[var(--text-primary)] font-mono">{value} / {max}</span>
            </div>
            <div className="h-2 w-full bg-[var(--bg-elevation-2)] rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${color}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// Generic Drill-down Modal
const DetailsModal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-[var(--bg-elevation-2)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <CloseIcon />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {children}
            </div>
        </div>
    </div>
);

interface OverviewPerformanceProps {
    setActiveView?: (view: string, params?: any) => void;
}

const OverviewPerformance: React.FC<OverviewPerformanceProps> = ({ setActiveView }) => {
    const { projects, tasks, selectProject } = useTaskManager();
    const { clients } = useClients();
    const { accounts, transactions } = useFinance();
    const { tasks: calendarTasks } = useCalendar();

    // State for Modal
    const [activeDetail, setActiveDetail] = useState<'projects' | 'clients' | 'meetings' | 'deliveries' | null>(null);

    // --- DATA ---
    
    // Project Metrics
    const activeProjects = projects; // Assuming all projects in list are active for now
    const totalProjects = activeProjects.length;

    // Helper to calculate project progress
    const getProjectStats = (projectId: string) => {
        const projectTasks = tasks.filter(t => t.projectId === projectId);
        const total = projectTasks.length;
        const completed = projectTasks.filter(t => t.status === 'CONCLUIDO').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, progress };
    };

    // "Completed Projects" Logic (Simulated: Projects with 100% tasks done)
    const completedProjectsCount = projects.filter(p => {
        const stats = getProjectStats(p.id);
        return stats.total > 0 && stats.completed === stats.total;
    }).length;

    const projectSuccessRate = totalProjects > 0 ? Math.round((completedProjectsCount / totalProjects) * 100) : 0;

    // Task Metrics (Global)
    const completedTasks = tasks.filter(t => t.status === 'CONCLUIDO');
    const totalTasksCount = tasks.length;
    const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;

    // Client Metrics
    const totalClients = clients.length;
    const newClientsThisMonth = clients.filter(c => {
        const joinDate = new Date(c.since);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    });

    // Finance Metrics
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const monthlyIncome = transactions
        .filter(t => t.type === 'receita' && t.status === 'pago') 
        .reduce((acc, t) => acc + t.amount, 0);
        
    const meetingsList = calendarTasks.filter(t => t.category === 'REUNIAO').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const deliveriesList = tasks.filter(t => t.status !== 'CONCLUIDO').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const aiUsage = {
        textTokens: 85400,
        imageGen: 42,
        videoGen: 12,
        limitText: 1000000,
        limitImage: 100,
        limitVideo: 50
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const handleGoToProject = (projectId: string) => {
        if (setActiveView && selectProject) {
            selectProject(projectId);
            setActiveView('Tarefas');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Gamification Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a1b23] to-[#0F1014] border border-[var(--border-color)] shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-color)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Level Circle */}
                <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 overflow-visible">
                            <circle cx="50%" cy="50%" r="56" stroke="var(--bg-elevation-2)" strokeWidth="8" fill="transparent" />
                            <circle 
                                cx="50%" cy="50%" r="56" 
                                stroke="var(--accent-color)" 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray="351" 
                                strokeDashoffset={351 - (351 * 0.75)} 
                                strokeLinecap="round" 
                                className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Nível</span>
                            <span className="text-4xl font-black text-white">7</span>
                        </div>
                    </div>
                </div>

                {/* User Info & Badge */}
                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Teles</h2>
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            Budget Seller
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-4">Engenheiro de Prompts Sênior</h3>
                    
                    <p className="text-[var(--text-muted)] text-sm max-w-lg mb-6 leading-relaxed">
                        Sua eficiência operacional está <span className="text-emerald-400 font-bold">15% acima da média</span>. 
                        Continue utilizando agentes autônomos para desbloquear recursos Enterprise.
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-[var(--bg-elevation-2)] rounded-full text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-color)]">🏆 Top 5% Usuários</span>
                        <span className="px-3 py-1 bg-[var(--bg-elevation-2)] rounded-full text-xs font-medium text-[var(--text-secondary)] border border-[var(--border-color)]">🔥 12 Dias Seguidos</span>
                    </div>
                </div>
            </div>

            {/* KPI Grid - Updated Structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Projetos Ativos */}
                <KpiCard 
                    title="Projetos Ativos" 
                    value={totalProjects} 
                    subtext="Ver e acompanhar tarefas" 
                    icon={<ProjectIcon />} 
                    colorClass="text-blue-500" 
                    onClick={() => setActiveDetail('projects')}
                />

                {/* 2. Projetos Concluídos (Nova Lógica) */}
                <KpiCard 
                    title="Projetos Concluídos" 
                    value={completedProjectsCount} 
                    subtext={`${projectSuccessRate}% Taxa de Sucesso`} 
                    icon={<TrophyIcon />} 
                    trend="up"
                    colorClass="text-amber-500"
                    // No onClick detail needed per user request, but could list completed history later
                />

                {/* 3. Novos Clientes */}
                <KpiCard 
                    title="Novos Clientes" 
                    value={`+${newClientsThisMonth.length}`} 
                    subtext="Neste mês" 
                    icon={<UserGroupIcon />} 
                    trend={newClientsThisMonth.length > 0 ? 'up' : 'neutral'}
                    colorClass="text-violet-500" 
                    onClick={() => setActiveDetail('clients')}
                />

                {/* 4. Saldo */}
                <KpiCard 
                    title="Saldo em Caixa" 
                    value={formatCurrency(totalBalance)} 
                    subtext="Fluxo Disponível" 
                    icon={<MoneyIcon />} 
                    colorClass="text-emerald-500" 
                    onClick={() => { if(setActiveView) setActiveView('Financeiro', { tab: 'cockpit' }) }}
                />
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Usage & Activity (X-Ray) */}
                <div className="lg:col-span-2 space-y-6">
                    <WidgetCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Raio-X de Produtividade</h3>
                            <div className="text-xs text-[var(--text-muted)] italic">Clique nos cards para detalhar</div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Agenda Card */}
                            <div 
                                onClick={() => setActiveDetail('meetings')}
                                className="p-4 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-[var(--bg-elevation-2)] group"
                            >
                                <div className="flex items-center gap-2 mb-2 text-indigo-400 group-hover:text-indigo-300">
                                    <CalendarIcon />
                                    <span className="text-xs font-bold uppercase">Agenda</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{meetingsList.length}</p>
                                <p className="text-xs text-[var(--text-muted)]">Reuniões agendadas</p>
                            </div>
                            
                            {/* Entregas Card */}
                            <div 
                                onClick={() => setActiveDetail('deliveries')}
                                className="p-4 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] hover:border-rose-500/50 cursor-pointer transition-all hover:bg-[var(--bg-elevation-2)] group"
                            >
                                <div className="flex items-center gap-2 mb-2 text-rose-400 group-hover:text-rose-300">
                                    <CheckIcon />
                                    <span className="text-xs font-bold uppercase">Entregas</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{totalTasksCount - completedTasks.length}</p>
                                <p className="text-xs text-[var(--text-muted)]">Tarefas pendentes</p>
                            </div>

                            {/* Fluxo Card - Redirects to Finance */}
                            <div 
                                onClick={() => { if(setActiveView) setActiveView('Financeiro', { tab: 'cockpit' }) }}
                                className="p-4 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-[var(--bg-elevation-2)] group"
                            >
                                <div className="flex items-center gap-2 mb-2 text-emerald-400 group-hover:text-emerald-300">
                                    <MoneyIcon />
                                    <span className="text-xs font-bold uppercase">Fluxo</span>
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(monthlyIncome)}</p>
                                <p className="text-xs text-[var(--text-muted)]">Receita do período</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Eficiência Operacional</h4>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                                            Progresso Geral
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-emerald-600">
                                            {taskCompletionRate}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200/20">
                                    <div style={{ width: `${taskCompletionRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000"></div>
                                </div>
                            </div>
                        </div>
                    </WidgetCard>
                </div>

                {/* Right Column: AI Consumption (Tokens) */}
                <WidgetCard className="bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-elevation-1)]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg text-white shadow-lg">
                            <ChipIcon />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Uso de IA (Tokens)</h3>
                    </div>

                    <div className="space-y-6">
                        <ProgressBar 
                            label="Processamento de Texto (Gemini Pro)" 
                            value={aiUsage.textTokens} 
                            max={aiUsage.limitText} 
                            color="bg-purple-500" 
                        />
                        <ProgressBar 
                            label="Geração de Imagens (Imagen)" 
                            value={aiUsage.imageGen} 
                            max={aiUsage.limitImage} 
                            color="bg-pink-500" 
                        />
                        <ProgressBar 
                            label="Renderização de Vídeo" 
                            value={aiUsage.videoGen} 
                            max={aiUsage.limitVideo} 
                            color="bg-indigo-500" 
                        />
                    </div>

                    <div className="mt-8 p-4 bg-[var(--bg-elevation-2)] rounded-xl border border-[var(--border-color)]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Plano Atual</span>
                            <span className="text-xs font-bold text-[var(--accent-color)] border border-[var(--accent-color)] px-2 py-0.5 rounded">PRO</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Renova em 24 de Outubro.
                        </p>
                    </div>
                </WidgetCard>
            </div>

            {/* --- MODALS FOR DRILL-DOWN --- */}

            {/* 1. PROJECTS MODAL - ENHANCED WITH TASK PROGRESS */}
            {activeDetail === 'projects' && (
                <DetailsModal title="Projetos Ativos e Progresso" onClose={() => setActiveDetail(null)}>
                    <div className="space-y-4">
                        {activeProjects.length > 0 ? activeProjects.map(proj => {
                            const { total, completed, progress } = getProjectStats(proj.id);
                            return (
                                <div key={proj.id} className="p-4 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] flex flex-col gap-3 hover:border-blue-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)]">{proj.name}</h4>
                                            <p className="text-xs text-[var(--text-muted)]">{proj.client}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleGoToProject(proj.id)}
                                            className="text-xs bg-[var(--accent-color)] text-white px-3 py-1.5 rounded hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-1 shadow-lg shadow-[var(--accent-glow)]"
                                        >
                                            Ver Tarefas <ArrowRightIcon />
                                        </button>
                                    </div>
                                    
                                    {/* Task Progress Bar within Project Card */}
                                    <div className="bg-[var(--bg-card)] p-3 rounded-lg border border-[var(--border-color)]">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-[var(--text-secondary)] font-medium">Progresso de Tarefas</span>
                                            <span className="text-[var(--text-primary)] font-bold">{completed} / {total} Concluídas</span>
                                        </div>
                                        <div className="w-full bg-[var(--bg-elevation-2)] rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full transition-all duration-700" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : <p className="text-[var(--text-muted)] text-center py-4">Nenhum projeto ativo.</p>}
                    </div>
                </DetailsModal>
            )}

            {/* 3. CLIENTS MODAL */}
            {activeDetail === 'clients' && (
                <DetailsModal title="Novos Clientes (Este Mês)" onClose={() => setActiveDetail(null)}>
                    <div className="space-y-3">
                        {newClientsThisMonth.length > 0 ? newClientsThisMonth.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-3 bg-[var(--bg-elevation-1)] rounded-lg border border-[var(--border-color)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {c.name.substring(0,1)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">{c.name}</h4>
                                        <p className="text-xs text-[var(--text-muted)]">{c.companyName}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">Novo</span>
                            </div>
                        )) : <p className="text-[var(--text-muted)] text-center py-4">Nenhum novo cliente este mês.</p>}
                    </div>
                </DetailsModal>
            )}

            {/* 4. MEETINGS MODAL */}
            {activeDetail === 'meetings' && (
                <DetailsModal title="Agenda: Reuniões Marcadas" onClose={() => setActiveDetail(null)}>
                    <div className="space-y-3">
                        {meetingsList.length > 0 ? meetingsList.map(m => (
                            <div key={m.id} className="flex items-start gap-4 p-3 bg-[var(--bg-elevation-1)] rounded-lg border border-[var(--border-color)] border-l-4 border-l-indigo-500">
                                <div className="flex flex-col items-center min-w-[50px]">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">{new Date(m.dueDate).toLocaleString('pt-BR', {weekday: 'short'})}</span>
                                    <span className="text-xl font-light text-[var(--text-primary)]">{new Date(m.dueDate).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)]">{m.title}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{m.description || 'Sem descrição'}</p>
                                </div>
                            </div>
                        )) : <p className="text-[var(--text-muted)] text-center py-4">Nenhuma reunião agendada.</p>}
                    </div>
                </DetailsModal>
            )}

            {/* 5. DELIVERIES MODAL */}
            {activeDetail === 'deliveries' && (
                <DetailsModal title="Próximas Entregas (Tarefas Pendentes)" onClose={() => setActiveDetail(null)}>
                    <div className="space-y-3">
                        {deliveriesList.length > 0 ? deliveriesList.map(t => (
                            <div key={t.id} className="p-3 bg-[var(--bg-elevation-1)] rounded-lg border border-[var(--border-color)]">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.priority === 'ALTA' ? 'bg-rose-500/20 text-rose-500' : 'bg-sky-500/20 text-sky-500'}`}>{t.priority}</span>
                                    <span className="text-xs text-[var(--text-muted)]">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Sem data'}</span>
                                </div>
                                <h4 className="font-medium text-[var(--text-primary)]">{t.title}</h4>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Responsável: {t.assignee || 'N/A'}</p>
                            </div>
                        )) : <p className="text-[var(--text-muted)] text-center py-4">Tudo entregue!</p>}
                    </div>
                </DetailsModal>
            )}

        </div>
    );
};

export default OverviewPerformance;
