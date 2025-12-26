import React from 'react';
import type { Email } from '../../types';
import { EmailViewSkeleton } from './skeletons';

const BackIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
    </svg>
);
const ReplyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
);
const ForwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
    </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const AttachmentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

interface EmailViewPanelProps {
    email: Email | null;
    onBack?: () => void;
}

const EmailViewPanel: React.FC<EmailViewPanelProps> = ({ email, onBack }) => {

    if (!email) {
        return (
            <div className="h-full flex items-center justify-center text-center text-white/50">
                <div>
                    <p className="text-xl font-bold">Selecione um email para ler</p>
                    <p>O conteúdo do seu email aparecerá aqui.</p>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(email.date).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 flex-shrink-0 border-b border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 lg:hidden">
                            <BackIcon />
                        </button>
                    )}
                    <h2 className="text-xl font-semibold text-white/90 line-clamp-1">{email.subject}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10" title="Responder"><ReplyIcon className="w-5 h-5"/></button>
                    <button className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10" title="Encaminhar"><ForwardIcon className="w-5 h-5"/></button>
                    <button className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10" title="Excluir"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </header>
            <div className="p-4 flex-shrink-0 flex items-center gap-4">
                <img src={email.from.avatar || `https://ui-avatars.com/api/?name=${email.from.name.replace(' ', '+')}&background=B91C1C&color=fff`} alt={email.from.name} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-white">{email.from.name}</p>
                    <p className="text-sm text-white/70">{email.from.email}</p>
                </div>
                <time className="text-sm text-white/60 ml-auto">{formattedDate}</time>
            </div>
            <div className="flex-grow overflow-y-auto p-4 prose prose-invert prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: email.body }} />
            </div>
            {email.attachments.length > 0 && (
                 <div className="flex-shrink-0 p-4 border-t border-white/10">
                     <h3 className="text-sm font-semibold text-white/80 mb-2">{email.attachments.length} Anexo(s)</h3>
                     <div className="flex flex-wrap gap-2">
                        {email.attachments.map(att => (
                            <a key={att.id} href={att.url} download className="flex items-center gap-2 bg-black/50 hover:bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white/90 transition-colors">
                                <AttachmentIcon className="w-4 h-4" />
                                <span>{att.filename}</span>
                                <span className="text-xs text-white/60">({(att.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </a>
                        ))}
                     </div>
                 </div>
            )}
        </div>
    );
};

export default EmailViewPanel;
