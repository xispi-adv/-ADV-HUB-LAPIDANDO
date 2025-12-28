
import React from 'react';
import type { Email } from '../../types';

interface EmailListItemProps {
    email: Email;
    isSelected: boolean;
    onSelect: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onSelect }) => {
    const date = new Date(email.date);
    const formattedDate = date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0');

    return (
        <li
            onClick={onSelect}
            className={`px-6 py-5 border-b border-white/5 cursor-pointer transition-all duration-300 relative group
                ${isSelected ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}
        >
            {/* Active Indicator */}
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-600 shadow-[0_0_15px_#e11d48]"></div>}
            
            <div className="flex items-start gap-4">
                {!email.isRead && <div className="mt-2 w-2 h-2 bg-rose-500 rounded-full flex-shrink-0 animate-pulse"></div>}
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold truncate tracking-tight transition-colors ${email.isRead ? 'text-white/40' : 'text-white group-hover:text-rose-400'}`}>
                            {email.from.name}
                        </span>
                        <span className="text-[10px] font-mono text-white/20">{formattedDate}</span>
                    </div>
                    
                    <h4 className={`text-sm truncate mb-1 ${email.isRead ? 'text-white/60 font-normal' : 'text-white font-semibold'}`}>
                        {email.subject}
                    </h4>
                    
                    <p className="text-xs text-white/30 truncate leading-relaxed">
                        {email.snippet}
                    </p>
                </div>
            </div>
            
            {email.priority === 'high' && (
                <div className="absolute top-2 right-2">
                    <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                </div>
            )}
        </li>
    );
};

export default EmailListItem;
