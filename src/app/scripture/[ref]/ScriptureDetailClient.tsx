'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Node, Claim, Interpretation, Edge } from '@/lib/types';

interface ClaimWithInterpretations {
    claim: Claim;
    interpretations: Interpretation[];
    edge?: Edge;
}

interface Props {
    scripture: Node;
    claims: Claim[];
    claimInterpretations: ClaimWithInterpretations[];
    displayRef: string;
}

// Lens colors for visual distinction
const LENS_COLORS: Record<string, string> = {
    'Consensus': '#6b8e23',
    'Catholic': '#7c6a9a',
    'Orthodox': '#4a90a4',
    'Lutheran': '#8b7355',
    'Reformed': '#5c8a5c',
    'ZwinglianBaptistic': '#a08060',
    'Coptic': '#8b4513',
};

// Relation type badges
const RELATION_BADGES: Record<string, { label: string; color: string }> = {
    'Defines': { label: 'Foundational Text', color: '#d4af37' },
    'Supports': { label: 'Supporting Evidence', color: '#6b8e23' },
    'Develops': { label: 'Further Development', color: '#4a90a4' },
    'Challenges': { label: 'Interpretive Tension', color: '#c75050' },
};

export default function ScriptureDetailClient({
    scripture,
    claims,
    claimInterpretations,
    displayRef
}: Props) {
    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/scripture"
                        className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                    >
                        ← Scripture Index
                    </Link>
                    <span className="text-[#d4cfc4]">|</span>
                    <h1 className="font-serif text-xl text-[#5c5346]">
                        {scripture.scripture_ref}
                    </h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Scripture Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    {/* Book and reference */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">📖</span>
                        <div>
                            <span className="text-sm text-[#9a9285] uppercase tracking-wide">
                                {scripture.book}
                            </span>
                            <h2 className="font-serif text-4xl text-[#3d3529]">
                                {scripture.scripture_ref}
                            </h2>
                        </div>
                    </div>

                    {/* Verse text in elegant styling */}
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] to-[#d4af37]/30 rounded-full" />
                        <blockquote className="pl-6 py-4">
                            <p className="font-serif text-2xl text-[#3d3529] leading-relaxed italic">
                                "{scripture.verse_text}"
                            </p>
                        </blockquote>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-[#9a9285]">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#8b7355]" />
                            {scripture.date_range}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#6b8e23]" />
                            {claims.length} connected {claims.length === 1 ? 'claim' : 'claims'}
                        </span>
                    </div>
                </motion.div>

                {/* Historical Context */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                        Historical Significance
                    </h3>
                    <div className="bg-white rounded-xl p-5 border border-[#e8e4dc]">
                        <p className="text-[#6b6358] leading-relaxed">
                            {scripture.summary}
                        </p>
                    </div>
                </motion.div>

                {/* Connected Doctrinal Claims */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-4">
                        Doctrinal Claims Connected to This Passage
                    </h3>

                    <div className="space-y-6">
                        {claimInterpretations.map(({ claim, interpretations, edge }, index) => (
                            <motion.div
                                key={claim.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="bg-white rounded-xl border border-[#e8e4dc] overflow-hidden"
                            >
                                {/* Claim Header */}
                                <div className="p-5 border-b border-[#e8e4dc]">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <span className="text-xs text-[#9a9285] uppercase tracking-wide">
                                                {claim.cluster}
                                            </span>
                                            <Link
                                                href={`/claim/${claim.id}`}
                                                className="block mt-1"
                                            >
                                                <h4 className="font-serif text-xl text-[#3d3529] hover:text-[#8b7355] transition-colors">
                                                    {claim.short_label}
                                                </h4>
                                            </Link>
                                        </div>

                                        {/* Relation badge */}
                                        {edge && RELATION_BADGES[edge.relation_type] && (
                                            <span
                                                className="shrink-0 text-xs px-2 py-1 rounded-full font-medium"
                                                style={{
                                                    color: RELATION_BADGES[edge.relation_type].color,
                                                    backgroundColor: `${RELATION_BADGES[edge.relation_type].color}15`
                                                }}
                                            >
                                                {RELATION_BADGES[edge.relation_type].label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Edge note */}
                                    {edge?.note && (
                                        <p className="text-sm text-[#6b6358] italic">
                                            "{edge.note}"
                                        </p>
                                    )}
                                </div>

                                {/* Tradition Perspectives */}
                                <div className="p-5">
                                    <h5 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                                        How Traditions Interpret This Connection
                                    </h5>

                                    <div className="space-y-3">
                                        {interpretations.slice(0, 4).map(interp => (
                                            <div
                                                key={interp.id}
                                                className="flex items-start gap-3"
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                                                    style={{ backgroundColor: LENS_COLORS[interp.lens] || '#9a9285' }}
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-[#5c5346]">
                                                        {interp.lens === 'ZwinglianBaptistic' ? 'Zwinglian/Baptist' : interp.lens}:
                                                    </span>
                                                    <p className="text-sm text-[#6b6358] mt-0.5">
                                                        {interp.summary}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* View Full Claim Link */}
                                    <Link
                                        href={`/claim/${claim.id}`}
                                        className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#8b7355] hover:text-[#6b5339] font-medium transition-colors"
                                    >
                                        View Full Claim Trace
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Decorative footer */}
                <div className="mt-16 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-[#d4af37]/60">
                            <span className="w-12 h-[1px] bg-current" />
                            <span className="text-sm">✦</span>
                            <span className="w-12 h-[1px] bg-current" />
                        </div>
                    </div>
                    <p className="text-[#9a9285] text-sm max-w-md mx-auto">
                        This passage has shaped Christian teaching for centuries.
                        <Link href="/scripture" className="text-[#8b7355] hover:underline ml-1">
                            Explore more Scripture references →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
