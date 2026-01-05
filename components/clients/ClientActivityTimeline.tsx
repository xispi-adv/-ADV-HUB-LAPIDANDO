
import React, { useState, useMemo } from 'react';
import type { Client, ClientActivity, ActivityType } from '../../types';
import { useClients } from '../../context/ClientContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
    Search, Calendar, Phone, AlertTriangle, FileText, 
    XCircle, Filter, Download, Plus, ChevronDown, 
    CheckCircle2, MoreVertical, Pin, Clock
} from 'lucide-react';
import ActivityDrawer from './ActivityDrawer';

const MOCK_ACTIVITIES: ClientActivity[] = [
    {
        id: 'act-1',
        clientId: 'cli-1',
        authorId: 'user-1',
        authorName: 'Carlos Teles',
        type: 'MEETING',
        title: 'Alinhamento Estratégico Q4',
        description: 'Reunião via Google Meet para definir as metas de performance para o último trimestre do ano. Cliente solicitou foco total em ROI para o produto Ultravioleta.',
        dateOccurred: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        createdAt: new Date().toISOString(),
        isPinned: true
    },
    {
        id: 'act-2',
        clientId: 'cli-1',
        authorId: 'user-2',
        authorName: 'Ana Silva',
        type: 'COMPLAINT',
        title: 'Atraso em Criativos de Campanha',
        description: 'Cliente reportou insatisfação com a demora na entrega dos banners para a campanha de Cashback. Incidente escalado para o time de design.',
        dateOccurred: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: 'act-3',
        clientId: 'cli-1',
        authorId: 'user-1',
        authorName: 'Carlos Teles',
        type: 'CALL',
        title: 'Feedback Mensal de Operação',
        description: 'Chamada de 15 minutos. Cliente está satisfeito com os resultados orgânicos, mas quer revisar a verba de TikTok Ads.',
        dateOccurred: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: 'act-4',
        clientId: 'cli-1',
        authorId: 'user-3',
        authorName: 'Robô Alita',
        type: 'INCIDENT',
        title: 'Erro de Tracking detectado',
        description: 'Detector automático identificou queda brusca de eventos de conversão no site principal. Provável erro no GTM.',
        dateOccurred: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        createdAt: new Date().toISOString(),
    },
    {
        id: 'act-5',
        clientId: 'cli-1',
        authorId: 'user-1',
        authorName: 'Carlos Teles',
        type: 'NOTE',
        title: 'Insight de Público-Alvo',
        description: 'Observado aumento de interesse no segmento de alta renda para investimentos em cripto. Considerar nova segmentação para a próxima sprint.',
        dateOccurred: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        createdAt: new Date().toISOString(),
    }
];

const TYPE_CONFIG = {
    MEETING: { 
        label: 'Reunião', 
        icon: Calendar, 
        color: 'text-blue-500', 
        bg: 'bg-blue-600', 
        border: 'border-blue-500/30', 
        glass: 'bg-blue-500/5' 
    },
    CALL: { 
        label: 'Chamado', 
        icon: Phone, 
        color: 'text-emerald-500', 
        bg: 'bg-emerald-600', 
        border: 'border-emerald-500/30', 
        glass: 'bg-emerald-500/5' 
    },
    COMPLAINT: { 
        label: 'Reclamação', 
        icon: AlertTriangle, 
        color: 'text-orange-500', 
        bg: 'bg-orange-600', 
        border: 'border-orange-500/40', 
        glass: 'bg-orange-500/10' 
    },
    NOTE: { 
        label: 'Pontuamento', 
        icon: FileText, 
        color: 'text-slate-400', 
        bg: 'bg-slate-600', 
        border: 'border-slate-500/20', 
        glass: 'bg-slate-500/5' 
    },
    INCIDENT: { 
        label: 'Incidente', 
        icon: XCircle, 
        color: 'text-rose-500', 
        bg: 'bg-rose-600', 
        border: 'border-rose-500/50', 
        glass: 'bg-rose-500/10' 
    },
};

const ClientActivityTimeline: React.FC<{ client: Client }> = ({ client }) => {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTypes, setFilterTypes] = useState<ActivityType[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const filteredActivities = useMemo(() => {
        return MOCK_ACTIVITIES.filter(act => {
            const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                act.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterTypes.length === 0 || filterTypes.includes(act.type);
            return matchesSearch && matchesType;
        }).sort((a, b) => new Date(b.dateOccurred).getTime() - new Date(a.dateOccurred).getTime());
    }, [searchQuery, filterTypes]);

    const toggleFilter = (type: ActivityType) => {
        setFilterTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* TOOLBAR */}
            <div className={`
                sticky top-0 z-20 flex flex-col md:flex-row gap-4 p-5 border-b mb-12 backdrop-blur-md rounded-2xl shadow-sm
                ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-[#0F1014]/80 border-white/5'}
            `}>
                <div className="relative flex-1 group">
                    <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${theme === 'light' ? 'text-slate-400 group-focus-within:text-blue-500' : 'text-white/20 group-focus-within:text-rose-500'}`} />
                    <input 
                        type="text" 
                        placeholder="Buscar no histórico operacional..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`
                            w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all outline-none font-medium
                            ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500' : 'bg-black/20 border-white/5 focus:border-rose-500/50 text-white'}
                        `}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <button className={`
                            flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all
                            ${theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}
                        `}>
                            <Filter size={16} />
                            <span>Filtrar</span>
                            <ChevronDown size={14} />
                        </button>
                        <div className={`
                            absolute right-0 top-full mt-2 w-56 p-3 rounded-2xl border shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all backdrop-blur-xl
                            ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1a1b23] border-white/10'}
                        `}>
                            <div className="space-y-1">
                                {(Object.keys(TYPE_CONFIG) as ActivityType[]).map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => toggleFilter(type)}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all
                                            ${filterTypes.includes(type) 
                                                ? (theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-rose-500/10 text-rose-500')
                                                : (theme === 'light' ? 'hover:bg-slate-50 text-slate-500' : 'hover:bg-white/5 text-white/40')}
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${TYPE_CONFIG[type].bg}`}></div>
                                            {TYPE_CONFIG[type].label}
                                        </div>
                                        {filterTypes.includes(type) && <CheckCircle2 size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className={`
                        p-3 rounded-xl border transition-all
                        ${theme === 'light' ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-900' : 'bg-white/5 border-white/5 text-white/30 hover:text-white'}
                    `}>
                        <Download size={18} />
                    </button>

                    <button 
                        onClick={() => setIsDrawerOpen(true)}
                        className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transform active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Novo Registro
                    </button>
                </div>
            </div>

            {/* TIMELINE VIEW */}
            <div className="flex-1 relative pl-12 md:pl-24">
                {/* Vertical Line */}
                <div className={`absolute left-8 md:left-20 top-0 bottom-0 w-0.5 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/5'}`}></div>

                <div className="space-y-12 pb-20">
                    {filteredActivities.length > 0 ? filteredActivities.map((act, index) => (
                        <TimelineItem key={act.id} activity={act} index={index} />
                    )) : (
                        <div className="py-20 text-center opacity-20">
                            <Clock size={48} className="mx-auto mb-4" />
                            <p className="text-xl font-black uppercase tracking-widest">Nenhuma atividade registrada</p>
                        </div>
                    )}
                </div>
            </div>

            <ActivityDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} clientName={client.name} />
        </div>
    );
};

const TimelineItem: React.FC<{ activity: ClientActivity; index: number }> = ({ activity, index }) => {
    const { theme } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const config = TYPE_CONFIG[activity.type];
    const Icon = config.icon;
    
    return (
        <div className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            {/* Node - Now with solid background preenchimento (Requirement 1.1) */}
            <div className={`
                absolute -left-12 md:-left-21 top-3 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-2xl border-4
                ${theme === 'light' ? 'border-white' : 'border-[#0F1014]'}
                ${config.bg}
            `}>
                <Icon size={16} strokeWidth={3} className="text-white" />
            </div>

            {/* Card - Glassmorphism + Pertinent Border + BG (Requirements 1.2 & 1.3) */}
            <div className={`
                relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500
                ${theme === 'light' 
                    ? `bg-white/80 border-slate-200 shadow-sm ${config.border} hover:bg-white` 
                    : `${config.glass} ${config.border} hover:bg-white/[0.05]`
                }
                hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20
            `}>
                {activity.isPinned && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                        <Pin size={10} /> PINNED_EVENT
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${config.color.replace('text-', 'bg-')}/10 ${config.color} border-current/20`}>
                            {config.label}
                        </span>
                        <h4 className={`text-xl font-black tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{activity.title}</h4>
                    </div>
                    
                    {/* Date Info - More visible color (Requirement 1.4) */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 text-[10px] font-black font-mono uppercase ${theme === 'light' ? 'text-slate-600' : 'text-white/70'}`}>
                            <Calendar size={12} className={config.color} />
                            {format(new Date(activity.dateOccurred), "dd 'de' MMM, yyyy", { locale: ptBR })} 
                            <span className={`mx-2 opacity-30 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>|</span>
                            <span className={theme === 'light' ? 'text-slate-900' : 'text-white'}>
                                {formatDistanceToNow(new Date(activity.dateOccurred), { addSuffix: true, locale: ptBR })}
                            </span>
                        </div>
                        <button className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${theme === 'light' ? 'text-slate-300' : 'text-white/10'}`}>
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                <div className={`relative ${!isExpanded && 'max-h-24 overflow-hidden'}`}>
                    <p className={`text-base leading-relaxed font-medium transition-colors ${theme === 'light' ? 'text-slate-600' : 'text-[var(--text-secondary)]'}`}>
                        {activity.description}
                    </p>
                    {!isExpanded && activity.description.length > 200 && (
                        <div className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${theme === 'light' ? 'from-white/90' : 'from-black/10'} to-transparent`}></div>
                    )}
                </div>

                {activity.description.length > 200 && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`mt-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:underline ${theme === 'light' ? 'text-blue-600' : 'text-rose-500'}`}
                    >
                        {isExpanded ? 'Ocultar Relatório' : 'Expandir Registro Completo'}
                    </button>
                )}

                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl border border-white/10 ${config.bg} flex items-center justify-center text-xs font-black text-white shadow-sm`}>
                            {activity.authorName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>
                                Autor do Log
                            </span>
                            <span className={`text-xs font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                                {activity.authorName}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {activity.attachments && activity.attachments.length > 0 && (
                             <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg border border-blue-400/20 flex items-center gap-2">
                                <Plus size={12} /> {activity.attachments.length} ARQUIVOS_ANEXOS
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientActivityTimeline;
