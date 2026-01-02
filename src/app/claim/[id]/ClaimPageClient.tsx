'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Claim, TraceNode, Interpretation } from '@/lib/types';

interface Props {
    claim: Claim;
    nodes: TraceNode[];
    interpretations: Interpretation[];
    doctrineSlug: string;
    doctrineName: string;
}

// Lens colors matching the Scripture page
const LENS_COLORS: Record<string, string> = {
    'Consensus': '#6b8e23',
    'Catholic': '#7c6a9a',
    'Orthodox': '#4a90a4',
    'Lutheran': '#8b7355',
    'Reformed': '#5c8a5c',
    'ZwinglianBaptistic': '#a08060',
    'Coptic': '#8b4513',
};

// Era styling
const getEra = (year: number): { name: string; bgColor: string; textColor: string } => {
    if (year < 100) return { name: 'Scripture', bgColor: '#f5f0e6', textColor: '#6b6358' };
    if (year < 600) return { name: 'Early Church', bgColor: '#fef3e2', textColor: '#8b7355' };
    if (year < 1500) return { name: 'Medieval', bgColor: '#fef0e0', textColor: '#a08060' };
    if (year < 1650) return { name: 'Reformation', bgColor: '#e8f4f8', textColor: '#4a90a4' };
    return { name: 'Confessional', bgColor: '#f0f0f0', textColor: '#6b6358' };
};

// Relation type styling
const RELATION_BADGES: Record<string, { label: string; color: string }> = {
    'Defines': { label: 'Defines', color: '#d4af37' },
    'Supports': { label: 'Supports', color: '#6b8e23' },
    'Develops': { label: 'Develops', color: '#4a90a4' },
    'Challenges': { label: 'Challenges', color: '#c75050' },
};

// Confidence styling
const CONFIDENCE_STYLES: Record<string, { color: string; label: string }> = {
    'High': { color: '#6b8e23', label: 'High Confidence' },
    'Medium': { color: '#d4af37', label: 'Medium Confidence' },
    'Contested': { color: '#c75050', label: 'Contested' },
};

export default function ClaimPageClient({
    claim,
    nodes,
    interpretations,
    doctrineSlug,
    doctrineName,
}: Props) {
    const [activeLens, setActiveLens] = useState<string>('Consensus');

    // Group nodes by era
    let currentEra = '';

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href={`/doctrine/${doctrineSlug}`}
                        className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                    >
                        ← {doctrineName}
                    </Link>
                    <span className="text-[#d4cfc4]">|</span>
                    <h1 className="font-serif text-lg text-[#5c5346] truncate">
                        Claim Trace
                    </h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Claim Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    {/* Cluster badge */}
                    <span className="inline-block px-3 py-1 rounded-full bg-[#8b7355]/10 text-[#8b7355] text-xs font-semibold uppercase tracking-wide mb-4">
                        {claim.cluster}
                    </span>

                    {/* Claim title */}
                    <h2 className="font-serif text-4xl text-[#3d3529] mb-4 leading-tight text-reveal">
                        {claim.short_label}
                    </h2>

                    {/* Full statement */}
                    <p className="text-xl text-[#6b6358] leading-relaxed mb-6 max-w-3xl">
                        {claim.full_statement}
                    </p>

                    {/* Definition variants */}
                    <div className="bg-white rounded-xl p-5 border border-[#e8e4dc]">
                        <h3 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                            Definition Variants
                        </h3>
                        <ul className="space-y-2">
                            {claim.definition_variants.map((v, i) => (
                                <li key={i} className="flex gap-3 text-sm text-[#6b6358]">
                                    <span className="text-[#d4af37]">•</span>
                                    {v}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Historical Trace */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-6 flex items-center gap-2">
                                Historical Trace
                                <span className="text-xs font-normal bg-[#f5f2ed] px-2 py-0.5 rounded-full">
                                    {nodes.length} sources
                                </span>
                            </h3>

                            {/* Timeline */}
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#d4af37] via-[#d4af37]/60 to-[#d4af37]/20" />

                                <div className="space-y-4">
                                    {nodes.map((node, index) => {
                                        const era = getEra(node.parsedYear);
                                        const showEraHeader = era.name !== currentEra;
                                        if (showEraHeader) currentEra = era.name;
                                        const relation = RELATION_BADGES[node.edge.relation_type];
                                        const confidence = CONFIDENCE_STYLES[node.edge.confidence];

                                        return (
                                            <React.Fragment key={node.id}>
                                                {showEraHeader && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="ml-6 mb-2 mt-6 first:mt-0"
                                                    >
                                                        <span
                                                            className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                                                            style={{
                                                                backgroundColor: era.bgColor,
                                                                color: era.textColor,
                                                            }}
                                                        >
                                                            {era.name}
                                                        </span>
                                                    </motion.div>
                                                )}

                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 + 0.1 }}
                                                    className="relative flex gap-4"
                                                >
                                                    {/* Diamond marker */}
                                                    <div className="relative z-10 w-4 h-4 mt-5 shrink-0">
                                                        <div
                                                            className="w-3 h-3 rotate-45 border-2 bg-white"
                                                            style={{
                                                                borderColor: confidence?.color || '#d4af37',
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Card */}
                                                    <div className="flex-1 bg-white rounded-xl p-5 border border-[#e8e4dc] transition-all group hover-lift border-glow">
                                                        {/* Date and type */}
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-[#8b7355]">
                                                                {node.date_range}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {relation && (
                                                                    <span
                                                                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                        style={{
                                                                            color: relation.color,
                                                                            backgroundColor: `${relation.color}15`,
                                                                        }}
                                                                    >
                                                                        {relation.label}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-[#9a9285] bg-[#f5f2ed] px-2 py-0.5 rounded-full">
                                                                    {node.type}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Title */}
                                                        <h4 className="font-serif text-lg text-[#3d3529] mb-2 group-hover:text-[#8b7355] transition-colors">
                                                            {node.title}
                                                        </h4>

                                                        {/* Summary */}
                                                        <p className="text-sm text-[#6b6358] leading-relaxed mb-3">
                                                            {node.summary}
                                                        </p>

                                                        {/* Edge note */}
                                                        {node.edge.note && (
                                                            <p className="text-xs text-[#9a9285] italic border-l-2 border-[#e8e4dc] pl-3">
                                                                "{node.edge.note}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Tradition Perspectives */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:sticky lg:top-24 panel-enter"
                        >
                            <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-4">
                                Tradition Perspectives
                            </h3>

                            {/* Lens tabs */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {interpretations.map((interp) => (
                                    <button
                                        key={interp.id}
                                        onClick={() => setActiveLens(interp.lens)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${activeLens === interp.lens
                                            ? 'text-white shadow-md'
                                            : 'bg-white border border-[#e8e4dc] text-[#6b6358] hover:border-[#d4cfc4]'
                                            }`}
                                        style={{
                                            backgroundColor: activeLens === interp.lens
                                                ? LENS_COLORS[interp.lens] || '#8b7355'
                                                : undefined,
                                        }}
                                    >
                                        {interp.lens === 'ZwinglianBaptistic' ? 'Zwinglian' : interp.lens}
                                    </button>
                                ))}
                            </div>

                            {/* Active interpretation */}
                            {interpretations
                                .filter((i) => i.lens === activeLens)
                                .map((interp) => (
                                    <motion.div
                                        key={interp.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white rounded-xl p-5 border border-[#e8e4dc] hover-lift"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: LENS_COLORS[interp.lens] || '#8b7355' }}
                                            />
                                            <span className="text-sm font-medium text-[#5c5346]">
                                                {interp.lens === 'ZwinglianBaptistic' ? 'Zwinglian/Baptist' : interp.lens} View
                                            </span>
                                        </div>

                                        <p className="text-sm text-[#6b6358] leading-relaxed mb-4">
                                            {interp.summary}
                                        </p>

                                        {interp.key_points.length > 0 && (
                                            <div className="border-t border-[#e8e4dc] pt-4">
                                                <h4 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-2">
                                                    Key Points
                                                </h4>
                                                <ul className="space-y-2">
                                                    {interp.key_points.map((point, i) => (
                                                        <li key={i} className="flex gap-2 text-xs text-[#6b6358]">
                                                            <span className="text-[#d4af37]">•</span>
                                                            {point.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>
                </div>

                {/* Decorative footer */}
                <div className="mt-16 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-[#d4af37]/60">
                            <span className="w-12 h-[1px] bg-current" />
                            <span className="text-sm decorative-star">✦</span>
                            <span className="w-12 h-[1px] bg-current" />
                        </div>
                    </div>
                    <p className="text-[#9a9285] text-sm">
                        Tracing doctrine through {nodes.length} historical sources.
                    </p>
                </div>
            </main>
        </div>
    );
}
