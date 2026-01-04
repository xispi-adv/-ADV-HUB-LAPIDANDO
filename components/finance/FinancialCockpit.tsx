
import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import WidgetCard from '../dashboard/shared/WidgetCard';
import { CategoryScientificChart, FinanceTrendChart } from './FinanceCharts';
import { Sparkles, ArrowUpRight, ArrowDownLeft, Calendar, TrendingUp, Layers, Activity, Share2, PieChart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AI_TIPS = [
    { title: "Sincronia de Caixa", text: "Alita detectou que suas entradas costumam ser maiores às terças. Ajuste vencimentos de boletos para este dia." },
    { title: "Dreno SaaS", text: "Identificamos 3 assinaturas com baixo uso nos últimos 30 dias. Economia potencial: R$ 450/mês." },
    { title: "Poder de Lucro", text: "Sua margem de sobra subiu 12%. Recomendamos investir mais em 'Tráfego Pago' para escalar." },
    { title: "Alerta de Risco", text: "Projeção mostra saldo negativo em 15 dias caso seus gastos atuais continuem nesse ritmo." }
];

const FinancialCockpit: React.FC<{ onRequestAuditor?: () => void }> = ({ onRequestAuditor }) => {
  const { transactions = [], categories = [], accounts = [] } = useFinance();
  const { theme } = useTheme();
  const [currentTip, setCurrentTip] = useState(0);
  const [analysisMode, setAnalysisMode] = useState<'receita' | 'despesa'>('despesa');

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
    if (!startDate || !endDate) return { trendData: [], distributionData: [], totalInPeriod: 0 };

    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    
    const periodTransactions = transactions.filter(t => {
        const td = new Date(t.date + 'T00:00:00');
        return td >= start && td <= end;
    });

    const trendMap = new Map<string, {revenue: number, expense: number}>();
    periodTransactions.forEach(t => {
        const existing = trendMap.get(t.date) || { revenue: 0, expense: 0 };
        if (t.type === 'receita') existing.revenue += t.amount;
        else existing.expense += t.amount;
        trendMap.set(t.date, existing);
    });

    const trendData = Array.from(trendMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, vals]) => ({
            label: new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}),
            ...vals
        }));

    const totalInPeriod = periodTransactions
        .filter(t => t.type === analysisMode && t.status === 'pago')
        .reduce((acc, t) => acc + t.amount, 0) || 1;

    const grouping = new Map<string, number>();
    periodTransactions
        .filter(t => t.type === analysisMode && t.status === 'pago')
        .forEach(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            const name = cat?.name || 'OUTROS';
            grouping.set(name, (grouping.get(name) || 0) + t.amount);
        });

    const distributionData = Array.from(grouping.entries()).map(([name, amount]) => ({
        name,
        amount,
        value: (amount / totalInPeriod) * 100
    })).sort((a, b) => b.amount - a.amount);

    return { trendData, distributionData, totalInPeriod: totalInPeriod === 1 ? 0 : totalInPeriod };
  }, [transactions, categories, startDate, endDate, analysisMode]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WidgetCard className="relative overflow-hidden group flex flex-col justify-center min-h-[220px] transition-all duration-500 bg-gradient-to-br from-[#0F0F11] to-black border-white/5">
                <div className="absolute -right-6 -bottom-6 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 text-white"><Layers size={200} /></div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Capital Disponível</h3>
                </div>
                <p className="text-5xl font-black tracking-tighter drop-shadow-lg text-white">{formatCurrency(financialSummary.balance)}</p>
                <div className="flex items-center gap-6 mt-8">
                    <div className="flex flex-col"><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Inflow</span><span className="text-base font-black text-emerald-400">+{formatCurrency(financialSummary.income)}</span></div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="flex flex-col"><span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Outflow</span><span className="text-base font-black text-rose-400">-{formatCurrency(financialSummary.expense)}</span></div>
                </div>
            </WidgetCard>

            <WidgetCard className="flex flex-col min-h-[220px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Últimos Lançamentos</h3>
                </div>
                <div className="space-y-4">
                    {recentTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between group/item">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${t.type === 'receita' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                                    {t.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-xs font-bold truncate max-w-[150px] ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t.description}</p>
                                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest opacity-60">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-black ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}</span>
                        </div>
                    ))}
                </div>
            </WidgetCard>

            <div className={`rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden text-white shadow-2xl border min-h-[220px] group transition-all duration-500 ${theme === 'light' ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-400/20' : 'bg-gradient-to-br from-[#1e1b4b] to-[#312e81] border-blue-500/20'}`}>
                <div className="absolute -right-4 -top-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000"><Sparkles size={120} className="text-blue-300" /></div>
                <div className="relative z-10 animate-fade-in" key={currentTip}>
                    <div className="flex items-center gap-2 mb-4 font-black uppercase tracking-[0.4em] text-blue-100 text-[9px]"><Sparkles size={14} className="text-white" /> Auditoria Neural</div>
                    <h3 className="text-xl font-black mb-3 tracking-tighter">{AI_TIPS[currentTip].title}</h3>
                    <p className="text-blue-100/70 text-[13px] leading-relaxed font-medium min-h-[60px]">{AI_TIPS[currentTip].text}</p>
                </div>
                <button onClick={onRequestAuditor} className="relative z-10 bg-white text-[#1e1b4b] text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl w-full active:scale-95 mt-4">Consultar Alita</button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
            <WidgetCard className="p-10 overflow-hidden relative flex flex-col transition-colors duration-500 bg-[#08080A] border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-white"><TrendingUp size={180} /></div>
                
                <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.4em]">Integrated Intelligence Panel</span>
                            <div className="w-8 h-px bg-emerald-500 opacity-30"></div>
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Telemetria de Fluxo</h3>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 px-4 rounded-2xl border shadow-2xl backdrop-blur-md bg-white/[0.03] border-white/5">
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

                <div className="w-full h-72 mb-12 relative z-10 border-b border-white/5 pb-10">
                    <FinanceTrendChart data={analyticsData.trendData} forceTheme="dark" />
                </div>

                <div className="flex flex-col xl:flex-row gap-12 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Share2 size={20} className="text-blue-500" />
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Distribuição por Categoria (Orbital)</h3>
                            </div>
                            
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md">
                                <button 
                                    onClick={() => setAnalysisMode('despesa')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${analysisMode === 'despesa' ? 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e]' : 'text-white/40 hover:text-white'}`}
                                >
                                    <ArrowDownLeft size={14} /> Despesas
                                </button>
                                <button 
                                    onClick={() => setAnalysisMode('receita')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${analysisMode === 'receita' ? 'bg-emerald-500 text-white shadow-[0_0_15px_#10b981]' : 'text-white/40 hover:text-white'}`}
                                >
                                    <ArrowUpRight size={14} /> Receitas
                                </button>
                            </div>
                        </div>
                        
                        <div className="w-full h-[500px] flex flex-col md:flex-row items-center gap-12 bg-white/[0.01] border border-white/5 rounded-[3rem] p-8 shadow-inner">
                            <div className="flex-1 h-full">
                                <CategoryScientificChart 
                                    data={analyticsData.distributionData} 
                                    mode={analysisMode}
                                    total={analyticsData.totalInPeriod}
                                    forceTheme="dark" 
                                />
                            </div>
                            
                            <div className="w-full md:w-80 space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 flex items-center gap-2">
                                    <PieChart size={14} /> Ranking de Volume
                                </h4>
                                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                    {analyticsData.distributionData.map((item, idx) => (
                                        <div key={item.name} className="flex flex-col gap-2 group cursor-default">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                                <span className="text-white/60 group-hover:text-white transition-colors">{item.name}</span>
                                                <span className={analysisMode === 'receita' ? 'text-emerald-500' : 'text-rose-500'}>
                                                    {item.value.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-[1500ms] ease-out ${analysisMode === 'receita' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} 
                                                    style={{ width: `${item.value}%` }} 
                                                />
                                            </div>
                                            <p className="text-[9px] text-white/20 font-mono">VALOR: {formatCurrency(item.amount)}</p>
                                        </div>
                                    ))}
                                    {analyticsData.distributionData.length === 0 && (
                                        <p className="text-[10px] text-white/20 italic">Aguardando telemetria...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full xl:w-96 flex flex-col gap-6 pt-16">
                        <div className={`p-8 rounded-[2.5rem] border flex items-start gap-4 transition-colors ${analysisMode === 'despesa' ? 'bg-rose-500/[0.03] border-rose-500/10' : 'bg-emerald-500/[0.03] border-emerald-500/10'}`}>
                            <Activity size={20} className={analysisMode === 'despesa' ? 'text-rose-500' : 'text-emerald-500'} />
                            <div>
                                <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${analysisMode === 'despesa' ? 'text-rose-400' : 'text-emerald-400'}`}>Insights Alita</span>
                                <p className="text-xs text-white/60 leading-relaxed">
                                    {analysisMode === 'despesa' 
                                        ? "Detectamos uma concentração atípica em recursos operacionais. Sugerimos revisar o orçamento de SaaS para este período."
                                        : "O fluxo de recebimentos via contratos recorrentes cresceu 18%. Momento ideal para reinvestir em infraestrutura."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </WidgetCard>
        </div>
    </div>
  );
};

export default FinancialCockpit;
