import React from 'react';
import { useEmail } from '../../context/EmailContext';
import EmailListItem from './EmailListItem';
import { EmailListSkeleton } from './skeletons';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const BackIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
    </svg>
);


interface EmailListPanelProps {
    onSelectEmail: (emailId: string) => void;
    onBack?: () => void; // Optional for mobile view
    selectedEmailId?: string | null;
}

const EmailListPanel: React.FC<EmailListPanelProps> = ({ onSelectEmail, onBack, selectedEmailId }) => {
    const { getEmailsByFolder, selectedFolderId, folders, isLoading } = useEmail();
    const emails = getEmailsByFolder(selectedFolderId);
    const selectedFolder = folders.find(f => f.id === selectedFolderId);

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 flex-shrink-0 border-b border-white/10 flex items-center gap-2">
                {onBack && (
                     <button onClick={onBack} className="p-2 -ml-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 lg:hidden">
                        <BackIcon />
                    </button>
                )}
                <h2 className="text-xl font-semibold text-white/90">{selectedFolder?.name}</h2>
            </header>
            <div className="p-4 flex-shrink-0">
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Pesquisar email..."
                        className="w-full bg-black/50 border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    />
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                    <EmailListSkeleton />
                ) : emails.length > 0 ? (
                    <ul>
                        {emails.map(email => (
                            <EmailListItem
                                key={email.id}
                                email={email}
                                isSelected={email.id === selectedEmailId}
                                onSelect={() => onSelectEmail(email.id)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full text-white/50">
                        <p>Nenhum email aqui.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailListPanel;
