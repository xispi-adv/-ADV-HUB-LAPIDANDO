
import React, { useState, useEffect, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useClients } from '../../context/ClientContext';
import type { TransactionType } from '../../types';

interface Props {
    onClose: () => void;
    defaultClientId?: string;
}

const TransactionModal: React.FC<Props> = ({ onClose, defaultClientId }) => {
    const { addTransaction, categories, accounts, classifyTransactionWithAI } = useFinance();
    const { clients } = useClients();
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('despesa');
    
    // Filtrar categorias baseadas no tipo selecionado
    const availableCategories = useMemo(() => {
        return categories.filter(c => c.type === type);
    }, [categories, type]);

    const [catId, setCatId] = useState('');
    const [accId, setAccId] = useState(accounts[0]?.id || '');
    const [clientId, setClientId] = useState(defaultClientId || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Reset catId when type or availableCategories changes
    useEffect(() => {
        if (availableCategories.length > 0) {
            // Only reset if current catId is not in the new available list
            const currentIsValid = availableCategories.some(c => c.id === catId);
            if (!currentIsValid) {
                setCatId(availableCategories[0].id);
            }
        }
    }, [availableCategories, type]);

    // AI Auto-Categorize effect when description changes (debounced)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (desc.length > 3) {
                setIsAiLoading(true);
                const suggestedCatId = await classifyTransactionWithAI(desc, type);
                if (suggestedCatId) setCatId(suggestedCatId);
                setIsAiLoading(false);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [desc, type, classifyTransactionWithAI]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTransaction({
            date,
            description: desc,
            amount: Number(amount),
            type,
            categoryId: catId,
            accountId: accId,
            status: 'pago',
            clientId: clientId || undefined
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Novo Lançamento</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Tipo de Fluxo</label>
                            <div className="flex bg-[var(--bg-elevation-1)] rounded-lg p-1">
                                <button type="button" onClick={() => setType('receita')} className={`flex-1 py-1.5 rounded text-sm font-medium transition-all ${type === 'receita' ? 'bg-emerald-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}>Receita</button>
                                <button type="button" onClick={() => setType('despesa')} className={`flex-1 py-1.5 rounded text-sm font-medium transition-all ${type === 'despesa' ? 'bg-rose-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}>Despesa</button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Data do Evento</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Descrição / Identificador</label>
                         <input 
                            type="text" 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder={type === 'receita' ? "Ex: Pagamento Projeto Alpha" : "Ex: Assinatura ChatGPT Pro"}
                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                            required 
                         />
                         {isAiLoading && <span className="text-[10px] text-[var(--accent-color)] font-bold animate-pulse mt-0.5">ALITA: Classificando movimento...</span>}
                    </div>

                     <div className="flex flex-col gap-1">
                         <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Valor Monetário (BRL)</label>
                         <input 
                            type="number" 
                            step="0.01"
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] font-mono font-bold focus:outline-none focus:border-[var(--accent-color)]"
                            placeholder="0,00"
                            required 
                         />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Categoria ({type === 'receita' ? 'Entrada' : 'Saída'})</label>
                            <select 
                                value={catId} 
                                onChange={e => setCatId(e.target.value)} 
                                className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none appearance-none cursor-pointer"
                                required
                            >
                                {availableCategories.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
                                {availableCategories.length === 0 && <option value="">Sem categorias</option>}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Conta de Destino/Origem</label>
                             <select value={accId} onChange={e => setAccId(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none appearance-none cursor-pointer">
                                {accounts.map(a => <option key={a.id} value={a.id} className="bg-zinc-900">{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Vinculação Estratégica (Cliente)</label>
                        <select 
                            value={clientId} 
                            onChange={e => setClientId(e.target.value)} 
                            disabled={!!defaultClientId}
                            className={`w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none appearance-none cursor-pointer ${defaultClientId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="" className="bg-zinc-900">Operação Interna / Geral</option>
                            {clients.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white transition-colors">Descartar</button>
                        <button type="submit" className={`px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95 ${type === 'receita' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'} text-white`}>
                            Efetivar Lançamento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
