import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClaim, getTrace, getInterpretations, getAllClaims } from '@/lib/data';
import { TraceRail } from '@/components/domain/TraceRail';
import { InterpretationPanel } from '@/components/domain/InterpretationPanel';
import { ReadingProgress } from '@/components/domain/ReadingProgress';
import { KeyboardShortcuts } from '@/components/domain/KeyboardShortcuts';
import { ConsensusSummary } from '@/components/domain/ConsensusSummary';
import { ArrowLeft, Share2 } from 'lucide-react';

// Use generateStaticParams for SSG if desired, but dynamic for now is fine for MVP.
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
            <div className="min-h-screen pb-20">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Back to Search</span>
                        </Link>
                        <div className="font-serif font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
                            Church History <span className="text-slate-400 font-sans font-normal text-sm ml-2">Claim Trace</span>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* LEFT: Claim Header & Trace Rail */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Consensus Summary */}
                            <ConsensusSummary claimId={claim.id} />

                            {/* Claim Header */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
                                    {claim.cluster}
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
                                    {claim.short_label}
                                </h1>
                                <p className="text-xl text-slate-600 leading-relaxed mb-6 font-serif">
                                    {claim.full_statement}
                                </p>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Definition Variants</h3>
                                    <ul className="space-y-2">
                                        {claim.definition_variants.map((v, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-700">
                                                <span className="text-blue-300">•</span> {v}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Trace Rail */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Historical Trace
                                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{nodes.length} Nodes</span>
                                </h2>
                                <TraceRail nodes={nodes} />
                            </div>
                        </div>

                        {/* RIGHT: Interpretation Panel */}
                        <div className="lg:col-span-5 relative">
                            <InterpretationPanel interpretations={interpretations} />
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
