
import React from 'react';
import WidgetCard from '../../dashboard/shared/WidgetCard';

const EditProfile: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Meu Perfil</h2>
                <p className="text-[var(--text-secondary)] text-sm">Gerencie suas informações pessoais e de exibição.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Avatar & Basic Info */}
                <div className="space-y-6">
                    <WidgetCard className="flex flex-col items-center p-8 text-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-[var(--bg-card)] shadow-xl overflow-hidden mb-4">
                                <img src="https://i.pravatar.cc/150?u=teles" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Alterar</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Teles</h3>
                        <p className="text-sm text-[var(--text-muted)]">CEO & Founder</p>
                    </WidgetCard>
                </div>

                {/* Right Column: Form Fields */}
                <div className="md:col-span-2 space-y-6">
                    <WidgetCard>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Teles" 
                                        className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Cargo / Função</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Head de Marketing" 
                                        className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">E-mail Corporativo</label>
                                <input 
                                    type="email" 
                                    defaultValue="teles@adverge.com" 
                                    className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Bio / Sobre</label>
                                <textarea 
                                    rows={4}
                                    defaultValue="Especialista em marketing digital focado em performance e automação com IA." 
                                    className="w-full bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
                                <button type="button" className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancelar</button>
                                <button type="button" className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-rose-900/20 transition-all">Salvar Alterações</button>
                            </div>
                        </form>
                    </WidgetCard>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
