
import React, { useMemo, useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, PieChart, Pie, Cell, Sector
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

// --- 1. MAIN FLOW TREND CHART ---
interface FlowChartProps {
    data: { label: string; revenue: number; expense: number }[];
    forceTheme?: 'light' | 'dark';
}

const TrendTooltip = ({ active, payload, label, theme }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={`border p-4 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/5 scale-90 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0A0A0B]/90 border-white/10'}`}>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-3 border-b pb-2 ${theme === 'light' ? 'text-slate-400 border-slate-100' : 'text-white/40 border-white/5'}`}>Data: {label}</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                            <span className={`text-[10px] font-bold uppercase ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>Entrou (Receita)</span>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-400">R$ {payload[0].value.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                            <span className={`text-[10px] font-bold uppercase ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>Saiu (Despesa)</span>
                        </div>
                        <span className="text-xs font-mono font-black text-rose-400">R$ {payload[1].value.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const FinanceTrendChart: React.FC<FlowChartProps> = ({ data, forceTheme }) => {
    const { theme: globalTheme } = useTheme();
    const theme = forceTheme || globalTheme;
    
    if (!data || data.length < 2) return null;
    return (
        <div className="w-full h-full group/chart">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} vertical={false} />
                    <XAxis dataKey="label" stroke={theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)'} fontSize={9} tickLine={false} axisLine={false} dy={10} interval="preserveStartEnd" />
                    <YAxis stroke={theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)'} fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={<TrendTooltip theme={theme} />} cursor={{ stroke: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#gradIn)" animationDuration={2000} activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fill="url(#gradOut)" animationDuration={2000} activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- 2. STRATEGIC ANALYTICS PANEL ---

interface CategoryMetric {
    id: string;
    name: string;
    amount: number;
    percentage: number;
}

interface FinanceAnalyticsPanelProps {
    metrics: any;
    categoryData: CategoryMetric[];
    budgetRange: [number, number];
    forceTheme?: 'light' | 'dark';
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const renderActiveShape = (props: any, theme: string) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    const textColor = theme === 'light' ? '#0f172a' : '#fff';
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={textColor} className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {payload.name}
            </text>
            <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill={textColor} className="text-2xl font-black tabular-nums">
                {Math.round(percent * 100)}%
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 12} outerRadius={outerRadius + 15} fill={fill} />
        </g>
    );
};

const SEGMENT_ATTRIBUTES: Record<string, {name: string, value: number}[]> = {
    'SOFTWARE & SAAS': [
        { name: 'Nuvem e Servidores', value: 45 },
        { name: 'Sistemas e APIs', value: 20 },
        { name: 'Ferramentas de Trabalho', value: 25 },
        { name: 'Segurança Digital', value: 10 }
    ],
    'PESSOAL / FREELANCERS': [
        { name: 'Salários Equipe', value: 65 },
        { name: 'Impostos e Encargos', value: 15 },
        { name: 'Freelancers', value: 15 },
        { name: 'Benefícios', value: 5 }
    ],
    'INFRAESTRUTURA': [
        { name: 'Aluguel e Escritório', value: 50 },
        { name: 'Logística e Fretes', value: 25 },
        { name: 'Manutenção Geral', value: 15 },
        { name: 'Equipamentos e Hardware', value: 10 }
    ]
};

export const StrategicAnalyticsPanel: React.FC<FinanceAnalyticsPanelProps> = ({ metrics, categoryData, budgetRange, forceTheme }) => {
    const { theme: globalTheme } = useTheme();
    const theme = forceTheme || globalTheme;
    const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const activeCategory = useMemo(() => 
        categoryData.find(c => c.id === focusedCategoryId),
    [focusedCategoryId, categoryData]);

    const displayData = useMemo(() => {
        if (!focusedCategoryId) {
            return categoryData.map(c => ({ name: c.name, value: c.amount }));
        }
        const attrs = SEGMENT_ATTRIBUTES[activeCategory?.name || ''] || [{ name: 'Outros Itens', value: 100 }];
        return attrs.map(a => ({ name: a.name.toUpperCase(), value: a.value }));
    }, [categoryData, focusedCategoryId, activeCategory]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-stretch py-8">
            <div className="w-full lg:w-72 flex flex-col gap-3 flex-shrink-0">
                <header className="mb-4">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>Divisão por Grupos</h4>
                    <button 
                        onClick={() => setFocusedCategoryId(null)}
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${!focusedCategoryId ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                        Ver Tudo
                    </button>
                </header>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {categoryData.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFocusedCategoryId(focusedCategoryId === cat.id ? null : cat.id)}
                            className={`
                                w-full text-left p-5 rounded-[1.8rem] border transition-all duration-500 group relative overflow-hidden
                                ${focusedCategoryId === cat.id 
                                    ? (theme === 'light' ? 'bg-slate-100 border-blue-500/30 shadow-md' : 'bg-white/10 border-white/20 shadow-2xl') 
                                    : (theme === 'light' ? 'bg-slate-50 border-slate-200 hover:border-blue-500/20 hover:bg-white' : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]')}
                            `}
                        >
                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <span className={`text-[11px] font-black uppercase tracking-tight ${focusedCategoryId === cat.id ? (theme === 'light' ? 'text-blue-600' : 'text-white') : (theme === 'light' ? 'text-slate-600' : 'text-white/60')}`}>{cat.name}</span>
                                <span className={`font-mono text-[10px] ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>{cat.percentage}%</span>
                            </div>
                            <div className={`w-full h-1 rounded-full overflow-hidden relative z-10 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/5'}`}>
                                <div className={`h-full transition-all duration-1000 ${focusedCategoryId === cat.id ? (theme === 'light' ? 'bg-blue-600' : 'bg-white') : (theme === 'light' ? 'bg-slate-400' : 'bg-white/20')}`} style={{ width: `${cat.percentage}%` }} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex-1 w-full h-[500px] lg:h-[600px] flex items-center justify-center rounded-[3rem] border relative group overflow-hidden shadow-2xl transition-all duration-500 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border opacity-[0.03] rounded-full animate-[spin_60s_linear_infinite] ${theme === 'light' ? 'border-slate-900' : 'border-white'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border opacity-[0.05] rounded-full animate-[spin_40s_linear_infinite_reverse] ${theme === 'light' ? 'border-slate-900' : 'border-white'}`}></div>
                </div>

                <div className="absolute top-10 flex flex-col items-center gap-1 z-20">
                    <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${theme === 'light' ? 'text-slate-400' : 'text-white/20'}`}>Onde seu dinheiro está indo</span>
                    <h3 className={`text-lg font-black uppercase tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {focusedCategoryId ? `Detalhes: ${activeCategory?.name}` : 'Saúde Operacional Geral'}
                    </h3>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={(props) => renderActiveShape(props, theme)}
                            data={displayData}
                            cx="50%"
                            cy="50%"
                            innerRadius={110}
                            outerRadius={150}
                            paddingAngle={5}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {displayData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={theme === 'light' ? '#fff' : 'rgba(0,0,0,0.5)'} strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#000', border: theme === 'light' ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '11px', color: theme === 'light' ? '#1e293b' : '#fff', fontWeight: '900' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute bottom-12 flex flex-col items-center gap-4 z-20">
                    <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>Total no Período</span>
                        <p className={`text-3xl font-black tracking-tighter drop-shadow-2xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {formatCurrency(focusedCategoryId ? activeCategory?.amount || 0 : categoryData.reduce((acc, c) => acc + c.amount, 0))}
                        </p>
                    </div>
                    {focusedCategoryId && (
                        <button 
                            onClick={() => setFocusedCategoryId(null)}
                            className={`group/back flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600' : 'bg-white/5 border-white/10 hover:bg-rose-500 text-white'}`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest">Voltar à Visão Geral</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const FinanceRadarChart: React.FC<any> = ({ metrics, categoryData, budgetRange, forceTheme }) => (
    <StrategicAnalyticsPanel metrics={metrics} categoryData={categoryData} budgetRange={budgetRange} forceTheme={forceTheme} />
);
