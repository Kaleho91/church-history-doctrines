import React from 'react';
import { TraceNode } from '@/lib/types';
import { NodeCard } from './NodeCard';

export function TraceRail({ nodes }: { nodes: TraceNode[] }) {
    // Simple check to insert headers
    const getEra = (year: number) => {
        if (year < 100) return 'Scripture';
        if (year < 600) return 'Early Church';
        if (year < 1500) return 'Medieval';
        if (year < 1650) return 'Reformation';
        return 'Confessional & Modern';
    };

    let currentEra = '';

    return (
        <div className="relative">
            {nodes.map((node, i) => {
                const era = getEra(node.parsedYear);
                const showHeader = era !== currentEra;
                if (showHeader) currentEra = era;

                return (
                    <React.Fragment key={node.id}>
                        {showHeader && (
                            <div className="relative pl-8 py-6">
                                {/* Era Header Line connection */}
                                <div className="absolute left-[11px] -top-6 bottom-0 w-px bg-slate-200"></div>

                                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200 relative z-10">
                                    {era}
                                </div>
                            </div>
                        )}
                        <NodeCard node={node} />
                    </React.Fragment>
                );
            })}
        </div>
    );
}
