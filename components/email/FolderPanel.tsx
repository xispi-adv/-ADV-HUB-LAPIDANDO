
import React from 'react';
import { useEmail } from '../../context/EmailContext';
import { useTheme } from '../../context/ThemeContext';

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
    const { theme } = useTheme();
    
    const handleFolderClick = (folderId: string) => {
        selectFolder(folderId);
        onSelectFolder();
    };

    return (
        <div className="h-full flex flex-col p-5">
            {/* Optimized Header Title - Forced White */}
            <div className="mb-8 px-2">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1.5 h-6 rounded-full ${theme === 'light' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                    <h2 className="text-2xl tracking-tighter text-white">
                        <span className="font-black">Email</span>
                        <span className="font-light opacity-60 ml-1">Central</span>
                    </h2>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Inbox de Inteligência
                </p>
            </div>
            
            <button
                onClick={onCompose}
                className={`flex items-center justify-center gap-3 w-full font-black py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-xl mb-10 transform active:scale-95 text-xs uppercase tracking-widest
                    ${theme === 'light' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                        : 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/40'}`}
            >
                <ComposeIcon className="w-5 h-5" />
                <span>Escrever</span>
            </button>

            <nav className="flex-grow space-y-1">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 px-3 text-white/30">
                    Navegação Principal
                </h3>
                {folders.map(folder => {
                    const isActive = folder.id === selectedFolderId;
                    const Icon = folder.icon;
                    return (
                        <div key={folder.id} className="border-b border-white/5 last:border-none pb-1 mb-1">
                            <button
                                onClick={() => handleFolderClick(folder.id)}
                                className={`flex items-center justify-between gap-3 w-full text-left font-bold py-3 px-4 rounded-xl transition-all duration-300 group relative
                                    ${isActive
                                        ? (theme === 'light' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]')
                                        : 'text-white hover:bg-white/5 hover:translate-x-1'
                                    }`}
                            >
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${theme === 'light' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? (theme === 'light' ? 'text-blue-600' : 'text-red-500 scale-110') : 'text-white group-hover:text-white'}`} />
                                    <span className={`text-sm tracking-tight transition-colors ${isActive ? 'font-black' : 'font-semibold'}`}>
                                        {folder.name}
                                    </span>
                                </div>
                                
                                {folder.unreadCount > 0 && (
                                    <span className={`text-[10px] font-black rounded-full px-2 py-0.5 min-w-[22px] text-center shadow-sm
                                        ${isActive 
                                            ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white') 
                                            : 'bg-white/10 text-white'}`}>
                                        {folder.unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    );
                })}
            </nav>

            {/* Version / System Tag */}
            <div className="mt-auto pt-6 border-t border-white/5 opacity-20">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-center text-white">ADV-HUB Mail 2.5</p>
            </div>
        </div>
    );
};

export default FolderPanel;
