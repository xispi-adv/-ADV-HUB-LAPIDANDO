
import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedMedia } from '../../types';
import ResultCard from './ResultCard';
import RecentCreationsSidebar from './RecentCreationsSidebar';
import GenerateButton from './GenerateButton';

const BackIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);
const MagicIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const VIDEO_PROMPT_EXAMPLES = [
    "Um drone voando rapidamente por um cânion futurista, com naves espaciais passando em alta velocidade, estilo cinematográfico.",
    "Cozinheiro preparando sushi em câmera lenta, close nos detalhes do peixe e do arroz, iluminação de estúdio, fotorrealista.",
    "Lapso de tempo de uma cidade movimentada do dia para a noite, as luzes dos carros criando rastros de luz, transição suave.",
];

interface VideoGeneratorProps {
    onBack: () => void;
    onMediaGenerated: (media: GeneratedMedia) => void;
    history: GeneratedMedia[];
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onBack, onMediaGenerated, history }) => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('generico');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<GeneratedMedia | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [prompt]);

    const handleGenerateVideo = async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedVideo(null);

        // Mock Simulation
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const newVideo: GeneratedMedia = {
            id: `vid-${Date.now()}`,
            type: 'video',
            prompt: prompt,
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            options: { style },
        };

        setGeneratedVideo(newVideo);
        onMediaGenerated(newVideo);
        setIsLoading(false);
    };

    const copyPrompt = (text: string) => setPrompt(text);
    const handleSuggestPrompt = () => setPrompt(VIDEO_PROMPT_EXAMPLES[Math.floor(Math.random() * VIDEO_PROMPT_EXAMPLES.length)]);

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--bg-main)] animate-fade-in">
            
            {/* LEFT: CANVAS AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-[var(--bg-elevation-1)] overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'linear-gradient(0deg, transparent 24%, var(--text-primary) 25%, var(--text-primary) 26%, transparent 27%, transparent 74%, var(--text-primary) 75%, var(--text-primary) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, var(--text-primary) 25%, var(--text-primary) 26%, transparent 27%, transparent 74%, var(--text-primary) 75%, var(--text-primary) 76%, transparent 77%, transparent)', 
                         backgroundSize: '50px 50px' 
                     }}>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-[var(--border-color)] border-t-[var(--accent-color)] animate-spin mb-6"></div>
                            <p className="text-[var(--text-primary)] font-light tracking-wide animate-pulse">Sintetizando Vídeo...</p>
                            <p className="text-[var(--text-muted)] text-xs mt-2">Isso pode levar alguns instantes</p>
                        </div>
                    ) : generatedVideo ? (
                        <div className="max-w-full max-h-full shadow-2xl shadow-black/20 rounded-lg overflow-hidden">
                            <ResultCard media={generatedVideo} onCopyPrompt={copyPrompt} />
                        </div>
                    ) : (
                        <div className="text-center select-none opacity-20">
                            <h1 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] tracking-tighter mb-4">MOTION</h1>
                            <p className="text-[var(--text-secondary)] uppercase tracking-[0.5em]">Video Synthesis Studio</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: CONTROL SIDEBAR */}
            <div className="w-full md:w-96 bg-[var(--bg-card)] border-l border-[var(--border-color)] flex flex-col h-[50vh] md:h-full z-20 shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 border-b border-[var(--border-color)] bg-[var(--bg-elevation-1)]">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <BackIcon />
                    </button>
                    <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-sm">Configuração de Vídeo</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {/* Prompt Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Prompt de Movimento</label>
                            <button onClick={handleSuggestPrompt} className="text-[10px] flex items-center gap-1 text-[var(--accent-color)] hover:underline" title="Sugerir ideia">
                                <MagicIcon /> Ideia
                            </button>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Descreva a cena e o movimento..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] resize-none transition-all min-h-[100px]"
                        />
                    </div>

                    {/* Settings */}
                    <div>
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Estilo de Movimento</label>
                        <select 
                            value={style} 
                            onChange={e => setStyle(e.target.value)}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
                        >
                            <option value="generico">Padrão</option>
                            <option value="cinematografico">Cinematográfico</option>
                            <option value="realista">Realista</option>
                        </select>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-2">
                        <GenerateButton disabled={!prompt.trim()} isLoading={isLoading} onClick={handleGenerateVideo} />
                    </div>

                    {/* History Section embedded in sidebar */}
                    <div className="pt-6 border-t border-[var(--border-color)]">
                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Galeria Recente</h3>
                        <div className="h-64">
                            <RecentCreationsSidebar history={history} mediaType="video" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;
