import React, { useState } from 'react';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ComposeModalProps {
    onClose: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would connect to a service to send the email
        console.log("Sending email:", formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-[#100101] border border-red-800 rounded-xl shadow-2xl shadow-red-900/40 w-full max-w-3xl m-4 h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-white/20 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">Nova Mensagem</h2>
                    <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col min-h-0">
                    <div className="p-4 space-y-3 flex-shrink-0 border-b border-white/20">
                        <InputField label="Para" name="to" type="email" value={formData.to} onChange={handleChange} required />
                        <InputField label="Assunto" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                    <div className="flex-grow p-4 min-h-0">
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            placeholder="Escreva seu email aqui..."
                            className="w-full h-full bg-transparent text-white placeholder-white/50 focus:outline-none resize-none"
                        />
                    </div>
                    <footer className="p-4 flex justify-end gap-4 border-t border-white/20 flex-shrink-0">
                         <button type="button" onClick={onClose} className="py-2 px-5 rounded-lg text-white/80 hover:bg-white/10 transition-colors">Descartar</button>
                        <button type="submit" className="py-2 px-5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors">Enviar</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

const InputField: React.FC<{label: string, name: string, value: string, onChange: any, type?: string, required?: boolean}> = ({ label, name, value, onChange, type = 'text', required = false }) => (
    <div className="flex items-center">
        <label htmlFor={name} className="block text-sm font-medium text-white/70 w-20">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none"
        />
    </div>
);


export default ComposeModal;
