
import React from 'react';
import type { Email } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface EmailListItemProps {
    email: Email;
    isSelected: boolean;
    onSelect: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onSelect }) => {
    const { theme } = useTheme();
    const date = new Date(email.date);
    const formattedDate = date.getHours() + ":" + String(date.getMinutes()).padStart(2, '0');

    return (
        <li
            onClick={onSelect}
            className={`px-6 py-5 border-b cursor-pointer transition-all duration-300 relative group
                ${theme === 'light' 
                    ? (isSelected ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100 hover:bg-slate-50') 
                    : (isSelected ? 'bg-white/[0.04] border-white/5' : 'bg-transparent border-white/5 hover:bg-white/[0.01]')}`}
        >
            {/* Active Indicator */}
            {isSelected && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 shadow-lg
                    ${theme === 'light' ? 'bg-blue-600' : 'bg-rose-600 shadow-rose-900/40'}`}
                ></div>
            )}
            
            <div className="flex items-start gap-4">
                {!email.isRead && (
                    <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 animate-pulse 
                        ${theme === 'light' ? 'bg-blue-600' : 'bg-rose-500'}`}></div>
                )}
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-black tracking-tight transition-colors 
                            ${email.isRead 
                                ? (theme === 'light' ? 'text-slate-400' : 'text-white/40') 
                                : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                            {email.from.name}
                        </span>
                        <span className={`text-[10px] font-bold font-mono 
                            ${theme === 'light' ? 'text-slate-400' : 'text-white/50'}`}>
                            {formattedDate}
                        </span>
                    </div>
                    
                    <h4 className={`text-sm truncate mb-1 leading-tight
                        ${email.isRead 
                            ? (theme === 'light' ? 'text-slate-500 font-medium' : 'text-white/60 font-normal') 
                            : (theme === 'light' ? 'text-slate-900 font-bold' : 'text-white font-bold')}`}>
                        {email.subject}
                    </h4>
                    
                    <p className={`text-xs truncate leading-relaxed
                        ${theme === 'light' ? 'text-slate-500' : 'text-white/50'}`}>
                        {email.snippet}
                    </p>
                </div>
            </div>
            
            {email.priority === 'high' && (
                <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full 
                    ${theme === 'light' ? 'bg-blue-600' : 'bg-rose-500'}`}></div>
            )}
        </li>
    );
};

export default EmailListItem;
