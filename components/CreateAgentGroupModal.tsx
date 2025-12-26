
import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';

interface CreateAgentGroupModalProps {
    onClose: () => void;
}

const CreateAgentGroupModal: React.FC<CreateAgentGroupModalProps> = ({ onClose }) => {
    const { addAgentGroup } = useAgents();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAgentGroup(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl shadow-black overflow-hidden relative" onClick={e => e.stopPropagation()}>
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 opacity-50"></div>

                <h2 className="text-2xl font-light text-white mb-8 mt-2">Nova Equipe de Agentes</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">Nome da Equipe</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Especialistas em Vendas"
                            className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">Descrição da Missão</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Objetivo principal desta unidade..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white transition-colors text-sm">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            Formar Equipe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAgentGroupModal;
