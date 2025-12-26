
import React from 'react';
import WidgetCard from '../../dashboard/shared/WidgetCard';

const CheckIcon = () => (
    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const Billing: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in max-w-5xl">
            <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Assinatura & IA</h2>
                <p className="text-[var(--text-secondary)] text-sm">Gerencie seu plano e monitore o consumo de recursos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Details */}
                <WidgetCard className="lg:col-span-2 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Plano Atual</span>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-3">Pro Enterprise</h3>
                            <p className="text-[var(--text-muted)] mt-1">Renova em 24 de Outubro, 2025</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-[var(--text-primary)]">R$ 299</span>
                            <span className="text-[var(--text-muted)] text-sm">/mês</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><CheckIcon /> Acesso ilimitado ao Gemini 1.5 Pro</div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><CheckIcon /> 10 Usuários inclusos</div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><CheckIcon /> 50GB de Armazenamento</div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><CheckIcon /> Suporte Prioritário 24/7</div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-main)] font-bold rounded-lg hover:opacity-90 transition-opacity">Gerenciar Plano</button>
                        <button className="px-6 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-elevation-1)] transition-colors">Alterar Pagamento</button>
                    </div>

                    {/* Background Decor */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </WidgetCard>

                {/* AI Token Usage */}
                <WidgetCard>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Consumo de IA</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-secondary)]">Tokens de Entrada</span>
                                <span className="text-[var(--text-primary)] font-mono">850k / 1M</span>
                            </div>
                            <div className="w-full bg-[var(--bg-elevation-1)] h-2 rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-secondary)]">Geração de Imagens</span>
                                <span className="text-[var(--text-primary)] font-mono">42 / 100</span>
                            </div>
                            <div className="w-full bg-[var(--bg-elevation-1)] h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[42%] rounded-full"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-secondary)]">Video Rendering</span>
                                <span className="text-[var(--text-primary)] font-mono">120min / 500min</span>
                            </div>
                            <div className="w-full bg-[var(--bg-elevation-1)] h-2 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full w-[24%] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-muted)] text-center">Precisa de mais limite? <a href="#" className="text-rose-500 hover:underline">Fale com vendas</a>.</p>
                    </div>
                </WidgetCard>
            </div>

            {/* Invoice History Table */}
            <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Histórico de Faturas</h3>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--bg-elevation-1)] border-b border-[var(--border-color)]">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {[
                                { date: '24 Set 2024', amount: 'R$ 299,00', status: 'Pago' },
                                { date: '24 Ago 2024', amount: 'R$ 299,00', status: 'Pago' },
                                { date: '24 Jul 2024', amount: 'R$ 299,00', status: 'Pago' },
                            ].map((invoice, i) => (
                                <tr key={i} className="hover:bg-[var(--bg-elevation-1)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{invoice.date}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono">{invoice.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded uppercase">{invoice.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline">PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
