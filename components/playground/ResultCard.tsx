
import React, { useState } from 'react';
import type { GeneratedMedia } from '../../types';

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);
const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H9.75" />
    </svg>
);

interface ResultCardProps {
    media: GeneratedMedia;
    onCopyPrompt: (prompt: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ media, onCopyPrompt }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(media.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group w-full h-full">
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-[var(--bg-elevation-2)]">
                {media.type === 'image' ? (
                    <img src={media.url} alt={media.prompt} className="w-full h-full object-contain" />
                ) : (
                    <video src={media.url} controls autoPlay loop className="w-full h-full object-contain bg-black" />
                )}
                
                {/* Overlay Actions (Only visible on hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white/90 text-xs line-clamp-2 mb-3 font-light drop-shadow-md">{media.prompt}</p>
                    <div className="flex gap-2">
                         <a 
                            href={media.url} 
                            download={`media-${media.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors border border-white/10"
                            title="Baixar"
                        >
                            <DownloadIcon />
                        </a>
                        <button 
                            onClick={handleCopy} 
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors border border-white/10"
                            title="Copiar Prompt"
                        >
                            <CopyIcon />
                        </button>
                        <button 
                            onClick={() => onCopyPrompt(media.prompt)} 
                            className="ml-auto px-3 py-1 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-lg"
                        >
                            Remix
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
