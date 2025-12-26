
import React, { useState, useMemo, useEffect } from 'react';
import type { Client, ClientBrand, ClientPersona } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { useTaskManager } from '../../context/TaskManagerContext';
import { useCalendar } from '../../context/CalendarContext';
import { useClients } from '../../context/ClientContext';
import TransactionModal from '../finance/TransactionModal';
import ProjectModal from '../ProjectModal';
import ProjectGroupModal from '../ProjectGroupModal';
import CalendarTaskModal from '../calendar/CalendarTaskModal';
import ClientObjectivesView from './ClientObjectivesView';

// --- ICONS ---
const Icons = {
    Back: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>,
    Folder: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    Money: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Calendar: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
    Check: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Plus: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    Edit: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
    Save: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    ArrowUp: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>,
    ArrowDown: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>,
    Instagram: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    Linkedin: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    Globe: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
    Mail: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    Target: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    FingerPrint: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"></path><path d="M5 15.1a7 7 0 0 0 10.9 0"></path><path d="M8.2 8.5a4 4 0 0 1 7.6 0"></path><path d="M12 12v.1"></path><path d="M16 16v.1"></path><path d="M8 16v.1"></path></svg>,
    Close: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
};

interface ClientDetailsViewProps {
    client: Client;
    onBack: () => void;
    setActiveView: (view: string) => void;
}

const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({ client, onBack, setActiveView }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'finance' | 'projects' | 'calendar' | 'objectives'>('profile');
    const { updateClient } = useClients();
    
    // Modal States
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [viewingPersona, setViewingPersona] = useState<ClientPersona | null>(null); // For reading Full Persona
    
    // --- Edit Mode State for Profile ---
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedClient, setEditedClient] = useState<Client>(client);

    // Sync edited client state when prop changes
    useEffect(() => {
        setEditedClient(client);
    }, [client]);

    const { projectGroups, projects, selectProject } = useTaskManager();
    const { transactions } = useFinance();
    const { tasks: calendarTasks } = useCalendar();

    // --- Data Filtering ---
    const clientGroups = useMemo(() => projectGroups.filter(g => g.clientId === client.id), [projectGroups, client.id]);
    const hasGroups = clientGroups.length > 0;

    const clientProjects = useMemo(() => {
        const groupIds = clientGroups.map(g => g.id);
        const viaGroup = projects.filter(p => groupIds.includes(p.groupId));
        const directOrString = projects.filter(p => p.client === client.name || p.client === client.companyName);
        const combined = [...viaGroup, ...directOrString];
        return combined.filter((p, index, self) => index === self.findIndex(t => t.id === p.id));
    }, [projects, clientGroups, client]);

    const clientTransactions = useMemo(() => {
        return transactions.filter(t => 
            t.clientId === client.id || 
            t.description.toLowerCase().includes(client.name.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, client]);

    const financialSummary = useMemo(() => {
        const income = clientTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
        const expense = clientTransactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
        return { income, expense };
    }, [clientTransactions]);

    const clientEvents = useMemo(() => {
        return calendarTasks.filter(t => 
            t.clientId === client.id ||
            t.title.toLowerCase().includes(client.name.toLowerCase())
        ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [calendarTasks, client]);

    const handleGoToProject = (projectId: string) => {
        selectProject(projectId);
        setActiveView('Tarefas');
    };

    const handleSaveProfile = () => {
        updateClient(client.id, editedClient);
        setIsEditingProfile(false);
    };

    const handleCancelEdit = () => {
        setEditedClient(client);
        setIsEditingProfile(false);
    };

    const handlePersonaChange = (index: number, field: keyof ClientPersona, value: string) => {
        const newPersonas = [...(editedClient.personas || [])];
        // Ensure we have an object at this index
        if (!newPersonas[index]) newPersonas[index] = { name: '', description: '' };
        
        newPersonas[index] = { ...newPersonas[index], [field]: value };
        setEditedClient({ ...editedClient, personas: newPersonas });
    };

    const handleBrandChange = (field: keyof ClientBrand, value: string) => {
        setEditedClient({
            ...editedClient,
            brand: { ...editedClient.brand, [field]: value } as ClientBrand
        });
    };

    const tabs = [
        { id: 'profile', label: 'Inteligência', icon: Icons.Check },
        { id: 'objectives', label: 'Objetivos', icon: Icons.Target },
        { id: 'finance', label: 'Financeiro', icon: Icons.Money },
        { id: 'projects', label: 'Projetos', icon: Icons.Folder },
        { id: 'calendar', label: 'Compromissos', icon: Icons.Calendar },
    ];

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Navigation Header */}
            <div className="flex-shrink-0 mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group">
                    <Icons.Back className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Voltar</span>
                </button>
            </div>

            {/* Client Header / Hero */}
            <div className="flex-shrink-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--bg-elevation-2)] to-[var(--bg-elevation-1)] border border-[var(--border-color)] flex items-center justify-center text-3xl font-bold text-[var(--text-secondary)] shadow-inner">
                        {client.logo ? <img src={client.logo} className="w-full h-full object-cover rounded-xl" /> : client.name.substring(0,1)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-light text-[var(--text-primary)] tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-[var(--text-muted)] font-medium">{client.companyName}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${client.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : client.status === 'PROSPECT' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                                {client.status}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-1 bg-[var(--bg-elevation-1)] p-1.5 rounded-xl border border-[var(--border-color)] overflow-x-auto max-w-full">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                    ${isActive 
                                        ? 'bg-[var(--accent-color)] text-white shadow-md' 
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevation-2)] hover:text-[var(--text-primary)]'}
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden md:inline">{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
                
                {/* --- TAB 1: PERFIL / INTELIGÊNCIA --- */}
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-end">
                            {isEditingProfile ? (
                                <div className="flex gap-3">
                                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancelar</button>
                                    <button onClick={handleSaveProfile} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95">
                                        <Icons.Save className="w-4 h-4" /> Salvar
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
                                    <Icons.Edit className="w-4 h-4" /> Editar Dados
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-2xl p-6 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-color)] opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
                                
                                <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                                    <Icons.FingerPrint className="w-5 h-5 text-[var(--accent-color)]" />
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-wide">Identidade Corporativa</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                                    <ReadOnlyOrEdit label="Responsável Contratante" value={editedClient.responsibleName} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, responsibleName: v})} />
                                    <ReadOnlyOrEdit label="CNPJ" value={editedClient.cnpj} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, cnpj: v})} />
                                    <ReadOnlyOrEdit label="Email de Contato" value={editedClient.email} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, email: v})} icon={<Icons.Mail className="w-4 h-4" />} />
                                    <ReadOnlyOrEdit label="Telefone" value={editedClient.phone} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, phone: v})} />
                                    
                                    <div className="md:col-span-2 pt-2">
                                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Social Dock</label>
                                        <div className="flex flex-wrap gap-4">
                                            <SocialInput icon={<Icons.Globe />} placeholder="Website" value={editedClient.website} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, website: v})} />
                                            <SocialInput icon={<Icons.Instagram />} placeholder="Instagram" value={editedClient.socialInstagram} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, socialInstagram: v})} />
                                            <SocialInput icon={<Icons.Linkedin />} placeholder="LinkedIn" value={editedClient.socialLinkedin} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, socialLinkedin: v})} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                                    <div className="w-2 h-2 bg-[var(--accent-color)] rounded-full animate-pulse"></div>
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Diretriz Estratégica</h3>
                                </div>
                                
                                <div className="flex-grow space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Objetivo Principal</label>
                                        {isEditingProfile ? (
                                            <textarea 
                                                value={editedClient.contractObjective || ''}
                                                onChange={e => setEditedClient({...editedClient, contractObjective: e.target.value})}
                                                className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none resize-none h-24"
                                            />
                                        ) : (
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-elevation-1)]/50 p-3 rounded-lg border border-transparent">
                                                {editedClient.contractObjective || "Não definido."}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">Contexto & Notas</label>
                                        {isEditingProfile ? (
                                            <textarea 
                                                value={editedClient.description || ''}
                                                onChange={e => setEditedClient({...editedClient, description: e.target.value})}
                                                className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none resize-none h-32"
                                            />
                                        ) : (
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-6">
                                                {editedClient.description || "Sem notas adicionais."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">DNA da Marca</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Tom de Voz</label>
                                    {isEditingProfile ? (
                                        <input 
                                            value={editedClient.brand?.toneOfVoice || ''}
                                            onChange={e => handleBrandChange('toneOfVoice', e.target.value)}
                                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none"
                                            placeholder="Ex: Jovem, Descontraído..."
                                        />
                                    ) : (
                                        <div className="relative h-12 bg-[var(--bg-elevation-1)] rounded-lg overflow-hidden flex items-center px-4 border border-[var(--border-color)]">
                                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
                                                {Array.from({ length: 20 }).map((_, i) => (
                                                    <div key={i} className="w-1 bg-[var(--text-primary)] rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                                                ))}
                                            </div>
                                            <span className="relative z-10 font-medium text-[var(--text-primary)] tracking-wide">{editedClient.brand?.toneOfVoice || "Não definido"}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Valores Centrais</label>
                                    {isEditingProfile ? (
                                        <input 
                                            value={editedClient.brand?.coreValues || ''}
                                            onChange={e => handleBrandChange('coreValues', e.target.value)}
                                            className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none"
                                            placeholder="Separados por vírgula..."
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(editedClient.brand?.coreValues?.split(',') || ["Não definido"]).map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-[var(--bg-elevation-2)] border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--text-secondary)]">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <Icons.Target className="w-5 h-5 text-[var(--accent-color)]" />
                                Arquivos de Persona (Target Audience)
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[0, 1, 2].map(index => (
                                    <PersonaCard 
                                        key={index}
                                        index={index}
                                        data={editedClient.personas?.[index] || { name: '', description: '' }}
                                        isEditing={isEditingProfile}
                                        onChangeName={(v) => handlePersonaChange(index, 'name', v)}
                                        onChangeDesc={(v) => handlePersonaChange(index, 'description', v)}
                                        onSelect={() => setViewingPersona(editedClient.personas?.[index] || { name: '', description: '' })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 5: OBJECTIVES (NEW) --- */}
                {activeTab === 'objectives' && (
                    <ClientObjectivesView client={client} />
                )}

                {/* --- TAB 2: FINANCE --- */}
                {activeTab === 'finance' && (
                    <div className="animate-fade-in space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border-color)] flex flex-col justify-between">
                                <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Total Recebido</p>
                                <div className="flex items-end justify-between mt-2">
                                    <span className="text-2xl font-light text-emerald-500">{formatCurrency(financialSummary.income)}</span>
                                    <div className="bg-emerald-500/10 p-2 rounded-full">
                                        <Icons.ArrowUp className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border-color)] flex flex-col justify-between">
                                <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Custo Operacional</p>
                                <div className="flex items-end justify-between mt-2">
                                    <span className="text-2xl font-light text-rose-500">{formatCurrency(financialSummary.expense)}</span>
                                    <div className="bg-rose-500/10 p-2 rounded-full">
                                        <Icons.ArrowDown className="w-5 h-5 text-rose-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button 
                                    onClick={() => setIsTransactionModalOpen(true)}
                                    className="w-full h-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl shadow-lg shadow-[var(--accent-glow)] flex flex-col items-center justify-center gap-2 transition-all p-5"
                                >
                                    <div className="bg-white/20 p-2 rounded-full">
                                        <Icons.Plus className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold">Novo Lançamento</span>
                                </button>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-color)]">
                                <h3 className="font-semibold text-[var(--text-primary)]">Extrato do Cliente</h3>
                            </div>
                            <div className="divide-y divide-[var(--border-color)]">
                                {clientTransactions.length > 0 ? clientTransactions.map(t => (
                                    <div key={t.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-elevation-1)] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 ${t.type === 'receita' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                                {t.type === 'receita' ? <Icons.ArrowUp className="w-5 h-5" /> : <Icons.ArrowDown className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)]">{t.description}</p>
                                                <div className="flex items-center gap-2 text-xs mt-0.5">
                                                    <span className="text-[var(--text-muted)]">{new Date(t.date).toLocaleDateString()}</span>
                                                    <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase font-bold ${t.status === 'pago' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`font-mono font-bold text-lg ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center text-[var(--text-muted)]">
                                        Nenhum registro financeiro encontrado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 3: PROJECTS --- */}
                {activeTab === 'projects' && (
                    <div className="animate-fade-in flex flex-col gap-6">
                        <div className="flex justify-between items-center bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)]">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Projetos do Cliente</h3>
                                <p className="text-sm text-[var(--text-muted)]">
                                    {hasGroups 
                                        ? `${clientGroups.length} grupos ativos.` 
                                        : "Este cliente ainda não possui grupos de projetos."}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsGroupModalOpen(true)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!hasGroups ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)] animate-pulse' : 'bg-[var(--bg-elevation-1)] text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)]'}`}
                                >
                                    <Icons.Folder className="w-4 h-4" />
                                    Novo Grupo
                                </button>
                                <button 
                                    onClick={() => setIsProjectModalOpen(true)}
                                    disabled={!hasGroups}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!hasGroups ? 'bg-[var(--bg-elevation-1)] text-[var(--text-muted)] cursor-not-allowed opacity-50' : 'bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] shadow-lg'}`}
                                    title={!hasGroups ? "Crie um grupo primeiro" : "Criar novo projeto"}
                                >
                                    <Icons.Plus className="w-4 h-4" />
                                    Novo Projeto
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clientProjects.length > 0 ? clientProjects.map(project => (
                                <div key={project.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-color)] transition-all hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold bg-[var(--bg-elevation-2)] px-2 py-1 rounded text-[var(--text-muted)] uppercase tracking-wider">
                                            {project.focus}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {new Date(project.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{project.name}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-6">{project.summary}</p>
                                    
                                    <button 
                                        onClick={() => handleGoToProject(project.id)}
                                        className="w-full py-2 rounded-lg bg-[var(--bg-elevation-1)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        <Icons.Folder className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white" />
                                        Abrir Quadro de Tarefas
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 bg-[var(--bg-card)] border border-[var(--border-color)] border-dashed rounded-xl text-[var(--text-muted)]">
                                    <Icons.Folder className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Nenhum projeto vinculado encontrado.</p>
                                    {!hasGroups && <p className="text-xs mt-2 text-[var(--accent-color)]">Crie um Grupo de Projetos para começar.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB 4: CALENDAR --- */}
                {activeTab === 'calendar' && (
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Agenda do Cliente</h3>
                            <button 
                                onClick={() => setIsCalendarModalOpen(true)}
                                className="flex items-center gap-2 bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium shadow-md"
                            >
                                <Icons.Calendar className="w-4 h-4" />
                                Novo Compromisso
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {clientEvents.length > 0 ? clientEvents.map(event => (
                                <div key={event.id} className="flex items-center gap-4 p-4 bg-[var(--bg-elevation-1)] rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-colors">
                                    <div className="flex flex-col items-center px-2 border-r border-[var(--border-color)] min-w-[60px]">
                                        <span className="text-xs text-[var(--text-muted)] uppercase font-bold">{new Date(event.dueDate).toLocaleString('pt-BR', { month: 'short' })}</span>
                                        <span className="text-2xl font-light text-[var(--text-primary)]">{new Date(event.dueDate).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[var(--text-primary)] font-medium">{event.title}</h4>
                                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{event.description || "Sem descrição"}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${event.status === 'CONCLUIDO' ? 'bg-green-500/20 text-green-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center py-12 border-2 border-dashed border-[var(--border-color)] rounded-xl">
                                    <p className="text-[var(--text-muted)]">Nenhum compromisso agendado para este cliente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
            
            {/* Modals */}
            {isTransactionModalOpen && (
                <TransactionModal 
                    onClose={() => setIsTransactionModalOpen(false)} 
                    defaultClientId={client.id} 
                />
            )}
            {isGroupModalOpen && (
                <ProjectGroupModal 
                    onClose={() => setIsGroupModalOpen(false)}
                    defaultClientId={client.id}
                />
            )}
            {isProjectModalOpen && (
                <ProjectModal 
                    onClose={() => setIsProjectModalOpen(false)}
                    groupId={clientGroups.length === 1 ? clientGroups[0].id : undefined} 
                />
            )}
            {isCalendarModalOpen && (
                <CalendarTaskModal
                    onClose={() => setIsCalendarModalOpen(false)}
                    defaultClientId={client.id}
                />
            )}
            
            {/* PERSONA FULL VIEW MODAL */}
            {viewingPersona && (
                <PersonaModal 
                    persona={viewingPersona} 
                    onClose={() => setViewingPersona(null)} 
                />
            )}
        </div>
    );
};

// --- SUB COMPONENTS FOR UI ---

const ReadOnlyOrEdit: React.FC<{label: string, value: any, isEditing: boolean, onChange: (val: string) => void, icon?: React.ReactNode}> = ({ label, value, isEditing, onChange, icon }) => (
    <div>
        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">{label}</label>
        {isEditing ? (
            <input 
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-[var(--bg-elevation-2)] border-b border-[var(--border-color)] py-1 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] outline-none transition-colors"
            />
        ) : (
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium min-h-[24px]">
                {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
                <span className="truncate">{value || "-"}</span>
            </div>
        )}
    </div>
);

const SocialInput: React.FC<{icon: React.ReactNode, value: string, isEditing: boolean, onChange: (val: string) => void, placeholder: string}> = ({ icon, value, isEditing, onChange, placeholder }) => {
    if (!isEditing) {
        return (
            <a href={value || '#'} target="_blank" rel="noreferrer" className={`p-2 rounded-lg border transition-all ${value ? 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]' : 'bg-transparent border-transparent text-[var(--text-muted)] opacity-30 cursor-default'}`}>
                {icon}
            </a>
        );
    }
    return (
        <div className="flex items-center bg-[var(--bg-elevation-2)] rounded-lg border border-[var(--border-color)] px-2 py-1 flex-1 min-w-[140px]">
            <span className="text-[var(--text-muted)] mr-2 scale-75">{icon}</span>
            <input 
                value={value || ''} 
                onChange={e => onChange(e.target.value)} 
                placeholder={placeholder}
                className="bg-transparent w-full text-xs text-[var(--text-primary)] outline-none"
            />
        </div>
    );
}

const PersonaCard: React.FC<{
    index: number, 
    data: ClientPersona, 
    isEditing: boolean, 
    onChangeName: (v: string) => void, 
    onChangeDesc: (v: string) => void,
    onSelect: () => void
}> = ({ index, data, isEditing, onChangeName, onChangeDesc, onSelect }) => {
    return (
        <div 
            onClick={() => !isEditing && onSelect && onSelect()}
            className={`group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 overflow-hidden hover:border-[var(--accent-color)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-500 relative ${!isEditing ? 'cursor-pointer' : ''}`}
        >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,var(--text-primary)_1px,transparent_1px)] [background-size:10px_10px]"></div>
            
            <div className="bg-[var(--bg-elevation-1)]/50 p-5 rounded-lg h-full flex flex-col relative z-10 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-color)] to-purple-900 flex items-center justify-center text-white font-bold shadow-lg">
                        P{index + 1}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                </div>

                {isEditing ? (
                    <input 
                        value={data.name} 
                        onChange={e => onChangeName(e.target.value)}
                        placeholder="Nome da Persona"
                        className="bg-transparent border-b border-[var(--border-color)] w-full text-[var(--text-primary)] font-bold mb-2 focus:border-[var(--accent-color)] outline-none"
                        onClick={e => e.stopPropagation()}
                    />
                ) : (
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 min-h-[28px]">{data.name || "Sem Nome"}</h4>
                )}

                {isEditing ? (
                    <textarea 
                        value={data.description}
                        onChange={e => onChangeDesc(e.target.value)}
                        placeholder="Características..."
                        className="w-full bg-[var(--bg-elevation-2)] rounded p-2 text-xs text-[var(--text-secondary)] resize-none h-24 outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                        onClick={e => e.stopPropagation()}
                    />
                ) : (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                        {data.description || "Descrição pendente..."}
                    </p>
                )}
            </div>
        </div>
    );
}

const PersonaModal: React.FC<{ persona: ClientPersona, onClose: () => void }> = ({ persona, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[70] animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-900 via-[var(--accent-color)] to-purple-900"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-purple-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        P
                    </div>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-[var(--bg-elevation-2)] transition-colors">
                        <Icons.Close className="w-6 h-6" />
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{persona.name || "Persona Sem Nome"}</h2>
                <div className="w-12 h-1 bg-[var(--accent-color)] rounded-full mb-6"></div>

                <div className="bg-[var(--bg-elevation-1)] p-6 rounded-xl border border-[var(--border-color)]">
                    <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Perfil Detalhado</h4>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                        {persona.description || "Nenhuma descrição detalhada disponível para esta persona."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsView;
