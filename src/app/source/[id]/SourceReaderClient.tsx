'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Source } from '@/lib/types';
import { useState } from 'react';

interface Props {
    source: Source;
}

export default function SourceReaderClient({ source }: Props) {
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
    };

    // Generate BibTeX citation from Chicago
    const generateBibTeX = (src: Source): string => {
        const author = src.citation_chicago.split('.')[0] || 'Unknown';
        const year = src.citation_chicago.match(/\d{3,4}/)?.[0] || 'n.d.';
        const key = src.id.toLowerCase().replace(/_/g, '');

        return `@misc{${key},
  author = {${author}},
  title = {${src.citation_chicago.split('.').slice(1, 2).join('').trim() || 'Primary Source'}},
  year = {${year}},
  url = {${src.url || ''}},
  note = {${src.notes || ''}}
}`;
    };

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                    >
                        ← Home
                    </Link>
                    <span className="text-[#d4cfc4]">|</span>
                    <h1 className="font-serif text-lg text-[#5c5346] truncate">
                        Primary Source
                    </h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Source Type Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${source.primary_or_secondary === 'Primary'
                            ? 'bg-[#6b8e23]/10 text-[#6b8e23]'
                            : 'bg-[#9a9285]/10 text-[#9a9285]'
                        }`}>
                        {source.primary_or_secondary} Source
                    </span>
                    {source.url && (
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#4a90a4] hover:underline"
                        >
                            View Original ↗
                        </a>
                    )}
                </motion.div>

                {/* Citation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-xl p-5 border border-[#e8e4dc]">
                        <h2 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-2">
                            Chicago Citation
                        </h2>
                        <p className="font-serif text-[#3d3529] leading-relaxed">
                            {source.citation_chicago}
                        </p>

                        {/* Copy buttons */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => copyToClipboard(source.citation_chicago, 'chicago')}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${copiedFormat === 'chicago'
                                        ? 'bg-[#6b8e23]/10 border-[#6b8e23]/30 text-[#6b8e23]'
                                        : 'border-[#e8e4dc] text-[#9a9285] hover:border-[#d4cfc4] hover:text-[#6b6358]'
                                    }`}
                            >
                                {copiedFormat === 'chicago' ? '✓ Copied' : 'Copy Chicago'}
                            </button>
                            <button
                                onClick={() => copyToClipboard(generateBibTeX(source), 'bibtex')}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${copiedFormat === 'bibtex'
                                        ? 'bg-[#6b8e23]/10 border-[#6b8e23]/30 text-[#6b8e23]'
                                        : 'border-[#e8e4dc] text-[#9a9285] hover:border-[#d4cfc4] hover:text-[#6b6358]'
                                    }`}
                            >
                                {copiedFormat === 'bibtex' ? '✓ Copied' : 'Copy BibTeX'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Excerpt - The Star of the Show */}
                {source.excerpt && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <h3 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                            Primary Text
                        </h3>

                        <div className="relative">
                            {/* Decorative border */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] via-[#d4af37]/60 to-[#d4af37]/20 rounded-full" />

                            {/* Manuscript-style container */}
                            <div className="ml-6 bg-gradient-to-br from-[#fdfcfa] to-[#f8f5f0] rounded-xl p-8 border border-[#e8e4dc] shadow-inner">
                                <blockquote className="font-serif text-xl text-[#3d3529] leading-relaxed italic">
                                    "{source.excerpt}"
                                </blockquote>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Why This Matters */}
                {source.significance && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-8"
                    >
                        <h3 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                            Why This Matters
                        </h3>

                        <div className="bg-[#7c6a9a]/5 rounded-xl p-5 border border-[#7c6a9a]/20">
                            <p className="text-[#5c5346] leading-relaxed">
                                {source.significance}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Editorial Notes */}
                {source.notes && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h3 className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide mb-3">
                            Scholarly Notes
                        </h3>

                        <div className="bg-white rounded-xl p-5 border border-[#e8e4dc]">
                            <p className="text-sm text-[#6b6358] leading-relaxed">
                                {source.notes}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* External Link */}
                {source.url && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-[#8b7355] text-white rounded-lg hover:bg-[#7a6349] transition-colors font-medium"
                        >
                            Read Full Source
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </motion.div>
                )}

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
                        Primary sources bring us closer to the original voices of history.
                    </p>
                </div>
            </main>
        </div>
    );
}
