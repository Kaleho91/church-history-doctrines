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
import { ArrowLeft, Share2 } from 'lucide-react';

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
                {/* Header - Glass effect */}
                <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Back to Search</span>
                        </Link>
                        <div className="font-serif font-bold text-xl tracking-tight text-stone-800 hidden sm:block">
                            Church History <span className="text-stone-400 font-sans font-normal text-sm ml-2">Claim Trace</span>
                        </div>
                        <button className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
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
            </div>
        </>
    );
}
