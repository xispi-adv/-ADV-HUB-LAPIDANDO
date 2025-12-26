
import React, { useState } from 'react';
import OverviewPerformance from './views/OverviewPerformance';
import EditProfile from './views/EditProfile';
import Billing from './views/Billing';
import Integrations from './views/Integrations';
import PersonalLifeOS from './views/PersonalLifeOS';

// Sidebar Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const CreditCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;

type SettingsTab = 'overview' | 'lifeos' | 'profile' | 'billing' | 'integrations' | 'security';

interface SettingsLayoutProps {
    setActiveView?: (view: string, params?: any) => void;
}

interface SettingsGroup {
    title: string;
    items: {
        id: SettingsTab;
        label: string;
        icon: React.FC;
    }[];
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ setActiveView }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewPerformance setActiveView={setActiveView} />;
            case 'lifeos': return <PersonalLifeOS />;
            case 'profile': return <EditProfile />;
            case 'billing': return <Billing />;
            case 'integrations': return <Integrations />;
            case 'security': return <div className="text-[var(--text-muted)] text-center py-20">Configurações de Segurança em desenvolvimento.</div>;
            default: return <OverviewPerformance setActiveView={setActiveView} />;
        }
    };

    const settingsGroups: SettingsGroup[] = [
        {
            title: 'Visão de Perfil',
            items: [
                { id: 'overview', label: 'Visão Geral', icon: DashboardIcon },
                { id: 'profile', label: 'Meu Perfil', icon: UserIcon },
                { id: 'lifeos', label: 'Life Os', icon: ActivityIcon },
            ]
        },
        {
            title: 'Configurações de Conta',
            items: [
                { id: 'billing', label: 'Assinatura & IA', icon: CreditCardIcon },
                { id: 'integrations', label: 'Integrações', icon: LinkIcon },
                { id: 'security', label: 'Segurança', icon: ShieldIcon },
            ]
        }
    ];

    return (
        <div className="h-full flex animate-fade-in-up overflow-hidden">
            {/* Sidebar */}
            <aside className="w-16 lg:w-64 bg-[#15161C] border-r border-[var(--border-color)] flex-shrink-0 flex flex-col py-6">
                <h2 className="px-6 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6 hidden lg:block">Configurações</h2>
                
                <nav className="flex-1 overflow-y-auto space-y-6">
                    {settingsGroups.map((group, index) => (
                        <div key={index} className="px-3">
                            <h3 className="px-3 mb-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:block">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map(item => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 
                                                ${isActive 
                                                    ? 'bg-[var(--bg-elevation-2)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' 
                                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-1)] border border-transparent'}
                                            `}
                                            title={item.label}
                                        >
                                            <Icon />
                                            <span className="text-sm font-medium hidden lg:inline">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-[var(--bg-main)] p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default SettingsLayout;
