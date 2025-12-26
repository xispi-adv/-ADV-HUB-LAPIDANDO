
import React from 'react';

// --- AREA CHART (Saldo) ---

interface AreaChartProps {
    data: number[];
    labels: string[];
    height?: number;
    color?: string;
}

export const FinanceAreaChart: React.FC<AreaChartProps> = ({ data, labels, height = 200, color = '#3b82f6' }) => {
    const padding = 20;
    const width = 600; // Internal viewBox width
    
    if (data.length < 2) return <div className="h-full flex items-center justify-center text-white/30">Dados insuficientes</div>;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Calculate points
    const points = data.map((val, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    // Area path (closes the loop at the bottom)
    const areaPath = `${points} ${width - padding},${height} ${padding},${height}`;

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-[var(--border-color)]" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-[var(--border-color)] opacity-30" strokeWidth="1" strokeDasharray="4 4" />

                {/* The Area Fill */}
                <polygon points={areaPath} fill="url(#chartGradient)" />
                
                {/* The Line */}
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />

                {/* Points */}
                {data.map((val, index) => {
                     const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
                     const y = height - padding - ((val - min) / range) * (height - padding * 2);
                     return (
                         <circle 
                            key={index} 
                            cx={x} 
                            cy={y} 
                            r="4" 
                            fill="var(--bg-card)" 
                            stroke={color} 
                            strokeWidth="2"
                            className="hover:r-6 transition-all cursor-pointer"
                         >
                             <title>R$ {val.toFixed(2)}</title>
                         </circle>
                     )
                })}
            </svg>
            {/* Labels (simplified) */}
            <div className="flex justify-between px-2 mt-2 text-xs text-[var(--text-muted)] font-mono">
                <span>{labels[0]}</span>
                <span>{labels[Math.floor(labels.length / 2)]}</span>
                <span>{labels[labels.length - 1]}</span>
            </div>
        </div>
    );
};

// --- DONUT CHART (Despesas) ---

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
    size?: number;
}

export const FinanceDonutChart: React.FC<DonutChartProps> = ({ data, size = 160 }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;
    const radius = size / 2;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <div className="flex items-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                    {data.map((item, index) => {
                        const percentage = total === 0 ? 0 : item.value / total;
                        const dashArray = percentage * circumference;
                        const offset = circumference - dashArray;
                        const rotateAngle = (currentAngle / total) * 360;
                        
                        currentAngle += item.value;

                        return (
                            <circle
                                key={index}
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                                strokeDashoffset={0} // We rotate the circle container instead
                                transform={`rotate(${(rotateAngle)} ${radius} ${radius})`}
                                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                            >
                                <title>{item.label}: {((item.value/total)*100).toFixed(1)}%</title>
                            </circle>
                        );
                    })}
                     {/* Center Text */}
                     <foreignObject x="0" y="0" width={size} height={size}>
                        <div className="w-full h-full flex flex-col items-center justify-center text-center rotate-90">
                            <span className="text-xs text-[var(--text-muted)]">Total</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">
                                {total > 1000 ? `${(total/1000).toFixed(1)}k` : total}
                            </span>
                        </div>
                    </foreignObject>
                </svg>
            </div>
            
            {/* Legend */}
            <div className="flex flex-col gap-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-[var(--text-secondary)] font-medium">{item.label}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">{(item.value/total * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
