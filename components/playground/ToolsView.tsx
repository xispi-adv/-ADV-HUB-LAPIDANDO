
import React from 'react';
import { Camera, Play, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ToolsViewProps {
    onSelectTool: (tool: 'imageGenerator' | 'videoGenerator') => void;
}

const ToolCard: React.FC<{
    title: string, 
    subtitle: string,
    description: string, 
    icon: React.ReactNode, 
    onClick: () => void, 
    delay: number,
    color: 'cyan' | 'magenta',
    pulseDelay: string
}> = ({ title, subtitle, description, icon, onClick, delay, color, pulseDelay }) => {
    
    const config = {
        cyan: {
            glow: 'group-hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]',
            border: 'group-hover:border-cyan-500/50',
            accent: 'text-cyan-400',
            gradient: 'from-cyan-500/10 to-blue-600/10',
            btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20',
            pulseClass: 'animate-idle-pulse-cyan'
        },
        magenta: {
            glow: 'group-hover:shadow-[0_0_50px_rgba(236,72,153,0.2)]',
            border: 'group-hover:border-pink-500/50',
            accent: 'text-pink-400',
            gradient: 'from-pink-500/10 to-rose-600/10',
            btn: 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/20',
            pulseClass: 'animate-idle-pulse-magenta'
        }
    }[color];

    return (
        <div
            onClick={onClick}
            style={{ 
                animationDelay: `${delay}ms, ${pulseDelay}`,
            }}
            className={`
                group relative min-h-[300px] w-full bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] overflow-visible cursor-pointer animate-fade-in-up transition-all duration-700
                hover:-translate-y-4 hover:scale-[1.02] ${config.glow} ${config.border}
                ${config.pulseClass}
            `}
        >
            {/* Glossy Gradient Overlay */}
            <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b ${config.gradient}`}></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 rounded-[2.5rem] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                {/* Icon Container */}
                <div className={`mb-4 p-5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 ${config.accent}`}>
                    {React.cloneElement(icon as React.ReactElement, { size: 32 })}
                </div>
                
                <span className={`text-[8px] font-black uppercase tracking-[0.4em] mb-2 ${config.accent} opacity-60 group-hover:opacity-100 transition-opacity`}>
                    {subtitle}
                </span>
                
                <h3 className="text-3xl font-black tracking-tighter text-white mb-3 transition-all">
                    {title}
                </h3>
                
                <p className="text-gray-400 text-xs leading-relaxed mb-6 max-w-[260px] group-hover:text-gray-200 transition-colors font-medium">
                    {description}
                </p>

                {/* Primary Action Button */}
                <div className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl ${config.btn} flex items-center gap-2 active:scale-95 transform`}>
                    <Zap size={12} fill="currentColor" />
                    <span>Acessar</span>
                </div>
            </div>
            
            {/* Ambient Background Flare */}
            <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-24 blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 ${color === 'cyan' ? 'bg-cyan-500' : 'bg-pink-500'}`}></div>

            <style>{`
                @keyframes idle-pulse-cyan {
                    0%, 100% { border-color: rgba(255,255,255,0.05); box-shadow: none; }
                    50% { border-color: rgba(6, 182, 212, 0.4); box-shadow: 0 0 20px rgba(6, 182, 212, 0.1); }
                }
                @keyframes idle-pulse-magenta {
                    0%, 100% { border-color: rgba(255,255,255,0.05); box-shadow: none; }
                    50% { border-color: rgba(236, 72, 153, 0.4); box-shadow: 0 0 20px rgba(236, 72, 153, 0.1); }
                }
                .animate-idle-pulse-cyan {
                    animation: idle-pulse-cyan 4s infinite ease-in-out;
                }
                .animate-idle-pulse-magenta {
                    animation: idle-pulse-magenta 4s infinite ease-in-out;
                }
                /* Pause animation on hover */
                .group:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}

const ToolsView: React.FC<ToolsViewProps> = ({ onSelectTool }) => {
    return (
        <div className="h-full flex items-center justify-center py-4 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl w-full px-6 overflow-visible">
                <ToolCard
                    title="Gerar Art"
                    subtitle="Neural Engine"
                    description="Sintetize imagens de alta fidelidade a partir de descrições neurais. Ideal para assets e branding."
                    icon={<Camera strokeWidth={1.5} />}
                    onClick={() => onSelectTool('imageGenerator')}
                    delay={0}
                    pulseDelay="0s"
                    color="cyan"
                />
                 <ToolCard
                    title="Gerar Vídeo"
                    subtitle="Motion Dynamics"
                    description="Materialize sequências cinematográficas. Controle total sobre fluidez e enquadramento."
                    icon={<Play strokeWidth={1.5} />}
                    onClick={() => onSelectTool('videoGenerator')}
                    delay={150}
                    pulseDelay="2s"
                    color="magenta"
                />
            </div>
        </div>
    );
};

export default ToolsView;
