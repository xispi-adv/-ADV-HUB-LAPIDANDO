
import React from 'react';

interface WidgetCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ children, className = '', onClick, style }) => {
    return (
        <div 
            onClick={onClick}
            style={style}
            className={`
                bg-[var(--bg-card)] backdrop-blur-sm border border-[var(--border-color)] 
                rounded-2xl p-4 sm:p-5 flex flex-col h-full 
                shadow-lg shadow-black/10 transition-all duration-300 
                hover:border-[var(--border-hover)] hover:shadow-[var(--accent-glow)]/20 
                text-[var(--text-primary)]
                ${onClick ? 'cursor-pointer' : ''} 
                ${className}
            `}
        >
            {children}
        </div>
    );
};
export default WidgetCard;
