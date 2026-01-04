
import React, { useState, useEffect } from 'react';
import type { GeneratedMedia } from '../types';
import RecentsView from './playground/RecentsView';
import ToolsView from './playground/ToolsView';
import SupportView from './playground/SupportView';
import ImageGenerator from './playground/ImageGenerator';
import VideoGenerator from './playground/VideoGenerator';
import { useTheme } from '../context/ThemeContext';
import { LayoutGrid, Image as ImageIcon, Activity, Sparkles } from 'lucide-react';

type PlaygroundView = 'main' | 'imageGenerator' | 'videoGenerator';
type MainTab = 'recentes' | 'ferramentas' | 'suporte';

interface AIPlaygroundViewProps {
    initialTool?: PlaygroundView;
    initialTab?: MainTab;
}

const AIPlaygroundView: React.FC<AIPlaygroundViewProps> = ({ initialTool, initialTab }) => {
    const { theme } = useTheme();
    const [view, setView] = useState<PlaygroundView>('main');
    const [activeTab, setActiveTab] = useState<MainTab>('ferramentas'); 
    const [history, setHistory] = useState<GeneratedMedia[]>([]);

    useEffect(() => {
        if (initialTool) setView(initialTool);
        if (initialTab) setActiveTab(initialTab);
    }, [initialTool, initialTab]);

    const handleMediaGenerated = (media: GeneratedMedia) => {
        setHistory(prev => [media, ...prev]);
    };

    if (view === 'imageGenerator') {
        return <ImageGenerator onBack={() => setView('main')} onMediaGenerated={handleMediaGenerated} history={history} />;
    }

    if (view === 'videoGenerator') {
        return <VideoGenerator onBack={() => setView('main')} onMediaGenerated={handleMediaGenerated} history={history} />;
    }

    const tabs: { id: MainTab, label: string, icon: React.FC<any> }[] = [
        { id: 'ferramentas', label: 'Estúdio', icon: LayoutGrid },
        { id: 'recentes', label: 'Galeria Neural', icon: ImageIcon },
        { id: 'suporte', label: 'Core System', icon: Activity },
    ];

    return (
        <div className="animate-fade-in h-full flex flex-col relative overflow-hidden">
            
            {/* Background Neural Grid FX */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0, 210, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Header: Mantido Conforme Protocolo */}
            <header className="mb-4 flex flex-col justify-start gap-2 border-b border-[var(--border-color)] pb-6 flex-shrink-0 relative z-10">
                <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    AI Playground
                </h1>
                <p className={`text-sm mt-1 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                    Laboratório experimental de síntese criativa e processamento neural.
                </p>
            </header>

            {/* Content Integrated Container */}
            <div className="flex-grow flex flex-col min-h-0 w-full max-w-7xl mx-auto relative z-10 overflow-visible">
                
                {/* Navegação Integrada com Fundo Escuro (DOCK) */}
                <div className="flex justify-center py-8">
                    <nav className="flex items-center gap-2 p-1.5 bg-[#0a0a0c] border border-white/5 rounded-[1.2rem] shadow-2xl shadow-black/40 backdrop-blur-xl">
                        {tabs.map(tab => {
                            const IsActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                 <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2.5 px-6 py-2.5 rounded-[0.9rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group
                                        ${IsActive 
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] scale-105' 
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <Icon size={14} className={`transition-all duration-500 ${IsActive ? 'rotate-12 scale-110' : 'group-hover:scale-110'}`} />
                                    <span className={IsActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}>{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Main Content Area - Ajustado para overflow-visible e sem fundo fixo */}
                <div className="flex-grow overflow-y-auto no-scrollbar pb-10 overflow-x-visible px-4">
                     {activeTab === 'recentes' && <RecentsView history={history} />}
                     {activeTab === 'ferramentas' && <ToolsView onSelectTool={(tool) => setView(tool)} />}
                     {activeTab === 'suporte' && <SupportView />}
                </div>
            </div>
        </div>
    );
};

export default AIPlaygroundView;
