
import React from 'react';
import { useNexus } from '../../context/NexusContext';

// Simple placeholder implementation to ensure the file exists and works
// You can expand this with the full Canvas/Node logic if needed.
const NexusBoardView: React.FC = () => {
    const { nodes, addNode } = useNexus();

    return (
        <div className="h-full flex flex-col animate-fade-in-up relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center pointer-events-none">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Nexus Board</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Canvas Infinito de Planejamento</p>
                </div>
                <div className="pointer-events-auto">
                    <button 
                        onClick={() => addNode({ type: 'note', position: { x: Math.random() * 400, y: Math.random() * 400 }, data: { label: 'Nova Nota' } })}
                        className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
                    >
                        + Adicionar Nota
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                     style={{ 
                         backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)', 
                         backgroundSize: '20px 20px' 
                     }}
                />

                {/* Nodes Layer */}
                <div className="relative w-full h-full">
                    {nodes.map(node => (
                        <div 
                            key={node.id}
                            className="absolute bg-[var(--bg-elevation-1)] border border-[var(--border-color)] p-4 rounded-xl shadow-xl w-48 hover:border-[var(--accent-color)] transition-colors"
                            style={{ left: node.position.x, top: node.position.y }}
                        >
                            <div className="font-bold text-[var(--text-primary)] mb-2 text-sm">
                                {node.type === 'client' ? 'Cliente' : node.type === 'finance' ? 'Financeiro' : 'Nota'}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                {node.data.label || 'Sem conteúdo'}
                            </div>
                        </div>
                    ))}
                    
                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)] pointer-events-none">
                            <p>O canvas está vazio. Adicione itens para começar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NexusBoardView;
