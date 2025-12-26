
import React, { useState, useEffect } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useClients } from '../context/ClientContext';
import type { ProjectGroup } from '../types';

interface ProjectGroupModalProps {
    onClose: () => void;
    defaultClientId?: string;
    group?: ProjectGroup | null; // Added prop for editing
}

const ProjectGroupModal: React.FC<ProjectGroupModalProps> = ({ onClose, defaultClientId, group }) => {
    const { addProjectGroup, updateProjectGroup } = useTaskManager();
    const { clients } = useClients();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        clientId: defaultClientId || ''
    });

    // Load group data if editing
    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description,
                clientId: group.clientId || ''
            });
        } else {
            // Initial load logic for new group
            if (defaultClientId) {
                const initialClient = clients.find(c => c.id === defaultClientId);
                if (initialClient) {
                    setFormData(prev => ({ ...prev, name: `Projetos ${initialClient.name}`, clientId: defaultClientId }));
                }
            }
        }
    }, [group, defaultClientId, clients]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Auto-fill name if client is selected manually AND we are creating a NEW group (not editing)
        if (!group && name === 'clientId' && value && !defaultClientId) {
            const client = clients.find(c => c.id === value);
            if (client) {
                setFormData(prev => ({ ...prev, [name]: value, name: `Projetos ${client.name}` }));
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (group) {
            updateProjectGroup(group.id, formData);
        } else {
            addProjectGroup(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl shadow-black overflow-hidden relative" onClick={e => e.stopPropagation()}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/20 blur-[50px]"></div>
                
                <h2 className="text-2xl font-light text-white mb-8 relative z-10">{group ? 'Editar Grupo' : 'Novo Grupo de Projetos'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    
                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Vincular Cliente</label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            disabled={!!defaultClientId || !!group} // Disable if passed as prop OR if editing (shouldn't change client of existing group usually)
                            className={`w-full bg-[#111] border-b border-white/10 py-2 text-lg text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${(defaultClientId || group) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Uso Interno / Geral</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        {group && <p className="text-[10px] text-white/30 mt-1">O cliente não pode ser alterado após a criação.</p>}
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Nome do Grupo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Clientes Enterprise"
                            className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Propósito deste agrupamento..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white transition-colors text-sm">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            {group ? 'Salvar Alterações' : 'Criar Grupo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectGroupModal;
