
import React from 'react';
import WidgetCard from '../../dashboard/shared/WidgetCard';

const Integrations: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Integrações</h2>
                <p className="text-[var(--text-secondary)] text-sm">Conecte suas ferramentas favoritas ao Nexus Hub.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WidgetCard className="flex items-center justify-between opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 font-bold">O</div>
                        <div>
                            <h3 className="font-bold text-[var(--text-primary)]">OpenAI API</h3>
                            <p className="text-xs text-[var(--text-muted)]">GPT-4 Turbo connection</p>
                        </div>
                    </div>
                    <span className="text-xs border border-[var(--border-color)] px-2 py-1 rounded">Em Breve</span>
                </WidgetCard>

                <WidgetCard className="flex items-center justify-between opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-500 font-bold">IG</div>
                        <div>
                            <h3 className="font-bold text-[var(--text-primary)]">Instagram Graph</h3>
                            <p className="text-xs text-[var(--text-muted)]">Auto-posting & Analytics</p>
                        </div>
                    </div>
                    <span className="text-xs border border-[var(--border-color)] px-2 py-1 rounded">Em Breve</span>
                </WidgetCard>
            </div>
        </div>
    );
};

export default Integrations;
