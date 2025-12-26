
import React from 'react';
import type { AgentCardData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

interface AgentCardProps extends AgentCardData {
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ title, description, isHighlighted, icon: Icon, onSelect }) => {
  const { theme } = useTheme();
  const DisplayIcon = Icon || Bot;

  return (
    <div 
        onClick={onSelect}
        className={`
            group relative flex flex-col rounded-3xl p-[1px] transition-all duration-500 cursor-pointer overflow-hidden
            ${isHighlighted 
                ? 'bg-gradient-to-br from-rose-500 via-purple-600 to-rose-700 shadow-xl shadow-rose-900/10 hover:scale-[1.02]' 
                : theme === 'light'
                ? 'bg-slate-200 hover:bg-rose-500/30'
                : 'bg-white/5 hover:bg-rose-500/20'
            }
        `}
    >
        {/* Main Content Area */}
        <div className={`
            flex flex-col h-full rounded-[1.7rem] p-6 transition-all duration-500
            ${theme === 'light' ? 'bg-white' : 'bg-[#1A1B23]'}
            ${!isHighlighted && 'group-hover:bg-opacity-90'}
        `}>
            {/* Header: Role Icon */}
            <div className="flex justify-between items-start mb-6">
                <div className={`
                    p-3.5 rounded-2xl transition-all duration-500 shadow-sm
                    ${isHighlighted 
                        ? 'bg-rose-500 text-white shadow-rose-200' 
                        : theme === 'light'
                        ? 'bg-slate-50 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600'
                        : 'bg-white/5 text-gray-400 group-hover:bg-rose-500/20 group-hover:text-rose-400'
                    }
                `}>
                    <DisplayIcon size={24} strokeWidth={2} />
                </div>
                
                {isHighlighted && (
                    <div className="bg-rose-500/10 text-rose-500 text-[9px] font-black px-2.5 py-1 rounded-full border border-rose-500/20 flex items-center gap-1 uppercase tracking-widest">
                        <Sparkles size={10} />
                        Elite
                    </div>
                )}
            </div>
            
            {/* Body */}
            <div className="flex-grow">
                <h2 className={`text-xl font-bold tracking-tight mb-2 transition-colors ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-rose-500`}>
                    {title}
                </h2>
                <p className={`text-xs leading-relaxed line-clamp-3 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                    {description}
                </p>
            </div>
            
            {/* Action Zone */}
            <div className={`mt-6 pt-5 border-t flex items-center gap-3 ${theme === 'light' ? 'border-slate-50' : 'border-white/5'}`}>
                <div className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-slate-50 text-slate-400' : 'bg-white/5 text-gray-500'} group-hover:text-rose-500`}>
                    <MessageSquare size={14} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'} group-hover:text-rose-500 transition-colors`}>
                    Iniciar Chat
                </span>
            </div>
        </div>

        {/* Highlight Glow Effect */}
        {isHighlighted && (
            <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        )}
    </div>
  );
};

export default AgentCard;
