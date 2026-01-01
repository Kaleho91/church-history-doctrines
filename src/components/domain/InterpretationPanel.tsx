'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Interpretation, Tradition, TraditionPosition } from '@/lib/types';
import { getTraditionsGroupedByFamily, getTradition } from '@/lib/data';
import { CitationList } from './CitationList';
import { Check, Shield, AlertTriangle, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { transitions, perspectiveShift, ease, durations } from '@/lib/motion';

// Family color mapping for visual distinction
const FAMILY_COLORS: Record<string, { border: string; accent: string; badge: string }> = {
    'Catholic': { border: 'border-l-rose-400', accent: 'text-rose-700', badge: 'bg-rose-50 text-rose-700' },
    'Eastern Catholic': { border: 'border-l-rose-300', accent: 'text-rose-600', badge: 'bg-rose-50/70 text-rose-600' },
    'Eastern Orthodox': { border: 'border-l-amber-400', accent: 'text-amber-700', badge: 'bg-amber-50 text-amber-700' },
    'Oriental Orthodox': { border: 'border-l-orange-400', accent: 'text-orange-700', badge: 'bg-orange-50 text-orange-700' },
    'Church of the East': { border: 'border-l-yellow-400', accent: 'text-yellow-700', badge: 'bg-yellow-50 text-yellow-700' },
    'Protestant (Reformation)': { border: 'border-l-blue-400', accent: 'text-blue-700', badge: 'bg-blue-50 text-blue-700' },
    'Protestant (Reformation-derived)': { border: 'border-l-indigo-400', accent: 'text-indigo-700', badge: 'bg-indigo-50 text-indigo-700' },
    'Protestant (modern)': { border: 'border-l-violet-400', accent: 'text-violet-700', badge: 'bg-violet-50 text-violet-700' },
    'Radical Reformation': { border: 'border-l-purple-400', accent: 'text-purple-700', badge: 'bg-purple-50 text-purple-700' },
    'African Initiated / Independent': { border: 'border-l-emerald-400', accent: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700' },
    'Other': { border: 'border-l-stone-400', accent: 'text-stone-700', badge: 'bg-stone-100 text-stone-700' },
};

function getFamilyColor(family: string) {
    return FAMILY_COLORS[family] || FAMILY_COLORS['Other'];
}

// Simplified lens names for display
const SIMPLIFIED_FAMILY_NAMES: Record<string, string> = {
    'Catholic': 'Catholic',
    'Eastern Catholic': 'Eastern Catholic',
    'Eastern Orthodox': 'Eastern Orthodox',
    'Oriental Orthodox': 'Oriental Orthodox',
    'Church of the East': 'Church of East',
    'Protestant (Reformation)': 'Protestant',
    'Protestant (Reformation-derived)': 'Protestant',
    'Protestant (modern)': 'Protestant Modern',
    'Radical Reformation': 'Anabaptist',
    'African Initiated / Independent': 'African Initiated',
    'Non-Nicene movement': 'Non-Nicene',
};

interface InterpretationPanelProps {
    interpretations: Interpretation[];
}

/**
 * SYSTEM 3: Interpretive Framework Lenses
 * 
 * Lenses are NOT opinions — they are structured interpretive frameworks.
 * Each lens explains how traditions read the same historical nodes.
 * 
 * Features:
 * - Two-level navigation: Family → Individual Traditions
 * - Epistemic posture note per tradition
 * - Position summaries with confidence indicators
 * - Side-by-side comparison mode (future)
 */
export function InterpretationPanel({ interpretations }: InterpretationPanelProps) {
    const [activeLens, setActiveLens] = useState<string>('Catholic');
    const [expandedFamily, setExpandedFamily] = useState<string | null>('Catholic');
    const shouldReduceMotion = useReducedMotion();

    // Get available lenses from interpretations
    const availableLenses = useMemo(() => {
        return interpretations.map(i => i.lens);
    }, [interpretations]);

    // Get current interpretation
    const currentInt = useMemo(() => {
        return interpretations.find(i => i.lens === activeLens) || interpretations[0];
    }, [interpretations, activeLens]);

    const lensColor = getFamilyColor(activeLens);

    // Group available interpretations by family type
    const groupedInterpretations = useMemo(() => {
        const groups: Record<string, Interpretation[]> = {};
        for (const interp of interpretations) {
            const family = interp.lens;
            if (!groups[family]) {
                groups[family] = [];
            }
            groups[family].push(interp);
        }
        return groups;
    }, [interpretations]);

    // Priority order for families
    const familyOrder = [
        'Catholic',
        'Eastern Orthodox',
        'Oriental Orthodox',
        'Protestant (Reformation)',
        'Protestant (Reformation-derived)',
        'Protestant (modern)',
        'Other',
    ];

    const sortedFamilies = Object.keys(groupedInterpretations).sort((a, b) => {
        const aIndex = familyOrder.indexOf(a);
        const bIndex = familyOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    return (
        <div className="sticky top-24 space-y-5">
            {/* Lens Toggle - Family-level navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-stone-50/80 border-b border-stone-100 px-4 py-3">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Theological Lens
                    </h3>
                    <p className="text-[10px] text-stone-400 mt-1">
                        How different traditions read the same evidence
                    </p>
                </div>
                <div className="p-2 space-y-1">
                    {sortedFamilies.map(family => (
                        <button
                            key={family}
                            onClick={() => {
                                setActiveLens(family);
                                setExpandedFamily(expandedFamily === family ? null : family);
                            }}
                            className={`relative w-full text-left text-xs px-3 py-2.5 rounded-lg font-medium transition-all ${activeLens === family
                                    ? `${getFamilyColor(family).accent} bg-white shadow-sm border border-stone-200`
                                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                                }`}
                            aria-pressed={activeLens === family}
                        >
                            <span className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    {activeLens === family && <Check className="w-3 h-3" />}
                                    {SIMPLIFIED_FAMILY_NAMES[family] || family}
                                </span>
                                {groupedInterpretations[family]?.length > 0 && (
                                    <span className="text-[10px] text-stone-400">
                                        {groupedInterpretations[family][0]?.positions?.length || 0} traditions
                                    </span>
                                )}
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
                                {SIMPLIFIED_FAMILY_NAMES[activeLens] || activeLens} Perspective
                            </span>
                        </div>

                        <p className="text-lg text-stone-800 leading-relaxed mb-6 font-serif">
                            {currentInt?.summary}
                        </p>

                        {/* Key Points */}
                        {currentInt?.key_points && currentInt.key_points.length > 0 && (
                            <div className="space-y-4">
                                {currentInt.key_points.slice(0, 5).map((point, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${lensColor.accent.replace('text-', 'bg-')}`} />
                                        <p className="text-stone-600 text-sm leading-relaxed">
                                            {point.text}
                                            <CitationList citationIds={point.citations} />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tradition Positions Breakdown */}
                        {currentInt?.positions && currentInt.positions.length > 0 && (
                            <TraditionPositionsList positions={currentInt.positions} />
                        )}

                        {/* Epistemic Posture Note */}
                        <EpistemicPostureNote lens={activeLens} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Debate Summary */}
            <DebatePanelBox />
        </div>
    );
}

interface TraditionPositionsListProps {
    positions: TraditionPosition[];
}

function TraditionPositionsList({ positions }: TraditionPositionsListProps) {
    const [expanded, setExpanded] = useState(false);

    // Group by stance
    const stanceGroups = useMemo(() => {
        const groups: Record<string, TraditionPosition[]> = {};
        for (const pos of positions) {
            const stance = pos.stance || 'Other';
            if (!groups[stance]) {
                groups[stance] = [];
            }
            groups[stance].push(pos);
        }
        return groups;
    }, [positions]);

    const stanceOrder = ['Affirm', 'Modify', 'Deny', 'Divide', 'Vary'];
    const sortedStances = Object.keys(stanceGroups).sort((a, b) => {
        const aIndex = stanceOrder.indexOf(a);
        const bIndex = stanceOrder.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });

    const STANCE_COLORS: Record<string, string> = {
        Affirm: 'bg-emerald-100 text-emerald-800',
        Modify: 'bg-amber-100 text-amber-800',
        Deny: 'bg-rose-100 text-rose-800',
        Divide: 'bg-purple-100 text-purple-800',
        Vary: 'bg-blue-100 text-blue-800',
    };

    return (
        <div className="mt-6 pt-4 border-t border-stone-100">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
            >
                {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {positions.length} tradition positions
            </button>

            {expanded && (
                <div className="mt-3 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    {sortedStances.map(stance => (
                        <div key={stance}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STANCE_COLORS[stance] || 'bg-stone-100 text-stone-700'}`}>
                                    {stance}
                                </span>
                                <span className="text-[10px] text-stone-400">
                                    {stanceGroups[stance].length} traditions
                                </span>
                            </div>
                            <div className="pl-3 space-y-1">
                                {stanceGroups[stance].slice(0, 3).map((pos, i) => (
                                    <div key={i} className="text-xs text-stone-500">
                                        <span className="font-medium">{pos.traditionName}</span>
                                        {pos.summary && <span className="text-stone-400"> — {pos.summary.slice(0, 80)}{pos.summary.length > 80 ? '...' : ''}</span>}
                                    </div>
                                ))}
                                {stanceGroups[stance].length > 3 && (
                                    <div className="text-[10px] text-stone-400 italic">
                                        +{stanceGroups[stance].length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function EpistemicPostureNote({ lens }: { lens: string }) {
    // Posture descriptions by family
    const postures: Record<string, string> = {
        'Catholic': 'This reading draws on magisterial teaching, sacramental theology, and the development of doctrine under papal authority.',
        'Eastern Catholic': 'This reading combines Eastern liturgical and theological traditions with communion with Rome.',
        'Eastern Orthodox': 'This reading emphasizes theosis, mystery, patristic continuity, and conciliar authority.',
        'Oriental Orthodox': 'This reading draws on non-Chalcedonian christology and ancient Alexandrian/Syriac traditions.',
        'Church of the East': 'This reading reflects East Syriac theological heritage and distinctive liturgical tradition.',
        'Protestant (Reformation)': 'This reading prioritizes Scripture as primary authority with tradition valued but subordinate.',
        'Protestant (Reformation-derived)': 'This reading builds on Reformation principles with distinctive emphases (holiness, believer\'s church, etc.).',
        'Protestant (modern)': 'This reading reflects modern evangelical, Pentecostal, or Adventist theological developments.',
        'Radical Reformation': 'This reading emphasizes believer\'s church, discipleship, peace witness, and separation from state.',
        'African Initiated / Independent': 'This reading integrates historic Christian faith with indigenous African expressions and experiences.',
        'Non-Nicene movement': 'This reading represents movements outside historic Nicene orthodoxy (included for boundary-marking).',
    };

    const posture = postures[lens] || 'This reading reflects the distinctive theological commitments of this tradition.';

    return (
        <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-stone-300 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-stone-400 italic leading-relaxed">
                    {posture}
                </p>
            </div>
        </div>
    );
}

function DebatePanelBox() {
    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Where Certainty Ends
            </h3>

            <div className="space-y-3 text-sm text-stone-600">
                <p className="leading-relaxed">
                    History reveals <strong>what was believed</strong>. Interpretation debates <strong>what it means</strong>.
                </p>
                <p className="text-xs text-stone-400 italic">
                    This system teaches how beliefs are justified, not what to believe.
                </p>
            </div>
        </div>
    );
}
