
import React, { useState, useCallback } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import type { Task, TaskStatus, TaskPriority } from '../types';

interface TaskModalProps {
    task?: Task | null;
    status?: TaskStatus; 
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, status, onClose }) => {
    const { addTask, updateTask, selectedProjectId, deleteTask } = useTaskManager();
    
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'MEDIA',
        dueDate: task?.dueDate || '',
        assignee: task?.assignee || '',
        status: task?.status || status || 'A_FAZER',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId) return;

        if (task) { 
            updateTask(task.id, {
                ...formData,
                priority: formData.priority as TaskPriority,
                status: formData.status as TaskStatus,
            });
        } else {
            addTask({
                ...formData,
                priority: formData.priority as TaskPriority,
                status: formData.status as TaskStatus,
                projectId: selectedProjectId,
            });
        }
        onClose();
    };

    const handleDelete = useCallback(() => {
        if (task && window.confirm(`Excluir tarefa "${task.title}"?`)) {
            deleteTask(task.id);
            onClose();
        }
    }, [task, deleteTask, onClose]);

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-lg m-4 p-8 rounded-3xl shadow-2xl shadow-black flex flex-col relative overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] pointer-events-none"></div>
                
                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-light text-white tracking-wide">{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
                        {task && (
                            <button type="button" onClick={handleDelete} className="text-white/30 hover:text-red-500 transition-colors text-sm">
                                Excluir
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Title Input - Big & Clean */}
                        <div>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="O que precisa ser feito?"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <SelectField 
                                label="Prioridade" 
                                name="priority" 
                                value={formData.priority} 
                                onChange={handleChange}
                                options={[
                                    { value: 'ALTA', label: 'Alta Prioridade' },
                                    { value: 'MEDIA', label: 'Média Prioridade' },
                                    { value: 'BAIXA', label: 'Baixa Prioridade' },
                                ]}
                            />
                             <SelectField 
                                label="Status" 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange}
                                options={[
                                    { value: 'A_FAZER', label: 'A Fazer' },
                                    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
                                    { value: 'CONCLUIDO', label: 'Concluído' },
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                             <InputField label="Responsável" name="assignee" value={formData.assignee} onChange={handleChange} placeholder="Quem fará?" />
                             <InputField label="Prazo" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Detalhes adicionais..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            {task ? 'Salvar Alterações' : 'Criar Tarefa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
            {options.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
        </select>
    </div>
);

export default TaskModal;
