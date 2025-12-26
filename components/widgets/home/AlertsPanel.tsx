import React from 'react';

// Mock Data
const MOCK_ALERTS = [
    { id: 1, criticality: 'high', message: 'Orçamento da Campanha Q3 atingiu 90%. Ação recomendada.', timestamp: 'há 15 minutos' },
    { id: 2, criticality: 'medium', message: 'API do Meta Ads retornou um erro temporário. O sistema tentará novamente.', timestamp: 'há 2 horas' },
    { id: 3, criticality: 'low', message: 'Nova política de privacidade do Google Analytics a partir de 1º de Novembro.', timestamp: 'ontem' },
];

// Icons
const AlertHighIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const AlertMediumIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);
const AlertLowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-sky-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);
const BellIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
);


const criticalityMap = {
    high: { icon: <AlertHighIcon />, border: 'border-red-500/50' },
    medium: { icon: <AlertMediumIcon />, border: 'border-yellow-500/50' },
    low: { icon: <AlertLowIcon />, border: 'border-sky-500/50' },
};

const AlertsPanel: React.FC = () => {
    return (
        <div className="p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <BellIcon/>
                <h2 className="text-xl font-semibold text-white">Alertas e Notificações</h2>
            </div>
            <div className="space-y-3">
                {MOCK_ALERTS.map(alert => {
                    const { icon, border } = criticalityMap[alert.criticality as keyof typeof criticalityMap];
                    return (
                        <div key={alert.id} className={`flex items-start gap-3 p-3 bg-black/40 rounded-lg border-l-4 ${border}`}>
                            <div className="flex-shrink-0 pt-0.5">{icon}</div>
                            <div>
                                <p className="text-sm text-white/90">{alert.message}</p>
                                <p className="text-xs text-white/60 mt-1">{alert.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlertsPanel;
