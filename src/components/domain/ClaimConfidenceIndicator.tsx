'use client';

import React, { useState } from 'react';
import { getClaim } from '@/lib/data';
import { ClaimScoring, ConfidenceLevel } from '@/lib/types';

interface ClaimConfidenceProps {
    claimId: string;
}

/**
 * SYSTEM 1: Claim Confidence Engine
 * 
 * Displays algorithmically-derived confidence based on scoring components:
 * - ScriptureScore (0-3): How explicit is biblical support?
 * - PatristicBreadth (0-3): How widespread in early church fathers?
 * - CouncilScore (0-2): Council/creedal endorsement level?
 * - ConsensusScore (0-3): Cross-tradition agreement?
 * 
 * Confidence levels:
 * - High: Strong agreement across historical sources
 * - Mixed: Sources agree on core claims; details debated
 * - Contested: Multiple interpretations exist in the sources
 */
export function ClaimConfidenceIndicator({ claimId }: ClaimConfidenceProps) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const claim = getClaim(claimId);

    if (!claim) return null;

    const { scoring } = claim;
    const confidence = scoring.derivedConfidence as ConfidenceLevel;

    const styles = {
        High: {
            container: 'border-l-stone-300 bg-stone-50/50',
            text: 'text-stone-600',
            bar: 'bg-emerald-500',
        },
        Medium: {
            container: 'border-l-amber-300/70 bg-amber-50/30',
            text: 'text-amber-700/80',
            bar: 'bg-amber-400',
        },
        Mixed: {
            container: 'border-l-amber-300/60 bg-amber-50/30',
            text: 'text-amber-700/80',
            bar: 'bg-amber-400',
        },
        Contested: {
            container: 'border-l-rose-300/60 bg-rose-50/30',
            text: 'text-rose-700/80',
            bar: 'bg-rose-400',
        },
    };

    const descriptions: Record<ConfidenceLevel, string> = {
        High: 'Strong agreement across historical sources',
        Medium: 'Good support with some interpretive differences',
        Mixed: 'Sources agree on core claims; details debated',
        Contested: 'Multiple interpretations exist in the sources',
    };

    const style = styles[confidence] || styles.High;

    return (
        <div className={`border-l-2 pl-4 py-2 ${style.container}`}>
            {/* Main confidence display */}
            <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-left group"
                aria-expanded={showBreakdown}
                aria-label="Toggle scoring breakdown"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className={`text-xs font-medium ${style.text}`}>
                            Historical confidence: {confidence.toLowerCase()}
                        </span>
                        {scoring.tier && (
                            <span className="text-[10px] text-stone-400">
                                • {scoring.tier.replace('Tier ', '').replace(' – ', ': ')}
                            </span>
                        )}
                    </div>
                    <span className="text-stone-300 text-xs group-hover:text-stone-500 transition-colors">
                        {showBreakdown ? '▲' : '▼'}
                    </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                    {descriptions[confidence]}
                </p>
            </button>

            {/* Scoring breakdown - collapsible */}
            {showBreakdown && (
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5 animate-in slide-in-from-top-1 duration-200">
                    <ScoreBar
                        label="Scripture"
                        value={scoring.scriptureScore}
                        max={3}
                        sublabel={scoring.scriptureClass}
                    />
                    <ScoreBar
                        label="Patristic Breadth"
                        value={scoring.patristicBreadth}
                        max={3}
                    />
                    <ScoreBar
                        label="Council/Creed"
                        value={scoring.councilScore}
                        max={2}
                    />
                    <ScoreBar
                        label="Cross-Tradition"
                        value={scoring.consensusScore}
                        max={3}
                    />
                </div>
            )}
        </div>
    );
}

interface ScoreBarProps {
    label: string;
    value: number;
    max: number;
    sublabel?: string;
}

function ScoreBar({ label, value, max, sublabel }: ScoreBarProps) {
    const percentage = Math.round((value / max) * 100);

    // Color based on percentage
    let barColor = 'bg-stone-300';
    if (percentage >= 80) barColor = 'bg-emerald-400';
    else if (percentage >= 50) barColor = 'bg-amber-400';
    else if (percentage > 0) barColor = 'bg-rose-300';

    return (
        <div className="flex items-center gap-3">
            <div className="w-28 flex-shrink-0">
                <span className="text-xs text-stone-500">{label}</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-[10px] text-stone-400 w-8 text-right">
                    {value}/{max}
                </span>
            </div>
            {sublabel && (
                <span className="text-[10px] text-stone-400 ml-1 truncate max-w-24">
                    {sublabel}
                </span>
            )}
        </div>
    );
}

/**
 * Compact version for use in cards/lists
 */
export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
    const styles: Record<ConfidenceLevel, string> = {
        High: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Medium: 'bg-amber-50 text-amber-700 border-amber-200',
        Mixed: 'bg-amber-50 text-amber-700 border-amber-200',
        Contested: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[confidence] || styles.High}`}>
            {confidence}
        </span>
    );
}
