'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ArrowRight, Layers } from 'lucide-react';

interface Claim {
    id: string;
    short_label: string;
    full_statement: string;
    cluster: string;
}

interface Doctrine {
    name: string;
    description: string;
    gradient: string;
    year: string;
}

function ClaimCardDark({ claim, gradient }: { claim: Claim; gradient: string }) {
    return (
        <Link
            href={`/claim/${claim.id}`}
            className="group block relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-white/30" />
                    <span className="text-xs text-white/30 font-medium uppercase tracking-wide">
                        Claim
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {claim.short_label}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">
                    {claim.full_statement}
                </p>

                <div className="flex items-center text-sm font-semibold text-amber-400 group-hover:translate-x-2 transition-transform">
                    Trace this claim <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </Link>
    );
}

export function DoctrinePageClient({
    doctrine,
    claims,
    slug
}: {
    doctrine: Doctrine;
    claims: Claim[];
    slug: string
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Background decoration */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${doctrine.gradient} opacity-5`} />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">All Doctrines</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Trace</span>
                    </div>
                    <div className="w-24" />
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 pt-16 pb-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${doctrine.gradient} text-white text-xs font-bold mb-6`}>
                            {doctrine.year} · {claims.length} Claims
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                            {doctrine.name}
                        </h1>

                        <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                            {doctrine.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Claims Grid */}
            <section className="relative z-10 px-6 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-4">
                        {claims.map((claim, i) => (
                            <motion.div
                                key={claim.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                            >
                                <ClaimCardDark claim={claim} gradient={doctrine.gradient} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
