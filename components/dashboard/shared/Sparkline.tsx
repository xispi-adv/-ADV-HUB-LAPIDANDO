import React from 'react';

interface SparklineProps {
    data: number[];
    positiveIsGood: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, positiveIsGood }) => {
    if (!data || data.length < 2) {
        return <div className="w-24 h-8" />; // Return empty div if not enough data
    }

    const width = 100, height = 30;
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * (height - 4) + 2}`).join(' ');
    
    const isPositiveTrend = data[data.length - 1] > data[0];
    const colorClass = (isPositiveTrend && positiveIsGood) || (!isPositiveTrend && !positiveIsGood) ? 'text-green-500' : 'text-red-500';

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-24 h-8">
            <polyline 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                points={points} 
                className={colorClass} 
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Sparkline;
