'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TraceNode } from '@/lib/types';
import { NodeCard } from './NodeCard';
import { viewportReveal, ease, durations } from '@/lib/motion';

/**
 * SYSTEM 3: Historical Trace as a Journey
 * 
 * Each node enters gently when it first appears in viewport.
 * The timeline feels like moving forward through time.
 */
export function TraceRail({ nodes }: { nodes: TraceNode[] }) {
    const shouldReduceMotion = useReducedMotion();

    const getEra = (year: number): { name: string; color: string } => {
        if (year < 100) return { name: 'Scripture', color: 'bg-purple-50 text-purple-700 border-purple-200' };
        if (year < 600) return { name: 'Early Church', color: 'bg-amber-50 text-amber-700 border-amber-200' };
        if (year < 1500) return { name: 'Medieval', color: 'bg-rose-50 text-rose-700 border-rose-200' };
        if (year < 1650) return { name: 'Reformation', color: 'bg-blue-50 text-blue-700 border-blue-200' };
        return { name: 'Confessional & Modern', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    };

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
                className="absolute left-24 top-0 bottom-0 w-px bg-gradient-to-b from-purple-200 via-amber-200 via-rose-200 to-blue-200"
                style={{ top: '2rem' }}
            />

            {nodes.map((node, i) => {
                const era = getEra(node.parsedYear);
                const showHeader = era.name !== currentEra;
                if (showHeader) currentEra = era.name;

                // Node reveal configuration
                const nodeVariants = {
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: durations.short, ease }
                    }
                };

                return (
                    <React.Fragment key={node.id}>
                        {showHeader && (
                            <motion.div
                                initial={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: durations.short, ease }}
                                className="relative mb-6 mt-10 first:mt-0"
                            >
                                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${era.color} ml-14`}>
                                    {era.name}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={shouldReduceMotion ? undefined : "hidden"}
                            whileInView={shouldReduceMotion ? undefined : "visible"}
                            viewport={{ once: true, margin: "-50px" }}
                            variants={shouldReduceMotion ? undefined : nodeVariants}
                            className="relative flex items-start gap-6 mb-6 group"
                        >
                            {/* Date Label (Left) */}
                            <div className="w-20 flex-shrink-0 text-right pt-5">
                                <div className="text-sm font-bold text-stone-600 group-hover:text-indigo-600 transition-colors">
                                    {formatYear(node.date_range)}
                                </div>
                            </div>

                            {/* Timeline Dot */}
                            <div className="relative flex-shrink-0 pt-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-stone-300 group-hover:border-indigo-500 group-hover:bg-indigo-100 transition-all" />
                            </div>

                            {/* Node Card (Right) */}
                            <div className="flex-1 -mt-1">
                                <NodeCard node={node} />
                            </div>
                        </motion.div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
