
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface NexusNode {
    id: string;
    type: 'note' | 'client' | 'finance';
    position: { x: number; y: number };
    data: any;
}

interface NexusContextType {
    nodes: NexusNode[];
    addNode: (node: Omit<NexusNode, 'id'>) => void;
    deleteNode: (id: string) => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nodes, setNodes] = useState<NexusNode[]>([
        { id: '1', type: 'note', position: { x: 100, y: 100 }, data: { label: 'Ideia de Campanha Q4' } },
        { id: '2', type: 'client', position: { x: 350, y: 150 }, data: { label: 'Nubank - Briefing' } }
    ]);

    const addNode = (nodeData: Omit<NexusNode, 'id'>) => {
        const newNode: NexusNode = {
            ...nodeData,
            id: `node-${Date.now()}`
        };
        setNodes(prev => [...prev, newNode]);
    };

    const deleteNode = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NexusContext.Provider value={{ nodes, addNode, deleteNode }}>
            {children}
        </NexusContext.Provider>
    );
};

export const useNexus = (): NexusContextType => {
    const context = useContext(NexusContext);
    if (!context) {
        throw new Error('useNexus must be used within a NexusProvider');
    }
    return context;
};
