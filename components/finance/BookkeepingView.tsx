
import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from './TransactionModal';
import { Trash2, Search, Download, Calendar, Plus, Maximize2, X, ArrowRightLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BookkeepingView: React.FC = () => {
  const { transactions, deleteTransaction, categories, accounts } = useFinance();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedViewOpen, setIsExpandedViewOpen] = useState(false);
  
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

  // Tabela Reutilizável para Grid e Modal
  const RenderTable = ({ limit }: { limit?: number }) => {
    const data = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

    return (
        <div className="flex flex-col w-full min-w-0">
            {/* Header Reduzido */}
            <div className={`grid grid-cols-12 gap-4 px-8 py-4 border-b text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/[0.02] border-white/5 text-white/30'}`}>
                <div className="col-span-2">Data</div>
                <div className="col-span-6">Descrição</div>
                <div className="col-span-3 text-right">Valor</div>
                <div className="col-span-1"></div>
            </div>

            {/* Linhas */}
            <div className="divide-y divide-[var(--border-color)]">
                {data.length > 0 ? (
                    data.map((t) => (
                        <div key={t.id} className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-[var(--bg-elevation-1)] transition-all group cursor-default min-w-0">
                            <div className="col-span-2">
                                <p className={`text-sm font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{formatDate(t.date)}</p>
                            </div>
                            <div className="col-span-6 min-w-0 pr-4">
                                <p className={`text-base font-bold truncate ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{t.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase border ${t.status === 'pago' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                                        {t.status}
                                    </span>
                                    <span className={`text-[9px] font-medium truncate ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>{categories.find(c => c.id === t.categoryId)?.name}</span>
                                </div>
                            </div>
                            <div className="col-span-3 text-right">
                                <span className={`text-base font-black tracking-tighter block truncate ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {t.type === 'despesa' ? '-' : '+'}{formatCurrency(t.amount)}
                                </span>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <button 
                                    onClick={() => { if(confirm("Deseja excluir este lançamento?")) deleteTransaction(t.id); }} 
                                    className={`p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${theme === 'light' ? 'bg-slate-100 text-slate-400 hover:text-rose-600' : 'bg-white/5 text-white/20 hover:text-rose-500'}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <ArrowRightLeft size={48} className="mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">Nenhum registro</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-10 animate-fade-in max-w-full">
        
        {/* Toolbar de Controle */}
        <div className={`flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 p-4 rounded-3xl border transition-all ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}`}>
             <div className="flex flex-wrap items-center gap-3 flex-grow">
                <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Pesquisa rápida..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={`w-full border rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:border-blue-500' : 'bg-black/20 border-white/5 focus:border-[var(--accent-color)]'}`}
                    />
                </div>
                <div className={`flex items-center gap-2 p-1 px-3 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/5'}`}>
                    <Calendar size={14} className="text-[var(--accent-color)] opacity-50" />
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-bold outline-none text-[var(--text-primary)]" />
                    <span className="text-[var(--text-muted)] opacity-30">/</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-bold outline-none text-[var(--text-primary)]" />
                </div>
                <button 
                    onClick={() => setIsExpandedViewOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-white border border-slate-200 text-blue-600 shadow-sm' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}
                >
                    <Maximize2 size={12} /> Expandir Listagem
                </button>
             </div>

             <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-grow lg:flex-none bg-[var(--accent-color)] text-white px-6 py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                >
                    <Plus size={18} /> Novo Lançamento
                </button>
             </div>
        </div>

        {/* Quadro Principal - Fixo para 4 itens */}
        <div className={`
            overflow-hidden rounded-[2.5rem] border transition-all flex flex-col shadow-2xl relative
            ${theme === 'light' ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-black/40'}
        `}>
            {/* Visualização de 4 Itens sem scroll interno no quadro */}
            <div className="min-h-[380px]">
                <RenderTable limit={4} />
            </div>

            {/* Rodapé Estilo Imagem Solicitada */}
            <div className={`px-10 py-8 border-t flex flex-col sm:flex-row items-center justify-between gap-8 ${theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
                <div className="flex items-center gap-12 flex-1">
                    {/* Entradas */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Entradas Confirmadas</span>
                        <span className="text-3xl font-black text-emerald-500 tracking-tighter">{formatCurrency(totals.entradas)}</span>
                    </div>
                    
                    {/* Divisor Vertical */}
                    <div className="w-px h-12 bg-[var(--border-color)] opacity-20"></div>

                    {/* Saídas */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">Saídas Confirmadas</span>
                        <span className="text-3xl font-black text-rose-500 tracking-tighter">{formatCurrency(totals.saidas)}</span>
                    </div>
                </div>

                {/* Card Fluxo Líquido (Destaque conforme imagem) */}
                <div className={`
                    px-10 py-6 rounded-[2rem] border min-w-[320px] transition-all flex flex-col items-end
                    ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#121214] border-white/5 shadow-2xl'}
                `}>
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Fluxo Líquido do Período</span>
                    <p className={`text-4xl font-black tracking-tighter ${totals.fluxo >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatCurrency(totals.fluxo)}
                    </p>
                </div>
            </div>
        </div>

        {/* Modal de Visão Expandida (Popup em Destaque) */}
        {isExpandedViewOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-xl animate-fade-in" onClick={() => setIsExpandedViewOpen(false)}>
                <div className={`w-full max-w-6xl h-full lg:h-[85vh] rounded-[3rem] border overflow-hidden flex flex-col shadow-2xl relative ${theme === 'light' ? 'bg-white border-slate-300' : 'bg-[#0F0F11] border-white/10'}`} onClick={e => e.stopPropagation()}>
                    {/* Header do Modal */}
                    <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between flex-shrink-0">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Auditoria de Lançamentos</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-[var(--text-primary)] uppercase">Histórico Geral</h2>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className={`hidden md:flex p-1 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                <button onClick={() => setTypeFilter('all')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'all' ? 'bg-[var(--accent-color)] text-white' : 'text-[var(--text-muted)]'}`}>Tudo</button>
                                <button onClick={() => setTypeFilter('receita')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'receita' ? 'bg-emerald-500 text-white' : 'text-[var(--text-muted)]'}`}>Receitas</button>
                                <button onClick={() => setTypeFilter('despesa')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${typeFilter === 'despesa' ? 'bg-rose-500 text-white' : 'text-[var(--text-muted)]'}`}>Despesas</button>
                            </div>
                            <button onClick={() => setIsExpandedViewOpen(false)} className={`p-4 rounded-full transition-all ${theme === 'light' ? 'bg-slate-100 text-slate-400 hover:text-slate-900' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                                <X size={28} />
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo com Scroll Vertical Independente */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--bg-main)]/50">
                        <RenderTable />
                    </div>

                    {/* Resumo Rodapé Modal */}
                    <div className={`p-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6 flex-shrink-0 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
                        <div className="flex gap-10">
                            <div><p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Confirmadas</p><p className="text-2xl font-black text-emerald-500 tracking-tighter">{formatCurrency(totals.entradas)}</p></div>
                            <div className="w-px h-10 bg-[var(--border-color)] opacity-20"></div>
                            <div><p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1">Debitas</p><p className="text-2xl font-black text-rose-500 tracking-tighter">{formatCurrency(totals.saidas)}</p></div>
                        </div>
                        <div className={`px-10 py-5 rounded-[2rem] border text-center ${theme === 'light' ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10 shadow-2xl shadow-black'}`}>
                            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1 opacity-60">Consolidado no Filtro</p>
                            <p className={`text-4xl font-black tracking-tighter ${totals.fluxo >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatCurrency(totals.fluxo)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default BookkeepingView;
