import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import type { Email, EmailFolder, EmailFolderId } from '../types';
import { MOCK_FOLDERS, MOCK_EMAILS } from '../data/mock-email-data';

interface EmailContextState {
    folders: EmailFolder[];
    emails: Email[];
    selectedFolderId: EmailFolderId;
    selectFolder: (folderId: EmailFolderId) => void;
    getEmailsByFolder: (folderId: EmailFolderId) => Email[];
    getEmailById: (emailId: string) => Email | undefined;
    markEmailAsRead: (emailId: string) => void;
    archiveEmail: (emailId: string) => void;
    isLoading: boolean;
}

const EmailContext = createContext<EmailContextState | undefined>(undefined);

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [folders, setFolders] = useState<EmailFolder[]>(MOCK_FOLDERS);
    const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
    const [selectedFolderId, setSelectedFolderId] = useState<EmailFolderId>('inbox');
    const [isLoading, setIsLoading] = useState(false);

    const selectFolder = useCallback((folderId: EmailFolderId) => {
        setIsLoading(true);
        setSelectedFolderId(folderId);
        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);
    
    const getEmailsByFolder = useCallback((folderId: EmailFolderId) => {
        return emails.filter(email => email.folderId === folderId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [emails]);
    
    const getEmailById = useCallback((emailId: string) => {
        return emails.find(email => email.id === emailId);
    }, [emails]);

    const markEmailAsRead = useCallback((emailId: string) => {
        setEmails(prev => prev.map(email => email.id === emailId ? { ...email, isRead: true } : email));
    }, []);
    
    const archiveEmail = useCallback((emailId: string) => {
        // In a real app, this would likely be a status change. Here we move it to a pseudo 'archived' folder.
        setEmails(prev => prev.map(email => email.id === emailId ? { ...email, folderId: 'archived' } : email));
    }, []);

    const value = useMemo(() => ({
        folders,
        emails,
        selectedFolderId,
        selectFolder,
        getEmailsByFolder,
        getEmailById,
        markEmailAsRead,
        archiveEmail,
        isLoading
    }), [folders, emails, selectedFolderId, selectFolder, getEmailsByFolder, getEmailById, markEmailAsRead, archiveEmail, isLoading]);

    return (
        <EmailContext.Provider value={value}>
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = (): EmailContextState => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error('useEmail must be used within an EmailProvider');
    }
    return context;
};