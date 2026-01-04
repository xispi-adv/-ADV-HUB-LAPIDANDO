
import React, { useMemo, useState, useRef } from 'react';
import type { NavLink } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useTaskManager } from '../context/TaskManagerContext';
import { useAgents } from '../context/AgentContext';

// --- SVG Icons ---
const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.12 0l8.955 8.955M3 10.5v.75a3 3 0 003 3h12a3 3 0 003-3v-.75M9 21v-6a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" />
    </svg>
);
const TarefasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const AgentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.22 15.75M9.75 3.104a2.25 2.25 0 014.5 0v5.714a2.25 2.25 0 01-.5 1.591L14.78 15.75M9.75 3.104a2.25 2.25 0 00-4.5 0v5.714a2.25 2.25 0 000.5 1.591L5.22 15.75m14.06-5.25a2.25 2.25 0 00-4.5 0v5.714a2.25 2.25 0 000.5 1.591L14.78 15.75m-4.5-8.25h4.5a2.25 2.25 0 010 4.5h-4.5a2.25 2.25 0 010-4.5zM10.22 15.75a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zM14.78 15.75a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z" />
    </svg>
);
const ProjetosIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);
const ClientesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.226c-3.42-.74-6.36-3.686-6.36-7.226 0-4.024 3.28-7.297 7.348-7.297s7.348 3.273 7.348 7.297c0 3.54-2.94 6.486-6.36 7.226m-1.546-9.332a9.014 9.014 0 0110.153-2.191m-10.153 2.191L4.5 21m0 0a9.014 9.014 0 0010.153-2.191m-4.243-5.344a9.015 9.015 0 01-3.182-2.152m3.182 2.152a2.25 2.25 0 00-3.182-2.152" />
    </svg>
);
const AlitaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a.38.38 0 01.266-.112h2.008m-6.667-3.918a.33.33 0 01-.33-.33V9.75a.33.33 0 01.33-.33h.33a.33.33 0 01.33.33v3.418a.33.33 0 01-.33.33h-.33z" />
    </svg>
);
const PlaygroundIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.875V3.75m-4.5 10.5a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
    </svg>
);
const CalendarioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);
const EmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const FinanceiroIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
);
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CollapseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
);
const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
);
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.263l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);
const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);


const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'Home': HomeIcon,
    'Tarefas': TarefasIcon,
    'Meus Agents': AgentsIcon,
    'Meus Projetos': ProjetosIcon,
    'E-mail': EmailIcon, 
    'Financeiro': FinanceiroIcon,
    'AI Playground': PlaygroundIcon,
    'Calendário': CalendarioIcon,
    'Gestão de clientes': ClientesIcon,
    'Fale com Alita': AlitaIcon,
    'Configurações': SettingsIcon,
};

interface SidebarProps {
  navLinks: NavLink[];
  activeView: string;
  onNavigate: (view: string, params?: any) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

// Type definition for grouped links
interface NavGroup {
    title: string;
    links: NavLink[];
}

const Sidebar: React.FC<SidebarProps> = ({ navLinks, activeView, onNavigate, isCollapsed, onToggle }) => {
    const { theme, toggleTheme } = useTheme();
    const { projects, selectProject } = useTaskManager();
    const { agents, groups } = useAgents();
    
    // State for Submenu
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [submenuPosition, setSubmenuPosition] = useState<{ top: number, left: number } | null>(null);
    const hoverTimeoutRef = useRef<any>(null);
    
    // Organize links into logical groups
    const groupedLinks: NavGroup[] = useMemo(() => {
        const groupsConfig: Record<string, string[]> = {
            'Principal': ['Home'],
            'Operacional': ['Tarefas', 'Meus Projetos'],
            'Gestão': ['Gestão de clientes', 'Calendário', 'E-mail', 'Financeiro'],
            'Inteligência': ['Meus Agents', 'AI Playground', 'Fale com Alita'],
            'Sistema': ['Configurações'],
        };

        const result: NavGroup[] = [];
        
        Object.entries(groupsConfig).forEach(([title, linkLabels]) => {
             const linksInGroup = navLinks.filter(link => linkLabels.includes(link.label));
             if (linksInGroup.length > 0) {
                 result.push({ title, links: linksInGroup });
             }
        });

        // Catch-all for any links not explicitly grouped
        const groupedLabels = Object.values(groupsConfig).flat();
        const remainingLinks = navLinks.filter(link => !groupedLabels.includes(link.label));
        if (remainingLinks.length > 0) {
            result.push({ title: 'Outros', links: remainingLinks });
        }

        return result;
    }, [navLinks]);

    const handleMouseEnter = (label: string, e: React.MouseEvent<HTMLElement>) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        
        const rect = e.currentTarget.getBoundingClientRect();
        setSubmenuPosition({ top: rect.top, left: rect.right });
        setHoveredItem(label);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredItem(null);
            setSubmenuPosition(null);
        }, 300);
    };

    // Submenu Data Logic
    const renderSubMenu = () => {
        if (!hoveredItem || !submenuPosition) return null;

        let content = null;

        switch (hoveredItem) {
            case 'Meus Projetos':
                content = (
                    <>
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Projetos Recentes</h4>
                        <ul className="space-y-1">
                            {projects.slice(0, 5).map(p => (
                                <li key={p.id}>
                                    <button 
                                        onClick={() => {
                                            selectProject(p.id);
                                            onNavigate('Tarefas');
                                            setHoveredItem(null);
                                        }}
                                        className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors truncate"
                                    >
                                        {p.name}
                                    </button>
                                </li>
                            ))}
                            {projects.length === 0 && <li className="text-xs text-[var(--text-muted)] px-2">Sem projetos criados.</li>}
                        </ul>
                    </>
                );
                break;
            case 'Financeiro':
                content = (
                    <>
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Acesso Rápido</h4>
                        <ul className="space-y-1">
                            {['cockpit', 'bookkeeping', 'auditor'].map(tab => (
                                <li key={tab}>
                                    <button 
                                        onClick={() => {
                                            onNavigate('Financeiro', { tab });
                                            setHoveredItem(null);
                                        }}
                                        className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors"
                                    >
                                        {tab === 'cockpit' ? 'Cockpit' : tab === 'bookkeeping' ? 'Lançamentos' : 'Auditor IA'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                );
                break;
            case 'Meus Agents':
                content = (
                    <>
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Equipes de IA</h4>
                        <ul className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {groups.map(g => (
                                <li key={g.id}>
                                    <button 
                                        onClick={() => {
                                            onNavigate('Meus Agents', { groupId: g.id });
                                            setHoveredItem(null);
                                        }}
                                        className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors truncate"
                                    >
                                        {g.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                );
                break;
            case 'AI Playground':
                content = (
                    <>
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Ferramentas</h4>
                        <ul className="space-y-1">
                            <li>
                                <button onClick={() => { onNavigate('AI Playground', { tool: 'imageGenerator' }); setHoveredItem(null); }} className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors">Gerar Imagem</button>
                            </li>
                            <li>
                                <button onClick={() => { onNavigate('AI Playground', { tool: 'videoGenerator' }); setHoveredItem(null); }} className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors">Gerar Vídeo</button>
                            </li>
                            <li>
                                <button onClick={() => { onNavigate('AI Playground', { tab: 'recentes' }); setHoveredItem(null); }} className="w-full text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] px-2 py-1.5 rounded transition-colors">Galeria</button>
                            </li>
                        </ul>
                    </>
                );
                break;
            default:
                return null;
        }

        return (
            <div 
                className="fixed z-[100] w-56 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl shadow-2xl p-3 animate-fade-in origin-left ml-2"
                style={{ top: submenuPosition.top, left: submenuPosition.left }}
                onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); }}
                onMouseLeave={handleMouseLeave}
            >
                {content}
            </div>
        );
    };

    return (
        <>
            <aside 
                className={`
                    backdrop-blur-xl flex-shrink-0 flex flex-col border-r border-[var(--border-color)]
                    transition-all duration-300 ease-in-out overflow-visible relative z-50
                    ${isCollapsed ? 'w-20' : 'w-72'}
                `}
                style={{ backgroundColor: 'var(--bg-sidebar)' }}
            >
                {/* Header / Logo Area */}
                <div className="h-20 flex items-center px-6 relative">
                     <div className={`
                        text-[var(--text-primary)] font-bold tracking-wider whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center
                        ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto text-xl'}
                     `}>
                         IA MARKETING
                     </div>
                     
                     {/* Collapsed Logo State */}
                     <div className={`
                        absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center transition-all duration-300
                        ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}
                     `}>
                         <span className="text-[var(--accent-color)] font-black text-2xl">IA</span>
                     </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow overflow-y-auto overflow-x-hidden py-4 space-y-2 custom-scrollbar">
                    {groupedLinks.map((group, index) => (
                        <div key={group.title} className={`px-3 ${index > 0 ? 'mt-6' : ''}`}>
                            {!isCollapsed && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider animate-fade-in whitespace-nowrap">
                                    {group.title}
                                </h3>
                            )}
                            {isCollapsed && index > 0 && (
                                 <div className="h-px w-8 bg-[var(--border-color)] mx-auto mb-4" />
                            )}
                            <ul className="space-y-1">
                                {group.links.map((link) => {
                                    const isActive = link.label === activeView;
                                    const Icon = iconMap[link.label];

                                    return (
                                        <li key={link.id} className="relative group/item">
                                            <button
                                                onClick={() => onNavigate(link.label)}
                                                onMouseEnter={(e) => handleMouseEnter(link.label, e)}
                                                onMouseLeave={handleMouseLeave}
                                                title={isCollapsed ? link.label : ''}
                                                className={`
                                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                                    ${isActive 
                                                        ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' 
                                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                                                    }
                                                    ${isCollapsed ? 'justify-center' : ''}
                                                `}
                                            >
                                                {/* Active Indicator Line (Left) */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--accent-color)] rounded-r-full"></div>
                                                )}

                                                {Icon && (
                                                    <Icon 
                                                        className={`
                                                            w-5 h-5 flex-shrink-0 transition-colors duration-200
                                                            ${isActive ? 'text-[var(--accent-color)]' : 'group-hover:text-[var(--text-primary)]'}
                                                        `} 
                                                    />
                                                )}
                                                <span 
                                                    className={`
                                                        text-sm font-medium whitespace-nowrap transition-all duration-300 origin-left
                                                        ${isCollapsed ? 'opacity-0 w-0 scale-0 hidden' : 'opacity-100 w-auto scale-100'}
                                                    `}
                                                >
                                                    {link.label}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer / Toggle Area */}
                <div className="mt-auto p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md flex flex-col gap-2">
                    
                    {/* Theme Toggle */}
                     <button
                        onClick={toggleTheme}
                        className={`
                            flex items-center gap-3 w-full rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-200
                            ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2'}
                        `}
                        title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                    >
                        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        <span className={`
                            text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300
                            ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                        `}>
                            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                        </span>
                    </button>

                    {/* Collapse Toggle */}
                    <button
                        onClick={onToggle}
                        className={`
                            flex items-center gap-3 w-full rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-200
                            ${isCollapsed ? 'justify-center py-3' : 'px-3 py-2'}
                        `}
                        title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
                    >
                        {isCollapsed ? <ExpandIcon className="w-5 h-5"/> : <CollapseIcon className="w-5 h-5" />}
                        <span className={`
                            text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300
                            ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                        `}>
                            Recolher Menu
                        </span>
                    </button>
                </div>
            </aside>
            
            {/* Render Submenu Outside the Nav flow using fixed positioning */}
            {renderSubMenu()}
        </>
    );
};

export default Sidebar;
