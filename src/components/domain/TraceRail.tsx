'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TraceNode } from '@/lib/types';
import { NodeCard } from './NodeCard';
import { ease, durations } from '@/lib/motion';

/**
 * SYSTEM 3: Historical Trace as a Journey
 * 
 * Manuscript-inspired timeline with ink gradient and diamond markers.
 * Each node enters gently when it first appears in viewport.
 */
export function TraceRail({ nodes }: { nodes: TraceNode[] }) {
    const shouldReduceMotion = useReducedMotion();

    const getEra = (year: number): { name: string; color: string; textColor: string } => {
        if (year < 100) return {
            name: 'Scripture',
            color: 'bg-stone-100 border-stone-400',
            textColor: 'text-stone-700'
        };
        if (year < 600) return {
            name: 'Early Church',
            color: 'bg-amber-50 border-amber-600',
            textColor: 'text-amber-800'
        };
        if (year < 1500) return {
            name: 'Medieval',
            color: 'bg-orange-50 border-orange-700',
            textColor: 'text-orange-900'
        };
        if (year < 1650) return {
            name: 'Reformation',
            color: 'bg-sky-50 border-sky-600',
            textColor: 'text-sky-800'
        };
        return {
            name: 'Confessional & Modern',
            color: 'bg-slate-100 border-slate-500',
            textColor: 'text-slate-700'
        };
    };

    const formatYear = (dateRange: string): string => {
        if (dateRange.startsWith('c.')) return dateRange;
        const yearMatch = dateRange.match(/\d{3,4}/);
        return yearMatch ? `${yearMatch[0]} AD` : dateRange;
    };

    let currentEra = '';

    return (
        <div className="relative">
            {/* Continuous timeline line — ink trace gradient */}
            <div
                className="absolute left-24 top-0 bottom-0 w-0.5 timeline-ink"
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
                                {/* Era badge with illuminated style */}
                                <div className={`
                                    era-badge inline-block px-4 py-1.5 rounded-r-lg 
                                    text-xs font-bold uppercase tracking-widest 
                                    ${era.color} ${era.textColor}
                                    ml-14
                                `}>
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
                                <div className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                    {formatYear(node.date_range)}
                                </div>
                            </div>

                            {/* Timeline Diamond */}
                            <div className="relative flex-shrink-0 pt-4">
                                <div className="timeline-diamond" />
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

