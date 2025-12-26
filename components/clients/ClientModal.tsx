
import React, { useState } from 'react';
import { useClients } from '../../context/ClientContext';
import type { Client, ClientStatus } from '../../types';

interface ClientModalProps {
    onClose: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ onClose }) => {
    const { addClient } = useClients();
    
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        description: '',
        status: 'PROSPECT' as ClientStatus,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newClient: Client = {
            id: `cli-${Date.now()}`,
            name: formData.name,
            companyName: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            description: formData.description,
            status: formData.status,
            since: new Date().toISOString(),
            onboardingChecklist: [], // Start empty
            logo: '' // Optional placeholder
        };

        addClient(newClient);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl shadow-black relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900"></div>
                
                <h2 className="text-2xl font-light text-white mb-8">Novo Cliente</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">Nome do Contato</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ex: João Silva"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">Empresa</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Acme Corp"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contato@empresa.com"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-blue-500 transition-colors">Status Inicial</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-[#111] border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                            >
                                <option value="PROSPECT">Em Negociação (Prospect)</option>
                                <option value="ACTIVE">Contrato Ativo</option>
                                <option value="CHURNED">Encerrado</option>
                            </select>
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-blue-500 transition-colors">Descrição / Notas</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Detalhes sobre o contrato ou necessidades..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white transition-colors text-sm">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            Cadastrar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;
