import React from 'react';

interface RadialProgressProps {
    progress: number;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ progress }) => {
    const stroke = 4, radius = 28, normalizedRadius = radius - stroke;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = progress < 40 ? 'text-red-500' : progress < 80 ? 'text-yellow-500' : 'text-green-500';

    return (
        <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
            <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <circle stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
                <circle 
                    stroke="currentColor" 
                    strokeWidth={stroke} 
                    strokeDasharray={`${circumference} ${circumference}`} 
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }} 
                    strokeLinecap="round" 
                    fill="transparent" 
                    r={normalizedRadius} 
                    cx={radius} 
                    cy={radius} 
                    className={color} 
                />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${color}`}>
                {`${Math.round(progress)}%`}
            </span>
        </div>
    );
};

export default RadialProgress;
