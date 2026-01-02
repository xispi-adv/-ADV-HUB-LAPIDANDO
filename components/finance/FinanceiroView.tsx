
import React, { useState, useEffect } from 'react';
import FinancialCockpit from './FinancialCockpit';
import BookkeepingView from './BookkeepingView';
import AIAuditorView from './AIAuditorView';
import { useTheme } from '../../context/ThemeContext';

interface FinanceiroViewProps {
    initialTab?: 'cockpit' | 'bookkeeping' | 'auditor';
}

const FinanceiroView: React.FC<FinanceiroViewProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'bookkeeping' | 'auditor'>('cockpit');
  const { theme } = useTheme();

  useEffect(() => {
      if (initialTab) {
          setActiveTab(initialTab);
      }
  }, [initialTab]);

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      <header className="flex-shrink-0 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--border-color)] pb-8">
        <div>
            <h1 className={`text-5xl font-light tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Financeiro Inteligente
            </h1>
            <p className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-slate-500' : 'text-[var(--text-muted)]'}`}>
                Gestão analítica de caixa e auditoria fiscal impulsionada por IA.
            </p>
        </div>
        <div className="flex gap-2 bg-[var(--bg-elevation-1)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm">
             {['cockpit', 'bookkeeping', 'auditor'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wider
                        ${activeTab === tab 
                            ? 'bg-[var(--accent-color)] text-white shadow-lg' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'}
                    `}
                 >
                     {tab === 'cockpit' ? 'Cockpit' : tab === 'bookkeeping' ? 'Lançamentos' : 'Auditor IA'}
                 </button>
             ))}
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          {activeTab === 'cockpit' && <FinancialCockpit onRequestAuditor={() => setActiveTab('auditor')} />}
          {activeTab === 'bookkeeping' && <BookkeepingView />}
          {activeTab === 'auditor' && <AIAuditorView />}
      </div>
    </div>
  );
};

export default FinanceiroView;
