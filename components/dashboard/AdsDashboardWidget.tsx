import React, { useState, useMemo } from 'react';
import type { AdMetric } from '../../types';

const MOCK_AD_DATA: AdMetric[] = Array.from({ length: 30 }).map((_, i): AdMetric[] => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    return [
        { date: dateString, platform: 'google', cost: 80 + Math.random() * 40, clicks: 150 + Math.random() * 80, impressions: 8000 + Math.random() * 2000 },
        { date: dateString, platform: 'meta', cost: 120 + Math.random() * 50, clicks: 250 + Math.random() * 100, impressions: 12000 + Math.random() * 3000 }
    ];
}).flat().reverse();

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
);

interface MetricDisplayProps {
    title: string;
    value: string;
    textColor: string;
    className?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ title, value, textColor, className }) => (
    <div className={className || "bg-white/10 p-4 rounded-lg backdrop-blur-sm"}>
        <p className={`text-sm ${textColor} opacity-80`}>{title}</p>
        <p className={`text-2xl lg:text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
);

const AdsDashboardWidget: React.FC = () => {
    const [platform, setPlatform] = useState<'all' | 'google' | 'meta'>('all');
    const [period, setPeriod] = useState<7 | 14 | 30>(7);

    const themes = {
      all: { bg: 'bg-black/40', border: 'border-white/20', text: 'text-white', accent: 'text-red-500', selectBg: 'bg-black/30' },
      meta: { bg: 'bg-gradient-to-br from-blue-700 to-blue-900', border: 'border-blue-400/50', text: 'text-white', accent: 'text-blue-300', selectBg: 'bg-white/10' },
      google: { bg: 'bg-gray-50', border: 'border-transparent', text: 'text-gray-800', accent: 'text-blue-600', selectBg: 'bg-gray-200' }
    };
    const currentTheme = themes[platform];
    const googleColors = ['border-l-[#4285F4]', 'border-l-[#DB4437]', 'border-l-[#F4B400]', 'border-l-[#0F9D58]'];

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
    
    const metrics = [
        { title: "Custo Total", value: formatCurrency(aggregatedMetrics.cost) },
        { title: "Cliques", value: formatNumber(aggregatedMetrics.clicks) },
        { title: "Impressões", value: formatNumber(aggregatedMetrics.impressions) },
        { title: "CTR", value: `${ctr.toFixed(2)}%` }
    ];

    return (
        <div className={`relative p-6 rounded-2xl border transition-all duration-500 ${currentTheme.bg} ${currentTheme.border} shadow-lg shadow-black/30 overflow-hidden`}>
             {platform === 'google' && (
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                    <div className="w-1/4 bg-[#4285F4]"></div>
                    <div className="w-1/4 bg-[#DB4437]"></div>
                    <div className="w-1/4 bg-[#F4B400]"></div>
                    <div className="w-1/4 bg-[#0F9D58]"></div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                 <div className="flex items-center gap-3">
                    <ChartIcon className={`w-6 h-6 ${currentTheme.accent}`} />
                    <h2 className={`text-xl font-semibold ${currentTheme.text}`}>Dashboard de Anúncios</h2>
                </div>
                <div className="flex items-center gap-2">
                     <select value={platform} onChange={e => setPlatform(e.target.value as any)} className={`${currentTheme.selectBg} border border-white/30 ${currentTheme.text} text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-2`}>
                        <option value="all">Todas as Plataformas</option>
                        <option value="google">Google Ads</option>
                        <option value="meta">Meta Ads</option>
                    </select>
                     <select value={period} onChange={e => setPeriod(Number(e.target.value) as any)} className={`${currentTheme.selectBg} border border-white/30 ${currentTheme.text} text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-2`}>
                        <option value={7}>Últimos 7 dias</option>
                        <option value={14}>Últimos 14 dias</option>
                        <option value={30}>Últimos 30 dias</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <MetricDisplay 
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        textColor={currentTheme.text}
                        className={platform === 'google'
                            ? `p-4 rounded-lg bg-white border-l-4 shadow-sm ${googleColors[index]}`
                            : "bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                        }
                    />
                ))}
            </div>
            
            <div className="mt-6 p-8 bg-black/20 rounded-lg text-center h-48 flex flex-col items-center justify-center">
                 <p className={`${currentTheme.text} opacity-70`}>Visualização de gráfico virá aqui.</p>
                 <p className={`text-xs ${currentTheme.text} opacity-50 mt-1`}>Implementar um componente de gráfico para renderizar os dados de `filteredData`.</p>
            </div>
        </div>
    );
};

export default AdsDashboardWidget;