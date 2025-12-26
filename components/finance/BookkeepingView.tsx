
import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import TransactionModal from './TransactionModal';

const TrashIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg> );
const FilterIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg> );
const SearchIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );

const BookkeepingView: React.FC = () => {
  const { transactions, deleteTransaction, categories, accounts } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'receita' | 'despesa'>('all');

  const filteredTransactions = useMemo(() => {
      return transactions.filter(t => {
          const matchSearch = t.description.toLowerCase().includes(search.toLowerCase());
          const matchType = typeFilter === 'all' || t.type === typeFilter;
          return matchSearch && matchType;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, typeFilter]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col h-full space-y-4">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
             <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input 
                        type="text" 
                        placeholder="Buscar lançamento..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full md:w-64 bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                    />
                </div>
                <div className="flex bg-[var(--bg-elevation-1)] rounded-lg p-1 border border-[var(--border-color)]">
                    <button onClick={() => setTypeFilter('all')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${typeFilter === 'all' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Todos</button>
                    <button onClick={() => setTypeFilter('receita')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${typeFilter === 'receita' ? 'bg-emerald-500/20 text-emerald-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Receitas</button>
                    <button onClick={() => setTypeFilter('despesa')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${typeFilter === 'despesa' ? 'bg-rose-500/20 text-rose-500' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Despesas</button>
                </div>
             </div>

             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-[var(--accent-color)] text-white px-5 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-all font-bold text-sm shadow-lg shadow-[var(--accent-glow)] flex items-center justify-center gap-2"
            >
                <span>+</span> Novo Lançamento
             </button>
        </div>

        {/* DataGrid */}
        <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--bg-elevation-2)] border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <div className="col-span-2">Data</div>
                <div className="col-span-4">Descrição</div>
                <div className="col-span-2">Categoria</div>
                <div className="col-span-2 text-right">Valor</div>
                <div className="col-span-2 text-center">Ações</div>
            </div>

            {/* Rows Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                        <div key={t.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[var(--border-color)] hover:bg-[var(--bg-elevation-1)] transition-colors group">
                            <div className="col-span-2 font-mono text-sm text-[var(--text-secondary)]">
                                {formatDate(t.date)}
                            </div>
                            
                            <div className="col-span-4">
                                <p className="font-medium text-[var(--text-primary)] truncate">{t.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${t.status === 'pago' ? 'border-emerald-500/30 text-emerald-500' : 'border-yellow-500/30 text-yellow-500'}`}>
                                        {t.status}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-muted)]">{accounts.find(a => a.id === t.accountId)?.name}</span>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-elevation-2)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                                    {categories.find(c => c.id === t.categoryId)?.name || 'Outros'}
                                </span>
                            </div>

                            <div className="col-span-2 text-right">
                                <span className={`font-mono font-bold text-sm ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {t.type === 'despesa' ? '-' : '+'}{formatCurrency(t.amount)}
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => deleteTransaction(t.id)} 
                                    className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                                    title="Excluir"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
                        <FilterIcon />
                        <p className="mt-2">Nenhum lançamento encontrado.</p>
                    </div>
                )}
            </div>
            
            {/* Footer Summary */}
            <div className="p-3 bg-[var(--bg-elevation-2)] border-t border-[var(--border-color)] flex justify-between items-center text-xs text-[var(--text-muted)]">
                <span>Mostrando {filteredTransactions.length} lançamentos</span>
                <span>Total visível: <b className="text-[var(--text-primary)]">{formatCurrency(filteredTransactions.reduce((acc, t) => acc + (t.type === 'receita' ? t.amount : -t.amount), 0))}</b></span>
            </div>
        </div>
        
        {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default BookkeepingView;
