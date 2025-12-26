import React from 'react';
import WidgetCard from './shared/WidgetCard';

const MOCK_TEAM_DATA = [
    { name: 'Alice', tasks: 12, progress: 85, avatar: 'https://i.pravatar.cc/40?u=alice' },
    { name: 'Bob', tasks: 8, progress: 60, avatar: 'https://i.pravatar.cc/40?u=bob' },
    { name: 'Charlie', tasks: 15, progress: 95, avatar: 'https://i.pravatar.cc/40?u=charlie' },
    { name: 'Diana', tasks: 10, progress: 70, avatar: 'https://i.pravatar.cc/40?u=diana' },
];

const ProductivityWidget: React.FC = () => {
    return (
        <WidgetCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Produtividade da Equipe</h3>
                    <p className="text-sm text-white/70">Progresso das tarefas da semana</p>
                </div>
                <div className="text-left md:text-right mt-2 md:mt-0">
                    <p className="text-2xl font-bold text-white">+15K</p>
                    <p className="text-sm text-green-400 font-semibold">+12% vs. Semana Anterior</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_TEAM_DATA.map(member => (
                    <div key={member.name} className="bg-black/40 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                                <span className="text-sm font-medium text-white/90">{member.name}</span>
                            </div>
                            <span className="text-xs font-bold text-white/80">{member.progress}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-1.5">
                            <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${member.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetCard>
    );
};

export default ProductivityWidget;