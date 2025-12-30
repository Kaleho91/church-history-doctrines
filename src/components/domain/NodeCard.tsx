'use client';

import React from 'react';
import { TraceNode } from '@/lib/types';
import { CitationList } from './CitationList';
import { Calendar, MapPin, FileText, User, Scroll, Landmark } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
    Scripture: <BookIcon className="w-4 h-4" />,
    Text: <FileText className="w-4 h-4" />,
    Person: <User className="w-4 h-4" />,
    Confession: <Scroll className="w-4 h-4" />,
    Council: <Landmark className="w-4 h-4" />,
    Event: <Calendar className="w-4 h-4" />,
};

function BookIcon(props: any) {
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

export function NodeCard({ node }: { node: TraceNode }) {
    const Icon = TYPE_ICONS[node.type] || <FileText className="w-4 h-4" />;
    const relationStyle = RELATION_COLORS[node.edge.relation_type] || 'bg-slate-100 text-slate-700';

    return (
        <div className="relative pl-8 pb-12 last:pb-0 group">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-200 group-last:hidden"></div>

            {/* Timeline Dot */}
            <div className={`absolute left-0 top-6 w-[22px] h-[22px] rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-slate-100 text-slate-500 z-10`}>
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <header className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${relationStyle}`}>
                                {node.edge.relation_type}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                {node.date_range} • {node.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                            {node.title}
                        </h3>
                    </div>
                </header>

                <p className="text-slate-700 leading-relaxed text-sm">
                    {node.summary}
                    <CitationList citationIds={node.citations} />
                </p>

                {node.edge.note && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 italic flex gap-2">
                        <span className="font-semibold not-italic text-slate-400">Trace Note:</span>
                        {node.edge.note}
                    </div>
                )}
            </div>
        </div>
    );
}
