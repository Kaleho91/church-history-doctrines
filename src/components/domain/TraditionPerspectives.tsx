'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClaimPositions, getTraditionBreadth } from '@/lib/scoring';
import { TraditionPosition, TraditionFamily, Stance } from '@/lib/types';
import { ChevronRight, Check, X, Minus } from 'lucide-react';

interface TraditionPerspectivesProps {
    claimId: string;
}

const CONFIDENCE_INFO: Record<'High' | 'Medium' | 'Contested', {
    label: string;
    description: string;
    color: string;
}> = {
    High: {
        label: 'High',
        description: 'Well-documented position',
        color: 'text-emerald-400'
    },
    Medium: {
        label: 'Medium',
        description: 'Some scholarly debate',
        color: 'text-amber-400'
    },
    Contested: {
        label: 'Contested',
        description: 'Active disagreement',
        color: 'text-rose-400'
    }
};

const STANCE_STYLES: Record<Stance, {
    icon: React.ReactNode;
    label: string;
    color: string;
}> = {
    Affirm: {
        icon: <Check className="w-3 h-3" />,
        label: 'Affirms',
        color: 'text-emerald-400'
    },
    Modify: {
        icon: <Minus className="w-3 h-3" />,
        label: 'Modifies',
        color: 'text-amber-400'
    },
    Deny: {
        icon: <X className="w-3 h-3" />,
        label: 'Denies',
        color: 'text-rose-400'
    },
    Divide: {
        icon: <Minus className="w-3 h-3" />,
        label: 'Divided',
        color: 'text-purple-400'
    },
    Vary: {
        icon: <Minus className="w-3 h-3" />,
        label: 'Varies',
        color: 'text-blue-400'
    },
};

const FAMILY_ACCENT: Record<TraditionFamily, string> = {
    'Catholic': 'border-l-rose-400',
    'Eastern Orthodox': 'border-l-amber-500',
    'Oriental Orthodox': 'border-l-orange-400',
    'Protestant': 'border-l-blue-400',
    'Other': 'border-l-white/30',
};

export function TraditionPerspectives({ claimId }: TraditionPerspectivesProps) {
    const [expanded, setExpanded] = useState(true);
    const positions = getClaimPositions(claimId);
    const breadth = getTraditionBreadth(claimId);

    if (positions.length === 0) {
        return null;
    }

    const byStance = positions.reduce((acc, pos) => {
        const stance = pos.stance;
        if (!acc[stance]) acc[stance] = [];
        acc[stance].push(pos);
        return acc;
    }, {} as Record<Stance, TraditionPosition[]>);

    const stanceOrder: Stance[] = ['Affirm', 'Modify', 'Deny', 'Divide', 'Vary'];

    return (
        <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div>
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2">
                        Tradition Perspectives
                    </h3>

                    <div className="flex items-center gap-3 text-xs">
                        {breadth.affirm > 0 && (
                            <span className="text-emerald-400 font-medium">
                                {breadth.affirm} affirm
                            </span>
                        )}
                        {breadth.modify > 0 && (
                            <span className="text-amber-400 font-medium">
                                {breadth.modify} modify
                            </span>
                        )}
                        {breadth.deny > 0 && (
                            <span className="text-rose-400 font-medium">
                                {breadth.deny} deny
                            </span>
                        )}
                        <span className="text-white/30">
                            · {breadth.total} total
                        </span>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: expanded ? 90 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-white/40"
                >
                    <ChevronRight className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-5 border-t border-white/5 pt-4">
                            {stanceOrder.map(stance => {
                                const stancePositions = byStance[stance];
                                if (!stancePositions || stancePositions.length === 0) return null;

                                const stanceStyle = STANCE_STYLES[stance];

                                return (
                                    <div key={stance}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${stanceStyle.color}`}>
                                                {stanceStyle.icon}
                                                {stanceStyle.label}
                                            </span>
                                            <span className="text-xs text-white/20">
                                                {stancePositions.length}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {stancePositions.map((pos, i) => (
                                                <TraditionCard key={`${pos.traditionName}-${i}`} position={pos} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            <p className="text-[10px] text-white/20 pt-3 border-t border-white/5">
                                Based on confessional documents and scholarly consensus.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TraditionCard({ position }: { position: TraditionPosition }) {
    const familyAccent = FAMILY_ACCENT[position.family] || FAMILY_ACCENT['Other'];
    const confidenceInfo = CONFIDENCE_INFO[position.confidence];

    return (
        <div className={`
            border-l-2 ${familyAccent} pl-3 py-2
            hover:bg-white/[0.02] transition-colors rounded-r
        `}>
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-white">
                    {position.traditionName}
                </span>

                <span className={`text-[10px] ${confidenceInfo.color} font-medium`}>
                    {confidenceInfo.description}
                </span>
            </div>

            <p className="text-xs text-white/40 leading-relaxed">
                {position.summary}
            </p>
        </div>
    );
}
