
import React, { useState, useEffect } from 'react';
import type { GeneratedMedia } from '../types';
import RecentsView from './playground/RecentsView';
import ToolsView from './playground/ToolsView';
import SupportView from './playground/SupportView';
import ImageGenerator from './playground/ImageGenerator';
import VideoGenerator from './playground/VideoGenerator';
import { useTheme } from '../context/ThemeContext';

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

    const tabs: { id: MainTab, label: string }[] = [
        { id: 'ferramentas', label: 'Ferramentas' },
        { id: 'recentes', label: 'Galeria' },
        { id: 'suporte', label: 'Status' },
    ];

    return (
        <div className={`animate-fade-in-up h-full flex flex-col ${theme === 'light' ? 'bg-slate-50 -m-10 p-10' : ''}`}>
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--border-color)] pb-10 flex-shrink-0">
                <div>
                    <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        AI Playground
                    </h1>
                    <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                        Laboratório experimental de síntese criativa e processamento neural.
                    </p>
                </div>
                
                <nav className="flex bg-[var(--bg-elevation-1)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                    {tabs.map(tab => {
                        const IsActive = activeTab === tab.id;
                        return (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wider
                                    ${IsActive 
                                        ? 'bg-[var(--accent-color)] text-white shadow-lg' 
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'}
                                `}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </header>

            <div className="flex-grow min-h-0 w-full max-w-7xl mx-auto pb-6">
                 {activeTab === 'recentes' && <RecentsView history={history} />}
                 {activeTab === 'ferramentas' && <ToolsView onSelectTool={(tool) => setView(tool)} />}
                 {activeTab === 'suporte' && <SupportView />}
            </div>
        </div>
    );
};

export default AIPlaygroundView;
