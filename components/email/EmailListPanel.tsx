import React, { useMemo } from 'react';
import { useEmail } from '../../context/EmailContext';
import EmailListItem from './EmailListItem';
import { EmailListSkeleton } from './skeletons';
import { Search, ChevronLeft } from 'lucide-react';
import type { Email } from '../../types';

interface EmailListPanelProps {
    onSelectEmail: (emailId: string) => void;
    onBack?: () => void;
    selectedEmailId?: string | null;
}

const EmailListPanel: React.FC<EmailListPanelProps> = ({ onSelectEmail, onBack, selectedEmailId }) => {
    const { getEmailsByFolder, selectedFolderId, folders, isLoading } = useEmail();
    const emails = getEmailsByFolder(selectedFolderId);
    const selectedFolder = folders.find(f => f.id === selectedFolderId);

    const groupedEmails = useMemo(() => {
        const today = new Date().toDateString();
        const groups: { [key: string]: Email[] } = { 'Hoje': [], 'Anteriores': [] };
        
        emails.forEach(email => {
            const date = new Date(email.date).toDateString();
            if (date === today) groups['Hoje'].push(email);
            else groups['Anteriores'].push(email);
        });
        return groups;
    }, [emails]);

    return (
        <div className="h-full flex flex-col bg-[var(--bg-elevation-1)]">
            <header className="p-6 border-b border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white transition-all rounded-lg lg:hidden">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-white tracking-tight">{selectedFolder?.name}</h2>
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{emails.length} Mensagens</span>
                </div>
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-rose-500">
                        <Search size={16} className="text-white/20" />
                    </div>
                    <input
                        type="search"
                        placeholder="Buscar na conversa..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <EmailListSkeleton />
                ) : emails.length > 0 ? (
                    // Fix: Cast Object.entries to correct type to avoid 'unknown' mapping errors
                    (Object.entries(groupedEmails) as [string, Email[]][]).map(([title, group]) => group.length > 0 && (
                        <div key={title}>
                            <div className="px-6 py-2 bg-white/5 backdrop-blur-sm border-y border-white/5">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{title}</span>
                            </div>
                            <ul>
                                {group.map(email => (
                                    <EmailListItem
                                        key={email.id}
                                        email={email}
                                        isSelected={email.id === selectedEmailId}
                                        onSelect={() => onSelectEmail(email.id)}
                                    />
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 p-10 text-center">
                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-4">
                            <Search size={24} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium">Caixa de entrada limpa</p>
                        <p className="text-xs mt-1">Nada para o marcador selecionado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailListPanel;