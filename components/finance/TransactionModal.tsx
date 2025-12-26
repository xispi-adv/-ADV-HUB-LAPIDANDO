
import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useClients } from '../../context/ClientContext';
import type { TransactionType } from '../../types';

interface Props {
    onClose: () => void;
    defaultClientId?: string; // New Prop
}

const TransactionModal: React.FC<Props> = ({ onClose, defaultClientId }) => {
    const { addTransaction, categories, accounts, classifyTransactionWithAI } = useFinance();
    const { clients } = useClients();
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<TransactionType>('despesa');
    const [catId, setCatId] = useState(categories[0]?.id || '');
    const [accId, setAccId] = useState(accounts[0]?.id || '');
    const [clientId, setClientId] = useState(defaultClientId || ''); // State for client linking
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // AI Auto-Categorize effect when description changes (debounced)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (desc.length > 3) {
                setIsAiLoading(true);
                const suggestedCatId = await classifyTransactionWithAI(desc);
                if (suggestedCatId) setCatId(suggestedCatId);
                setIsAiLoading(false);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [desc, classifyTransactionWithAI]);

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
            clientId: clientId || undefined // Save link
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Nova Transação</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Tipo</label>
                            <div className="flex bg-[var(--bg-elevation-1)] rounded-lg p-1">
                                <button type="button" onClick={() => setType('receita')} className={`flex-1 py-1.5 rounded text-sm font-medium ${type === 'receita' ? 'bg-emerald-500 text-white' : 'text-[var(--text-secondary)]'}`}>Receita</button>
                                <button type="button" onClick={() => setType('despesa')} className={`flex-1 py-1.5 rounded text-sm font-medium ${type === 'despesa' ? 'bg-rose-500 text-white' : 'text-[var(--text-secondary)]'}`}>Despesa</button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Data</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                         <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Descrição</label>
                         <input 
                            type="text" 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Ex: Almoço com Cliente"
                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                            required 
                         />
                         {isAiLoading && <span className="text-xs text-[var(--accent-color)] animate-pulse">IA Analisando categoria...</span>}
                    </div>

                     <div className="flex flex-col gap-1">
                         <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Valor (R$)</label>
                         <input 
                            type="number" 
                            step="0.01"
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                            required 
                         />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Categoria</label>
                            <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Conta</label>
                             <select value={accId} onChange={e => setAccId(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none">
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Client Selector (Optional or Pre-filled) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Vincular Cliente (Opcional)</label>
                        <select 
                            value={clientId} 
                            onChange={e => setClientId(e.target.value)} 
                            disabled={!!defaultClientId}
                            className={`w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none ${defaultClientId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Sem vínculo</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-[var(--accent-color)] text-white rounded-lg font-bold hover:bg-[var(--accent-hover)]">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
