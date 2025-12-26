
import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedMedia } from '../../types';
import ResultCard from './ResultCard';
import RecentCreationsSidebar from './RecentCreationsSidebar';
import GenerateButton from './GenerateButton';
import { GoogleGenAI } from "@google/genai";

// Icons
const BackIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);
const SparklesIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12z"/><path d="M21 2v6h-6"/></svg>
);
const MagicIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const IMAGE_PROMPT_EXAMPLES = [
    "Um astronauta surfando em uma onda cósmica, nebulosas coloridas ao fundo, estilo arte digital, vibrante.",
    "Uma biblioteca antiga e empoeirada dentro de uma árvore gigante, raios de sol entrando por frestas na madeira, atmosfera mágica, fotorrealista.",
    "Um robô cyberpunk servindo ramen em uma barraca de rua em Tóquio à noite, luzes de neon refletindo no metal, chuva fina caindo.",
    "Retrato de um gato nobre vestido com trajes da era vitoriana, pintura a óleo clássica, detalhes ricos, fundo escuro.",
];

interface ImageGeneratorProps {
    onBack: () => void;
    onMediaGenerated: (media: GeneratedMedia) => void;
    history: GeneratedMedia[];
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onBack, onMediaGenerated, history }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [style, setStyle] = useState('generico');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<GeneratedMedia | null>(null);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [prompt]);

    const optimizePrompt = (userPrompt: string, options: { imageType: string }): string => {
        const persona = "Atue como um diretor de fotografia e especialista em arte digital.";
        const styleDescription = {
            'generico': "Um estilo visual padrão, bem iluminado e claro.",
            'cinematografico': "Iluminação dramática, cores saturadas, enquadramento cinematográfico.",
            'realista': "Foco em fotorrealismo, com texturas detalhadas e iluminação natural.",
            'desenho animado': "Estilo de animação clássica, com cores vibrantes.",
        }[options.imageType] || "Estilo não definido.";
        
        if (!userPrompt.trim()) return '';
        return `**Persona:** ${persona}\n**Prompt:** "${userPrompt}"\n**Estilo:** ${styleDescription}`;
    };

    const handleOptimizePrompt = () => {
        if (!prompt.trim()) return;
        const optimized = optimizePrompt(prompt, { imageType: style });
        setPrompt(optimized);
    };

    const handleSuggestPrompt = () => {
        const randomIndex = Math.floor(Math.random() * IMAGE_PROMPT_EXAMPLES.length);
        setPrompt(IMAGE_PROMPT_EXAMPLES[randomIndex]);
    };

    const handleGenerateImage = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: { numberOfImages: 1, aspectRatio: aspectRatio as any },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                const newImage: GeneratedMedia = {
                    id: `img-${Date.now()}`,
                    type: 'image',
                    prompt: prompt,
                    url: imageUrl,
                    options: { aspectRatio, style },
                };
                setGeneratedImage(newImage);
                onMediaGenerated(newImage);
            } else {
                throw new Error("A API não retornou nenhuma imagem.");
            }
        } catch (err) {
            console.error("Erro:", err);
            setError(`Erro: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const copyPrompt = (text: string) => setPrompt(text);

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--bg-main)] animate-fade-in">
            
            {/* LEFT: CANVAS AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-[var(--bg-elevation-1)] overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', 
                         backgroundSize: '30px 30px' 
                     }}>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-[var(--border-color)] border-t-[var(--accent-color)] animate-spin mb-6"></div>
                            <p className="text-[var(--text-primary)] font-light tracking-wide animate-pulse">Renderizando...</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-md p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                            <p className="text-red-500 font-bold mb-2">Falha na Geração</p>
                            <p className="text-[var(--text-secondary)] text-sm">{error}</p>
                        </div>
                    ) : generatedImage ? (
                        <div className="max-w-full max-h-full shadow-2xl shadow-black/20 rounded-lg overflow-hidden">
                            <ResultCard media={generatedImage} onCopyPrompt={copyPrompt} />
                        </div>
                    ) : (
                        <div className="text-center select-none opacity-20">
                            <h1 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] tracking-tighter mb-4">CANVAS</h1>
                            <p className="text-[var(--text-secondary)] uppercase tracking-[0.5em]">Neural Image Studio</p>
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
                    <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider text-sm">Configuração</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {/* Prompt Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Prompt</label>
                            <div className="flex gap-2">
                                <button onClick={handleSuggestPrompt} className="text-[10px] flex items-center gap-1 text-[var(--accent-color)] hover:underline" title="Sugerir ideia">
                                    <MagicIcon /> Ideia
                                </button>
                                <button onClick={handleOptimizePrompt} disabled={!prompt.trim()} className="text-[10px] flex items-center gap-1 text-[var(--accent-color)] hover:underline disabled:opacity-50" title="Melhorar prompt com IA">
                                    <SparklesIcon /> Otimizar
                                </button>
                            </div>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Descreva a imagem que você imagina..."
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] resize-none transition-all min-h-[100px]"
                        />
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Estilo</label>
                            <select 
                                value={style} 
                                onChange={e => setStyle(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
                            >
                                <option value="generico">Padrão</option>
                                <option value="cinematografico">Cinema</option>
                                <option value="realista">Fotorrealista</option>
                                <option value="desenho animado">Cartoon</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Proporção</label>
                            <select 
                                value={aspectRatio} 
                                onChange={e => setAspectRatio(e.target.value)}
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
                            >
                                <option value="1:1">Quadrado (1:1)</option>
                                <option value="16:9">Landscape (16:9)</option>
                                <option value="9:16">Portrait (9:16)</option>
                            </select>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-2">
                        <GenerateButton disabled={!prompt.trim()} isLoading={isLoading} onClick={handleGenerateImage} />
                    </div>

                    {/* History Section embedded in sidebar */}
                    <div className="pt-6 border-t border-[var(--border-color)]">
                        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Criações Recentes</h3>
                        <div className="h-64">
                            <RecentCreationsSidebar history={history} mediaType="image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
