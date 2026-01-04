
import React, { useState, useEffect } from 'react';
import type { NavLink } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MeusAgentsView from './components/MeusAgentsView'; 
import TarefasView from './components/TarefasView';
import MeusProjetosView from './components/MeusProjetosView';
import HomeView from './components/HomeView';
import AIPlaygroundView from './components/AIPlaygroundView';
import MarketingOpsCalendarView from './components/calendar/MarketingOpsCalendarView';
import EmailCentralView from './components/EmailCentralView';
import FinanceiroView from './components/finance/FinanceiroView';
import GestaoClientesView from './components/clients/GestaoClientesView';
import SettingsLayout from './components/settings/SettingsLayout';

import { TaskManagerProvider } from './context/TaskManagerContext';
import { CalendarProvider } from './context/CalendarContext';
import { EmailProvider } from './context/EmailContext';
import { AgentProvider } from './context/AgentContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { ClientProvider } from './context/ClientContext';

const navLinks: NavLink[] = [
  { id: 'Home', label: 'Home' },
  { id: 'Tarefas', label: 'Tarefas' },
  { id: 'Meus Projetos', label: 'Meus Projetos' },
  { id: 'Gestão de clientes', label: 'Gestão de clientes' },
  { id: 'Calendário', label: 'Calendário' },
  { id: 'E-mail', label: 'E-mail' },
  { id: 'Financeiro', label: 'Financeiro' },
  { id: 'Meus Agents', label: 'Meus Agents' },
  { id: 'AI Playground', label: 'AI Playground' },
  { id: 'Fale com Alita', label: 'Fale com Alita' },
  { id: 'Configurações', label: 'Configurações' },
];

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<string>('Home');
  const [navParams, setNavParams] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-hide sidebar when opening Settings
  useEffect(() => {
    if (activeView === 'Configurações') {
      setIsSidebarCollapsed(true);
    }
  }, [activeView]);

  const handleNavigate = (view: string, params?: any) => {
      setActiveView(view);
      setNavParams(params || null);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Home': return <HomeView setActiveView={handleNavigate} />;
      case 'Meus Agents': return <MeusAgentsView initialAgentId={navParams?.agentId} initialGroupId={navParams?.groupId} />;
      case 'E-mail': return <EmailCentralView />;
      case 'Financeiro': return <FinanceiroView initialTab={navParams?.tab} />;
      case 'Gestão de clientes': return <GestaoClientesView setActiveView={handleNavigate} />;
      case 'Tarefas': return <TarefasView />;
      case 'Meus Projetos': return <MeusProjetosView setActiveView={handleNavigate} />;
      case 'AI Playground': return <AIPlaygroundView initialTool={navParams?.tool} initialTab={navParams?.tab} />;
      case 'Calendário': return <MarketingOpsCalendarView />;
      case 'Configurações': return <SettingsLayout setActiveView={handleNavigate} />;
      default: return <div className="flex items-center justify-center h-full text-2xl font-bold opacity-20">Página em Construção</div>;
    }
  };

  const isSettings = activeView === 'Configurações'; 

  return (
    <div 
        className="h-screen flex transition-colors duration-300" 
        style={{ background: 'var(--bg-main)' }}
        data-theme={theme}
    >
        <Sidebar 
            navLinks={navLinks} 
            activeView={activeView} 
            onNavigate={handleNavigate} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${!isSettings ? 'p-6 md:p-8 lg:p-10' : ''}`}>
            {!isSettings && activeView === 'Home' && <Header />}
            <div className="flex-grow min-h-0">
                {renderContent()}
            </div>
        </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <ClientProvider>
            <AgentProvider>
                <TaskManagerProvider>
                    <CalendarProvider>
                        <EmailProvider>
                            <FinanceProvider>
                                <AppContent />
                            </FinanceProvider>
                        </EmailProvider>
                    </CalendarProvider>
                </TaskManagerProvider>
            </AgentProvider>
        </ClientProvider>
    </ThemeProvider>
  );
};

export default App;
