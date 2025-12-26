
import React from 'react';
import type { GeneratedMedia } from '../../types';

interface RecentCreationsSidebarProps {
    history: GeneratedMedia[];
    mediaType: 'image' | 'video';
}

const RecentCreationsSidebar: React.FC<RecentCreationsSidebarProps> = ({ history, mediaType }) => {
    const filteredHistory = history.filter(item => item.type === mediaType).slice(0, 10);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(item => (
                        <div key={item.id} className="group/item relative rounded-lg overflow-hidden cursor-pointer animate-fade-in border border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--bg-elevation-1)]">
                            {item.type === 'image' ? (
                                <img src={item.url} alt={item.prompt} className="w-full h-20 object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" />
                            ) : (
                                <video src={item.url} className="w-full h-20 object-cover bg-black opacity-80 group-hover/item:opacity-100 transition-opacity" />
                            )}
                             {/* Hover Prompt Hint */}
                            <div className="hidden group-hover:block group-hover/item:block absolute inset-0 bg-black/70 p-2">
                                <p className="text-[10px] text-white line-clamp-3 leading-tight">{item.prompt}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-[var(--text-muted)] text-xs px-2 opacity-50">
                        <p>Sem histórico recente</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentCreationsSidebar;
