
import React, { useState, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { useClients } from '../../context/ClientContext';
import type { CalendarTask, CalendarTaskStatus, CalendarTaskPriority, CalendarTaskCategory } from '../../types';

interface TaskModalProps {
    task?: CalendarTask | null;
    dueDate?: string | null;
    defaultClientId?: string; // Propriedade para pré-selecionar cliente
    onClose: () => void;
}

const CalendarTaskModal: React.FC<TaskModalProps> = ({ task, dueDate, defaultClientId, onClose }) => {
    const { addTask, updateTask, deleteTask } = useCalendar();
    const { clients } = useClients();

    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'MEDIA',
        category: task?.category || 'OUTRO',
        status: task?.status || 'A_FAZER',
        dueDate: task?.dueDate || dueDate || '',
        assignedTo: task?.assignedTo || '',
        clientId: task?.clientId || defaultClientId || '', // Estado para o Cliente
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            priority: formData.priority as CalendarTaskPriority,
            category: formData.category as CalendarTaskCategory,
            status: formData.status as CalendarTaskStatus,
        };

        if (task) {
            updateTask(task.id, taskData);
        } else {
            addTask(taskData);
        }
        onClose();
    };

    const handleDelete = useCallback(() => {
        if (task && window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
            deleteTask(task.id);
            onClose();
        }
    }, [task, deleteTask, onClose]);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl shadow-black flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 blur-[60px] pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-light text-white tracking-wide">{task ? 'Editar Compromisso' : 'Novo Compromisso'}</h2>
                        {task && (
                            <button type="button" onClick={handleDelete} className="text-white/30 hover:text-red-500 transition-colors text-xs uppercase tracking-widest font-bold">
                                Excluir
                            </button>
                        )}
                    </div>

                    {/* Title Input (Hero) */}
                    <div className="group">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Título do evento ou tarefa..."
                            className="w-full bg-transparent border-b border-white/10 py-2 text-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>

                    {/* Grid Layout for Meta Data */}
                    <div className="grid grid-cols-2 gap-6">
                        <SelectField 
                            label="Categoria" 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            options={[
                                { value: 'CAMPANHA', label: 'Campanha' },
                                { value: 'SOCIAL_MEDIA', label: 'Social Media' },
                                { value: 'CONTEUDO', label: 'Conteúdo' },
                                { value: 'REUNIAO', label: 'Reunião' },
                                { value: 'ADS', label: 'Ads / Tráfego' },
                                { value: 'SEO', label: 'SEO' },
                                { value: 'EMAIL', label: 'Email Mkt' },
                                { value: 'OUTRO', label: 'Outro' },
                            ]} 
                        />
                        <SelectField 
                            label="Prioridade" 
                            name="priority" 
                            value={formData.priority} 
                            onChange={handleChange} 
                            options={[
                                { value: 'BAIXA', label: 'Baixa' },
                                { value: 'MEDIA', label: 'Média' },
                                { value: 'ALTA', label: 'Alta' },
                                { value: 'URGENTE', label: 'Urgente' },
                            ]} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputField label="Data" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                        <SelectField 
                            label="Status" 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            options={[
                                { value: 'A_FAZER', label: 'A Fazer' },
                                { value: 'EM_PROGRESSO', label: 'Em Andamento' },
                                { value: 'REVISAO', label: 'Em Revisão' },
                                { value: 'CONCLUIDO', label: 'Concluído' },
                            ]} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <InputField label="Responsável" name="assignedTo" value={formData.assignedTo} onChange={handleChange} placeholder="Quem fará?" />
                        
                        {/* Client Selector */}
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Cliente</label>
                            <select
                                name="clientId"
                                value={formData.clientId}
                                onChange={handleChange}
                                disabled={!!defaultClientId}
                                className={`w-full bg-transparent border-b border-white/10 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer ${defaultClientId ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <option value="" className="bg-[#1a1a1a]">Sem vínculo</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id} className="bg-[#1a1a1a]">{client.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Detalhes</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Adicione notas, links ou contexto..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reusable Components for the Modal
const InputField: React.FC<{label: string, name: string, value: string, onChange: any, type?:string, required?: boolean, placeholder?: string}> = ({ label, name, value, onChange, type='text', required = false, placeholder }) => (
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

const SelectField: React.FC<{label: string, name: string, value: string, onChange: any, options: {value: string, label: string}[]}> = ({ label, name, value, onChange, options }) => (
    <div className="group">
        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent border-b border-white/10 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer"
        >
            {options.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1a1a1a]">{opt.label}</option>)}
        </select>
    </div>
);

export default CalendarTaskModal;
