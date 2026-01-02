'use client';

import Link from 'next/link';
import { getScriptureNodes, getClaimsForScripture, normalizeScriptureRef } from '@/lib/data';
import { Node } from '@/lib/types';
import { motion } from 'framer-motion';

// Book order for proper sorting
const BOOK_ORDER = [
    // New Testament (primary for this app)
    'Matthew', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Colossians', '1 Timothy', 'Titus', 'Hebrews',
    '1 Peter', '2 Peter', '1 John'
];

function getBookOrder(book: string): number {
    const index = BOOK_ORDER.indexOf(book);
    return index >= 0 ? index : 999;
}

interface ScriptureWithClaims extends Node {
    claimCount: number;
    clusterNames: string[];
}

export default function ScripturePage() {
    const scriptures = getScriptureNodes();

    // Enrich with claim data
    const scripturesWithClaims: ScriptureWithClaims[] = scriptures.map(s => {
        const claims = getClaimsForScripture(s.id);
        return {
            ...s,
            claimCount: claims.length,
            clusterNames: [...new Set(claims.map(c => c.cluster))]
        };
    });

    // Sort by book order, then chapter, then verse
    scripturesWithClaims.sort((a, b) => {
        const bookA = getBookOrder(a.book || '');
        const bookB = getBookOrder(b.book || '');
        if (bookA !== bookB) return bookA - bookB;
        if ((a.chapter || 0) !== (b.chapter || 0)) return (a.chapter || 0) - (b.chapter || 0);
        return (a.verse_start || 0) - (b.verse_start || 0);
    });

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                        >
                            ← Home
                        </Link>
                        <h1 className="font-serif text-xl text-[#5c5346]">
                            Scripture Index
                        </h1>
                    </div>
                    <span className="text-xs text-[#9a9285] bg-[#f5f2ed] px-3 py-1 rounded-full">
                        {scriptures.length} Passages
                    </span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl">📖</span>
                    </div>
                    <h2 className="font-serif text-3xl text-[#3d3529] mb-3">
                        Explore by Scripture
                    </h2>
                    <p className="text-[#6b6358] text-lg max-w-lg mx-auto">
                        What have Christians believed about each verse for 2,000 years?
                        Select a passage to trace its interpretation through history.
                    </p>
                </motion.div>

                {/* Scripture Cards */}
                <div className="space-y-4">
                    {scripturesWithClaims.map((scripture, index) => (
                        <motion.div
                            key={scripture.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/scripture/${normalizeScriptureRef(scripture.scripture_ref || '')}`}
                                className="group block"
                            >
                                <div className="bg-white rounded-xl p-5 border border-[#e8e4dc] hover:border-[#d4cfc4] hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        {/* Book icon */}
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b7355]/10 to-[#8b7355]/5 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                                            📜
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            {/* Reference */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-serif text-xl text-[#3d3529] group-hover:text-[#8b7355] transition-colors">
                                                    {scripture.scripture_ref}
                                                </h3>
                                                <span className="text-xs text-[#9a9285] bg-[#f5f2ed] px-2 py-0.5 rounded-full">
                                                    {scripture.claimCount} {scripture.claimCount === 1 ? 'claim' : 'claims'}
                                                </span>
                                            </div>

                                            {/* Verse text preview */}
                                            <p className="text-[#6b6358] text-sm leading-relaxed mb-2 line-clamp-2 italic">
                                                "{scripture.verse_text}"
                                            </p>

                                            {/* Connected doctrines */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {scripture.clusterNames.map(cluster => (
                                                    <span
                                                        key={cluster}
                                                        className="text-xs text-[#7c6a9a] bg-[#7c6a9a]/10 px-2 py-0.5 rounded-full"
                                                    >
                                                        {cluster}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-[#d4cfc4] group-hover:text-[#8b7355] group-hover:translate-x-1 transition-all shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                        See how Scripture has been interpreted across the centuries
                    </p>
                </div>
            </main>
        </div>
    );
}
