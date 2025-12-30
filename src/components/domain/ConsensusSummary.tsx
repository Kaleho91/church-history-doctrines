import React from 'react';
import { getTrace } from '@/lib/data';
import { CheckCircle2, AlertCircle, Split } from 'lucide-react';

interface ConsensusSummaryProps {
    claimId: string;
}

export function ConsensusSummary({ claimId }: ConsensusSummaryProps) {
    const trace = getTrace(claimId);

    // Analyze confidence levels across the trace
    const highConfidence = trace.filter(node => node.edge.confidence === 'High');
    const contested = trace.filter(node => node.edge.confidence === 'Contested');
    const medium = trace.filter(node => node.edge.confidence === 'Medium');

    // Derive insights
    const hasConsensus = highConfidence.length >= 3;
    const hasDebate = medium.length > 0 || contested.length > 0;
    const hasSplit = contested.length >= 2;

    return (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl border border-stone-200 p-6 mb-8">
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
                Historical Assessment
            </h3>

            <div className="space-y-3">
                {hasConsensus && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-emerald-900 text-sm mb-1">CONSENSUS (High Confidence)</div>
                            <p className="text-sm text-emerald-800">
                                Early church sources consistently use regeneration/remission vocabulary in baptismal contexts
                                ({highConfidence.length} supporting nodes)
                            </p>
                        </div>
                    </div>
                )}

                {hasDebate && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-amber-900 text-sm mb-1">DEBATED (Medium Confidence)</div>
                            <p className="text-sm text-amber-800">
                                Interpretation of whether this vocabulary implies mechanical instrumentality vs. covenantal signing
                                ({medium.length} nodes with varied readings)
                            </p>
                        </div>
                    </div>
                )}

                {hasSplit && (
                    <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                        <Split className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-rose-900 text-sm mb-1">TRADITION SPLIT (Contested)</div>
                            <p className="text-sm text-rose-800">
                                Catholic/Orthodox traditions emphasize sacramental instrumentality; Reformed traditions emphasize covenantal sign and appointed-time efficacy
                                ({contested.length} contested interpretations)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200">
                <p className="text-xs text-stone-500 italic">
                    This summary is derived from {trace.length} historical nodes across {
                        Math.ceil((trace[trace.length - 1]?.parsedYear - trace[0]?.parsedYear) / 100)
                    }+ centuries of church history
                </p>
            </div>
        </div>
    );
}
