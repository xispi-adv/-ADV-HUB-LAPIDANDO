
import React from 'react';

interface GenerateButtonProps {
    disabled: boolean;
    isLoading: boolean;
    onClick: (e: any) => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ disabled, isLoading, onClick }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300
        flex items-center justify-center gap-3 overflow-hidden border
        ${disabled 
          ? 'bg-[var(--bg-elevation-2)] border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-50' 
          : 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)] hover:-translate-y-0.5 active:translate-y-0'
        }
      `}
    >
      {/* Shimmer Effect on Hover */}
      {!disabled && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
      )}

      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Processando...</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <span>Gerar Agora</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;
