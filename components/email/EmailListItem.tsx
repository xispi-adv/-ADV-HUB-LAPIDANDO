import React from 'react';
import type { Email } from '../../types';

interface EmailListItemProps {
    email: Email;
    isSelected: boolean;
    onSelect: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onSelect }) => {
    const formattedDate = new Date(email.date).toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <li
            onClick={onSelect}
            className={`px-4 py-3 border-b border-white/10 cursor-pointer transition-colors duration-200 relative ${
                isSelected ? 'bg-red-900/40' : 'hover:bg-white/10'
            }`}
        >
            {!email.isRead && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            <div className="flex justify-between items-start mb-1">
                <p className={`font-semibold truncate pr-4 ${email.isRead ? 'text-white/80' : 'text-white'}`}>
                    {email.from.name}
                </p>
                <time className="text-xs text-white/60 flex-shrink-0">{formattedDate}</time>
            </div>
            <p className={`text-sm truncate ${email.isRead ? 'text-white/80 font-normal' : 'text-white font-semibold'}`}>
                {email.subject}
            </p>
            <p className="text-sm text-white/60 truncate mt-1">{email.snippet}</p>
        </li>
    );
};

export default EmailListItem;
