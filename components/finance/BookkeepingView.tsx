
import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from './TransactionModal';
import { Trash2, Search, Download, Calendar, Plus, ArrowRightLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BookkeepingView: React.FC = () => {
  const { transactions, deleteTransaction, categories, accounts } = useFinance();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters - Initialized as empty to show all "latest" by default
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'receita' | 'despesa'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
      return transactions.filter(t => {
          const tDate = new Date(t.date + 'T00:00:00');
          const start = startDate ? new Date(startDate + 'T00:00:00') : null;
          const end = endDate ? new Date(endDate + 'T23:59:59') : null;

          const matchSearch = t.description.toLowerCase().includes(search.toLowerCase());
          const matchType = typeFilter === 'all' || t.type === typeFilter;
          const matchDate = (!start || tDate >= start) && (!end || tDate <= end);
          
          return matchSearch && matchType && matchDate;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, typeFilter, startDate, endDate]);

  const totals = useMemo(() => {
      const entradas = filteredTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((a, b) => a + b.amount, 0);
      const saidas = filteredTransactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((a, b) => a + b.amount, 0);
      return { entradas, saidas, fluxo: entradas - saidas };
  }, [filteredTransactions]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  const handleExport = () => {
    const headers = ["Data", "Descricao", "Categoria", "Conta", "Tipo", "Valor", "Status"];
    const rows = filteredTransactions.map(t => [
        t.date,
        t.description.replace(/,/g, ''),
        categories.find(c => c.id === t.categoryId)?.name || 'N/A',
        accounts.find(a => a.id === t.accountId)?.name || 'N/A',
        t.type,
        t.amount,
        t.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(r => r.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lancamentos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-8 pb-10 animate-fade-in w-full items-center">
        
        {/* Toolbar de Controle - MAIS LARGA (max-w-7xl) */}
        <div className="w-full max-w-7xl px-4">
            <div className={`flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 p-4 rounded-[1.5rem] border transition-all ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-xl'}`}>
                <div className="flex flex-wrap items-center gap-3 flex-grow">
                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Filtrar lançamentos..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={`w-full border rounded-xl pl-10 pr-4 py-2 text-sm outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-black/20 border-white/5 focus:border-[var(--accent-color)]'}`}
                        />
                    </div>
                    
                    <div className={`flex p-1 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <button onClick={() => setTypeFilter('all')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'all' ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white'}`}>Tudo</button>
                        <button onClick={() => setTypeFilter('receita')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'receita' ? 'bg-emerald-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white'}`}>Receitas</button>
                        <button onClick={() => setTypeFilter('despesa')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'despesa' ? 'bg-rose-500 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white'}`}>Despesas</button>
                    </div>

                    <div className={`flex items-center gap-2 p-1 px-3 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'}`}>
                        <Calendar size={14} className="text-[var(--accent-color)] opacity-50" />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-bold outline-none text-[var(--text-primary)]" />
                        <span className="text-[var(--text-muted)] opacity-30">/</span>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-bold outline-none text-[var(--text-primary)]" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExport}
                        title="Exportar CSV"
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[var(--accent-color)] text-white px-6 py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                        <Plus size={18} /> Novo
                    </button>
                </div>
            </div>
        </div>

        {/* Quadro de Lançamentos - MAIS ESTREITO (max-w-5xl) */}
        <div className="w-full max-w-5xl px-4 flex flex-col space-y-8">
            <div className={`
                overflow-hidden rounded-[2.5rem] border transition-all flex flex-col shadow-2xl relative
                ${theme === 'light' ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-black/40'}
            `}>
                
                {/* Header da Tabela Fixo */}
                <div className={`grid grid-cols-12 gap-4 px-10 py-5 border-b text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/[0.02] border-white/5 text-white/30'}`}>
                    <div className="col-span-2">Data</div>
                    <div className="col-span-6">Descrição & Categoria</div>
                    <div className="col-span-3 text-right">Valor</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Area de Scroll - 4 itens visíveis */}
                <div className="h-[360px] overflow-y-auto custom-scrollbar divide-y divide-[var(--border-color)]">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t) => (
                            <div key={t.id} className="grid grid-cols-12 gap-4 px-10 py-6 items-center hover:bg-[var(--bg-elevation-1)] transition-all group cursor-default h-[90px]">
                                <div className="col-span-2">
                                    <p className={`text-sm font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{formatDate(t.date)}</p>
                                </div>
                                
                                <div className="col-span-6 min-w-0 pr-4">
                                    <p className={`text-base font-bold truncate ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase border ${t.status === 'pago' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                                            {t.status}
                                        </span>
                                        <span className={`text-[9px] font-medium truncate ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>
                                            {categories.find(c => c.id === t.categoryId)?.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-3 text-right">
                                    <span className={`text-lg font-black tracking-tighter block truncate ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {t.type === 'despesa' ? '-' : '+'}{formatCurrency(t.amount)}
                                    </span>
                                </div>

                                <div className="col-span-1 flex justify-end">
                                    <button 
                                        onClick={() => { if(confirm("Remover lançamento?")) deleteTransaction(t.id); }} 
                                        className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${theme === 'light' ? 'bg-slate-100 text-slate-400 hover:text-rose-600 shadow-sm' : 'bg-white/5 text-white/20 hover:text-rose-500'}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                            <ArrowRightLeft size={64} className="mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">Nenhum registro</p>
                        </div>
                    )}
                </div>

                {/* Rodapé de Sumário */}
                <div className={`px-10 py-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6 ${theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-black/40 border-white/5'}`}>
                    <div className="flex items-center gap-10 flex-1">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Registros</span>
                            <span className={`text-2xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{filteredTransactions.length}</span>
                        </div>

                        <div className={`w-px h-10 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`}></div>

                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Entradas</span>
                            <span className="text-2xl font-black text-emerald-500 tracking-tighter">{formatCurrency(totals.entradas)}</span>
                        </div>
                        
                        <div className={`w-px h-10 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`}></div>

                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest">Saídas</span>
                            <span className="text-2xl font-black text-rose-500 tracking-tighter">{formatCurrency(totals.saidas)}</span>
                        </div>
                    </div>

                    <div className={`
                        px-8 py-5 rounded-[1.5rem] border min-w-[280px] transition-all flex flex-col items-end shadow-xl
                        ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#111113] border-white/10 shadow-black/60'}
                    `}>
                        <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Fluxo do Período</span>
                        <p className={`text-4xl font-black tracking-tighter ${totals.fluxo >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {formatCurrency(totals.fluxo)}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default BookkeepingView;
