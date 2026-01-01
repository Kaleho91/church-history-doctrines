'use client';

import React, { useState } from 'react';
import { TraceNode } from '@/lib/types';
import { CitationList } from './CitationList';
import { FileText, User, Scroll, Landmark, Calendar } from 'lucide-react';

/**
 * PART 2: Node-Level Confidence
 * 
 * Uses edge confidence to influence styling subtly:
 * - Border opacity varies by confidence
 * - Hover tooltip explains confidence level
 */

const TYPE_ICONS: Record<string, React.ReactNode> = {
    Scripture: <BookIcon className="w-4 h-4" />,
    Text: <FileText className="w-4 h-4" />,
    Person: <User className="w-4 h-4" />,
    Confession: <Scroll className="w-4 h-4" />,
    Council: <Landmark className="w-4 h-4" />,
    Event: <Calendar className="w-4 h-4" />,
};

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}

const RELATION_COLORS = {
    Defines: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Supports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Challenges: 'bg-rose-100 text-rose-700 border-rose-200',
    Develops: 'bg-amber-100 text-amber-700 border-amber-200',
};

// Confidence-based styling - subtle variations
const CONFIDENCE_STYLES = {
    High: {
        border: 'border-stone-200',
        opacity: 'opacity-100',
        tooltip: 'High confidence — strong source agreement',
    },
    Medium: {
        border: 'border-stone-200/70',
        opacity: 'opacity-95',
        tooltip: 'Medium confidence — supported by sources, interpreted differently',
    },
    Contested: {
        border: 'border-stone-200/50',
        opacity: 'opacity-90',
        tooltip: 'Contested — scholarly debate exists on interpretation',
    },
};

export function NodeCard({ node }: { node: TraceNode }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const Icon = TYPE_ICONS[node.type] || <FileText className="w-4 h-4" />;
    const relationStyle = RELATION_COLORS[node.edge.relation_type] || 'bg-slate-100 text-slate-700';
    const confidence = node.edge.confidence || 'High';
    const confidenceStyle = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.High;

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`bg-white rounded-xl border ${confidenceStyle.border} shadow-sm p-5 hover:shadow-md transition-all ${confidenceStyle.opacity}`}>
                <header className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${relationStyle}`}>
                                {node.edge.relation_type}
                            </span>
                            <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                                {node.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">
                            {node.title}
                        </h3>
                    </div>
                </header>

                <p className="text-stone-600 leading-relaxed text-sm font-serif">
                    {node.summary}
                    <CitationList citationIds={node.citations} />
                </p>

                {node.edge.note && (
                    <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500 italic flex gap-2">
                        <span className="font-medium not-italic text-stone-400">Note:</span>
                        {node.edge.note}
                    </div>
                )}
            </div>

            {/* Confidence tooltip - appears on hover */}
            {showTooltip && (
                <div className="absolute -top-8 left-4 z-20 px-2.5 py-1 bg-stone-800 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none">
                    {confidenceStyle.tooltip}
                </div>
            )}
        </div>
    );
}
