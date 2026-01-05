
import React, { useState, useMemo, useEffect } from 'react';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import type { Client, ClientStatus } from '../../types';
import ClientDetailsView from './ClientDetailsView';
import ClientModal from './ClientModal';
import { Search, X } from 'lucide-react';

// Icons
const BuildingIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

const PlusIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

interface ClientColumnProps {
    title: string;
    status: ClientStatus;
    clients: Client[];
    onSelectClient: (clientId: string) => void;
}

const ClientColumn: React.FC<ClientColumnProps> = ({ title, status, clients, onSelectClient }) => {
    const { updateClient } = useClients();
    const { theme } = useTheme();
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsOver(true); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const clientId = e.dataTransfer.getData('clientId');
        if (clientId) updateClient(clientId, { status });
        setIsOver(false);
    };

    const statusColors = {
        ACTIVE: {
            border: theme === 'light' ? 'border-emerald-500/20' : 'border-emerald-500/30',
            glow: theme === 'light' ? 'shadow-sm' : 'shadow-[0_0_15px_rgba(16,185,129,0.05)]',
            indicator: 'bg-emerald-500'
        },
        PROSPECT: {
            border: theme === 'light' ? 'border-blue-500/20' : 'border-blue-500/30',
            glow: theme === 'light' ? 'shadow-sm' : 'shadow-[0_0_15px_rgba(59,130,246,0.05)]',
            indicator: 'bg-blue-500'
        },
        CHURNED: {
            border: theme === 'light' ? 'border-slate-400/20' : 'border-slate-500/30',
            glow: theme === 'light' ? 'shadow-sm' : 'shadow-[0_0_15px_rgba(100,116,139,0.05)]',
            indicator: 'bg-slate-400'
        }
    }[status];

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={() => setIsOver(false)}
            onDrop={handleDrop}
            className={`
                flex flex-col h-full min-w-[340px] flex-1 rounded-[2.5rem] transition-all duration-500 border backdrop-blur-xl overflow-hidden
                ${statusColors.border} ${statusColors.glow}
                ${theme === 'light' 
                    ? `bg-white/40 ${isOver ? 'bg-white/70 ring-4 ring-blue-500/5' : ''}` 
                    : `bg-white/[0.03] ${isOver ? 'bg-white/[0.08]' : ''}`
                }
            `}
        >
            <div className="p-7 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${statusColors.indicator} animate-pulse`}></div>
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.25em] ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {title}
                    </h3>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${theme === 'light' ? 'bg-white/80 text-slate-700 border-slate-200' : 'bg-black/20 text-slate-400 border-white/5'}`}>
                    {clients.length}
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                {clients.map(client => (
                    <div 
                        key={client.id}
                        draggable
                        onDragStart={(e) => { e.dataTransfer.setData('clientId', client.id); e.dataTransfer.effectAllowed = 'move'; }}
                        onClick={() => onSelectClient(client.id)}
                        className={`
                            p-6 rounded-[2rem] transition-all duration-300 cursor-pointer active:scale-[0.98] border backdrop-blur-md
                            ${theme === 'light' 
                                ? 'bg-white/70 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:border-blue-500/20 hover:bg-white' 
                                : 'bg-[#121214] border-white/5 hover:border-[var(--accent-color)] hover:shadow-2xl hover:shadow-black/40'
                            }
                            group relative overflow-hidden
                        `}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all
                                ${theme === 'light' ? 'bg-white border-slate-100 text-slate-400 group-hover:shadow-sm' : 'bg-[var(--bg-card)] border-white/5'}
                            `}>
                                {client.logo ? <img src={client.logo} className="w-full h-full object-cover rounded-xl" /> : <BuildingIcon className="w-6 h-6" />}
                            </div>
                            <div className="min-w-0">
                                <h4 className={`font-bold text-base truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{client.name}</h4>
                                <p className={`text-[9px] font-black uppercase tracking-widest truncate ${theme === 'light' ? 'text-slate-400' : 'text-[var(--text-muted)]'}`}>{client.companyName}</p>
                            </div>
                        </div>
                        
                        <p className={`text-xs leading-relaxed line-clamp-2 mb-6 ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-[var(--text-secondary)]'}`}>
                            {client.description || 'Defina um contexto estratégico para esta conta.'}
                        </p>
                        
                        <div className={`flex justify-between items-center pt-4 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
                             <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-slate-400' : 'text-[var(--text-muted)]'}`}>
                                DESDE {new Date(client.since).getFullYear()}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
                                ${status === 'ACTIVE' 
                                    ? (theme === 'light' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-emerald-500/10 text-emerald-500')
                                    : status === 'PROSPECT'
                                    ? (theme === 'light' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-blue-500/10 text-blue-500')
                                    : (theme === 'light' ? 'bg-slate-50 text-slate-500 border border-slate-100' : 'bg-gray-500/10 text-gray-500')
                                }
                            `}>
                                {status === 'ACTIVE' ? 'Ativo' : status === 'PROSPECT' ? 'Negociação' : 'Churn'}
                            </span>
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-20 h-full">
                        <Search size={40} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">Nenhum resultado</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const GestaoClientesView: React.FC<{ setActiveView: (view: string) => void, onSidebarCollapse?: (collapsed: boolean) => void }> = ({ setActiveView, onSidebarCollapse }) => {
    const { clients } = useClients();
    const { theme } = useTheme();
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (selectedClientId && onSidebarCollapse) {
            onSidebarCollapse(true);
        }
    }, [selectedClientId, onSidebarCollapse]);

    const handleBackFromDetails = () => {
        setSelectedClientId(null);
        if (onSidebarCollapse) onSidebarCollapse(false);
    };

    const filteredClients = useMemo(() => {
        if (!searchQuery) return clients;
        const query = searchQuery.toLowerCase();
        return clients.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.companyName?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query)
        );
    }, [clients, searchQuery]);

    const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId) || null, [clients, selectedClientId]);

    if (selectedClient) {
        return <ClientDetailsView client={selectedClient} onBack={handleBackFromDetails} setActiveView={setActiveView} />;
    }

    return (
        <div className="flex-1 flex flex-col animate-fade-in-up h-full overflow-hidden">
            <header className="flex-shrink-0 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-[var(--border-color)]">
                <div>
                    <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        Gestão de Clientes
                    </h1>
                    <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                        Mapeamento 360º de parcerias e fluxo comercial.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all group-focus-within:scale-110 ${theme === 'light' ? 'text-slate-600' : 'text-white/30'}`}>
                            <Search size={18} strokeWidth={2.5} />
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Pesquisar cliente..."
                            className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm transition-all outline-none font-medium ${theme === 'light' ? 'bg-white border-slate-200 focus:border-blue-500 text-slate-900 placeholder-slate-400' : 'bg-[var(--bg-elevation-1)] border-white/10 focus:border-[var(--accent-color)] text-white placeholder-white/20'}`}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto bg-[var(--accent-color)] text-white px-8 py-3.5 rounded-2xl hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[var(--accent-glow)] transform active:scale-95 whitespace-nowrap"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-sm">Novo Cliente</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 flex gap-8 overflow-x-auto pb-2 custom-scrollbar pr-1">
                <ClientColumn title="Contratos Ativos" status="ACTIVE" clients={filteredClients.filter(c => c.status === 'ACTIVE')} onSelectClient={setSelectedClientId} />
                <ClientColumn title="Em Negociação" status="PROSPECT" clients={filteredClients.filter(c => c.status === 'PROSPECT')} onSelectClient={setSelectedClientId} />
                <ClientColumn title="Finalizados" status="CHURNED" clients={filteredClients.filter(c => c.status === 'CHURNED')} onSelectClient={setSelectedClientId} />
            </div>

            {isModalOpen && <ClientModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default GestaoClientesView;
