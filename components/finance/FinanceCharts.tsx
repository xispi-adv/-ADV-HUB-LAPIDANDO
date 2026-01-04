
import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, PieChart, Pie, Cell, Sector
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface FlowChartProps {
    data: { label: string; revenue: number; expense: number }[];
    forceTheme?: 'light' | 'dark';
}

const CustomTooltip = ({ active, payload, label, theme }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-fade-in ${theme === 'light' ? 'bg-white/90 border-slate-200 shadow-slate-200' : 'bg-black/80 border-white/10 shadow-black'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">{label}</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                            <span className="text-xs font-bold uppercase tracking-tight">Receitas</span>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-500">R$ {payload[0]?.value?.toLocaleString('pt-BR') || 0}</span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"></div>
                            <span className="text-xs font-bold uppercase tracking-tight">Despesas</span>
                        </div>
                        <span className="text-xs font-mono font-black text-rose-500">R$ {payload[1]?.value?.toLocaleString('pt-BR') || 0}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const FinanceTrendChart = React.memo(({ data = [], forceTheme }: FlowChartProps) => {
    const { theme: globalTheme } = useTheme();
    const theme = forceTheme || globalTheme;
    
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} vertical={false} />
                    <XAxis dataKey="label" stroke={theme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)'} fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke={theme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)'} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ stroke: theme === 'light' ? '#6366f1' : '#ef4444', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
});

interface CategoryDataPoint {
    name: string;
    value: number;
    amount: number;
}

interface CategoryDistributionChartProps {
    data: CategoryDataPoint[];
    mode: 'receita' | 'despesa';
    total: number;
    forceTheme?: 'light' | 'dark';
}

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: `drop-shadow(0 0 12px ${fill}44)` }}
            />
        </g>
    );
};

export const CategoryScientificChart = React.memo(({ data = [], mode, total, forceTheme }: CategoryDistributionChartProps) => {
    const { theme: globalTheme } = useTheme();
    const theme = forceTheme || globalTheme;
    const [activeIndex, setActiveIndex] = React.useState(0);

    const onPieEnter = (_: any, index: number) => setActiveIndex(index);

    const COLORS = mode === 'receita' 
        ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669'] 
        : ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48'];

    if (!data || data.length === 0) return (
        <div className="h-full flex items-center justify-center opacity-20">
            <p className="text-xs font-black uppercase tracking-widest">Aguardando telemetria...</p>
        </div>
    );

    return (
        <div className="w-full h-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">Total</p>
                <p className={`text-2xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(total || 0)}
                </p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="85%"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        paddingAngle={4}
                        stroke="none"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        content={({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="p-4 bg-black/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
                                        <p className="text-xs font-black text-white uppercase mb-1 tracking-widest">{d.name}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-emerald-400">R$ {d.amount?.toLocaleString('pt-BR') || 0}</span>
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/10 text-white/60">{d.value?.toFixed(1) || 0}%</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
});

export const FinanceRadarChart = CategoryScientificChart;
export const FinanceTrendChartLegacy = FinanceTrendChart;
