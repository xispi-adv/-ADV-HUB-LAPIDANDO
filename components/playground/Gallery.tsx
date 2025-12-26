import React from 'react';
import type { GeneratedMedia } from '../../types';

interface GalleryProps {
    history: GeneratedMedia[];
    onCopyPrompt: (prompt: string) => void;
}

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5 .124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H9.75" />
    </svg>
);


const Gallery: React.FC<GalleryProps> = ({ history, onCopyPrompt }) => {
    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl h-full flex flex-col">
            <h2 className="text-xl font-semibold text-white p-4 border-b border-white/10 flex-shrink-0">Criações Recentes</h2>
            <div className="flex-grow p-4 overflow-y-auto">
                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map(item => (
                            <div key={item.id} className="group relative animate-fade-in">
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.prompt} className="w-full h-32 object-cover rounded-lg" />
                                ) : (
                                    <video src={item.url} className="w-full h-32 object-cover rounded-lg bg-black" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg p-2 flex flex-col justify-end">
                                    <p className="text-white text-xs line-clamp-2">{item.prompt}</p>
                                    <button
                                        onClick={() => onCopyPrompt(item.prompt)}
                                        className="flex items-center gap-1.5 text-xs text-white/80 hover:text-red-400 transition-colors mt-1 self-start"
                                    >
                                        <CopyIcon />
                                        Reutilizar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-white/50">
                        <p>Suas criações aparecerão aqui.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;