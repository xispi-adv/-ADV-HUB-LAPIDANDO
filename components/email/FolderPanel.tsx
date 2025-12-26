import React from 'react';
import { useEmail } from '../../context/EmailContext';

const ComposeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);


interface FolderPanelProps {
    onSelectFolder: () => void;
    onCompose: () => void;
}

const FolderPanel: React.FC<FolderPanelProps> = ({ onSelectFolder, onCompose }) => {
    const { folders, selectedFolderId, selectFolder } = useEmail();
    
    const handleFolderClick = (folderId: string) => {
        selectFolder(folderId);
        onSelectFolder();
    };

    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="text-2xl font-semibold text-white/90 px-2 mb-4">Email Central</h2>
            <button
                onClick={onCompose}
                className="flex items-center justify-center gap-2 w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-red-900/50 hover:shadow-red-800/60 mb-6"
            >
                <ComposeIcon className="w-5 h-5" />
                Escrever
            </button>
            <nav className="flex-grow space-y-1">
                {folders.map(folder => {
                    const isActive = folder.id === selectedFolderId;
                    const Icon = folder.icon;
                    return (
                        <a
                            key={folder.id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleFolderClick(folder.id);
                            }}
                            className={`flex items-center justify-between gap-3 w-full text-left font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-red-500/20 text-white'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{folder.name}</span>
                            </div>
                            {folder.unreadCount > 0 && (
                                <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${isActive ? 'bg-red-600 text-white' : 'bg-white/20 text-white/80'}`}>
                                    {folder.unreadCount}
                                </span>
                            )}
                        </a>
                    );
                })}
            </nav>
        </div>
    );
};

export default FolderPanel;
