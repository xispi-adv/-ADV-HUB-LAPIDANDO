import React from 'react';

const MOCK_METRICS = {
    cost: { value: 1250.75, change: -0.05, trend: [100, 120, 110, 130, 125, 140, 125] },
    clicks: { value: 2840, change: 0.12, trend: [200, 220, 250, 240, 280, 270, 284] },
    impressions: { value: 180500, change: 0.08, trend: [15000, 16000, 15500, 17000, 18000, 17500, 18050] },
    ctr: { value: 1.57, change: 0.04, goal: 2.0, trend: [1.2, 1.3, 1.4, 1.35, 1.5, 1.45, 1.57] }
};

// --- Icons ---
const ArrowUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.22 9.64a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg>
);
const ArrowDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.97-4.018a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.97 4.018V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg>
);
const ChartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
);

// --- Child Components ---
const Sparkline: React.FC<{ data: number[], positiveIsGood: boolean }> = ({ data, positiveIsGood }) => {
    const width = 100, height = 30;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * height}`).join(' ');
    const isPositive = data[data.length - 1] > data[0];
    const colorClass = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood) ? 'text-green-500' : 'text-red-500';

    return <svg viewBox={`0 0 ${width} ${height}`} className="w-24 h-8"><polyline fill="none" stroke="currentColor" strokeWidth="2" points={points} className={colorClass} /></svg>;
};

const RadialProgress: React.FC<{ progress: number }> = ({ progress }) => {
    const stroke = 5, radius = 35, normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = progress < 40 ? 'text-red-500' : progress < 80 ? 'text-yellow-500' : 'text-green-500';

    return (
        <div className="relative w-[70px] h-[70px]">
            <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <circle stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
                <circle stroke="currentColor" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset }} strokeLinecap="round" fill="transparent" r={normalizedRadius} cx={radius} cy={radius} className={`transition-all duration-500 ${color}`} />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${color}`}>{Math.round(progress)}%</span>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; change: number; trend: number[]; positiveIsGood?: boolean; }> = ({ title, value, change, trend, positiveIsGood = true }) => {
    const isPositive = change >= 0;
    const changeColor = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood) ? 'text-green-400' : 'text-red-400';

    return (
        <div className="bg-black/40 p-4 rounded-lg flex flex-col justify-between">
            <p className="text-sm text-white/70">{title}</p>
            <div className="flex justify-between items-end mt-2">
                <div>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
                        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <span>{(Math.abs(change) * 100).toFixed(1)}%</span>
                    </div>
                </div>
                <Sparkline data={trend} positiveIsGood={positiveIsGood} />
            </div>
        </div>
    );
};

// --- Main Component ---
const GrowthMetricsPanel: React.FC = () => {
    const formatCurrency = (value: number) => `R$${(value / 1000).toFixed(1)}k`;
    const formatNumber = (value: number) => (value / 1000).toFixed(1) + 'k';
    const ctrProgress = (MOCK_METRICS.ctr.value / MOCK_METRICS.ctr.goal) * 100;

    return (
        <div className="p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <ChartIcon className="text-red-500"/>
                <h2 className="text-xl font-semibold text-white">Métricas de Crescimento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard title="Custo Total" value={formatCurrency(MOCK_METRICS.cost.value)} change={MOCK_METRICS.cost.change} trend={MOCK_METRICS.cost.trend} positiveIsGood={false} />
                <MetricCard title="Cliques" value={formatNumber(MOCK_METRICS.clicks.value)} change={MOCK_METRICS.clicks.change} trend={MOCK_METRICS.clicks.trend} />
                
                {/* CTR Card with Radial Progress */}
                <div className="bg-black/40 p-4 rounded-lg flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start">
                         <div>
                            <p className="text-sm text-white/70">CTR / Meta</p>
                             <p className="text-3xl font-bold text-white tracking-tight">{`${MOCK_METRICS.ctr.value.toFixed(2)}%`}</p>
                             <p className="text-sm text-white/60">Meta: {MOCK_METRICS.ctr.goal.toFixed(2)}%</p>
                         </div>
                         <RadialProgress progress={ctrProgress} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthMetricsPanel;