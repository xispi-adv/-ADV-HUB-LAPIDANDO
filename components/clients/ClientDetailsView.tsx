
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { Camera, Image as ImageIcon, Layers, Briefcase } from 'lucide-react';

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
    const [viewingPersonaIndex, setViewingPersonaIndex] = useState<number | null>(null);
    
    // --- Edit Mode State for Profile ---
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedClient, setEditedClient] = useState<Client>(client);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditedClient(client);
    }, [client]);

    const { projectGroups, projects, selectProject } = useTaskManager();
    const { transactions } = useFinance();
    const { tasks: calendarTasks } = useCalendar();

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                updateClient(client.id, { logo: base64 });
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handlePersonaChange = (index: number, updatedPersona: ClientPersona) => {
        const newPersonas = [...(editedClient.personas || [])];
        newPersonas[index] = updatedPersona;
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
            {/* Navigation Header - COMPACT VERSION (UNCHANGED BY USER REQUEST) */}
            <div className="flex-shrink-0 mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group">
                    <Icons.Back className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Contas</span>
                </button>
            </div>

            {/* Client Header / Hero - COMPACT VERSION (UNCHANGED BY USER REQUEST) */}
            <div className="flex-shrink-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.5rem] p-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10">
                    <div className="relative group/logo">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bg-elevation-2)] to-[var(--bg-elevation-1)] border border-[var(--border-color)] flex items-center justify-center text-2xl font-bold text-[var(--text-secondary)] shadow-lg overflow-hidden">
                            {client.logo ? <img src={client.logo} className="w-full h-full object-cover" /> : client.name.substring(0,1)}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 p-1.5 bg-[var(--accent-color)] text-white rounded-lg shadow-xl opacity-0 group-hover/logo:opacity-100 transition-all transform hover:scale-110 active:scale-95"
                        >
                            <Camera size={14} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter mb-0.5">{client.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-[var(--text-muted)] font-medium">{client.companyName}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${client.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : client.status === 'PROSPECT' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/30'}`}>
                                {client.status}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-1 bg-[var(--bg-elevation-1)] p-1 rounded-xl border border-[var(--border-color)] overflow-x-auto max-w-full">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                                    ${isActive 
                                        ? 'bg-[var(--accent-color)] text-white shadow-lg' 
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevation-2)] hover:text-[var(--text-primary)]'}
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
                
                {/* --- TAB 1: PERFIL / INTELIGÊNCIA --- */}
                {activeTab === 'profile' && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="flex justify-end">
                            {isEditingProfile ? (
                                <div className="flex gap-3">
                                    <button onClick={handleCancelEdit} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancelar</button>
                                    <button onClick={handleSaveProfile} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2 shadow-lg transition-all transform active:scale-95">
                                        <Icons.Save className="w-4 h-4" /> Salvar
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingProfile(true)} className="px-5 py-2 bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                                    <Icons.Edit className="w-4 h-4" /> Editar Dossier
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-10 shadow-lg relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-10 border-b border-[var(--border-color)] pb-6">
                                    <Icons.FingerPrint className="w-8 h-8 text-rose-500" />
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Metadados Corporativos</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 relative z-10">
                                    <ReadOnlyOrEdit label="Head do Projeto" value={editedClient.responsibleName} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, responsibleName: v})} />
                                    <ReadOnlyOrEdit label="CNPJ" value={editedClient.cnpj} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, cnpj: v})} />
                                    <ReadOnlyOrEdit label="Canal de Email" value={editedClient.email} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, email: v})} icon={<Icons.Mail className="w-5 h-5" />} />
                                    <ReadOnlyOrEdit label="Linha Direta" value={editedClient.phone} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, phone: v})} />
                                    
                                    <div className="md:col-span-2 pt-4">
                                        <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4 block opacity-50">Ecosistema Social</label>
                                        <div className="flex flex-wrap gap-5">
                                            <SocialInput icon={<Icons.Globe />} placeholder="Website" value={editedClient.website} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, website: v})} />
                                            <SocialInput icon={<Icons.Instagram />} placeholder="Instagram" value={editedClient.socialInstagram} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, socialInstagram: v})} />
                                            <SocialInput icon={<Icons.Linkedin />} placeholder="LinkedIn" value={editedClient.socialLinkedin} isEditing={isEditingProfile} onChange={(v) => setEditedClient({...editedClient, socialLinkedin: v})} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-10 flex flex-col shadow-lg">
                                <div className="flex items-center gap-4 mb-10 border-b border-[var(--border-color)] pb-6">
                                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Core Strategy</h3>
                                </div>
                                
                                <div className="space-y-10 flex-grow">
                                    <div>
                                        <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-3 block">North Star Metric</label>
                                        {isEditingProfile ? (
                                            <textarea 
                                                value={editedClient.contractObjective || ''}
                                                onChange={e => setEditedClient({...editedClient, contractObjective: e.target.value})}
                                                className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-primary)] focus:border-rose-500 outline-none resize-none h-32 transition-all font-medium"
                                                placeholder="Qual o principal objetivo?"
                                            />
                                        ) : (
                                            <p className="text-lg font-medium text-[var(--text-primary)] leading-relaxed italic border-l-4 border-rose-500 pl-4 py-2 bg-rose-500/5 rounded-r-xl">
                                                "{editedClient.contractObjective || "Objetivo não definido."}"
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-3 block">Notas de Operação</label>
                                        {isEditingProfile ? (
                                            <textarea 
                                                value={editedClient.description || ''}
                                                onChange={e => setEditedClient({...editedClient, description: e.target.value})}
                                                className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-primary)] focus:border-rose-500 outline-none resize-none h-40 transition-all font-medium"
                                            />
                                        ) : (
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                                {editedClient.description || "Sem notas estratégicas vinculadas."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DNA DA MARCA - GRID COMPACTO */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2.5rem] p-10 shadow-lg">
                             <div className="flex items-center gap-4 mb-10 border-b border-[var(--border-color)] pb-6">
                                <Icons.Target className="w-8 h-8 text-blue-500" />
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight uppercase">DNA & Onboarding Estratégico</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <OnboardingSection label="Tom de Voz" value={editedClient.brand?.toneOfVoice} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('toneOfVoice', v)} placeholder="Ex: Disruptivo..." />
                                <OnboardingSection label="Identidade Visual" value={editedClient.brand?.visualIdentity} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('visualIdentity', v)} placeholder="Cores, fontes..." />
                                <OnboardingSection label="Missão & Visão" value={editedClient.brand?.missionVision} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('missionVision', v)} placeholder="Onde quer chegar?" />
                                <OnboardingSection label="Principais Concorrentes" value={editedClient.brand?.mainCompetitors} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('mainCompetitors', v)} placeholder="Quem são os players?" />
                                <OnboardingSection label="Diferenciais" value={editedClient.brand?.differentiation} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('differentiation', v)} placeholder="USP da marca..." />
                                <OnboardingSection label="ICP (Cliente Ideal)" value={editedClient.brand?.idealCustomerProfile} isEditing={isEditingProfile} onChange={(v) => handleBrandChange('idealCustomerProfile', v)} placeholder="Perfil técnico..." />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-color)] pb-6">
                                <div className="flex items-center gap-4">
                                    <Icons.Target className="w-8 h-8 text-emerald-500" />
                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight uppercase">Base de Persona (Targeting)</h3>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[0, 1, 2].map(index => (
                                    <PersonaCard 
                                        key={index}
                                        index={index}
                                        data={editedClient.personas?.[index] || { name: '', description: '' }}
                                        isEditing={isEditingProfile}
                                        onSelect={() => setViewingPersonaIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 5: OBJECTIVES --- */}
                {activeTab === 'objectives' && (
                    <div className="animate-fade-in">
                        <ClientObjectivesView client={client} />
                    </div>
                )}

                {/* --- TAB 3: PROJECTS (GROUPED BY NUCLEO) --- */}
                {activeTab === 'projects' && (
                    <div className="animate-fade-in flex flex-col gap-10">
                        <div className="flex justify-between items-center bg-[var(--bg-card)] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-lg">
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Frentes de Entrega</h3>
                                <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Sincronismo operacional por núcleos de inteligência.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsGroupModalOpen(true)} className="flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--bg-elevation-1)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-rose-500/40 transition-all">
                                    <Icons.Folder className="w-5 h-5 opacity-40" /> Novo Núcleo
                                </button>
                                <button onClick={() => setIsProjectModalOpen(true)} disabled={!hasGroups} className="flex items-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] shadow-2xl shadow-[var(--accent-glow)] disabled:opacity-50 transition-all">
                                    <Icons.Plus className="w-5 h-5" /> Nova Frente
                                </button>
                            </div>
                        </div>

                        <div className="space-y-16">
                            {clientGroups.length > 0 ? clientGroups.map(group => {
                                const groupProjects = projects.filter(p => p.groupId === group.id);
                                return (
                                    <section key={group.id} className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-rose-500">
                                                <Layers size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{group.name}</h4>
                                                <p className="text-sm text-[var(--text-muted)] font-medium">{group.description || 'Núcleo de execução estratégica.'}</p>
                                            </div>
                                            <div className="flex-grow h-px bg-[var(--border-color)] opacity-20"></div>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{groupProjects.length} PROJETOS</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {groupProjects.length > 0 ? groupProjects.map(project => (
                                                <div key={project.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] p-8 hover:border-[var(--accent-color)] transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <span className="text-[10px] font-black bg-rose-500/10 px-3 py-1 rounded-full text-rose-500 uppercase tracking-widest border border-rose-500/10">{project.focus}</span>
                                                        <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{new Date(project.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-[var(--text-primary)] mb-3 group-hover:text-rose-500 transition-colors tracking-tight">{project.name}</h3>
                                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-8 leading-relaxed font-medium">{project.summary}</p>
                                                    <button onClick={() => handleGoToProject(project.id)} className="w-full py-4 rounded-2xl bg-[var(--bg-elevation-1)] text-[var(--text-primary)] hover:bg-[var(--accent-color)] hover:text-white font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-[var(--border-color)]">
                                                        Mapear Workboard
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="col-span-full py-12 border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] flex flex-col items-center justify-center text-[var(--text-muted)]">
                                                    <Briefcase size={32} className="opacity-10 mb-3" />
                                                    <p className="text-sm font-medium">Nenhum projeto ativo neste núcleo.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                );
                            }) : (
                                <div className="col-span-full text-center py-24 border-2 border-dashed border-[var(--border-color)] rounded-[3rem] text-[var(--text-muted)]">
                                    <p className="text-lg font-light">Defina os núcleos operacionais para este cliente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB 4: CALENDAR --- */}
                {activeTab === 'calendar' && (
                    <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-color)] p-10 animate-fade-in shadow-lg">
                        <div className="flex justify-between items-center mb-10 border-b border-[var(--border-color)] pb-6">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Agenda Operacional</h3>
                            <button onClick={() => setIsCalendarModalOpen(true)} className="flex items-center gap-3 bg-[var(--accent-color)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--accent-glow)] transform active:scale-95 transition-all">
                                <Icons.Plus className="w-5 h-5" /> Agendar Evento
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {clientEvents.length > 0 ? clientEvents.map(event => (
                                <div key={event.id} className="flex items-center gap-8 p-6 bg-[var(--bg-elevation-1)] rounded-3xl border border-[var(--border-color)] hover:border-indigo-500/50 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center px-6 border-r border-[var(--border-color)] min-w-[100px]">
                                        <span className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">{new Date(event.dueDate).toLocaleString('pt-BR', { month: 'short' })}</span>
                                        <span className="text-3xl font-black text-[var(--text-primary)]">{new Date(event.dueDate).getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-bold text-[var(--text-primary)] truncate tracking-tight">{event.title}</h4>
                                        <p className="text-sm text-[var(--text-secondary)] truncate font-medium mt-1">{event.description || "Sem detalhes adicionais."}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${event.status === 'CONCLUIDO' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/5 text-indigo-500 border-indigo-500/20'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            )) : <div className="text-center py-20 text-[var(--text-muted)] text-lg font-light italic border-2 border-dashed border-[var(--border-color)] rounded-[3rem]">O cronograma operacional está livre.</div>}
                        </div>
                    </div>
                )}

            </div>
            
            {/* Modals */}
            {isTransactionModalOpen && <TransactionModal onClose={() => setIsTransactionModalOpen(false)} defaultClientId={client.id} />}
            {isGroupModalOpen && <ProjectGroupModal onClose={() => setIsGroupModalOpen(false)} defaultClientId={client.id} />}
            {isProjectModalOpen && <ProjectModal onClose={() => setIsProjectModalOpen(false)} groupId={clientGroups.length === 1 ? clientGroups[0].id : undefined} />}
            {isCalendarModalOpen && <CalendarTaskModal onClose={() => setIsCalendarModalOpen(false)} defaultClientId={client.id} />}
            
            {/* PERSONA FULL VIEW/EDIT MODAL */}
            {viewingPersonaIndex !== null && (
                <PersonaModal 
                    persona={editedClient.personas?.[viewingPersonaIndex] || { name: '', description: '' }} 
                    isEditing={isEditingProfile}
                    onUpdate={(updated) => handlePersonaChange(viewingPersonaIndex, updated)}
                    onClose={() => setViewingPersonaIndex(null)} 
                />
            )}
        </div>
    );
};

// --- SUB COMPONENTS ---

const OnboardingSection: React.FC<{label: string, value?: string, isEditing: boolean, onChange: (v: string) => void, placeholder: string}> = ({ label, value, isEditing, onChange, placeholder }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] opacity-60 block">{label}</label>
        {isEditing ? (
            <textarea value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-primary)] focus:border-blue-500 outline-none resize-none h-32 font-medium shadow-inner" placeholder={placeholder} />
        ) : (
            <div className="p-5 bg-[var(--bg-elevation-1)] rounded-2xl border border-[var(--border-color)] min-h-[80px] shadow-sm">
                <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed">{value || <span className="italic opacity-30">Definição estratégica pendente.</span>}</p>
            </div>
        )}
    </div>
);

const ReadOnlyOrEdit: React.FC<{label: string, value: any, isEditing: boolean, onChange: (val: string) => void, icon?: React.ReactNode}> = ({ label, value, isEditing, onChange, icon }) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] block opacity-50">{label}</label>
        {isEditing ? (
            <input value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-elevation-2)] border border-[var(--border-color)] px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-primary)] focus:border-rose-500 outline-none transition-all shadow-inner" />
        ) : (
            <div className="flex items-center gap-3 text-lg font-bold text-[var(--text-primary)] tracking-tight min-h-[32px] group">
                {icon && <span className="text-rose-500 group-hover:scale-110 transition-transform">{icon}</span>}
                <span className="truncate">{value || "-"}</span>
            </div>
        )}
    </div>
);

const SocialInput: React.FC<{icon: React.ReactNode, value: string, isEditing: boolean, onChange: (val: string) => void, placeholder: string}> = ({ icon, value, isEditing, onChange, placeholder }) => {
    if (!isEditing) {
        return (
            <a href={value || '#'} target="_blank" rel="noreferrer" className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest ${value ? 'bg-[var(--bg-elevation-1)] border-[var(--border-color)] text-[var(--text-primary)] hover:text-rose-500 hover:border-rose-500 shadow-sm' : 'bg-transparent border-transparent text-[var(--text-muted)] opacity-20 cursor-not-allowed pointer-events-none'}`}>
                {icon} <span>{placeholder}</span>
            </a>
        );
    }
    return (
        <div className="flex items-center bg-[var(--bg-elevation-2)] rounded-xl border border-[var(--border-color)] px-4 py-2.5 flex-1 min-w-[180px] focus-within:border-rose-500 transition-colors shadow-inner">
            <span className="text-rose-500 mr-3">{icon}</span>
            <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bg-transparent w-full text-xs font-bold text-[var(--text-primary)] outline-none placeholder-white/10" />
        </div>
    );
}

const PersonaCard: React.FC<{index: number, data: ClientPersona, isEditing: boolean, onSelect: () => void}> = ({ index, data, onSelect }) => {
    const colors = ['border-rose-500/25', 'border-blue-500/25', 'border-emerald-500/25'];
    const textColors = ['text-rose-500', 'text-blue-500', 'text-emerald-500'];
    const backgrounds = ['bg-rose-500/5', 'bg-blue-500/5', 'bg-emerald-500/5'];

    return (
        <div onClick={onSelect} className={`group ${backgrounds[index % 3]} border-2 ${colors[index % 3]} rounded-[2rem] p-8 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-base shadow-lg ${textColors[index % 3]}`}>0{index + 1}</div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${textColors[index % 3].replace('text-', 'bg-')} animate-pulse`}></span>
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">FILE_ACTIVE</span>
                </div>
            </div>
            <h4 className="text-2xl font-black text-[var(--text-primary)] mb-3 tracking-tighter leading-tight group-hover:translate-x-1 transition-transform">{data.name || "Persona Desconhecida"}</h4>
            <div className="h-px w-full bg-[var(--border-color)] mb-4 opacity-20"></div>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed line-clamp-4 min-h-[72px]">{data.description || "Clique para mapear o comportamento neural e as dores deste avatar estratégico."}</p>
            
            <div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <span>Explorar Arquivo</span>
                <Icons.Back className="w-3 h-3 rotate-180" />
            </div>
        </div>
    );
}

const PersonaModal: React.FC<{ persona: ClientPersona, isEditing: boolean, onUpdate: (p: ClientPersona) => void, onClose: () => void }> = ({ persona, isEditing, onUpdate, onClose }) => {
    const [localPersona, setLocalPersona] = useState(persona);
    const handleChange = (field: keyof ClientPersona, val: string) => setLocalPersona({ ...localPersona, [field]: val });
    const handleConfirm = () => { onUpdate(localPersona); onClose(); };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[70] animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-2xl m-4 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-rose-500"></div>
                <div className="flex justify-between items-start mb-10">
                    <div>
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Data Lake / Targeting Profile</span>
                         <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{isEditing ? 'Configurar Avatar' : 'Arquivo da Persona'}</h2>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[var(--bg-elevation-2)] rounded-full text-[var(--text-muted)] transition-colors"><Icons.Close size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
                    <ModalField label="Nome do Arquétipo" value={localPersona.name} isEditing={isEditing} onChange={(v) => handleChange('name', v)} big />
                    <ModalField label="Descrição Técnica (Contexto)" value={localPersona.description} isEditing={isEditing} onChange={(v) => handleChange('description', v)} rows={4} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <ModalField label="Dores & Frustrações" value={localPersona.pains} isEditing={isEditing} onChange={(v) => handleChange('pains', v)} rows={3} />
                         <ModalField label="Desejos & Ambições" value={localPersona.desires} isEditing={isEditing} onChange={(v) => handleChange('desires', v)} rows={3} />
                    </div>
                    <ModalField label="Objeções de Compra" value={localPersona.objections} isEditing={isEditing} onChange={(v) => handleChange('objections', v)} rows={2} />
                </div>

                {isEditing && (
                    <div className="mt-10 pt-8 border-t border-[var(--border-color)] flex justify-end">
                        <button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-emerald-900/20 transition-all transform active:scale-95">Sincronizar Arquivo</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ModalField: React.FC<{label: string, value?: string, isEditing: boolean, onChange: (v: string) => void, rows?: number, big?: boolean}> = ({ label, value, isEditing, onChange, rows = 3, big = false }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-60 block">{label}</label>
        {isEditing ? (
            big ? (
                <input value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-elevation-1)] border-b-2 border-[var(--border-color)] py-2 text-2xl font-black text-[var(--text-primary)] focus:border-rose-500 outline-none transition-all placeholder-white/5" />
            ) : (
                <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows} className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-2xl p-4 text-sm font-medium text-[var(--text-primary)] focus:border-rose-500 outline-none resize-none transition-all shadow-inner" />
            )
        ) : (
            <div className={`p-6 bg-[var(--bg-elevation-1)] rounded-3xl border border-[var(--border-color)] shadow-inner ${big ? 'text-2xl font-black' : 'text-sm font-medium'} text-[var(--text-primary)] leading-relaxed`}>
                {value || <span className="opacity-10 italic">Nenhum dado neural capturado.</span>}
            </div>
        )}
    </div>
);

export default ClientDetailsView;
