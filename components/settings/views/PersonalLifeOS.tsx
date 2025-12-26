
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- Icons (using raw SVG for consistency) ---
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;

// --- Types ---
type MetricType = 'number' | 'boolean';

interface Metric {
    id: string;
    label: string;
    type: MetricType;
    data: (number | boolean)[]; // 7 days (0 = Mon, 6 = Sun)
}

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// --- Mock Initial Data ---
const INITIAL_METRICS: Metric[] = [
    { id: '1', label: 'Horas de Foco', type: 'number', data: [4, 6, 8, 5, 7, 2, 0] },
    { id: '2', label: 'Flexões (reps)', type: 'number', data: [20, 25, 0, 30, 25, 0, 40] },
    { id: '3', label: 'Leitura (páginas)', type: 'number', data: [10, 15, 10, 0, 20, 30, 50] },
    { id: '4', label: 'Arrumar Cama', type: 'boolean', data: [true, true, true, false, true, true, true] },
    { id: '5', label: 'Sem Açúcar', type: 'boolean', data: [true, false, true, true, true, false, false] },
];

const PersonalLifeOS: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
    const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
    const [weekOffset, setWeekOffset] = useState(0);

    const handleValueChange = (metricId: string, dayIndex: number, value: string | boolean) => {
        setMetrics(prev => prev.map(m => {
            if (m.id === metricId) {
                const newData = [...m.data];
                newData[dayIndex] = m.type === 'number' ? Number(value) : Boolean(value);
                return { ...m, data: newData };
            }
            return m;
        }));
    };

    const handleAddMetric = () => {
        const newMetric: Metric = {
            id: `new-${Date.now()}`,
            label: 'Nova Métrica',
            type: 'number',
            data: [0, 0, 0, 0, 0, 0, 0]
        };
        setMetrics([...metrics, newMetric]);
    };

    // --- Chart Data Preparation ---
    const chartData = useMemo(() => {
        return DAYS_OF_WEEK.map((day, index) => {
            if (selectedMetricId) {
                // Show specific metric data
                const metric = metrics.find(m => m.id === selectedMetricId);
                const rawValue = metric?.data[index];
                const value = typeof rawValue === 'boolean' ? (rawValue ? 1 : 0) : Number(rawValue || 0);
                return { name: day, value };
            } else {
                // Show Consistency Score (Average of all "done" items)
                // For numbers: > 0 counts as "done". For boolean: true is "done".
                const totalItems = metrics.length;
                if (totalItems === 0) return { name: day, value: 0 };

                const completedCount = metrics.filter(m => {
                    const val = m.data[index];
                    return typeof val === 'number' ? val > 0 : val === true;
                }).length;

                const score = Math.round((completedCount / totalItems) * 100);
                return { name: day, value: score };
            }
        });
    }, [metrics, selectedMetricId]);

    // Trend Logic for Color
    const isPositiveTrend = chartData[chartData.length - 1].value >= chartData[0].value;
    const chartColor = isPositiveTrend ? '#10b981' : '#f43f5e'; // Emerald vs Rose
    const selectedMetricLabel = selectedMetricId ? metrics.find(m => m.id === selectedMetricId)?.label : 'Consistência Geral';

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-light text-[var(--text-primary)] flex items-center gap-3">
                        <TrendingUpIcon />
                        Life OS <span className="text-[var(--accent-color)] font-bold">.Beta</span>
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-2 max-w-lg">
                        Monitore sua disciplina e hábitos de alta performance fora do trabalho.
                        "O que não é medido, não é gerenciado."
                    </p>
                </div>
                
                <div className="flex items-center gap-4 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
                    <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 hover:bg-[var(--bg-elevation-1)] rounded-lg text-[var(--text-secondary)] transition-colors">
                        <ChevronLeftIcon />
                    </button>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] w-24 text-center">
                        {weekOffset === 0 ? 'Esta Semana' : `Semana ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
                    </span>
                    <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 hover:bg-[var(--bg-elevation-1)] rounded-lg text-[var(--text-secondary)] transition-colors">
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 relative overflow-hidden h-80 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Visualização</h3>
                        <p className={`text-2xl font-bold ${selectedMetricId ? 'text-[var(--text-primary)]' : 'text-[var(--accent-color)]'}`}>
                            {selectedMetricLabel}
                        </p>
                    </div>
                    {selectedMetricId && (
                        <button 
                            onClick={() => setSelectedMetricId(null)}
                            className="text-xs bg-[var(--bg-elevation-1)] px-3 py-1.5 rounded-full border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors"
                        >
                            Voltar para Visão Geral
                        </button>
                    )}
                </div>

                <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="var(--text-muted)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                            />
                            <YAxis 
                                stroke="var(--text-muted)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                dx={-10}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--bg-elevation-2)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                itemStyle={{ color: chartColor }}
                                cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={chartColor} 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-elevation-1)]">
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider w-48">Métrica</th>
                                {DAYS_OF_WEEK.map(day => (
                                    <th key={day} className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-center w-20">{day}</th>
                                ))}
                                <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase text-right w-24">Total/Avg</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {metrics.map((metric) => {
                                const isSelected = selectedMetricId === metric.id;
                                const rowTotal = metric.type === 'number' 
                                    ? (metric.data as number[]).reduce((a, b) => a + b, 0)
                                    : (metric.data as boolean[]).filter(Boolean).length;

                                return (
                                    <tr 
                                        key={metric.id} 
                                        onClick={() => setSelectedMetricId(metric.id)}
                                        className={`
                                            group transition-all duration-200 cursor-pointer
                                            ${isSelected ? 'bg-[var(--accent-color)]/5' : 'hover:bg-[var(--bg-elevation-1)]'}
                                        `}
                                    >
                                        <td className="p-4">
                                            <input 
                                                type="text" 
                                                value={metric.label}
                                                onChange={(e) => {
                                                    const newLabel = e.target.value;
                                                    setMetrics(prev => prev.map(m => m.id === metric.id ? { ...m, label: newLabel } : m));
                                                }}
                                                className="bg-transparent border-b border-transparent focus:border-[var(--accent-color)] outline-none text-sm font-medium text-[var(--text-primary)] w-full transition-colors"
                                            />
                                        </td>
                                        {metric.data.map((val, dayIndex) => (
                                            <td key={dayIndex} className="p-2 text-center">
                                                {metric.type === 'number' ? (
                                                    <input 
                                                        type="number"
                                                        value={val as number}
                                                        onChange={(e) => handleValueChange(metric.id, dayIndex, e.target.value)}
                                                        className="w-12 bg-transparent text-center text-sm text-[var(--text-primary)] focus:bg-[var(--bg-elevation-2)] rounded focus:ring-1 focus:ring-[var(--accent-color)] outline-none appearance-none"
                                                    />
                                                ) : (
                                                    <input 
                                                        type="checkbox"
                                                        checked={val as boolean}
                                                        onChange={(e) => handleValueChange(metric.id, dayIndex, e.target.checked)}
                                                        className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--bg-elevation-2)] text-[var(--accent-color)] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[var(--accent-color)]"
                                                    />
                                                )}
                                            </td>
                                        ))}
                                        <td className="p-4 text-right">
                                            <span className="text-sm font-bold text-[var(--text-secondary)] font-mono">
                                                {rowTotal}
                                                {metric.type === 'boolean' && <span className="text-[10px] text-[var(--text-muted)] ml-1">/ 7</span>}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Add Metric Button */}
                <button 
                    onClick={handleAddMetric}
                    className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-1)] transition-all border-t border-[var(--border-color)]"
                >
                    <PlusIcon /> Adicionar Nova Métrica
                </button>
            </div>
        </div>
    );
};

export default PersonalLifeOS;
