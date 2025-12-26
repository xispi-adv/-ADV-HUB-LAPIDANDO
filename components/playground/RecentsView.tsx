
import React, { useState, useMemo } from 'react';
import type { GeneratedMedia } from '../../types';
import ResultCard from './ResultCard';

interface RecentsViewProps {
    history: GeneratedMedia[];
}

const RecentsView: React.FC<RecentsViewProps> = ({ history }) => {
    const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
    
    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            if (filter === 'all') return true;
            return item.type === filter;
        });
    }, [history, filter]);

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Filters */}
            <div className="flex-shrink-0 flex items-center justify-center mb-8 space-x-4">
                 {['all', 'image', 'video'].map((type) => (
                     <button
                        key={type}
                        onClick={() => setFilter(type as any)}
                        className={`
                            px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                            ${filter === type 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                            }
                        `}
                     >
                         {type === 'all' ? 'Tudo' : type === 'image' ? 'Imagens' : 'Vídeos'}
                     </button>
                 ))}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                        {filteredHistory.map((item, index) => (
                             <div key={item.id} className="animate-fade-in-up group" style={{ animationDelay: `${index * 50}ms`}}>
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50">
                                     <ResultCard media={item} onCopyPrompt={handleCopyPrompt} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-white/30 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <p className="text-lg font-light">A galeria está vazia</p>
                        <p className="text-sm mt-1">Crie algo incrível na aba Ferramentas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentsView;
