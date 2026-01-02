'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Interpretation, LensType } from '@/lib/types';
import { CitationList } from './CitationList';
import { Check, AlertTriangle } from 'lucide-react';

const LENSES: LensType[] = ['Consensus', 'Catholic', 'Orthodox', 'Lutheran', 'Reformed', 'ZwinglianBaptistic'];

const LENS_LABELS: Record<LensType, string> = {
    Consensus: 'Consensus',
    Catholic: 'Catholic',
    Orthodox: 'Orthodox',
    Lutheran: 'Lutheran',
    Reformed: 'Reformed',
    ZwinglianBaptistic: 'Zwinglian/Baptistic',
};

const LENS_COLORS: Record<LensType, { accent: string; border: string; bg: string }> = {
    Consensus: { accent: 'text-white', border: 'border-l-white/50', bg: 'bg-white/10' },
    Catholic: { accent: 'text-rose-400', border: 'border-l-rose-400', bg: 'bg-rose-500/10' },
    Orthodox: { accent: 'text-amber-400', border: 'border-l-amber-500', bg: 'bg-amber-500/10' },
    Lutheran: { accent: 'text-purple-400', border: 'border-l-purple-400', bg: 'bg-purple-500/10' },
    Reformed: { accent: 'text-blue-400', border: 'border-l-blue-400', bg: 'bg-blue-500/10' },
    ZwinglianBaptistic: { accent: 'text-emerald-400', border: 'border-l-emerald-400', bg: 'bg-emerald-500/10' },
};

function getLensContextNote(lens: LensType): string {
    const notes: Record<LensType, string> = {
        Consensus: 'Reflects broad agreement across major Christian traditions.',
        Catholic: 'Draws on magisterial teaching and sacramental theology.',
        Orthodox: 'Emphasizes theosis, mystery, and patristic continuity.',
        Lutheran: 'Prioritizes justification by grace through faith.',
        Reformed: 'Emphasizes covenant theology and divine sovereignty.',
        ZwinglianBaptistic: "Prioritizes memorial understanding and believer's profession.",
    };
    return notes[lens];
}

function getDebatedContent(interpretations: Interpretation[]): { high: string; contested: string } {
    const claimId = interpretations[0]?.claim_id || '';

    if (claimId.startsWith('CLM_TR')) {
        return {
            high: 'Universal affirmation of Nicene Trinitarianism across major traditions.',
            contested: 'The Filioque clause and the precise language of eternal procession.',
        };
    }
    if (claimId.startsWith('CLM_EU')) {
        return {
            high: 'Early church witness to Christ\'s presence in the Eucharist.',
            contested: 'Mode of presence: transubstantiation, sacramental union, spiritual, or memorial.',
        };
    }
    return {
        high: 'Early church usage of "regeneration" vocabulary for baptism.',
        contested: 'Whether this vocabulary implies mechanical instrumentality vs. covenantal signing.',
    };
}

export function InterpretationPanel({ interpretations }: { interpretations: Interpretation[] }) {
    const [activeLens, setActiveLens] = useState<LensType>('Consensus');
    const shouldReduceMotion = useReducedMotion();

    const currentInt = interpretations.find(i => i.lens === activeLens) || interpretations[0];
    const lensColor = LENS_COLORS[activeLens];
    const debatedContent = getDebatedContent(interpretations);

    return (
        <div className="space-y-4">
            {/* Lens Toggle */}
            <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                        Theological Lens
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-px bg-white/5">
                    {LENSES.map(lens => {
                        const isActive = lens === activeLens;
                        const hasData = interpretations.some(i => i.lens === lens);
                        const color = LENS_COLORS[lens];

                        return (
                            <button
                                key={lens}
                                onClick={() => hasData && setActiveLens(lens)}
                                disabled={!hasData}
                                className={`
                                    px-3 py-2 text-xs font-medium transition-all
                                    ${isActive
                                        ? `${color.bg} ${color.accent}`
                                        : hasData
                                            ? 'bg-[#0a0a0a] text-white/40 hover:bg-white/5 hover:text-white/70'
                                            : 'bg-[#0a0a0a] text-white/20 cursor-not-allowed'
                                    }
                                `}
                            >
                                {LENS_LABELS[lens]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Perspective Content */}
            <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeLens}
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`p-4 border-l-4 ${lensColor.border}`}
                    >
                        <h4 className={`text-sm font-bold ${lensColor.accent} mb-2`}>
                            {LENS_LABELS[activeLens]} Perspective
                        </h4>

                        <p className="text-sm text-white/60 leading-relaxed mb-3">
                            {currentInt?.summary || 'No interpretation available for this lens.'}
                        </p>

                        {currentInt?.key_points && currentInt.key_points.length > 0 && (
                            <ul className="space-y-2 mb-3">
                                {currentInt.key_points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-white/50">
                                            {point.text}
                                            {point.citations.length > 0 && (
                                                <CitationList citationIds={point.citations} />
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <p className="text-xs text-white/30 mt-4 pt-3 border-t border-white/5">
                            {getLensContextNote(activeLens)}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* What's Debated */}
            <div className="bg-amber-500/5 rounded-xl border border-amber-500/20 p-4">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    What's Debated
                </h3>

                <div className="space-y-3">
                    <div>
                        <span className="text-xs font-medium text-emerald-400 block mb-1">
                            High confidence
                        </span>
                        <p className="text-sm text-white/50">
                            {debatedContent.high}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-rose-400 block mb-1">
                            Contested
                        </span>
                        <p className="text-sm text-white/50">
                            {debatedContent.contested}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
