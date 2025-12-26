
import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import WidgetCard from '../dashboard/shared/WidgetCard';
import { FinanceDonutChart } from './FinanceCharts';

// Icons
const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

const ArrowDownLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

interface FinancialCockpitProps {
    onRequestAuditor?: () => void;
}

const FinancialCockpit: React.FC<FinancialCockpitProps> = ({ onRequestAuditor }) => {
  const { accounts, transactions, categories } = useFinance();

  const totalBalance = useMemo(() => accounts.reduce((acc, curr) => acc + curr.balance, 0), [accounts]);
  
  const recentTransactions = useMemo(() => {
      return [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
  }, [transactions]);

  const topExpensesData = useMemo(() => {
    const expenseMap = new Map<string, number>();
    transactions.filter(t => t.type === 'despesa').forEach(t => {
        const catName = categories.find(c => c.id === t.categoryId)?.name || 'Outros';
        expenseMap.set(catName, (expenseMap.get(catName) || 0) + t.amount);
    });
    
    const sorted = Array.from(expenseMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']; // Red, Yellow, Blue, Green
    
    return sorted.map(([label, value], index) => ({
        label,
        value,
        color: colors[index % colors.length]
    }));
  }, [transactions, categories]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6 pb-6">
        {/* Top Level Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Total Balance (Existing) */}
            <WidgetCard className="relative overflow-hidden group flex flex-col justify-center min-h-[180px]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-20 h-20 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39h-2.07c-.11-.92-.76-1.63-2.1-1.63-1.8 0-2.2.75-2.2 1.52 0 .73.84 1.22 2.67 1.66 2.51.6 4.18 1.75 4.18 3.71 0 1.77-1.39 2.95-3.27 3.27z"/></svg>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Caixa Total</h3>
                <p className="text-4xl font-light text-[var(--text-primary)] mt-2">{formatCurrency(totalBalance)}</p>
                <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-bold">
                    <span className="bg-emerald-500/20 p-1 rounded">▲ 12%</span> vs mês anterior
                </p>
            </WidgetCard>

            {/* Card 2: Recent History (New) */}
            <WidgetCard className="lg:col-span-1 flex flex-col min-h-[180px]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">Histórico Recente</h3>
                <div className="space-y-3 flex-grow">
                    {recentTransactions.length > 0 ? recentTransactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${t.type === 'receita' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                    {t.type === 'receita' ? <ArrowUpRightIcon className="w-4 h-4" /> : <ArrowDownLeftIcon className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{t.description}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-[var(--bg-elevation-2)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">{categories.find(c => c.id === t.categoryId)?.name}</span>
                                        <span className="text-[10px] text-[var(--text-muted)]">{formatDate(t.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`text-sm font-bold ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                            </span>
                        </div>
                    )) : (
                        <div className="text-center text-[var(--text-muted)] text-sm py-4">Sem transações recentes.</div>
                    )}
                </div>
            </WidgetCard>

            {/* Card 3: AI Quick Tip (New) */}
            <div className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white shadow-lg min-h-[180px]">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm">
                        <SparklesIcon className="w-6 h-6 text-blue-200" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Dica Rápida</h3>
                    <p className="text-blue-100/70 text-sm leading-relaxed">
                        Use nossa IA para analisar padrões nos seus gastos e descobrir onde economizar.
                    </p>
                </div>
                
                <div className="relative z-10 mt-4">
                    <button 
                        onClick={onRequestAuditor}
                        className="bg-white text-indigo-900 text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors shadow-md w-fit"
                    >
                        Consultar Agora
                    </button>
                </div>
            </div>
        </div>

        {/* Breakdown Row (Keep existing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
             <WidgetCard className="flex flex-col justify-center">
                 <h3 className="text-lg font-light text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-2">Distribuição de Gastos</h3>
                 <div className="flex justify-center py-4">
                     {topExpensesData.length > 0 ? (
                        <FinanceDonutChart data={topExpensesData} />
                     ) : (
                         <p className="text-[var(--text-muted)]">Sem dados de despesas</p>
                     )}
                 </div>
             </WidgetCard>

             <WidgetCard>
                 <h3 className="text-lg font-light text-[var(--text-primary)] mb-6 border-b border-[var(--border-color)] pb-2">Saldos por Conta</h3>
                 <div className="space-y-4">
                     {accounts.map(acc => (
                         <div key={acc.id} className="group flex items-center justify-between p-4 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-glow)]/10 transition-all duration-300">
                             <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${acc.type === 'bank' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                     {acc.type === 'bank' ? (
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                     ) : (
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                     )}
                                 </div>
                                 <div>
                                     <p className="font-medium text-[var(--text-primary)]">{acc.name}</p>
                                     <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{acc.type === 'bank' ? 'Conta Corrente' : 'Caixa Físico'}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                <span className="block font-mono font-bold text-[var(--text-primary)] text-lg">{formatCurrency(acc.balance)}</span>
                                <span className="text-xs text-emerald-500">Disponível</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </WidgetCard>
        </div>
    </div>
  );
};

export default FinancialCockpit;
