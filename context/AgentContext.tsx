
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AgentCardData, AgentGroup, Message } from '../types';
import { 
    Target, 
    Share2, 
    PenTool, 
    Zap, 
    LayoutDashboard,
    Search,
    Code,
    LineChart
} from 'lucide-react';

// Initial Groups
const INITIAL_GROUPS: AgentGroup[] = [
    { id: 'marketing_team', name: 'Equipe de Marketing', description: 'Especialistas em SEO, Social Media e Tráfego de Alta Conversão.' },
    { id: 'ops_team', name: 'Equipe Operacional', description: 'Gestão de projetos, automação de processos e sprints.' },
    { id: 'accounting_team', name: 'Contabilidade & Financeiro', description: 'Gestão fiscal, análise de DRE e balanços inteligentes.' },
];

// Update Initial Agents with specific Lucide Icons
const INITIAL_AGENTS: AgentCardData[] = [
    {
      id: 'strategist',
      groupId: 'marketing_team',
      title: 'Estrategista Digital',
      description: 'Visão holística para conectar canais e maximizar o ROI.',
      isHighlighted: true,
      icon: Target,
      systemInstruction: 'Você é um Estrategista Digital Sênior. Sua função é analisar funis de marketing.',
    },
    {
      id: 'social_media',
      groupId: 'marketing_team',
      title: 'Mestre de Mídias Sociais',
      description: 'Especialista em crescimento orgânico, viralização e branding.',
      icon: Share2,
      systemInstruction: 'Você é um especialista em Mídias Sociais e Viralização.',
    },
    {
      id: 'copywriter',
      groupId: 'marketing_team',
      title: 'Copywriter Pro',
      description: 'Engenharia de persuasão focada em resposta direta.',
      icon: PenTool,
      systemInstruction: 'Você é um Copywriter de Resposta Direta world-class.',
    },
    {
      id: 'traffic',
      groupId: 'marketing_team',
      title: 'Gestor de Tráfego Pago',
      description: 'Otimização avançada de Google ADS, Meta e TikTok ADS.',
      icon: Zap,
      systemInstruction: 'Você é um Gestor de Tráfego Pago focado em performance.',
    },
    {
      id: 'project_manager',
      groupId: 'ops_team',
      title: 'Gestor de Projetos',
      description: 'Organização de sprints, gestão de tempo e metodologias ágeis.',
      icon: LayoutDashboard,
      systemInstruction: 'Você é um Gestor de Projetos Ágil.',
    },
];

interface AgentContextState {
    groups: AgentGroup[];
    agents: AgentCardData[];
    addAgentGroup: (group: Omit<AgentGroup, 'id'>) => void;
    addAgent: (agent: Omit<AgentCardData, 'id' | 'chatHistory'>) => void;
    addMessageToHistory: (agentId: string, message: Message) => void;
}

const AgentContext = createContext<AgentContextState | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<AgentGroup[]>(INITIAL_GROUPS);
    const [agents, setAgents] = useState<AgentCardData[]>(INITIAL_AGENTS);

    const addAgentGroup = (groupData: Omit<AgentGroup, 'id'>) => {
        const newGroup: AgentGroup = {
            ...groupData,
            id: `group-${Date.now()}`,
        };
        setGroups(prev => [...prev, newGroup]);
    }

    const addAgent = (newAgentData: Omit<AgentCardData, 'id' | 'chatHistory'>) => {
        const newAgent: AgentCardData = {
            ...newAgentData,
            id: `custom-agent-${Date.now()}`,
            chatHistory: [],
            isHighlighted: false
        };
        setAgents(prev => [...prev, newAgent]);
    };

    const addMessageToHistory = (agentId: string, message: Message) => {
        setAgents(prev => prev.map(agent => {
            if (agent.id === agentId) {
                const history = agent.chatHistory || [];
                return { ...agent, chatHistory: [...history, message] };
            }
            return agent;
        }));
    };

    return (
        <AgentContext.Provider value={{ groups, agents, addAgentGroup, addAgent, addMessageToHistory }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgents = (): AgentContextState => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgents must be used within an AgentProvider');
    }
    return context;
};
