
import React from 'react';

const ImageV2Icon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-6 text-[var(--text-primary)] opacity-80 group-hover:text-[var(--accent-color)] transition-colors duration-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);
const VideoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-6 text-[var(--text-primary)] opacity-80 group-hover:text-[var(--accent-color)] transition-colors duration-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
);

interface ToolsViewProps {
    onSelectTool: (tool: 'imageGenerator' | 'videoGenerator') => void;
}

const ToolCard: React.FC<{title: string, description: string, icon: React.ReactNode, onClick: () => void, delay: number}> = ({ title, description, icon, onClick, delay }) => {
    return (
        <div
            onClick={onClick}
            style={{ animationDelay: `${delay}ms` }}
            className="group relative h-80 w-full bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border-color)] rounded-3xl overflow-hidden cursor-pointer animate-fade-in-up transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-[var(--accent-color)]"
        >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevation-1)] via-transparent to-[var(--bg-elevation-1)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                <div className="transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                    {icon}
                </div>
                <h3 className="text-2xl font-light tracking-widest uppercase text-[var(--text-primary)] mb-3 transition-colors">{title}</h3>
                <div className="w-12 h-px bg-[var(--border-color)] mb-4 group-hover:w-24 group-hover:bg-[var(--accent-color)] transition-all duration-500"></div>
                <p className="text-[var(--text-secondary)] text-center text-sm leading-relaxed max-w-xs group-hover:text-[var(--text-primary)] transition-colors">
                    {description}
                </p>
            </div>

            {/* Glow Effect */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[var(--accent-color)] opacity-10 blur-[80px] rounded-full group-hover:opacity-20 transition-all duration-500"></div>
        </div>
    )
}

const ToolsView: React.FC<ToolsViewProps> = ({ onSelectTool }) => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
                <ToolCard
                    title="Neural Image"
                    description="Síntese de imagem de alta fidelidade. Converta prompts textuais em arte digital, renderizações 3D ou fotografia."
                    icon={<ImageV2Icon />}
                    onClick={() => onSelectTool('imageGenerator')}
                    delay={0}
                />
                 <ToolCard
                    title="Motion Video"
                    description="Geração de vídeo cinemático. Crie cenas dinâmicas e animações fluidas com controle temporal."
                    icon={<VideoIcon />}
                    onClick={() => onSelectTool('videoGenerator')}
                    delay={100}
                />
            </div>
        </div>
    );
};

export default ToolsView;
