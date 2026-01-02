
import React, { useMemo, useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    CartesianGrid, PieChart, Pie, Cell, Sector, ComposedChart, Scatter
} from 'recharts';

// --- 1. MAIN FLOW TREND CHART ---
interface FlowChartProps {
    data: { label: string; revenue: number; expense: number }[];
}

const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0A0A0B]/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/5 scale-90">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 border-b border-white/5 pb-2">Data: {label}</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                            <span className="text-[10px] font-bold text-white/70 uppercase">Entrou (Receita)</span>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-400">R$ {payload[0].value.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                            <span className="text-[10px] font-bold text-white/70 uppercase">Saiu (Despesa)</span>
                        </div>
                        <span className="text-xs font-mono font-black text-rose-400">R$ {payload[1].value.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const FinanceTrendChart: React.FC<FlowChartProps> = ({ data }) => {
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
                    <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} dy={10} interval="preserveStartEnd" />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={<TrendTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#gradIn)" animationDuration={2000} activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fill="url(#gradOut)" animationDuration={2000} activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- 2. STRATEGIC ANALYTICS PANEL (Science Donut Refactor) ---

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
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="text-xs font-black uppercase tracking-widest opacity-40">
                {payload.name}
            </text>
            <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#fff" className="text-xl font-black tabular-nums">
                {Math.round(percent * 100)}%
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 12} outerRadius={outerRadius + 15} fill={fill} />
        </g>
    );
};

// Map of segmented attributes for the "Deep Dive"
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

export const StrategicAnalyticsPanel: React.FC<FinanceAnalyticsPanelProps> = ({ metrics, categoryData, budgetRange }) => {
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
            
            {/* Sidebar de Seleção de Grupos */}
            <div className="w-full lg:w-72 flex flex-col gap-3 flex-shrink-0">
                <header className="mb-4">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Divisão por Grupos</h4>
                    <button 
                        onClick={() => setFocusedCategoryId(null)}
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${!focusedCategoryId ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
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
                                    ? 'bg-white/10 border-white/20 shadow-2xl' 
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'}
                            `}
                        >
                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <span className={`text-[11px] font-black uppercase tracking-tight ${focusedCategoryId === cat.id ? 'text-white' : 'text-white/60'}`}>{cat.name}</span>
                                <span className="font-mono text-[10px] text-white/40">{cat.percentage}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                                <div className={`h-full transition-all duration-1000 ${focusedCategoryId === cat.id ? 'bg-white' : 'bg-white/20'}`} style={{ width: `${cat.percentage}%` }} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-8 border-t border-white/5 hidden lg:block">
                    <p className="text-[8px] font-mono text-white/20 leading-relaxed uppercase tracking-widest">
                        Status do Sistema: Estável<br/>
                        Núcleo: Processamento Central<br/>
                        Alocação: Otimizada
                    </p>
                </div>
            </div>

            {/* NEURAL ORBITAL DONUT (Main Science Visual) */}
            <div className="flex-1 w-full h-[500px] lg:h-[600px] flex items-center justify-center bg-black/30 rounded-[3rem] border border-white/5 relative group overflow-hidden shadow-2xl">
                
                {/* Background "Science" Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white opacity-[0.03] rounded-full animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-white opacity-[0.05] rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60"></div>
                    
                    {/* Corner HUD Data */}
                    <div className="absolute top-10 left-10 opacity-30">
                        <div className="flex flex-col gap-1">
                            <div className="w-8 h-0.5 bg-rose-500"></div>
                            <span className="text-[8px] font-mono text-white tracking-[0.2em]">ANÁLISE_PROFUNDA_V2</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 flex flex-col items-center gap-1 z-20">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Onde seu dinheiro está indo</span>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                        {focusedCategoryId ? `Detalhes do Grupo: ${activeCategory?.name}` : 'Saúde Operacional Geral'}
                    </h3>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '11px', color: '#fff', fontWeight: '900' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Central Focus HUD */}
                <div className="absolute bottom-12 flex flex-col items-center gap-4 z-20">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Total no Período</span>
                        <p className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
                            {formatCurrency(focusedCategoryId ? activeCategory?.amount || 0 : categoryData.reduce((acc, c) => acc + c.amount, 0))}
                        </p>
                    </div>
                    {focusedCategoryId && (
                        <button 
                            onClick={() => setFocusedCategoryId(null)}
                            className="group/back flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-rose-500 rounded-full border border-white/10 transition-all"
                        >
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Voltar à Visão Geral</span>
                        </button>
                    )}
                </div>

                <div className="absolute bottom-10 right-10 flex flex-col items-end opacity-20 pointer-events-none">
                    <p className="text-[8px] font-mono text-white text-right leading-relaxed">
                        LATÊNCIA: 4.2ms<br/>
                        CARGA REATIVA: ATIVA<br/>
                        CAMADA_NEURAL_ALITA_7
                    </p>
                </div>
            </div>
        </div>
    );
};

// Compatibility export
export const FinanceRadarChart: React.FC<any> = ({ metrics, categoryData, budgetRange }) => (
    <StrategicAnalyticsPanel metrics={metrics} categoryData={categoryData} budgetRange={budgetRange} />
);
