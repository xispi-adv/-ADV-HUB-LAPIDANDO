
import React, { useMemo } from 'react';
import type { Client, ClientActivity, ClientObjective } from '../../types';
import { useTaskManager } from '../../context/TaskManagerContext';
import { useTheme } from '../../context/ThemeContext';
import { 
    Activity, 
    AlertTriangle, 
    Target, 
    CheckCircle2, 
    Circle, 
    Sparkles, 
    TrendingDown, 
    TrendingUp, 
    ShieldAlert,
    BarChart3
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ClientHealthMonitorProps {
    client: Client;
}

const ClientHealthMonitor: React.FC<ClientHealthMonitorProps> = ({ client }) => {
    const { theme } = useTheme();
    const { tasks } = useTaskManager();

    // 1. DATA MINING & CALCULATION
    const stats = useMemo(() => {
        const activities = client.activities || [];
        const objectives = client.objectives || [];
        
        // Filter tasks for this client
        const clientTasks = tasks.filter(t => t.projectId && t.projectId.includes(client.id)); // Assuming project IDs relate to client
        const overdueTasks = clientTasks.filter(t => {
            const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'CONCLUIDO';
            return isOverdue;
        });

        const complaints = activities.filter(a => a.type === 'COMPLAINT');
        const incidents = activities.filter(a => a.type === 'INCIDENT');
        const completedGoals = objectives.filter(o => o.status === 'CONCLUIDO');

        // CALCULATION (Deterministic Algorithm)
        // Base: 100
        let score = 100;
        score -= (complaints.length * 15);
        score -= (incidents.length * 10);
        score -= (overdueTasks.length * 2);
        score += (completedGoals.length * 10);

        // Clamping 0-100
        const finalScore = Math.max(0, Math.min(100, score));

        return {
            score: finalScore,
            complaints: complaints.length,
            incidents: incidents.length,
            overdue: overdueTasks.length,
            completedTasks: clientTasks.filter(t => t.status === 'CONCLUIDO').length,
            totalTasks: clientTasks.length,
            goals: completedGoals.length,
            totalGoals: objectives.length,
            level: finalScore >= 80 ? 'SAUDÁVEL' : finalScore >= 50 ? 'EM_RISCO' : 'CRÍTICO'
        };
    }, [client, tasks]);

    const chartData = [{ name: 'Health', value: stats.score, fill: stats.level === 'SAUDÁVEL' ? '#10b981' : stats.level === 'EM_RISCO' ? '#f59e0b' : '#ef4444' }];

    const getDiagnosis = () => {
        if (stats.level === 'SAUDÁVEL') {
            return {
                summary: "Operação em alta performance. O cliente apresenta altos índices de satisfação e metas sendo batidas conforme cronograma.",
                action: "Solicitar depoimento (Case de Sucesso) ou apresentar nova proposta de Upsell.",
                sentiment: "positive"
            };
        } else if (stats.level === 'EM_RISCO') {
            return {
                summary: "Alerta de engajamento detectado. Algumas pendências operacionais estão impactando a percepção de valor.",
                action: "Agendar call de alinhamento imediata para revisar prazos de entregas pendentes.",
                sentiment: "neutral"
            };
        }
        return {
            summary: "Risco iminente de Churn. O volume de reclamações e incidentes técnicos ultrapassou o limite de segurança.",
            action: "War Room: Gestor de conta deve intervir pessoalmente e oferecer plano de recuperação de danos.",
            sentiment: "negative"
        };
    };

    const diagnosis = getDiagnosis();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* HERO SECTION: SCORE + AI DIAGNOSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* RADIAL GAUGE */}
                <div className={`col-span-1 border rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-500
                    ${theme === 'light' ? 'bg-white border-slate-100' : 'bg-[#1A1B23] border-white/5'}`}
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <Activity size={300} className="absolute -right-20 -bottom-20 rotate-12" />
                    </div>
                    
                    <div className="w-full h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                                cx="50%" cy="50%" 
                                innerRadius="80%" outerRadius="100%" 
                                barSize={20} 
                                data={chartData} 
                                startAngle={180} endAngle={0}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background dataKey="value" cornerRadius={30} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                            <span className={`text-6xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {stats.score}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Health Score</span>
                        </div>
                    </div>

                    <div className={`mt-6 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500
                        ${stats.level === 'SAUDÁVEL' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          stats.level === 'EM_RISCO' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-pulse'}`}
                    >
                        STATUS: {stats.level}
                    </div>
                </div>

                {/* AI DIAGNOSIS CARD */}
                <div className={`col-span-1 lg:col-span-2 border rounded-[3rem] p-10 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-500
                    ${theme === 'light' ? 'bg-blue-50/50 border-blue-100 shadow-blue-900/5' : 'bg-gradient-to-br from-[#1e1b4b] to-[#0F1014] border-white/5'}`}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} className="text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <Sparkles size={20} className="text-blue-400" />
                             </div>
                             <h3 className="text-xl font-black text-white tracking-tight uppercase">Diagnóstico da Inteligência</h3>
                        </div>
                        
                        <p className="text-white/80 text-lg leading-relaxed font-medium mb-8">
                            "{diagnosis.summary}"
                        </p>
                    </div>

                    <div className="relative z-10 p-6 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-2">Ação Recomendada</span>
                        <div className="flex items-center gap-3 text-white font-bold">
                            <TrendingUp size={18} className="text-emerald-500" />
                            {diagnosis.action}
                        </div>
                    </div>
                </div>
            </div>

            {/* BENTO PILLARS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* PILLAR: OPERACIONAL */}
                <div className={`group p-8 rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-1 shadow-sm
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1A1B23] border-white/5'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                            <BarChart3 size={24} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Eficiência</span>
                    </div>
                    <h4 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Operacional</h4>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-[var(--text-secondary)]">Tasks On-Time</span>
                                <span className={`text-sm font-black ${stats.overdue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {stats.overdue} Atrasadas
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-1000" 
                                    style={{ width: `${(stats.completedTasks / (stats.totalTasks || 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                            A velocidade de entrega é um fator crítico para a retenção deste cliente.
                        </p>
                    </div>
                </div>

                {/* PILLAR: RELACIONAMENTO */}
                <div className={`group p-8 rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-1 shadow-sm
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1A1B23] border-white/5'}
                    ${stats.complaints > 0 ? 'ring-1 ring-rose-500/20 border-rose-500/30' : ''}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className={`p-3 rounded-2xl ${stats.complaints > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {stats.complaints > 0 ? <ShieldAlert size={24} /> : <TrendingUp size={24} />}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Sentimento</span>
                    </div>
                    <h4 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Relacionamento</h4>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className={`text-4xl font-black tracking-tighter ${stats.complaints > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {stats.complaints}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">Reclamações</span>
                    </div>
                    
                    <div className="p-4 bg-black/10 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium">
                            {stats.complaints === 0 
                                ? "Nenhum sinal de insatisfação registrado nos últimos 30 dias." 
                                : "Atenção: Múltiplos tickets de insatisfação detectados."}
                        </p>
                    </div>
                </div>

                {/* PILLAR: ESTRATÉGICO */}
                <div className={`group p-8 rounded-[2.5rem] border transition-all duration-300 hover:-translate-y-1 shadow-sm
                    ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1A1B23] border-white/5'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                            <Target size={24} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Sucesso</span>
                    </div>
                    <h4 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Estratégico</h4>
                    
                    <div className="space-y-3 max-h-[120px] overflow-y-auto custom-scrollbar">
                        {client.objectives?.slice(0, 3).map(obj => (
                            <div key={obj.id} className="flex items-center gap-3">
                                {obj.status === 'CONCLUIDO' ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                ) : (
                                    <Circle size={16} className="text-white/10" />
                                )}
                                <span className={`text-xs font-bold truncate ${obj.status === 'CONCLUIDO' ? 'opacity-40' : ''}`}>
                                    {obj.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2 text-purple-500">
                            <span className="text-xl font-black">{Math.round((stats.goals / (stats.totalGoals || 1)) * 100)}%</span>
                            <span className="text-[9px] font-black uppercase tracking-widest">Metas Batidas</span>
                         </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientHealthMonitor;
