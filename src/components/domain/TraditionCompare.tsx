'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClaimPositions } from '@/lib/scoring';
import { TraditionPosition, TraditionFamily, Stance } from '@/lib/types';
import { Layers, Check, X, Minus, GitCompare, Sparkles } from 'lucide-react';

interface TraditionCompareProps {
    claimId: string;
}

const AVAILABLE_TRADITIONS = [
    { id: 'TR001', name: 'Roman Catholic', family: 'Catholic' as TraditionFamily },
    { id: 'TR002', name: 'Eastern Orthodox', family: 'Eastern Orthodox' as TraditionFamily },
    { id: 'TR003', name: 'Oriental Orthodox', family: 'Oriental Orthodox' as TraditionFamily },
    { id: 'TR013', name: 'Lutheran', family: 'Protestant' as TraditionFamily },
    { id: 'TR014', name: 'Reformed/Presbyterian', family: 'Protestant' as TraditionFamily },
    { id: 'TR012', name: 'Anglican', family: 'Protestant' as TraditionFamily },
    { id: 'TR016', name: 'Baptist', family: 'Protestant' as TraditionFamily },
    { id: 'TR017', name: 'Anabaptist/Mennonite', family: 'Protestant' as TraditionFamily },
    { id: 'TR018', name: 'Pentecostal', family: 'Protestant' as TraditionFamily },
];

const FAMILY_COLORS: Record<TraditionFamily, { bg: string; border: string; text: string }> = {
    'Catholic': { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
    'Eastern Orthodox': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    'Oriental Orthodox': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    'Protestant': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    'Other': { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/50' },
};

const STANCE_DISPLAY: Record<Stance, { icon: React.ReactNode; color: string; bgColor: string }> = {
    Affirm: { icon: <Check className="w-4 h-4" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    Modify: { icon: <Minus className="w-4 h-4" />, color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    Deny: { icon: <X className="w-4 h-4" />, color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
    Divide: { icon: <Minus className="w-4 h-4" />, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    Vary: { icon: <Minus className="w-4 h-4" />, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
};

export function TraditionCompare({ claimId }: TraditionCompareProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTraditions, setSelectedTraditions] = useState<string[]>(['TR001', 'TR014']);

    const positions = getClaimPositions(claimId);

    if (positions.length === 0) return null;

    const toggleTradition = (tradId: string) => {
        setSelectedTraditions(prev => {
            if (prev.includes(tradId)) {
                return prev.filter(t => t !== tradId);
            }
            if (prev.length >= 3) {
                return [...prev.slice(1), tradId];
            }
            return [...prev, tradId];
        });
    };

    const selectedPositions = selectedTraditions
        .map(id => positions.find(p => p.traditionId === id))
        .filter((p): p is TraditionPosition => p !== undefined);

    const stances = selectedPositions.map(p => p.stance);
    const allAgree = stances.every(s => s === stances[0]);
    const hasDivergence = !allAgree && selectedPositions.length >= 2;

    return (
        <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <GitCompare className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide">
                            Compare Traditions
                        </h3>
                        <p className="text-xs text-white/30 mt-0.5">
                            See where traditions agree or diverge
                        </p>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-white/40"
                >
                    <Layers className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                            <div>
                                <p className="text-xs text-white/40 mb-2">
                                    Select up to 3 traditions to compare:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {AVAILABLE_TRADITIONS.map(trad => {
                                        const isSelected = selectedTraditions.includes(trad.id);
                                        const hasPosition = positions.some(p => p.traditionId === trad.id);
                                        const colors = FAMILY_COLORS[trad.family];

                                        if (!hasPosition) return null;

                                        return (
                                            <button
                                                key={trad.id}
                                                onClick={() => toggleTradition(trad.id)}
                                                className={`
                                                    px-2.5 py-1 text-xs font-medium rounded-lg border transition-all
                                                    ${isSelected
                                                        ? `${colors.bg} ${colors.border} ${colors.text}`
                                                        : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20'
                                                    }
                                                `}
                                            >
                                                {trad.name.split('/')[0]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedPositions.length >= 2 && (
                                <div className="space-y-3">
                                    {hasDivergence && (
                                        <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-500/20">
                                            <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="text-xs font-semibold text-purple-300">
                                                    Divergence Point
                                                </span>
                                                <p className="text-xs text-purple-400/70 mt-0.5">
                                                    These traditions hold different positions on this claim.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {allAgree && (
                                        <div className="flex items-start gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="text-xs font-semibold text-emerald-300">
                                                    Agreement
                                                </span>
                                                <p className="text-xs text-emerald-400/70 mt-0.5">
                                                    These traditions share the same stance on this claim.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedPositions.length}, 1fr)` }}>
                                        {selectedPositions.map((pos) => {
                                            const stanceDisplay = STANCE_DISPLAY[pos.stance];
                                            const familyColors = FAMILY_COLORS[pos.family];

                                            return (
                                                <div
                                                    key={pos.traditionId}
                                                    className={`p-3 rounded-lg border ${familyColors.border} ${familyColors.bg}`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-semibold ${familyColors.text}`}>
                                                            {pos.traditionName.split('/')[0]}
                                                        </span>
                                                        <span className={`p-1 rounded ${stanceDisplay.bgColor} ${stanceDisplay.color}`}>
                                                            {stanceDisplay.icon}
                                                        </span>
                                                    </div>
                                                    <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${stanceDisplay.color}`}>
                                                        {pos.stance}
                                                    </div>
                                                    <p className="text-[11px] text-white/40 leading-relaxed">
                                                        {pos.summary.slice(0, 100)}{pos.summary.length > 100 ? '...' : ''}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedPositions.length < 2 && (
                                <p className="text-xs text-white/30 text-center py-4">
                                    Select at least 2 traditions to compare
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
