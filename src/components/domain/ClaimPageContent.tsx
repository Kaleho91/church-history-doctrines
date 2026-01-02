'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { pageArrival } from '@/lib/motion';
import { ClaimConfidenceIndicator } from './ClaimConfidenceIndicator';
import { TraditionPerspectives } from './TraditionPerspectives';
import { TraditionCompare } from './TraditionCompare';
import type { Claim } from '@/lib/types';

interface ClaimContentProps {
    claim: Claim;
    consensusSummary: React.ReactNode;
    traceRail: React.ReactNode;
    interpretationPanel: React.ReactNode;
    nodeCount: number;
    claimId: string;
}

export function ClaimPageContent({
    claim,
    consensusSummary,
    traceRail,
    interpretationPanel,
    nodeCount,
    claimId,
}: ClaimContentProps) {
    return (
        <motion.div
            variants={pageArrival.container}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
        >
            {/* LEFT: Claim Header & Trace Rail */}
            <div className="lg:col-span-7 space-y-8 min-w-0">

                {/* Consensus Summary */}
                <motion.div variants={pageArrival.section}>
                    {consensusSummary}
                </motion.div>

                {/* Claim Header */}
                <motion.div
                    variants={pageArrival.section}
                    className="bg-white/[0.03] rounded-2xl p-6 border border-white/10"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide mb-4">
                        {claim.cluster}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                        {claim.short_label}
                    </h1>
                    <p className="text-xl text-white/50 leading-relaxed mb-4 font-serif">
                        {claim.full_statement}
                    </p>

                    {/* Claim-Level Confidence */}
                    <div className="mb-6">
                        <ClaimConfidenceIndicator claimId={claimId} />
                    </div>

                    <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">
                            Definition Variants
                        </h3>
                        <ul className="space-y-2">
                            {claim.definition_variants.map((v, i) => (
                                <li key={i} className="flex gap-3 text-sm text-white/60">
                                    <span className="text-amber-500/50">•</span> {v}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Trace Rail */}
                <motion.div variants={pageArrival.section}>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        Historical Trace
                        <span className="text-sm font-normal text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                            {nodeCount} Nodes
                        </span>
                    </h2>
                    {traceRail}
                </motion.div>
            </div>

            {/* RIGHT: Interpretation Panel + Tradition Perspectives - Sticky Sidebar */}
            <motion.div
                variants={pageArrival.section}
                className="lg:col-span-5"
            >
                {/* Sticky wrapper for entire sidebar content */}
                <div className="lg:sticky lg:top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
                    {interpretationPanel}

                    {/* Tradition Compare - Divergence Overlay */}
                    <TraditionCompare claimId={claimId} />

                    {/* Tradition Perspectives */}
                    <TraditionPerspectives claimId={claimId} />
                </div>
            </motion.div>
        </motion.div>
    );
}
