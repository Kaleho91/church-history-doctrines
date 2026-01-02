'use client';

import React, { useState } from 'react';
import { TraceNode, ConfidenceLevel } from '@/lib/types';
import { CitationList } from './CitationList';
import { FileText, User, Scroll, Landmark, Calendar, BookOpen, Church, MapPin } from 'lucide-react';

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; weight: number }> = {
    Scripture: {
        icon: <BookOpen className="w-4 h-4" />,
        color: 'bg-emerald-500/20 text-emerald-400',
        weight: 5,
    },
    Text: {
        icon: <FileText className="w-4 h-4" />,
        color: 'bg-white/10 text-white/60',
        weight: 3,
    },
    Person: {
        icon: <User className="w-4 h-4" />,
        color: 'bg-amber-500/20 text-amber-400',
        weight: 3,
    },
    Confession: {
        icon: <Scroll className="w-4 h-4" />,
        color: 'bg-blue-500/20 text-blue-400',
        weight: 4,
    },
    Council: {
        icon: <Landmark className="w-4 h-4" />,
        color: 'bg-purple-500/20 text-purple-400',
        weight: 5,
    },
    Event: {
        icon: <Calendar className="w-4 h-4" />,
        color: 'bg-white/10 text-white/50',
        weight: 2,
    },
    'Early church manual': {
        icon: <Church className="w-4 h-4" />,
        color: 'bg-amber-500/20 text-amber-400',
        weight: 4,
    },
};

const RELATION_COLORS = {
    Defines: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    Supports: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Challenges: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    Develops: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const CONFIDENCE_STYLES: Record<ConfidenceLevel, {
    borderLeft: string;
    tooltip: string;
    dot: string;
}> = {
    High: {
        borderLeft: 'border-l-4 border-l-emerald-500',
        tooltip: 'High confidence — strong source agreement',
        dot: 'bg-emerald-500',
    },
    Medium: {
        borderLeft: 'border-l-4 border-l-amber-500',
        tooltip: 'Medium confidence — supported by sources, interpreted differently',
        dot: 'bg-amber-500',
    },
    Contested: {
        borderLeft: 'border-l-4 border-l-rose-400',
        tooltip: 'Contested — scholarly debate exists on interpretation',
        dot: 'bg-rose-400',
    },
};

export function NodeCard({ node }: { node: TraceNode }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const typeConfig = TYPE_CONFIG[node.type] || {
        icon: <FileText className="w-4 h-4" />,
        color: 'bg-white/10 text-white/60',
        weight: 2
    };
    const relationStyle = RELATION_COLORS[node.edge.relation_type as keyof typeof RELATION_COLORS] || 'bg-white/10 text-white/50';
    const confidence = (node.edge.confidence as ConfidenceLevel) || 'High';
    const confidenceStyle = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.High;

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`
                rounded-xl border border-white/10 bg-white/[0.03] p-5 
                hover:bg-white/[0.05] hover:border-white/20 transition-all
                ${confidenceStyle.borderLeft}
            `}>
                <header className="flex justify-between items-start mb-3">
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${relationStyle}`}>
                                {node.edge.relation_type}
                            </span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${typeConfig.color}`}>
                                {typeConfig.icon}
                                {node.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">
                            {node.title}
                        </h3>
                    </div>

                    {node.date_range && (
                        <div className="flex-shrink-0 ml-3">
                            <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                                {node.date_range}
                            </span>
                        </div>
                    )}
                </header>

                {node.region && (
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-white/30">
                        <MapPin className="w-3 h-3" />
                        {node.region}
                    </div>
                )}

                <p className="text-white/50 leading-relaxed text-sm">
                    {node.summary}
                    <CitationList citationIds={node.citations} />
                </p>

                {node.edge.note && (
                    <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/40 italic flex gap-2">
                        <span className="font-medium not-italic text-white/30">Note:</span>
                        {node.edge.note}
                    </div>
                )}

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${confidenceStyle.dot}`} />
                        <span className="text-[10px] text-white/30">{confidence} confidence</span>
                    </div>

                    {typeConfig.weight >= 4 && (
                        <span className="text-[10px] text-white/30">Primary source</span>
                    )}
                </div>
            </div>

            {showTooltip && (
                <div className="
                    absolute -top-10 left-4 z-20 
                    px-3 py-1.5 
                    bg-white text-stone-900 text-xs rounded-lg shadow-lg 
                    whitespace-nowrap pointer-events-none
                    animate-in fade-in slide-in-from-bottom-1 duration-150
                ">
                    {confidenceStyle.tooltip}
                    <div className="absolute -bottom-1 left-6 w-2 h-2 bg-white rotate-45" />
                </div>
            )}
        </div>
    );
}
