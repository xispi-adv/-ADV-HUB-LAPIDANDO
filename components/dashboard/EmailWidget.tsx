import React from 'react';
import WidgetCard from './shared/WidgetCard';
import { useEmail } from '../../context/EmailContext';

const EnvelopeIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> );
const ReplyIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg> );
const EyeIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );

const EmailWidget: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { emails, markEmailAsRead } = useEmail();

    // Fix: Using labelIds.includes('INBOX') instead of non-existent folderId property
    const unreadEmails = emails
        .filter(e => !e.isRead && e.labelIds.includes('INBOX'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    return (
        <WidgetCard onClick={() => setActiveView('E-mail')}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">E-mail Prioritário</h3>
                {unreadEmails.length > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {unreadEmails.length} Não Lido
                    </span>
                )}
            </div>
            <div className="space-y-2 flex-grow">
                {unreadEmails.length > 0 ? unreadEmails.map(email => (
                    <div key={email.id} className="group flex items-center gap-3 p-2 hover:bg-white/5 rounded-md transition-colors">
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-white/90 truncate">{email.from.name}</p>
                            <p className="text-xs text-white/70 truncate">{email.subject}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); markEmailAsRead(email.id); }} title="Marcar como lido" className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full"><EyeIcon /></button>
                            <button onClick={(e) => e.stopPropagation()} title="Responder" className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full"><ReplyIcon /></button>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/60">
                         <EnvelopeIcon />
                        <p className="mt-2">Caixa de entrada limpa!</p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
};

export default EmailWidget;