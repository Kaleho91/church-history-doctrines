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
import { ArrowLeft, Share2, Clock } from 'lucide-react';

// Map claim prefixes to doctrine slugs
function getDoctrineSlug(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'baptism-new-birth';
    if (claimId.startsWith('CLM_TR')) return 'trinity';
    if (claimId.startsWith('CLM_EU')) return 'eucharist';
    return 'baptism-new-birth';
}

function getDoctrineName(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'Baptism';
    if (claimId.startsWith('CLM_TR')) return 'Trinity';
    if (claimId.startsWith('CLM_EU')) return 'Eucharist';
    return 'Doctrine';
}

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
    const doctrineSlug = getDoctrineSlug(id);
    const doctrineName = getDoctrineName(id);

    return (
        <>
            <ReadingProgress />
            <KeyboardShortcuts />
            <div className="min-h-screen pb-20 bg-[#0a0a0a]">
                {/* Background decoration */}
                <div className="fixed inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <header className="relative z-30 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0a]/80 sticky top-0">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link
                            href={`/doctrine/${doctrineSlug}`}
                            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Back to {doctrineName}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight hidden sm:block">Trace</span>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-full text-white/50 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
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
