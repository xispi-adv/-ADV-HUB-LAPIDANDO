
import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Bot, Target } from 'lucide-react';

interface CreateAgentModalProps {
    groupId?: string;
    onClose: () => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ groupId: initialGroupId, onClose }) => {
    const { addAgent, groups } = useAgents();
    const { theme } = useTheme();
    
    const [formData, setFormData] = useState({
        groupId: initialGroupId || (groups[0]?.id || ''),
        title: '',
        description: '',
        persona: '',
        knowledge: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const systemInstruction = `
        ATUE COMO: ${formData.title}.
        SUA PERSONA: ${formData.persona}
        CONHECIMENTO BASE: ${formData.knowledge}
        `;

        addAgent({
            groupId: formData.groupId,
            title: formData.title,
            description: formData.description,
            systemInstruction: systemInstruction,
        });
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-3xl m-4 p-8 rounded-3xl shadow-2xl shadow-black relative flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-rose-600 rounded-lg shadow-lg shadow-rose-600/20">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-light text-white tracking-tight">Recrutar Agente</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                    
                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-rose-500 transition-colors">Vincular ao Squad</label>
                        <select
                            name="groupId"
                            value={formData.groupId}
                            onChange={handleChange}
                            disabled={!!initialGroupId}
                            className={`w-full bg-[#111] border-b border-white/10 py-2 text-lg text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer ${initialGroupId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-rose-500 transition-colors">Nome do Agente</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Analista de Growth"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-rose-500 transition-colors">Especialidade Principal</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Descrição curta da função..."
                                className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-rose-500 transition-colors">Persona & Comportamento</label>
                        <textarea
                            name="persona"
                            value={formData.persona}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Defina a personalidade e o tom de voz deste agente..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all resize-none text-sm"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-rose-500 transition-colors">Conhecimento Estratégico</label>
                        <textarea
                            name="knowledge"
                            value={formData.knowledge}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Instruções de sistema..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all text-sm"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Descartar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-rose-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            Inicializar Agente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAgentModal;
