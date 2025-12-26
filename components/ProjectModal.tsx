
import React, { useState, useEffect } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import { useClients } from '../context/ClientContext';
import type { Project } from '../types';

interface ProjectModalProps {
    project?: Project | null;
    groupId?: string; 
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, groupId, onClose }) => {
    const { addProject, updateProject, projectGroups } = useTaskManager();
    const { getClientById } = useClients();
    
    // If no groupId is passed, use the first available group ID
    const [selectedGroupId, setSelectedGroupId] = useState(groupId || (project?.groupId) || projectGroups[0]?.id || '');

    const [formData, setFormData] = useState({
        name: project?.name || '',
        purpose: project?.purpose || '',
        focus: project?.focus || '',
        client: project?.client || '',
        summary: project?.summary || '',
        deadline: project?.deadline || '',
    });

    // Effect: When Group changes, auto-fill the Client Name based on Group's linkage
    useEffect(() => {
        // Find the selected group
        const group = projectGroups.find(g => g.id === selectedGroupId);
        
        if (group) {
            if (group.clientId) {
                // If group is linked to a client, FORCE that client name
                const client = getClientById(group.clientId);
                if (client) {
                    setFormData(prev => ({ ...prev, client: client.name }));
                }
            } else {
                // If group is Internal/Not linked, default to agency name if empty, or allow edit
                if (!formData.client) {
                    setFormData(prev => ({ ...prev, client: 'AdVerge Interno' }));
                }
            }
        }
    }, [selectedGroupId, projectGroups, getClientById]); // Don't add formData.client to deps to avoid loops

    // Derived state to check if client input should be locked
    const isClientLocked = () => {
        const group = projectGroups.find(g => g.id === selectedGroupId);
        return !!group?.clientId;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (project) {
            updateProject(project.id, { ...formData, groupId: selectedGroupId });
        } else {
            addProject({ ...formData, groupId: selectedGroupId });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-2xl m-4 p-8 rounded-3xl shadow-2xl shadow-black relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900"></div>
                
                <h2 className="text-3xl font-light text-white mb-8">{project ? 'Editar Projeto' : 'Iniciar Novo Projeto'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Group Selector */}
                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Grupo de Projetos</label>
                        <select
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            disabled={!!groupId} // If created from specific view (like client detail), lock group
                            className={`w-full bg-[#111] border-b border-white/10 py-2 text-lg text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer ${groupId ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {projectGroups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-6">
                         <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Nome do Projeto"
                            className="w-full bg-transparent border-b border-white/10 py-2 text-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                        />

                        <div className="grid grid-cols-2 gap-8">
                             {/* Client Field - Conditionally Disabled */}
                             <div className="group">
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Cliente (Vinculado ao Grupo)</label>
                                <input
                                    type="text"
                                    name="client"
                                    value={formData.client}
                                    onChange={handleChange}
                                    readOnly={isClientLocked()}
                                    required
                                    className={`w-full bg-transparent border-b border-white/10 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors ${isClientLocked() ? 'opacity-70 cursor-not-allowed text-gray-400' : ''}`}
                                />
                            </div>
                             <InputField label="Entrega Final" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
                        </div>

                         <div className="grid grid-cols-2 gap-8">
                             <InputField label="Propósito Principal" name="purpose" value={formData.purpose} onChange={handleChange} required placeholder="Ex: Lançamento" />
                             <InputField label="Foco Estratégico" name="focus" value={formData.focus} onChange={handleChange} required placeholder="Ex: Branding" />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Resumo Executivo</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Breve descrição do escopo..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white transition-colors text-sm">Descartar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            {project ? 'Salvar Alterações' : 'Criar Projeto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: any, type?: string, required?: boolean, placeholder?: string}> = ({ label, name, value, onChange, type = 'text', required = false, placeholder }) => (
    <div className="group">
        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full bg-transparent border-b border-white/10 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
        />
    </div>
);

export default ProjectModal;
