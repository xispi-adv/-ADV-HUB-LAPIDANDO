import React, { useState, useMemo } from 'react';
import type { AdMetric } from '../../types';

// Mock Data
// FIX: Explicitly type the return value of the map callback to prevent type widening of the 'platform' property.
const MOCK_AD_DATA: AdMetric[] = Array.from({ length: 30 }).map((_, i): AdMetric[] => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    return [
        {
            date: dateString,
            platform: 'google',
            cost: 150 + Math.random() * 50 - 25,
            clicks: 300 + Math.random() * 100 - 50,
            impressions: 15000 + Math.random() * 5000 - 2500,
        },
        {
            date: dateString,
            platform: 'meta',
            cost: 200 + Math.random() * 60 - 30,
            clicks: 450 + Math.random() * 120 - 60,
            impressions: 22000 + Math.random() * 6000 - 3000,
        }
    ];
}).flat().reverse();

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
);


const MetricCard: React.FC<{ title: string; value: string; subValue?: string }> = ({ title, value, subValue }) => (
    <div className="bg-black/20 p-4 rounded-lg">
        <p className="text-sm text-white/70">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subValue && <p className="text-xs text-green-400">{subValue}</p>}
    </div>
);

const AdsDashboard: React.FC = () => {
    const [platform, setPlatform] = useState<'all' | 'google' | 'meta'>('all');
    const [period, setPeriod] = useState<7 | 14 | 30>(7);

    const filteredData = useMemo(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - period);

        return MOCK_AD_DATA.filter(d => {
            const dDate = new Date(d.date);
            const platformMatch = platform === 'all' || d.platform === platform;
            return dDate >= startDate && dDate <= endDate && platformMatch;
        });
    }, [platform, period]);

    const aggregatedMetrics = useMemo(() => {
        return filteredData.reduce((acc, curr) => {
            acc.cost += curr.cost;
            acc.clicks += curr.clicks;
            acc.impressions += curr.impressions;
            return acc;
        }, { cost: 0, clicks: 0, impressions: 0 });
    }, [filteredData]);
    
    const ctr = aggregatedMetrics.impressions > 0 ? (aggregatedMetrics.clicks / aggregatedMetrics.impressions) * 100 : 0;
    
    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
    const formatNumber = (value: number) => Math.round(value).toLocaleString('pt-BR');

    return (
        <div className="p-6 bg-black/40 rounded-xl border border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                 <div className="flex items-center gap-3">
                    <ChartIcon className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-semibold text-white">Dashboard de Anúncios</h2>
                </div>
                <div className="flex items-center gap-2">
                     <select value={platform} onChange={e => setPlatform(e.target.value as any)} className="bg-black/30 border border-white/30 text-white text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-2">
                        <option value="all">Todas as Plataformas</option>
                        <option value="google">Google Ads</option>
                        <option value="meta">Meta Ads</option>
                    </select>
                     <select value={period} onChange={e => setPeriod(Number(e.target.value) as any)} className="bg-black/30 border border-white/30 text-white text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-2">
                        <option value={7}>Últimos 7 dias</option>
                        <option value={14}>Últimos 14 dias</option>
                        <option value={30}>Últimos 30 dias</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Custo Total" value={formatCurrency(aggregatedMetrics.cost)} />
                <MetricCard title="Cliques" value={formatNumber(aggregatedMetrics.clicks)} />
                <MetricCard title="Impressões" value={formatNumber(aggregatedMetrics.impressions)} />
                <MetricCard title="CTR" value={`${ctr.toFixed(2)}%`} />
            </div>
            
            <div className="mt-6 p-4 bg-black/20 rounded-lg text-center">
                 <p className="text-white/70">Visualização de gráfico virá aqui.</p>
                 <p className="text-xs text-white/50 mt-1">Implementar um componente de gráfico (ex: Recharts, Chart.js) para renderizar os dados de `filteredData`.</p>
            </div>
        </div>
    );
};

export default AdsDashboard;