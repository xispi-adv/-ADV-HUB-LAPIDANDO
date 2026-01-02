
import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import WidgetCard from '../dashboard/shared/WidgetCard';
import { FinanceRadarChart, FinanceTrendChart } from './FinanceCharts';
import { Sparkles, ArrowUpRight, ArrowDownLeft, Wallet, BarChart3, ChevronRight, Info, Calendar, TrendingUp, Layers, Activity } from 'lucide-react';

const AI_TIPS = [
    { title: "Sincronia de Caixa", text: "Alita detectou que suas entradas costumam ser maiores às terças. Ajuste vencimentos de boletos para este dia.", action: "Otimizar Ciclo" },
    { title: "Dreno SaaS", text: "Identificamos 3 assinaturas com baixo uso nos últimos 30 dias. Economia potencial: R$ 450/mês.", action: "Verificar Contas" },
    { title: "Poder de Lucro", text: "Sua margem de sobra subiu 12%. Recomendamos investir mais em 'Tráfego Pago' para escalar.", action: "Aumentar Escala" },
    { title: "Alerta de Risco", text: "Projeção mostra saldo negativo em 15 dias caso seus gastos atuais continuem nesse ritmo.", action: "Ver Projeção" }
];

const FinancialCockpit: React.FC<{ onRequestAuditor?: () => void }> = ({ onRequestAuditor }) => {
  const { transactions, categories, accounts } = useFinance();
  const [currentTip, setCurrentTip] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (transactions.length > 0) {
        const sortedDates = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setStartDate(sortedDates[0].date);
        setEndDate(sortedDates[sortedDates.length - 1].date);
    } else {
        const now = new Date();
        setStartDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
        setEndDate(now.toISOString().split('T')[0]);
    }
  }, [transactions]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTip(prev => (prev + 1) % AI_TIPS.length), 8000);
    return () => clearInterval(timer);
  }, []);

  const financialSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = accounts.reduce((a, b) => a + b.balance, 0);
    return { income, expense, balance: totalBalance };
  }, [transactions, accounts]);

  const recentTransactions = useMemo(() => {
      return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  }, [transactions]);

  const analyticsData = useMemo(() => {
    if (!startDate || !endDate) return { trendData: [], daysInRange: 0, metrics: null, categoryData: [] };

    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysInRange = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

    const trendData: { label: string, revenue: number, expense: number }[] = [];
    const allocationMap = new Map<string, number>();

    for (let i = 0; i < daysInRange; i++) {
        const currentLoopDate = new Date(start);
        currentLoopDate.setDate(start.getDate() + i);
        const dateStr = currentLoopDate.toISOString().split('T')[0];
        const dayT = transactions.filter(t => t.date === dateStr);
        trendData.push({
            label: currentLoopDate.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}),
            revenue: dayT.filter(t => t.type === 'receita').reduce((a, b) => a + b.amount, 0),
            expense: dayT.filter(t => t.type === 'despesa').reduce((a, b) => a + b.amount, 0)
        });
    }

    const periodTransactions = transactions.filter(t => {
        const td = new Date(t.date + 'T00:00:00');
        return td >= start && td <= end;
    });

    const totalPeriodExpense = periodTransactions.filter(t => t.type === 'despesa').reduce((acc, t) => acc + t.amount, 0) || 1;
    
    categories.filter(c => c.type === 'despesa').forEach(cat => {
        const catTotal = periodTransactions.filter(t => t.categoryId === cat.id).reduce((acc, t) => acc + t.amount, 0);
        if (catTotal > 0) allocationMap.set(cat.name, catTotal);
    });

    const categoryData = Array.from(allocationMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, amount]) => ({
            id: categories.find(c => c.name === name)?.id || name,
            name: name.toUpperCase(),
            amount,
            percentage: Math.round((amount / totalPeriodExpense) * 100)
        }));

    const totalIncome = financialSummary.income || 1;
    const totalExpense = financialSummary.expense || 1;
    const margin = Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100);
    
    const metrics = {
        profitMargin: Math.min(100, margin * 1.5),
        retention: 85,
        roi: 72,
        liquidity: Math.min(100, (financialSummary.balance / totalExpense) * 20),
        taxEfficiency: 90,
        growthMoM: 65,
        fixedCosts: Math.min(100, 100 - (totalExpense / totalIncome) * 50),
        inboundFlow: Math.min(100, (totalIncome / 20000) * 100),
        burnRate: Math.max(0, 100 - (totalExpense / financialSummary.balance) * 100),
        investment: 40,
        cashHealth: Math.min(100, (financialSummary.balance / 10000) * 100)
    };

    return { trendData, daysInRange, metrics, categoryData };
  }, [transactions, categories, financialSummary, startDate, endDate]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 pb-20">
        {/* Row 1: Hero KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WidgetCard className="relative overflow-hidden group flex flex-col justify-center min-h-[220px] bg-gradient-to-br from-[#0F0F11] to-black">
                <div className="absolute -right-6 -bottom-6 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700"><Layers size={200} /></div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                    <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Dinheiro em Caixa (Saldo)</h3>
                </div>
                <p className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">{formatCurrency(financialSummary.balance)}</p>
                <div className="flex items-center gap-6 mt-8">
                    <div className="flex flex-col"><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Dinheiro Entrando</span><span className="text-base font-black text-emerald-400">+{formatCurrency(financialSummary.income)}</span></div>
                    <div className="w-px h-10 bg-white/5"></div>
                    <div className="flex flex-col"><span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Dinheiro Saindo</span><span className="text-base font-black text-rose-400">-{formatCurrency(financialSummary.expense)}</span></div>
                </div>
            </WidgetCard>

            <WidgetCard className="flex flex-col min-h-[220px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Últimos Lançamentos</h3>
                    <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded text-[var(--text-muted)] font-black uppercase tracking-widest">Sincronizado</span>
                </div>
                <div className="space-y-4">
                    {recentTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between group/item">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${t.type === 'receita' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                                    {t.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate max-w-[150px]">{t.description}</p>
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest opacity-60">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-black ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}</span>
                        </div>
                    ))}
                </div>
            </WidgetCard>

            <div className="rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white shadow-2xl border border-blue-500/20 min-h-[220px] group">
                <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000"><Sparkles size={120} className="text-blue-300" /></div>
                <div className="relative z-10 animate-fade-in" key={currentTip}>
                    <div className="flex items-center gap-2 mb-4 font-black uppercase tracking-[0.4em] text-blue-300 text-[9px]"><Sparkles size={14} className="text-blue-400" /> Auditor Financeiro</div>
                    <h3 className="text-xl font-black mb-3 tracking-tighter">{AI_TIPS[currentTip].title}</h3>
                    <p className="text-blue-100/70 text-[13px] leading-relaxed font-medium min-h-[60px]">{AI_TIPS[currentTip].text}</p>
                </div>
                <button onClick={onRequestAuditor} className="relative z-10 bg-white text-[#1e1b4b] text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl w-full active:scale-95 mt-4">Falar com Especialista</button>
            </div>
        </div>

        {/* --- GLOBAL COMMAND BLOCK (REDESIGNED 1, 1.1, 1.2) --- */}
        <div className="grid grid-cols-1 gap-6">
            <WidgetCard className="p-10 overflow-hidden relative flex flex-col bg-[#08080A]">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><TrendingUp size={180} /></div>
                
                <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.4em]">Análise Integrada de Dados</span>
                            <div className="w-8 h-px bg-emerald-500 opacity-30"></div>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Movimentação de Dinheiro</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white/[0.03] p-2 px-4 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md">
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={12} className="text-emerald-500" />
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[11px] font-black outline-none cursor-pointer hover:text-emerald-500 transition-colors uppercase" />
                        </div>
                        <div className="w-px h-6 bg-white/10"></div>
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={12} className="text-rose-500" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[11px] font-black outline-none cursor-pointer hover:text-rose-400 transition-colors uppercase" />
                        </div>
                    </div>
                </header>

                {/* 1. MAIN TREND CHART (TOP) */}
                <div className="w-full h-72 mb-12 relative z-10 border-b border-white/5 pb-10">
                    <FinanceTrendChart data={analyticsData.trendData} />
                </div>

                <div className="flex flex-col gap-12 relative z-10">
                    
                    {/* 2. INTELLIGENCE LOG CARDS (ABOVE RADAR) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all cursor-default group/insight backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_#ef4444]"></div>Aviso de Despesa</p>
                                <Activity size={16} className="text-rose-500 opacity-40 group-hover/insight:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[13px] text-white/40 leading-relaxed font-medium">Gastos acima do normal detectados em 'Infra'. Sugerimos revisar as contas para economizar no próximo mês.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all cursor-default group/insight backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></div>Sinal de Lucro</p>
                                <TrendingUp size={16} className="text-emerald-500 opacity-40 group-hover/insight:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[13px] text-white/40 leading-relaxed font-medium">Suas entradas subiram 14% nos últimos {analyticsData.daysInRange} dias. Seu negócio está ganhando tração e saúde financeira.</p>
                        </div>
                    </div>

                    {/* 3. NEURAL ALLOCATION ENGINE - EXPANDED SCALE (BELOW LOGS) */}
                    <div className="w-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Motor de Inteligência de Gastos</span>
                            <div className="flex-grow h-px bg-white/5 opacity-50"></div>
                        </div>
                        {analyticsData.metrics && (
                            <FinanceRadarChart 
                                metrics={analyticsData.metrics} 
                                categoryData={analyticsData.categoryData}
                                budgetRange={[130, 229]} 
                            />
                        )}
                    </div>

                    {/* 4. CANAIS DE INVESTIMENTO (FOOTER INTEGRATION 1.2) */}
                    <div className="mt-12 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-4 mb-10">
                            <BarChart3 className="text-rose-500 w-5 h-5" />
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Distribuição por Plataformas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Meta Ads', balance: 5200.40, color: 'bg-blue-600', icon: 'M', p: 80 },
                                { name: 'Google Ads', balance: 3450.00, color: 'bg-red-600', icon: 'G', p: 65 },
                                { name: 'TikTok Ads', balance: 1200.00, color: 'bg-black border border-white/20', icon: 'T', p: 30 },
                            ].map(acc => (
                                <div key={acc.name} className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${acc.color} flex items-center justify-center font-black text-white text-[11px] shadow-2xl group-hover:scale-110 transition-transform`}>{acc.icon}</div>
                                            <span className="text-xs font-black text-white uppercase tracking-tight">{acc.name}</span>
                                        </div>
                                        <span className="font-mono font-black text-white text-xs">{formatCurrency(acc.balance)}</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10b981] shadow-[0_0_10px_#10b981] transition-all duration-1000" style={{ width: `${acc.p}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 flex justify-center">
                            <button className="px-10 py-5 bg-white/5 hover:bg-[var(--accent-color)] hover:text-white text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] rounded-2xl transition-all border border-white/10 shadow-2xl active:scale-95 group">
                                <span className="flex items-center gap-3">Matriz de Performance Avançada <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </WidgetCard>
        </div>
    </div>
  );
};

export default FinancialCockpit;
