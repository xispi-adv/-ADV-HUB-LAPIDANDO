
import React, { useMemo } from 'react';
import { useEmail } from '../../context/EmailContext';
import { useTheme } from '../../context/ThemeContext';
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
    const { theme } = useTheme();
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
        <div className={`h-full flex flex-col ${theme === 'light' ? 'bg-slate-50' : 'bg-[#0F0F11]'}`}>
            <header className={`p-6 flex flex-col gap-4 border-b ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/5'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className={`p-2 -ml-2 transition-all rounded-lg lg:hidden ${theme === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-white/40 hover:text-white'}`}>
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h2 className={`text-xl font-bold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedFolder?.name}</h2>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>{emails.length} Mensagens</span>
                </div>
                
                <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${theme === 'light' ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-white/30 group-focus-within:text-rose-500'}`}>
                        <Search size={16} />
                    </div>
                    <input
                        type="search"
                        placeholder="Buscar na conversa..."
                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all outline-none font-medium
                            ${theme === 'light' 
                                ? 'bg-slate-100 border-slate-200 focus:bg-white focus:border-blue-500 text-slate-900 placeholder-slate-400' 
                                : 'bg-black/40 border-white/10 focus:border-rose-500/50 text-white placeholder-white/20'}`}
                    />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <EmailListSkeleton />
                ) : emails.length > 0 ? (
                    (Object.entries(groupedEmails) as [string, Email[]][]).map(([title, group]) => group.length > 0 && (
                        <div key={title}>
                            <div className={`px-6 py-2 border-y backdrop-blur-sm ${theme === 'light' ? 'bg-slate-100/50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-500' : 'text-white/60'}`}>{title}</span>
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
                    <div className={`flex flex-col items-center justify-center h-full p-10 text-center opacity-40 ${theme === 'light' ? 'text-slate-400' : 'text-white'}`}>
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-4 ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
                            <Search size={24} />
                        </div>
                        <p className="text-sm font-bold">Caixa de entrada limpa</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailListPanel;
