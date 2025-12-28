
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import type { Email, EmailFolder, EmailFolderId } from '../types';
import { MOCK_FOLDERS, MOCK_EMAILS } from '../data/mock-email-data';
import { GoogleGenAI } from "@google/genai";

interface EmailContextState {
    folders: EmailFolder[];
    emails: Email[];
    selectedFolderId: EmailFolderId;
    selectFolder: (folderId: EmailFolderId) => void;
    getEmailsByFolder: (folderId: EmailFolderId) => Email[];
    getEmailById: (emailId: string) => Email | undefined;
    markEmailAsRead: (emailId: string) => void;
    archiveEmail: (emailId: string) => void;
    summarizeEmail: (emailId: string) => Promise<string>;
    isLoading: boolean;
}

const EmailContext = createContext<EmailContextState | undefined>(undefined);

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [folders, setFolders] = useState<EmailFolder[]>(MOCK_FOLDERS);
    const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
    const [selectedFolderId, setSelectedFolderId] = useState<EmailFolderId>('INBOX');
    const [isLoading, setIsLoading] = useState(false);

    const selectFolder = useCallback((folderId: EmailFolderId) => {
        setIsLoading(true);
        setSelectedFolderId(folderId);
        setTimeout(() => {
            setIsLoading(false);
        }, 400);
    }, []);
    
    const getEmailsByFolder = useCallback((folderId: EmailFolderId) => {
        return emails.filter(email => email.labelIds.includes(folderId)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [emails]);
    
    const getEmailById = useCallback((emailId: string) => {
        return emails.find(email => email.id === emailId);
    }, [emails]);

    const markEmailAsRead = useCallback((emailId: string) => {
        setEmails(prev => prev.map(email => email.id === emailId ? { ...email, isRead: true } : email));
    }, []);
    
    const archiveEmail = useCallback((emailId: string) => {
        setEmails(prev => prev.map(email => {
            if (email.id === emailId) {
                const newLabels = email.labelIds.filter(l => l !== 'INBOX');
                if (!newLabels.includes('TRASH')) newLabels.push('ARCHIVE');
                return { ...email, labelIds: newLabels };
            }
            return email;
        }));
    }, []);

    const summarizeEmail = useCallback(async (emailId: string): Promise<string> => {
        const email = emails.find(e => e.id === emailId);
        if (!email) return "E-mail não encontrado.";

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Você é Alita, assistente de IA da agência ADV-HUB.
                Sumarize este e-mail de marketing/negócios para o gestor.
                FOCO: Ações necessárias, datas importantes e tom emocional.
                
                ASSUNTO: ${email.subject}
                DE: ${email.from.name} (${email.from.email})
                CONTEÚDO: ${email.body.replace(/<[^>]*>?/gm, '')}
                
                Retorne um resumo executivo curto em bullet points.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            return response.text || "Não foi possível gerar o resumo.";
        } catch (error) {
            console.error("Erro na sumarização:", error);
            return "Falha ao conectar com o motor neural de Alita.";
        }
    }, [emails]);

    const value = useMemo(() => ({
        folders,
        emails,
        selectedFolderId,
        selectFolder,
        getEmailsByFolder,
        getEmailById,
        markEmailAsRead,
        archiveEmail,
        summarizeEmail,
        isLoading
    }), [folders, emails, selectedFolderId, selectFolder, getEmailsByFolder, getEmailById, markEmailAsRead, archiveEmail, summarizeEmail, isLoading]);

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
