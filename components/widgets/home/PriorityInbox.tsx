import React from 'react';
import { useEmail } from '../../../context/EmailContext';

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ArchiveBoxIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);


const PriorityInbox: React.FC = () => {
    const { emails, markEmailAsRead, archiveEmail } = useEmail();

    // Fix: Use labelIds.includes('INBOX') instead of non-existent folderId property
    const unreadEmails = emails
        .filter(e => !e.isRead && e.labelIds.includes('INBOX'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Caixa de Entrada</h2>
                {unreadEmails.length > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2.5 py-1">
                        {unreadEmails.length}
                    </span>
                )}
            </div>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                {unreadEmails.length > 0 ? (
                    unreadEmails.map(email => (
                        <div key={email.id} className="group flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                            <img 
                                src={email.from.avatar || `https://ui-avatars.com/api/?name=${email.from.name.replace(' ', '+')}&background=1F2937&color=fff&bold=true`} 
                                alt={email.from.name} 
                                className="w-9 h-9 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0 flex-grow">
                                <p className="text-sm font-semibold text-white/90 truncate">{email.from.name}</p>
                                <p className="text-xs text-white/70 truncate">{email.subject}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); markEmailAsRead(email.id); }} title="Marcar como lido" className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full"><EyeIcon /></button>
                                <button onClick={(e) => { e.stopPropagation(); archiveEmail(email.id); }} title="Arquivar" className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full"><ArchiveBoxIcon /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-white/60">
                        <p>Caixa de entrada limpa!</p>
                    </div>
                )}
            </div>
            <button className="mt-4 w-full text-center bg-white/10 hover:bg-white/20 text-white/80 font-semibold py-2 rounded-lg transition-colors">
                Ver todos os e-mails
            </button>
        </div>
    );
};

export default PriorityInbox;