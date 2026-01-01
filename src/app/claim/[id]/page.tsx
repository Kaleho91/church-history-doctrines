import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClaim, getTrace, getInterpretations, getAllClaims } from '@/lib/data';
import { TraceRail } from '@/components/domain/TraceRail';
import { InterpretationPanel } from '@/components/domain/InterpretationPanel';
import { ReadingProgress } from '@/components/domain/ReadingProgress';
import { KeyboardShortcuts } from '@/components/domain/KeyboardShortcuts';
import { ConsensusSummary } from '@/components/domain/ConsensusSummary';
import { ClaimPageContent } from '@/components/domain/ClaimPageContent';
import { ArrowLeft, Share2, Database, ExternalLink } from 'lucide-react';

export function generateStaticParams() {
    const claims = getAllClaims();
    return claims.map((claim) => ({
        id: claim.id,
    }));
}

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const claim = getClaim(id);

    if (!claim) {
        notFound();
    }

    const nodes = getTrace(claim.id);
    const interpretations = getInterpretations(claim.id);

    return (
        <>
            <ReadingProgress />
            <KeyboardShortcuts />
            <div className="min-h-screen pb-20 bg-stone-50">
                {/* Header - Glass effect with new branding */}
                <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm hidden sm:inline">Back to Search</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-indigo-500" />
                            <span className="font-serif font-bold text-lg tracking-tight text-stone-800">
                                Doctrine Trace
                            </span>
                            <span className="text-stone-300 text-sm hidden sm:inline">|</span>
                            <span className="text-stone-400 font-normal text-xs hidden sm:inline">
                                {claim.cluster}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                                title="Share claim"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    <ClaimPageContent
                        claim={claim}
                        claimId={claim.id}
                        consensusSummary={<ConsensusSummary claimId={claim.id} />}
                        traceRail={<TraceRail nodes={nodes} />}
                        interpretationPanel={<InterpretationPanel interpretations={interpretations} />}
                        nodeCount={nodes.length}
                    />
                </main>

                {/* Footer with claim metadata */}
                <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-stone-100 mt-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
                        <div className="flex items-center gap-4">
                            <span>Claim ID: <code className="font-mono text-stone-500">{claim.id}</code></span>
                            {claim.scoring.tier && (
                                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                                    {claim.scoring.tier}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{nodes.length} historical nodes</span>
                            <span>{interpretations.length} tradition perspectives</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
