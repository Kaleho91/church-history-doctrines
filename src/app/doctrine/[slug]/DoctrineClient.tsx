'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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

// Doctrine colors for elegant aesthetic
const DOCTRINE_COLORS: Record<string, string> = {
    'baptism-new-birth': '#4a90a4',
    'trinity': '#7c6a9a',
    'eucharist': '#8b7355',
};

export function DoctrinePageClient({
    doctrine,
    claims,
    slug
}: {
    doctrine: Doctrine;
    claims: Claim[];
    slug: string
}) {
    const accentColor = DOCTRINE_COLORS[slug] || '#8b7355';

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                    >
                        ← Home
                    </Link>
                    <span className="text-[#d4cfc4]">|</span>
                    <h1 className="font-serif text-xl text-[#5c5346]">
                        {doctrine.name}
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    {/* Decorative accent */}
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2" style={{ color: accentColor }}>
                            <span className="w-8 h-[1px] bg-current opacity-50" />
                            <span className="text-sm">✦</span>
                            <span className="w-8 h-[1px] bg-current opacity-50" />
                        </div>
                    </div>

                    <span
                        className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4"
                        style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                        }}
                    >
                        {doctrine.year} · {claims.length} Claims
                    </span>

                    <h2 className="font-serif text-4xl sm:text-5xl text-[#3d3529] mb-4">
                        {doctrine.name}
                    </h2>

                    <p className="text-xl text-[#6b6358] max-w-2xl mx-auto leading-relaxed">
                        {doctrine.description}
                    </p>
                </motion.div>

                {/* Claims Grid */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-4">
                        Explore Claims
                    </h3>

                    {claims.map((claim, i) => (
                        <motion.div
                            key={claim.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/claim/${claim.id}`}
                                className="group block"
                            >
                                <div className="relative">
                                    {/* Accent bar on hover */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                                        style={{
                                            background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}40)`,
                                        }}
                                    />

                                    <div className="ml-0 group-hover:ml-4 bg-white rounded-xl p-5 border border-[#e8e4dc] hover:border-[#d4cfc4] hover:shadow-md transition-all duration-300">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-serif text-xl text-[#3d3529] mb-2 group-hover:text-[#8b7355] transition-colors">
                                                    {claim.short_label}
                                                </h4>
                                                <p className="text-[#6b6358] text-sm leading-relaxed line-clamp-2">
                                                    {claim.full_statement}
                                                </p>
                                            </div>

                                            {/* Arrow */}
                                            <div className="text-[#d4cfc4] group-hover:text-[#8b7355] group-hover:translate-x-1 transition-all shrink-0 mt-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 text-sm font-medium" style={{ color: accentColor }}>
                                            Trace this claim
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Decorative footer */}
                <div className="mt-16 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-[#d4af37]/60">
                            <span className="w-12 h-[1px] bg-current" />
                            <span className="text-sm">✦</span>
                            <span className="w-12 h-[1px] bg-current" />
                        </div>
                    </div>
                    <p className="text-[#9a9285] text-sm">
                        Each claim traces through history with primary sources.
                        <Link href="/scripture" className="text-[#8b7355] hover:underline ml-1">
                            Explore by Scripture →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
