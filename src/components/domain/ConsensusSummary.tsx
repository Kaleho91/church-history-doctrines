import React from 'react';
import { getTrace } from '@/lib/data';
import { CheckCircle2, AlertCircle, Split } from 'lucide-react';

interface ConsensusSummaryProps {
    claimId: string;
}

const CLUSTER_CONTENT: Record<string, {
    consensus: string;
    debated: string;
    split: string;
}> = {
    'Baptism & New Birth': {
        consensus: 'Early church sources consistently use regeneration/remission vocabulary in baptismal contexts',
        debated: 'Interpretation of whether this vocabulary implies mechanical instrumentality vs. covenantal signing',
        split: 'Catholic/Orthodox traditions emphasize sacramental instrumentality; Reformed traditions emphasize covenantal sign',
    },
    'Trinity': {
        consensus: 'All major Christian traditions affirm the co-equality and co-eternity of Father, Son, and Holy Spirit',
        debated: 'The precise relationship between economic and immanent Trinity, and the mechanics of eternal generation',
        split: 'Eastern traditions reject the Filioque clause; Western traditions affirm the Spirit proceeds from Father and Son',
    },
    'Eucharist': {
        consensus: 'Early and medieval sources consistently speak of Christ\'s true presence in the Eucharist',
        debated: 'The mode of presence (substantial, sacramental, spiritual, or memorial) and the nature of sacrifice',
        split: 'Catholic/Orthodox affirm transformation; Reformed affirm spiritual presence; Baptists affirm pure memorial',
    },
};

function getClusterFromId(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'Baptism & New Birth';
    if (claimId.startsWith('CLM_TR')) return 'Trinity';
    if (claimId.startsWith('CLM_EU')) return 'Eucharist';
    return 'Baptism & New Birth';
}

export function ConsensusSummary({ claimId }: ConsensusSummaryProps) {
    const trace = getTrace(claimId);
    const cluster = getClusterFromId(claimId);
    const content = CLUSTER_CONTENT[cluster] || CLUSTER_CONTENT['Baptism & New Birth'];

    const highConfidence = trace.filter(node => node.edge.confidence === 'High');
    const contested = trace.filter(node => node.edge.confidence === 'Contested');
    const medium = trace.filter(node => node.edge.confidence === 'Medium');

    const hasConsensus = highConfidence.length >= 3;
    const hasDebate = medium.length > 0 || contested.length > 0;
    const hasSplit = contested.length >= 2;

    return (
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
                Historical Assessment
            </h3>

            <div className="space-y-3">
                {hasConsensus && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-emerald-400 text-sm mb-1">CONSENSUS (High Confidence)</div>
                            <p className="text-sm text-emerald-300/70">
                                {content.consensus}
                                <span className="text-emerald-400/50"> ({highConfidence.length} supporting nodes)</span>
                            </p>
                        </div>
                    </div>
                )}

                {hasDebate && (
                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-amber-400 text-sm mb-1">DEBATED (Medium Confidence)</div>
                            <p className="text-sm text-amber-300/70">
                                {content.debated}
                                <span className="text-amber-400/50"> ({medium.length} nodes with varied readings)</span>
                            </p>
                        </div>
                    </div>
                )}

                {hasSplit && (
                    <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <Split className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-bold text-rose-400 text-sm mb-1">TRADITION SPLIT (Contested)</div>
                            <p className="text-sm text-rose-300/70">
                                {content.split}
                                <span className="text-rose-400/50"> ({contested.length} contested interpretations)</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/30 italic">
                    Derived from {trace.length} historical nodes across {
                        Math.ceil((trace[trace.length - 1]?.parsedYear - trace[0]?.parsedYear) / 100)
                    }+ centuries
                </p>
            </div>
        </div>
    );
}
