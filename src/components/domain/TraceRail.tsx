'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TraceNode } from '@/lib/types';
import { NodeCard } from './NodeCard';

export function TraceRail({ nodes }: { nodes: TraceNode[] }) {
    // Define era thresholds and colors
    const getEra = (year: number): { name: string; color: string } => {
        if (year < 100) return { name: 'Scripture', color: 'bg-purple-100 text-purple-700 border-purple-200' };
        if (year < 600) return { name: 'Early Church', color: 'bg-amber-100 text-amber-700 border-amber-200' };
        if (year < 1500) return { name: 'Medieval', color: 'bg-rose-100 text-rose-700 border-rose-200' };
        if (year < 1650) return { name: 'Reformation', color: 'bg-blue-100 text-blue-700 border-blue-200' };
        return { name: 'Confessional & Modern', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    };

    // Format year for display
    const formatYear = (dateRange: string): string => {
        if (dateRange.startsWith('c.')) return dateRange;
        const yearMatch = dateRange.match(/\d{3,4}/);
        return yearMatch ? `${yearMatch[0]} AD` : dateRange;
    };

    let currentEra = '';

    return (
        <div className="relative">
            {/* Continuous timeline line */}
            <div
                className="absolute left-24 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-amber-200 via-rose-200 via-blue-200 to-emerald-200"
                style={{ top: '2rem' }}
            />

            {nodes.map((node, i) => {
                const era = getEra(node.parsedYear);
                const showHeader = era.name !== currentEra;
                if (showHeader) currentEra = era.name;

                return (
                    <React.Fragment key={node.id}>
                        {showHeader && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative mb-8 mt-12 first:mt-0"
                            >
                                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${era.color} ml-14`}>
                                    {era.name}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="relative flex items-start gap-6 mb-8 group"
                        >
                            {/* Date Label (Left) */}
                            <div className="w-20 flex-shrink-0 text-right">
                                <div className="text-sm font-bold text-stone-700 group-hover:text-indigo-600 transition-colors">
                                    {formatYear(node.date_range)}
                                </div>
                            </div>

                            {/* Timeline Dot */}
                            <div className="relative flex-shrink-0" style={{ marginTop: '1.5rem' }}>
                                <div className="w-3 h-3 rounded-full bg-white border-2 border-indigo-400 group-hover:border-indigo-600 group-hover:scale-125 transition-all shadow-sm" />
                                {/* Connecting line to card */}
                                <div className="absolute left-[6px] top-[12px] w-px h-6 bg-stone-200" />
                            </div>

                            {/* Node Card (Right) */}
                            <div className="flex-1">
                                <NodeCard node={node} />
                            </div>
                        </motion.div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
