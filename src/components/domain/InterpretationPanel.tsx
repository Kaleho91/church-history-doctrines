'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Interpretation, LensType } from '@/lib/types';
import { CitationList } from './CitationList';
import { Check, Shield, AlertTriangle } from 'lucide-react';
import { transitions, variants } from '@/lib/motion';

const LENSES: LensType[] = ['Consensus', 'Catholic', 'Orthodox', 'Lutheran', 'Reformed', 'ZwinglianBaptistic'];

const LENS_LABELS: Record<LensType, string> = {
    Consensus: 'Consensus',
    Catholic: 'Catholic',
    Orthodox: 'Orthodox',
    Lutheran: 'Lutheran',
    Reformed: 'Reformed',
    ZwinglianBaptistic: 'Zwinglian/Baptistic',
};

const LENS_COLORS: Record<LensType, { border: string; bg: string; badge: string }> = {
    Consensus: { border: 'border-l-4 border-l-stone-400', bg: 'bg-stone-50', badge: 'bg-stone-100 text-stone-700' },
    Catholic: { border: 'border-l-4 border-l-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700' },
    Orthodox: { border: 'border-l-4 border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
    Lutheran: { border: 'border-l-4 border-l-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-700' },
    Reformed: { border: 'border-l-4 border-l-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    ZwinglianBaptistic: { border: 'border-l-4 border-l-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
};

export function InterpretationPanel({ interpretations }: { interpretations: Interpretation[] }) {
    const [activeLens, setActiveLens] = useState<LensType>('Consensus');
    const shouldReduceMotion = useReducedMotion();

    const currentInt = interpretations.find(i => i.lens === activeLens) || interpretations[0];

    return (
        <div className="sticky top-6 space-y-6">
            {/* Lens Toggle with Pill Animation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Theological Lens
                    </h3>
                </div>
                <div className="p-2 grid grid-cols-2 gap-1 sm:grid-cols-3 relative">
                    {LENSES.map(lens => (
                        <button
                            key={lens}
                            onClick={() => setActiveLens(lens)}
                            className={`relative text-xs px-2 py-2 rounded-md font-medium text-left z-10 transition-colors ${activeLens === lens
                                ? 'text-blue-700'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            aria-pressed={activeLens === lens}
                        >
                            {/* Animated pill background */}
                            {activeLens === lens && (
                                <motion.div
                                    layoutId="lens-pill"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-md -z-10 shadow-sm"
                                    transition={shouldReduceMotion ? { duration: 0 } : transitions.medium}
                                    style={{
                                        boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.1), 0 2px 4px rgba(99, 102, 241, 0.1)'
                                    }}
                                />
                            )}
                            {activeLens === lens && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
                            {LENS_LABELS[lens]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Interpretation Content with Fade/Slide Transition and Lens Color */}
            <div className={`bg-white rounded-xl shadow-sm border border-stone-200 p-6 ${LENS_COLORS[activeLens].border}`}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeLens}
                        initial={shouldReduceMotion ? undefined : variants.fadeSlideUp.initial}
                        animate={shouldReduceMotion ? undefined : variants.fadeSlideUp.animate}
                        exit={shouldReduceMotion ? undefined : variants.fadeSlideUp.exit}
                        transition={transitions.short}
                    >
                        <div className="mb-4">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${LENS_COLORS[activeLens].badge}`}>
                                {LENS_LABELS[activeLens]} Perspective
                            </span>
                        </div>

                        <p className="text-lg text-slate-800 leading-relaxed mb-6 font-medium">
                            {currentInt?.summary}
                        </p>

                        <div className="space-y-3">
                            {currentInt?.key_points.map((point, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
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
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> What's Debated
            </h3>

            <div className="space-y-4">
                <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 mb-1">
                        High Confidence
                    </span>
                    <p className="text-sm text-slate-600">
                        Early church usage of "regeneration" vocabulary for baptism.
                    </p>
                </div>
                <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 mb-1">
                        Contested
                    </span>
                    <p className="text-sm text-slate-600">
                        Whether this vocabulary implies mechanical instrumentality vs. covenantal signing vs. spiritual reception.
                    </p>
                </div>
            </div>
        </div>
    );
}
