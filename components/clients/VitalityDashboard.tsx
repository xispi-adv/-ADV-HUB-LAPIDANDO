
import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { useCalendar } from '../../context/CalendarContext';
import type { Client, Task, Transaction, CalendarTask, ClientActivity } from '../../types';
import { 
    Heart, Activity, AlertOctagon, TrendingUp, Zap, 
    Calendar as CalendarIcon, CheckCircle2, Target, 
    DollarSign, ArrowUpRight, ArrowDownRight, Clock,
    Ban, CalendarCheck
} from 'lucide-react';

interface VitalityDashboardProps {
    client: Client;
    tasks: Task[];
}

const VitalityDashboard: React.FC<VitalityDashboardProps> = ({ client, tasks: allTasks }) => {
    const { theme } = useTheme();
    const { transactions } = useFinance();
    const { tasks: allCalendarTasks } = useCalendar();

    // 1. FILTRAGEM DE DADOS VINCULADOS AO CLIENTE
    const clientTransactions = useMemo(() => 
        transactions.filter(t => t.clientId === client.id), 
    [transactions, client.id]);

    const clientCalendarTasks = useMemo(() => 
        allCalendarTasks.filter(t => t.clientId === client.id), 
    [allCalendarTasks, client.id]);

    const clientTasks = useMemo(() => 
        allTasks.filter(t => {
            // Verifica se a tarefa está ligada ao cliente via projeto ou descrição
            const isRelated = t.description?.toLowerCase().includes(client.name.toLowerCase()) || 
                             t.title.toLowerCase().includes(client.name.toLowerCase());
            return isRelated;
        }), 
    [allTasks, client.name]);

    // 2. ENGINE DE BIOMETRIA (HISTOGRAMA DE ATIVIDADE - 30 DIAS)
    const { ecgData, totalInteractions } = useMemo(() => {
        const data = [];
        const now = new Date();
        let interactionsCount = 0;

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Soma de todas as interações no dia
            const dailyFin = clientTransactions.filter(t => t.date === dateStr).length;
            const dailyCal = clientCalendarTasks.filter(t => t.dueDate === dateStr).length;
            const dailyTasks = clientTasks.filter(t => t.dueDate === dateStr).length;
            const dailyLogs = (client.activities || []).filter(a => a.dateOccurred.split('T')[0] === dateStr).length;

            const totalDay = dailyFin + dailyCal + dailyTasks + dailyLogs;
            interactionsCount += totalDay;

            data.push({
                day: date.getDate(),
                fullDate: dateStr,
                value: totalDay,
                // Breakdown para o tooltip
                fin: dailyFin,
                cal: dailyCal,
                task: dailyTasks,
                log: dailyLogs
            });
        }
        return { ecgData: data, totalInteractions: interactionsCount };
    }, [clientTransactions, clientCalendarTasks, clientTasks, client.activities]);

    // 3. CÁLCULO DE MÉTRICAS DO PANORAMA GERAL
    const metrics = useMemo(() => {
        // Atrasos
        const overdue = clientTasks.filter(t => 
            t.status !== 'CONCLUIDO' && new Date(t.dueDate) < new Date()
        ).length;

        // Reuniões
        const meetings = clientCalendarTasks.filter(t => t.category === 'REUNIAO');
        const finishedMeetings = meetings.filter(t => t.status === 'CONCLUIDO').length;
        const cancelledMeetings = meetings.filter(t => t.status === 'REVISAO').length; // Usando REVISAO como proxy para cancelado/pendente de nota
        const scheduledMeetings = meetings.filter(t => t.status === 'A_FAZER' || t.status === 'EM_PROGRESSO').length;

        // Objetivos e Metas (KR)
        const objectives = client.objectives || [];
        const completedObjectives = objectives.filter(o => o.status === 'CONCLUIDO').length;
        const openObjectives = objectives.length - completedObjectives;

        const allKRs = objectives.flatMap(o => o.keyResults || []);
        const reachedKRs = allKRs.filter(kr => kr.isCompleted).length;
        const openKRs = allKRs.length - reachedKRs;

        // Saúde Financeira
        const totalRevenue = clientTransactions.filter(t => t.type === 'receita').reduce((acc, t) => acc + t.amount, 0);
        const totalExpense = clientTransactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + t.amount, 0);
        const netMargin = totalRevenue - totalExpense;
        const financialHealthScore = totalRevenue > 0 ? (netMargin / totalRevenue) * 100 : 0;

        // Cálculo de Vitality Score (0-100)
        let score = 80; // Base
        score -= overdue * 5;
        score += (reachedKRs / (allKRs.length || 1)) * 20;
        if (netMargin < 0) score -= 15;
        const finalScore = Math.min(Math.max(Math.round(score), 0), 100);

        return {
            overdue,
            finishedMeetings, cancelledMeetings, scheduledMeetings,
            completedObjectives, openObjectives,
            reachedKRs, openKRs,
            totalRevenue, totalExpense, netMargin, financialHealthScore,
            finalScore
        };
    }, [clientTasks, clientCalendarTasks, client.objectives, clientTransactions]);

    const stateConfig = metrics.finalScore > 75 ? {
        color: '#10b981', label: 'Operação Nominal', emoji: '😇', pulse: false, bg: 'from-emerald-600/20'
    } : metrics.finalScore > 50 ? {
        color: '#fbbf24', label: 'Atenção Necessária', emoji: '😰', pulse: false, bg: 'from-amber-400/20'
    } : {
        color: '#e11d48', label: 'Risco de Churn Crítico', emoji: '😡', pulse: true, bg: 'from-rose-600/30'
    };

    const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="relative min-h-screen -m-10 p-10 overflow-hidden bg-[#0F1014] text-white">
            
            {/* BACKGROUND DECOR */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-[2000ms] ${stateConfig.bg} bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-50`}></div>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
                            <Heart className="text-rose-500 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.4em]">Integrated Bio-Analytics</h2>
                            <p className="text-3xl font-black tracking-tighter uppercase">VITALITY_PULSE v2.8</p>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl text-right">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Intensidade de Atividade</p>
                        <p className="text-xl font-black text-emerald-500">{totalInteractions} <span className="text-xs opacity-40">Interações / 30d</span></p>
                    </div>
                </div>

                {/* ECG CHART */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 h-72 relative group overflow-hidden">
                    <div className="absolute top-8 left-10 flex items-center gap-3">
                        <Activity className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Fluxo de Batimentos da Conta</span>
                    </div>
                    
                    <div className="w-full h-full pt-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ecgData}>
                                <defs>
                                    <linearGradient id="ecgGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={stateConfig.color} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={stateConfig.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" hide />
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-black/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[180px]">
                                                    <p className="text-[9px] font-black uppercase text-white/40 mb-3 border-b border-white/10 pb-2">{d.fullDate}</p>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-bold"><span>Finanças</span><span className="text-emerald-500">+{d.fin}</span></div>
                                                        <div className="flex justify-between text-[10px] font-bold"><span>Agenda</span><span className="text-blue-500">+{d.cal}</span></div>
                                                        <div className="flex justify-between text-[10px] font-bold"><span>Tarefas</span><span className="text-purple-500">+{d.task}</span></div>
                                                        <div className="flex justify-between text-[10px] font-bold"><span>Registros</span><span className="text-orange-500">+{d.log}</span></div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={stateConfig.color} 
                                    strokeWidth={3}
                                    fill="url(#ecgGrad)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PANORAMA GERAL - GRID DE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* CARD 1: OPERACIONAL */}
                    <MetricCard 
                        title="Status Operacional"
                        icon={<Zap size={20} />}
                        color="rose"
                        metrics={[
                            { label: 'Tarefas em Atraso', value: metrics.overdue, critical: metrics.overdue > 0 },
                            { label: 'Taxa de Entrega', value: '88%', sub: 'vs 92% meta' }
                        ]}
                    />

                    {/* CARD 2: AGENDA & REUNIÕES */}
                    <MetricCard 
                        title="Agenda de Contato"
                        icon={<CalendarIcon size={20} />}
                        color="blue"
                        metrics={[
                            { label: 'Finalizadas', value: metrics.finishedMeetings, icon: <CalendarCheck size={12} className="text-emerald-500" /> },
                            { label: 'Pendentes/Agendadas', value: metrics.scheduledMeetings, icon: <Clock size={12} className="text-blue-500" /> },
                            { label: 'Canceladas', value: metrics.cancelledMeetings, icon: <Ban size={12} className="text-rose-500" /> }
                        ]}
                    />

                    {/* CARD 3: ESTRATÉGIA OKR */}
                    <MetricCard 
                        title="Objetivos & Metas"
                        icon={<Target size={20} />}
                        color="purple"
                        metrics={[
                            { label: 'Objetivos Concluídos', value: `${metrics.completedObjectives}/${metrics.completedObjectives + metrics.openObjectives}` },
                            { label: 'Metas (KRs) Alcançadas', value: metrics.reachedKRs, sub: `${metrics.openKRs} em aberto` }
                        ]}
                    />

                    {/* CARD 4: SAÚDE FINANCEIRA */}
                    <MetricCard 
                        title="Saúde Financeira"
                        icon={<DollarSign size={20} />}
                        color="emerald"
                        metrics={[
                            { label: 'Margem Net', value: formatBRL(metrics.netMargin), critical: metrics.netMargin < 0 },
                            { label: 'Score ROI', value: `${metrics.financialHealthScore.toFixed(0)}%`, sub: metrics.netMargin >= 0 ? 'Lucrativo' : 'Déficit' }
                        ]}
                    />
                </div>

                {/* THE CORE DIAGNOSIS */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        <div className="relative">
                            <div className="w-40 h-40 rounded-full border-8 border-white/5 flex items-center justify-center text-6xl shadow-2xl transition-transform duration-700 group-hover:scale-110"
                                 style={{ background: `radial-gradient(circle, ${stateConfig.color}22 0%, transparent 80%)` }}>
                                {stateConfig.emoji}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black border border-white/10 shadow-2xl">
                                <span className="text-2xl font-black" style={{ color: stateConfig.color }}>{metrics.finalScore}</span>
                                <span className="text-[8px] font-bold text-white/40 ml-1 uppercase">Vitality</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <h3 className="text-3xl font-black uppercase tracking-tighter">{stateConfig.label}</h3>
                            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
                                O algoritmo Alita detectou um score de vitalidade de {metrics.finalScore}%. 
                                {metrics.overdue > 0 ? ` Atenção redobrada aos ${metrics.overdue} atrasos operacionais que estão drenando a confiança do cliente.` : ' A operação segue com fluxo saudável e entregas em dia.'}
                                {metrics.netMargin < 0 ? ' Alerta: A conta está operando com margem negativa no período filtrado.' : ''}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                <button className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl">Baixar Report Vitality</button>
                                <button className="px-8 py-3 bg-white/5 border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-all">Ver Auditoria Financeira</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// SUB-COMPONENT: METRIC CARD
const MetricCard: React.FC<{ 
    title: string, 
    icon: React.ReactNode, 
    color: string, 
    metrics: { label: string, value: string | number, sub?: string, icon?: React.ReactNode, critical?: boolean }[] 
}> = ({ title, icon, color, metrics }) => {
    const colorMap: any = {
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    };

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 hover:bg-white/[0.05] transition-all group shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
                    {icon}
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{title}</h4>
            </div>
            
            <div className="space-y-5">
                {metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white/40 uppercase mb-0.5 truncate">{m.label}</p>
                            {m.sub && <p className="text-[9px] text-white/20 font-medium">{m.sub}</p>}
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                {m.icon}
                                <span className={`text-lg font-black tracking-tighter ${m.critical ? 'text-rose-500' : 'text-white'}`}>
                                    {m.value}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VitalityDashboard;
