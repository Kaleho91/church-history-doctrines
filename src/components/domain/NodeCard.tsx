'use client';

import React, { useState } from 'react';
import { TraceNode, ConfidenceLevel } from '@/lib/types';
import { CitationList } from './CitationList';
import { FileText, User, Scroll, Landmark, Calendar, BookOpen, Church, MapPin } from 'lucide-react';

/**
 * SYSTEM 2: Node-Level Confidence Surfacing
 * 
 * Every NodeCard subtly reflects confidence through:
 * - Border opacity and left accent bar
 * - Card opacity variations
 * - Hover tooltip explaining confidence level
 * 
 * Confidence is shown calmly at every level.
 */

const TYPE_ICONS: Record<string, React.ReactNode> = {
    Scripture: <BookOpen className="w-4 h-4" />,
    Text: <FileText className="w-4 h-4" />,
    Person: <User className="w-4 h-4" />,
    Confession: <Scroll className="w-4 h-4" />,
    Council: <Landmark className="w-4 h-4" />,
    Event: <Calendar className="w-4 h-4" />,
    Tradition: <Church className="w-4 h-4" />,
    'Early church manual': <Church className="w-4 h-4" />,
    Foundational: <MapPin className="w-4 h-4" />,
};

const RELATION_COLORS = {
    Defines: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Supports: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Challenges: 'bg-rose-100 text-rose-700 border-rose-200',
    Develops: 'bg-amber-100 text-amber-700 border-amber-200',
};

// Confidence-based styling - subtle visual variations
const CONFIDENCE_STYLES: Record<ConfidenceLevel, {
    border: string;
    opacity: string;
    accent: string;
    tooltip: string;
    iconColor: string;
}> = {
    High: {
        border: 'border-stone-200',
        opacity: 'opacity-100',
        accent: 'border-l-4 border-l-emerald-400',
        tooltip: 'High confidence — strong source agreement',
        iconColor: 'text-emerald-500',
    },
    Medium: {
        border: 'border-stone-200/80',
        opacity: 'opacity-95',
        accent: 'border-l-4 border-l-amber-300',
        tooltip: 'Medium confidence — supported by sources, interpreted differently',
        iconColor: 'text-amber-500',
    },
    Mixed: {
        border: 'border-stone-200/75',
        opacity: 'opacity-95',
        accent: 'border-l-4 border-l-amber-200',
        tooltip: 'Mixed confidence — sources agree on core; details debated',
        iconColor: 'text-amber-400',
    },
    Contested: {
        border: 'border-stone-200/60',
        opacity: 'opacity-90',
        accent: 'border-l-4 border-l-rose-300/70',
        tooltip: 'Contested — scholarly debate exists on interpretation',
        iconColor: 'text-rose-400',
    },
};

interface NodeCardProps {
    node: TraceNode;
}

export function NodeCard({ node }: NodeCardProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const Icon = TYPE_ICONS[node.type] || <FileText className="w-4 h-4" />;
    const relationStyle = RELATION_COLORS[node.edge.relation_type as keyof typeof RELATION_COLORS] || 'bg-slate-100 text-slate-700';
    const confidence = (node.edge.confidence as ConfidenceLevel) || 'High';
    const confidenceStyle = CONFIDENCE_STYLES[confidence] || CONFIDENCE_STYLES.High;

    // Count citations for tooltip
    const citationCount = node.citations?.length || 0;

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div
                className={`
          bg-white rounded-xl border shadow-sm p-5 
          hover:shadow-md transition-all duration-200
          ${confidenceStyle.border} ${confidenceStyle.opacity} ${confidenceStyle.accent}
        `}
            >
                <header className="flex justify-between items-start mb-3">
                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${relationStyle}`}>
                                {node.edge.relation_type}
                            </span>
                            <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                                <span className={confidenceStyle.iconColor}>{Icon}</span>
                                {node.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 leading-tight">
                            {node.title}
                        </h3>
                    </div>

                    {/* Date badge */}
                    {node.date_range && (
                        <div className="flex-shrink-0 ml-3">
                            <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2 py-1 rounded">
                                {node.date_range}
                            </span>
                        </div>
                    )}
                </header>

                {/* Region indicator */}
                {node.region && (
                    <div className="flex items-center gap-1.5 mb-2 text-xs text-stone-400">
                        <MapPin className="w-3 h-3" />
                        {node.region}
                    </div>
                )}

                <p className="text-stone-600 leading-relaxed text-sm font-serif">
                    {node.summary}
                    <CitationList citationIds={node.citations} />
                </p>

                {/* Key figures if present */}
                {node.keyFigures && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
                        <User className="w-3 h-3" />
                        <span>{node.keyFigures}</span>
                    </div>
                )}

                {/* Edge note */}
                {node.edge.note && (
                    <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500 italic flex gap-2">
                        <span className="font-medium not-italic text-stone-400">Note:</span>
                        {node.edge.note}
                    </div>
                )}

                {/* Subtle confidence indicator in card */}
                <div className="mt-3 pt-2 border-t border-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <ConfidenceDot confidence={confidence} />
                        <span className="text-[10px] text-stone-400">
                            {confidence} confidence
                        </span>
                    </div>
                    {citationCount > 0 && (
                        <span className="text-[10px] text-stone-400">
                            {citationCount} source{citationCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Confidence tooltip - appears on hover */}
            {showTooltip && (
                <div
                    className="
            absolute -top-10 left-4 z-20 
            px-3 py-1.5 
            bg-stone-800 text-white text-xs rounded-lg shadow-lg 
            whitespace-nowrap pointer-events-none
            animate-in fade-in slide-in-from-bottom-1 duration-150
          "
                >
                    {confidenceStyle.tooltip}
                    {citationCount > 0 && ` • ${citationCount} source${citationCount !== 1 ? 's' : ''} cited`}
                    {/* Tooltip arrow */}
                    <div className="absolute -bottom-1 left-6 w-2 h-2 bg-stone-800 rotate-45" />
                </div>
            )}
        </div>
    );
}

/**
 * Small colored dot indicating confidence level
 */
function ConfidenceDot({ confidence }: { confidence: ConfidenceLevel }) {
    const colors: Record<ConfidenceLevel, string> = {
        High: 'bg-emerald-400',
        Medium: 'bg-amber-400',
        Mixed: 'bg-amber-300',
        Contested: 'bg-rose-400',
    };

    return (
        <div className={`w-2 h-2 rounded-full ${colors[confidence] || colors.High}`} />
    );
}

/**
 * Compact node card for lists/summaries
 */
export function NodeCardCompact({ node }: { node: TraceNode }) {
    const confidence = (node.edge.confidence as ConfidenceLevel) || 'High';
    const confidenceStyle = CONFIDENCE_STYLES[confidence];

    return (
        <div className={`
      flex items-center gap-3 p-3 rounded-lg border bg-white
      ${confidenceStyle.border} ${confidenceStyle.opacity}
    `}>
            <ConfidenceDot confidence={confidence} />
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-stone-800 truncate">{node.title}</h4>
                <p className="text-xs text-stone-400">{node.type} • {node.date_range}</p>
            </div>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${RELATION_COLORS[node.edge.relation_type as keyof typeof RELATION_COLORS] || 'bg-stone-100 text-stone-600'
                }`}>
                {node.edge.relation_type}
            </span>
        </div>
    );
}
