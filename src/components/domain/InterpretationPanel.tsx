'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Interpretation, LensType } from '@/lib/types';
import { CitationList } from './CitationList';
import { Check, Shield, AlertTriangle } from 'lucide-react';
import { transitions, perspectiveShift, ease, durations } from '@/lib/motion';

const LENSES: LensType[] = ['Consensus', 'Catholic', 'Orthodox', 'Lutheran', 'Reformed', 'ZwinglianBaptistic'];

const LENS_LABELS: Record<LensType, string> = {
    Consensus: 'Consensus',
    Catholic: 'Catholic',
    Orthodox: 'Orthodox',
    Lutheran: 'Lutheran',
    Reformed: 'Reformed',
    ZwinglianBaptistic: 'Zwinglian/Baptistic',
};

const LENS_COLORS: Record<LensType, { border: string; accent: string; badge: string }> = {
    Consensus: { border: 'border-l-stone-400', accent: 'text-stone-700', badge: 'bg-stone-100 text-stone-700' },
    Catholic: { border: 'border-l-rose-400', accent: 'text-rose-700', badge: 'bg-rose-50 text-rose-700' },
    Orthodox: { border: 'border-l-amber-400', accent: 'text-amber-700', badge: 'bg-amber-50 text-amber-700' },
    Lutheran: { border: 'border-l-purple-400', accent: 'text-purple-700', badge: 'bg-purple-50 text-purple-700' },
    Reformed: { border: 'border-l-blue-400', accent: 'text-blue-700', badge: 'bg-blue-50 text-blue-700' },
    ZwinglianBaptistic: { border: 'border-l-emerald-400', accent: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700' },
};

/**
 * SYSTEM 2: Lens Change = Perspective Shift
 * 
 * Switching lenses should feel like changing vantage points,
 * not toggling data. The panel is a "thinking surface."
 */
export function InterpretationPanel({ interpretations }: { interpretations: Interpretation[] }) {
    const [activeLens, setActiveLens] = useState<LensType>('Consensus');
    const shouldReduceMotion = useReducedMotion();

    const currentInt = interpretations.find(i => i.lens === activeLens) || interpretations[0];
    const lensColor = LENS_COLORS[activeLens];

    return (
        <div className="sticky top-24 space-y-5">
            {/* Lens Toggle - The vantage point selector */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-stone-50/80 border-b border-stone-100 px-4 py-3">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Theological Lens
                    </h3>
                </div>
                <div className="p-2 grid grid-cols-2 gap-1 sm:grid-cols-3 relative">
                    {LENSES.map(lens => (
                        <button
                            key={lens}
                            onClick={() => setActiveLens(lens)}
                            className={`relative text-xs px-3 py-2.5 rounded-lg font-medium text-left z-10 transition-colors ${activeLens === lens
                                    ? LENS_COLORS[lens].accent
                                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                                }`}
                            aria-pressed={activeLens === lens}
                        >
                            {/* Sliding pill - communicates continuity */}
                            {activeLens === lens && (
                                <motion.div
                                    layoutId="lens-pill"
                                    className="absolute inset-0 bg-white rounded-lg -z-10 shadow-sm border border-stone-200"
                                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease }}
                                />
                            )}
                            <span className="flex items-center gap-1.5">
                                {activeLens === lens && <Check className="w-3 h-3" />}
                                {LENS_LABELS[lens]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Interpretation Content - The thinking surface */}
            <div className={`bg-white rounded-xl shadow-md border border-stone-200 border-l-4 ${lensColor.border} overflow-hidden`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeLens}
                        initial={shouldReduceMotion ? undefined : perspectiveShift.initial}
                        animate={shouldReduceMotion ? undefined : perspectiveShift.animate}
                        exit={shouldReduceMotion ? undefined : perspectiveShift.exit}
                        transition={{ duration: durations.short, ease }}
                        className="p-6"
                    >
                        <div className="mb-5">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${lensColor.badge}`}>
                                {LENS_LABELS[activeLens]} Perspective
                            </span>
                        </div>

                        <p className="text-lg text-stone-800 leading-relaxed mb-6 font-serif">
                            {currentInt?.summary}
                        </p>

                        <div className="space-y-4">
                            {currentInt?.key_points.map((point, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${lensColor.accent.replace('text-', 'bg-')}`} />
                                    <p className="text-stone-600 text-sm leading-relaxed">
                                        {point.text}
                                        <CitationList citationIds={point.citations} />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <DebatePanelBox />
        </div>
    );
}

function DebatePanelBox() {
    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> What's Debated
            </h3>

            <div className="space-y-4">
                <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-1.5">
                        High Confidence
                    </span>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Early church usage of "regeneration" vocabulary for baptism.
                    </p>
                </div>
                <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 mb-1.5">
                        Contested
                    </span>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Whether this vocabulary implies mechanical instrumentality vs. covenantal signing vs. spiritual reception.
                    </p>
                </div>
            </div>
        </div>
    );
}
