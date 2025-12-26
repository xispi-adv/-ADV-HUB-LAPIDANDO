
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Client } from '../types';

const INITIAL_CLIENTS: Client[] = [
    {
        id: 'cli-1',
        name: 'Nubank',
        companyName: 'Nu Pagamentos S.A.',
        status: 'ACTIVE',
        email: 'marketing@nubank.com.br',
        phone: '(11) 99999-8888',
        cnpj: '18.236.120/0001-58',
        responsibleName: 'Cristina Junqueira',
        website: 'nubank.com.br',
        socialInstagram: '@nubank',
        socialLinkedin: 'linkedin.com/company/nubank',
        contractObjective: 'Aumentar market share no segmento de alta renda (Ultravioleta).',
        description: 'Conta Enterprise. Foco em campanhas de performance para o cartão Ultravioleta e ativação de marca.',
        brand: {
            toneOfVoice: 'Descontraído, direto, transparente e humano ("NuLanguage").',
            visualIdentity: 'Roxo (Principal), minimalista, uso forte de tipografia.',
            coreValues: 'Contra a burocracia, foco no cliente, transparência.'
        },
        personas: [
            { name: 'Jovem Conectado', description: '20-30 anos, nativo digital, busca facilidade e zero taxas.' },
            { name: 'Alta Renda (UV)', description: '30-45 anos, investidor, busca benefícios de viagem e cashback.' },
            { name: 'Pequeno Empreendedor', description: 'Dono de negócio, busca agilidade na conta PJ.' }
        ],
        objectives: [
            {
                id: 'obj-1',
                title: 'Aumentar base de clientes Ultravioleta',
                deadline: '2025-12-31',
                status: 'EM_ANDAMENTO',
                keyResults: [
                    { id: 'kr-1', title: 'Atingir 100k novas inscrições', isCompleted: false },
                    { id: 'kr-2', title: 'Reduzir CAC em 15%', isCompleted: true },
                    { id: 'kr-3', title: 'Lançar campanha com Influenciadores Tier 1', isCompleted: true }
                ]
            },
            {
                id: 'obj-2',
                title: 'Consolidar presença no TikTok',
                deadline: '2025-06-30',
                status: 'ATRASADO',
                keyResults: [
                    { id: 'kr-4', title: 'Publicar 3 vídeos virais por semana', isCompleted: false },
                    { id: 'kr-5', title: 'Alcançar 1M de seguidores', isCompleted: false }
                ]
            }
        ],
        since: '2023-01-15',
        onboardingChecklist: [
            { id: '1', label: 'Contrato Assinado', completed: true },
            { id: '2', label: 'Acesso ao Gerenciador de Anúncios', completed: true },
            { id: '3', label: 'Briefing Inicial', completed: true }
        ]
    },
    {
        id: 'cli-2',
        name: 'McDonald\'s',
        companyName: 'Arcos Dourados',
        status: 'ACTIVE',
        email: 'br.mkt@mcdonalds.com',
        phone: '(11) 4444-5555',
        cnpj: '42.591.651/0001-43',
        responsibleName: 'João Branco',
        website: 'mcdonalds.com.br',
        socialInstagram: '@mcdonalds_br',
        contractObjective: 'Engajamento em redes sociais e divulgação de ofertas sazonais.',
        description: 'Gestão de comunidade e lançamentos sazonais (McLanche Feliz).',
        brand: {
            toneOfVoice: 'Divertido, familiar, convidativo ("Méqui").',
            visualIdentity: 'Vermelho e Amarelo, fotografia de appetite appeal.',
            coreValues: 'Família, diversão, conveniência.'
        },
        personas: [
            { name: 'Família com Crianças', description: 'Busca experiência de fim de semana e brindes.' },
            { name: 'Jovens da Madrugada', description: 'Busca lanche rápido pós-rolê.' },
            { name: 'Executivo Almoço', description: 'Busca rapidez e consistência no horário de trabalho.' }
        ],
        objectives: [],
        since: '2024-02-10',
        onboardingChecklist: [
            { id: '1', label: 'Setup de Ferramentas', completed: true },
            { id: '2', label: 'Kick-off Meeting', completed: true }
        ]
    },
    {
        id: 'cli-3',
        name: 'Itaú',
        companyName: 'Itaú Unibanco',
        status: 'PROSPECT',
        email: 'novosnegocios@itau.com.br',
        description: 'Em negociação para gestão de mídia programática.',
        since: '2024-05-20',
        onboardingChecklist: [
            { id: '1', label: 'Envio de Proposta', completed: true },
            { id: '2', label: 'Aprovação Jurídica', completed: false }
        ]
    },
    {
        id: 'cli-4',
        name: 'Shell',
        companyName: 'Raízen',
        status: 'CHURNED',
        email: 'contato@shell.com',
        description: 'Contrato encerrado em Dez/2023 após reestruturação interna do cliente.',
        since: '2022-05-01',
        onboardingChecklist: []
    }
];

interface ClientContextState {
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (id: string, data: Partial<Client>) => void;
    getClientById: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextState | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

    const addClient = (client: Client) => {
        setClients(prev => [...prev, client]);
    };

    const updateClient = (id: string, data: Partial<Client>) => {
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const getClientById = (id: string) => clients.find(c => c.id === id);

    return (
        <ClientContext.Provider value={{ clients, addClient, updateClient, getClientById }}>
            {children}
        </ClientContext.Provider>
    );
};

export const useClients = (): ClientContextState => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClients must be used within a ClientProvider');
    }
    return context;
};
