'use client';

import React, { useState } from 'react';
import { getClaimScoring, getTraditionBreadth } from '@/lib/scoring';
import { ClaimScoring, ConfidenceLevel } from '@/lib/types';
import { ChevronDown, ChevronUp, BookOpen, Users, Landmark, Globe } from 'lucide-react';

interface ClaimConfidenceProps {
    claimId: string;
}

export function ClaimConfidenceIndicator({ claimId }: ClaimConfidenceProps) {
    const [showBreakdown, setShowBreakdown] = useState(false);
    const scoring = getClaimScoring(claimId);
    const breadth = getTraditionBreadth(claimId);

    if (!scoring) {
        return (
            <div className="text-xs text-white/30 italic">
                Scoring data not available for this claim.
            </div>
        );
    }

    const confidence = scoring.derivedConfidence;

    const styles: Record<ConfidenceLevel, { container: string; text: string; dot: string }> = {
        High: {
            container: 'border-l-emerald-500 bg-emerald-500/10',
            text: 'text-emerald-400',
            dot: 'bg-emerald-500',
        },
        Medium: {
            container: 'border-l-amber-500 bg-amber-500/10',
            text: 'text-amber-400',
            dot: 'bg-amber-500',
        },
        Contested: {
            container: 'border-l-rose-400 bg-rose-500/10',
            text: 'text-rose-400',
            dot: 'bg-rose-400',
        },
    };

    const descriptions: Record<ConfidenceLevel, string> = {
        High: 'Strong agreement across historical sources',
        Medium: 'Good support with some interpretive differences',
        Contested: 'Multiple interpretations exist in the sources',
    };

    const style = styles[confidence];

    return (
        <div className={`border-l-4 rounded-r-lg ${style.container}`}>
            <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full text-left px-4 py-3 group"
                aria-expanded={showBreakdown}
                aria-label="Toggle scoring breakdown"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <div>
                            <span className={`text-sm font-semibold ${style.text}`}>
                                Historical confidence: {confidence.toLowerCase()}
                            </span>
                            {scoring.tier && (
                                <span className="text-xs text-white/30 ml-2">
                                    • {scoring.tier.replace('Tier ', '').replace(' – ', ': ')}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="text-white/30 group-hover:text-white/50 transition-colors">
                        {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                </div>
                <p className="text-xs text-white/40 mt-1 pl-5">
                    {descriptions[confidence]}
                </p>
            </button>

            {showBreakdown && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    <ScoreRow
                        icon={<BookOpen className="w-4 h-4" />}
                        label="Scripture"
                        value={scoring.scriptureScore}
                        max={3}
                        sublabel={scoring.scriptureClass}
                    />
                    <ScoreRow
                        icon={<Users className="w-4 h-4" />}
                        label="Patristic Breadth"
                        value={scoring.patristicBreadth}
                        max={3}
                    />
                    <ScoreRow
                        icon={<Landmark className="w-4 h-4" />}
                        label="Council/Creed"
                        value={scoring.councilScore}
                        max={2}
                    />
                    <ScoreRow
                        icon={<Globe className="w-4 h-4" />}
                        label="Cross-Tradition"
                        value={scoring.consensusScore}
                        max={3}
                    />

                    {breadth.total > 0 && (
                        <div className="pt-2 mt-2 border-t border-white/5">
                            <div className="flex items-center gap-3 text-xs text-white/40">
                                <span className="font-medium">Tradition breadth:</span>
                                {breadth.affirm > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                        {breadth.affirm} affirm
                                    </span>
                                )}
                                {breadth.modify > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                        {breadth.modify} modify
                                    </span>
                                )}
                                {breadth.deny > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                                        {breadth.deny} deny
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface ScoreRowProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    max: number;
    sublabel?: string;
}

function ScoreRow({ icon, label, value, max, sublabel }: ScoreRowProps) {
    const percentage = Math.round((value / max) * 100);

    let barColor = 'bg-white/20';
    if (percentage >= 80) barColor = 'bg-emerald-500';
    else if (percentage >= 50) barColor = 'bg-amber-500';
    else if (percentage > 0) barColor = 'bg-rose-400';

    return (
        <div className="flex items-center gap-3">
            <div className="text-white/30">{icon}</div>
            <div className="w-28 flex-shrink-0">
                <span className="text-xs font-medium text-white/60">{label}</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-xs text-white/40 w-8 text-right font-mono">
                    {value}/{max}
                </span>
            </div>
            {sublabel && (
                <span className="text-[10px] text-white/30 truncate max-w-20">
                    {sublabel}
                </span>
            )}
        </div>
    );
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
    const styles: Record<ConfidenceLevel, string> = {
        High: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        Contested: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[confidence]}`}>
            {confidence}
        </span>
    );
}
