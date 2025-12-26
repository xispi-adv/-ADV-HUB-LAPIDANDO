
import React from 'react';
import WidgetCard from './shared/WidgetCard';
import Sparkline from './shared/Sparkline';
import RadialProgress from './shared/RadialProgress';

const ArrowUpIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.22 9.64a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" /></svg> );
const ArrowDownIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.97-4.018a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.97 4.018V3.75A.75.75 0 0110 3z" clipRule="evenodd" /></svg> );
const OptionsIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> );

interface MetricWidgetProps {
    title: string;
    value: string;
    change: number;
    period: string;
    type: 'sparkline' | 'radial';
    trendData?: number[];
    progress?: number;
    positiveIsGood?: boolean;
}

const MetricWidget: React.FC<MetricWidgetProps> = ({ title, value, change, period, type, trendData = [], progress = 0, positiveIsGood = true }) => {
    const isPositive = change >= 0;
    const changeColor = (isPositive && positiveIsGood) || (!isPositive && !positiveIsGood) ? 'text-green-500' : 'text-red-500';
    
    return (
        <WidgetCard>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-[var(--text-primary)] opacity-90">{title}</h3>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><OptionsIcon /></button>
            </div>
            <div className="flex-grow flex justify-between items-end">
                <div>
                    <p className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
                    <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
                        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <span>{(Math.abs(change) * 100).toFixed(0)}% {period}</span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    {type === 'sparkline' && <Sparkline data={trendData} positiveIsGood={positiveIsGood} />}
                    {type === 'radial' && <RadialProgress progress={progress} />}
                </div>
            </div>
        </WidgetCard>
    );
};

export default MetricWidget;
