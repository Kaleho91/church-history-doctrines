'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { pageArrival } from '@/lib/motion';
import type { Claim } from '@/lib/types';

interface ClaimContentProps {
    claim: Claim;
    consensusSummary: React.ReactNode;
    traceRail: React.ReactNode;
    interpretationPanel: React.ReactNode;
    nodeCount: number;
}

/**
 * SYSTEM 1: Page Arrival Choreography
 * 
 * Wraps claim page content in staggered entrance animation.
 * Content arrives gently - opacity 0→1, y 12→0
 * Each section staggers slightly to create a sense of place.
 */
export function ClaimPageContent({
    claim,
    consensusSummary,
    traceRail,
    interpretationPanel,
    nodeCount,
}: ClaimContentProps) {
    return (
        <motion.div
            variants={pageArrival.container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
            {/* LEFT: Claim Header & Trace Rail */}
            <div className="lg:col-span-7 space-y-8">
                {/* Consensus Summary */}
                <motion.div variants={pageArrival.section}>
                    {consensusSummary}
                </motion.div>

                {/* Claim Header */}
                <motion.div
                    variants={pageArrival.section}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-4">
                        {claim.cluster}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4 leading-tight tracking-tight">
                        {claim.short_label}
                    </h1>
                    <p className="text-xl text-stone-600 leading-relaxed mb-6 font-serif">
                        {claim.full_statement}
                    </p>

                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                            Definition Variants
                        </h3>
                        <ul className="space-y-2">
                            {claim.definition_variants.map((v, i) => (
                                <li key={i} className="flex gap-3 text-sm text-stone-700">
                                    <span className="text-indigo-300">•</span> {v}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Trace Rail */}
                <motion.div variants={pageArrival.section}>
                    <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                        Historical Trace
                        <span className="text-sm font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            {nodeCount} Nodes
                        </span>
                    </h2>
                    {traceRail}
                </motion.div>
            </div>

            {/* RIGHT: Interpretation Panel */}
            <motion.div
                variants={pageArrival.section}
                className="lg:col-span-5 relative"
            >
                {interpretationPanel}
            </motion.div>
        </motion.div>
    );
}
