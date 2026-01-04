
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GeneratedMedia } from '../../types';
import ResultCard from './ResultCard';
import RecentCreationsSidebar from './RecentCreationsSidebar';
import GenerateButton from './GenerateButton';
import { GoogleGenAI } from "@google/genai";

const BackIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);
const MagicIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const KeyIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
);

const VIDEO_PROMPT_EXAMPLES = [
    "Um drone voando rapidamente por um cânion futurista, com naves espaciais passando em alta velocidade, estilo cinematográfico.",
    "Cozinheiro preparando sushi em câmera lenta, close nos detalhes do peixe e do arroz, iluminação de estúdio, fotorrealista.",
    "Lapso de tempo de uma cidade movimentada do dia para a noite, as luzes dos carros criando rastros de luz, transição suave.",
    "Uma baleia majestosa nadando entre nuvens de algodão doce em um céu lilás, movimento suave, surrealista.",
];

interface VideoGeneratorProps {
    onBack: () => void;
    onMediaGenerated: (media: GeneratedMedia) => void;
    history: GeneratedMedia[];
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onBack, onMediaGenerated, history }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Iniciando síntese neural...');
    const [generatedVideo, setGeneratedVideo] = useState<GeneratedMedia | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Check for API Key on mount
    useEffect(() => {
        const checkKey = async () => {
            const selected = await window.aistudio.hasSelectedApiKey();
            setHasApiKey(selected);
        };
        checkKey();
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
        }
    }, [prompt]);

    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        setHasApiKey(true); // Assume success per protocol
    };

    const handleGenerateVideo = async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedVideo(null);
        setError(null);
        setLoadingMessage('Alocando recursos de GPU no cluster Veo...');

        try {
            // Re-instantiate AI to ensure freshest key from process.env
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio
                }
            });

            const statusMessages = [
                "Sintetizando frames base...",
                "Calculando dinâmica de movimento...",
                "Aplicando texturas neurais...",
                "Finalizando renderização MP4..."
            ];
            let msgIndex = 0;

            // Operation Polling
            while (!operation.done) {
                setLoadingMessage(statusMessages[msgIndex % statusMessages.length]);
                msgIndex++;
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            
            if (downloadLink) {
                setLoadingMessage('Finalizando asset...');
                // Append key to fetch binary data
                const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                
                if (!videoResponse.ok) {
                    const errText = await videoResponse.text();
                    if (errText.includes("Requested entity was not found")) {
                        setHasApiKey(false);
                        throw new Error("Sua chave de API expirou ou não possui permissão para Veo. Selecione uma chave válida de um projeto com faturamento ativo.");
                    }
                    throw new Error("Falha ao baixar o vídeo gerado.");
                }

                const videoBlob = await videoResponse.blob();
                const videoUrl = URL.createObjectURL(videoBlob);

                const newVideo: GeneratedMedia = {
                    id: `vid-${Date.now()}`,
                    type: 'video',
                    prompt: prompt,
                    url: videoUrl,
                    options: { style: 'cinematografico', aspectRatio: aspectRatio },
                };

                setGeneratedVideo(newVideo);
                onMediaGenerated(newVideo);
            } else {
                throw new Error("A operação terminou sem um link de download válido.");
            }
        } catch (err: any) {
            console.error("Erro na geração:", err);
            setError(err.message || "Falha na comunicação com o motor neural.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyPrompt = (text: string) => setPrompt(text);
    const handleSuggestPrompt = () => setPrompt(VIDEO_PROMPT_EXAMPLES[Math.floor(Math.random() * VIDEO_PROMPT_EXAMPLES.length)]);

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-[var(--bg-main)] animate-fade-in">
            
            {/* LEFT: CANVAS AREA */}
            <div className="flex-1 relative flex items-center justify-center bg-[var(--bg-elevation-1)] overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'linear-gradient(0deg, transparent 24%, var(--text-primary) 25%, var(--text-primary) 26%, transparent 27%, transparent 74%, var(--text-primary) 75%, var(--text-primary) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, var(--text-primary) 25%, var(--text-primary) 26%, transparent 27%, transparent 74%, var(--text-primary) 75%, var(--text-primary) 76%, transparent 77%, transparent)', 
                         backgroundSize: '50px 50px' 
                     }}>
                </div>

                <div className="relative z-10 p-8 w-full h-full flex items-center justify-center">
                    {!hasApiKey ? (
                        <div className="max-w-md p-10 bg-black/40 border border-white/10 rounded-[3rem] text-center backdrop-blur-2xl shadow-2xl flex flex-col items-center">
                            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20">
                                <KeyIcon size={40} className="text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Acesso Restrito ao Veo</h2>
                            <p className="text-white/60 text-sm leading-relaxed mb-10">
                                Para gerar vídeos com o modelo **Veo 3.1**, você deve selecionar uma chave de API vinculada a um projeto GCP com **faturamento ativado**.
                            </p>
                            <button 
                                onClick={handleSelectKey}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Selecionar API Key
                            </button>
                            <a 
                                href="https://ai.google.dev/gemini-api/docs/billing" 
                                target="_blank" 
                                className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                            >
                                Documentação de Faturamento
                            </a>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center max-w-sm text-center">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-[var(--accent-color)] animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-[var(--accent-glow)] animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-[var(--text-primary)] font-bold text-xl tracking-tight animate-pulse">{loadingMessage}</p>
                            <p className="text-[var(--text-muted)] text-xs mt-4 leading-relaxed">
                                A renderização de vídeos por IA é um processo complexo que pode levar de 1 a 3 minutos. Por favor, mantenha esta aba ativa.
                            </p>
                        </div>
                    ) : error ? (
                        <div className="max-w-md p-8 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center backdrop-blur-xl">
                            <p className="text-white font-bold text-lg mb-2">Erro de Processamento</p>
                            <p className="text-red-200/60 text-sm mb-6">{error}</p>
                            <button onClick={() => setError(null)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                Tentar Novamente
                            </button>
                        </div>
                    ) : generatedVideo ? (
                        <div className="max-w-full max-h-full shadow-2xl shadow-black/40 rounded-3xl overflow-hidden border border-white/10">
                            <ResultCard media={generatedVideo} onCopyPrompt={copyPrompt} />
                        </div>
                    ) : (
                        <div className="text-center select-none opacity-20">
                            <h1 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] tracking-tighter mb-4">MOTION</h1>
                            <p className="text-[var(--text-secondary)] uppercase tracking-[0.5em]">Neural Video Studio</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: CONTROL SIDEBAR */}
            <div className="w-full md:w-96 bg-[var(--bg-card)] border-l border-[var(--border-color)] flex flex-col h-[50vh] md:h-full z-20 shadow-xl backdrop-blur-2xl">
                <div className="flex items-center gap-4 p-5 border-b border-[var(--border-color)] bg-[var(--bg-elevation-1)]/50">
                    <button onClick={onBack} className="p-2.5 rounded-xl hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                        <BackIcon />
                    </button>
                    <span className="font-black text-[var(--text-primary)] uppercase tracking-[0.2em] text-xs">Parâmetros Veo 3.1</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* Prompt Section */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Prompt de Movimento</label>
                            <button onClick={handleSuggestPrompt} className="text-[10px] font-bold flex items-center gap-1.5 text-[var(--accent-color)] hover:brightness-125 transition-all">
                                <MagicIcon /> Insight
                            </button>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Descreva a sequência cinematográfica..."
                            disabled={!hasApiKey || isLoading}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] resize-none transition-all min-h-[120px] shadow-inner disabled:opacity-30"
                        />
                    </div>

                    {/* Format Toggle */}
                    <div className={!hasApiKey || isLoading ? 'opacity-30 pointer-events-none' : ''}>
                         <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-3 block">Formato de Saída</label>
                         <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => setAspectRatio('16:9')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${aspectRatio === '16:9' ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>16:9 Wide</button>
                             <button onClick={() => setAspectRatio('9:16')} className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${aspectRatio === '9:16' ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>9:16 Reel</button>
                         </div>
                    </div>

                    <div className="pt-2">
                        <GenerateButton 
                            disabled={!prompt.trim() || !hasApiKey} 
                            isLoading={isLoading} 
                            onClick={handleGenerateVideo} 
                        />
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-5">Renderizações Recentes</h3>
                        <div className="h-64 rounded-2xl overflow-hidden bg-black/20">
                            <RecentCreationsSidebar history={history} mediaType="video" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;
