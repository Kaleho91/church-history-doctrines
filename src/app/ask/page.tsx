'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Citation {
    id: string;
    author: string;
    work: string;
    excerpt: string;
    url?: string;
}

interface AskResponse {
    answer: string;
    citations: Citation[];
}

export default function AskPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<AskResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) {
                throw new Error('Failed to get response');
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError('Unable to consult the Fathers at this time. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-[#faf8f5] to-[#f5f2ed]">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 text-[#d4af37]/10 text-9xl font-serif select-none">✦</div>
                <div className="absolute top-40 right-20 text-[#d4af37]/5 text-6xl font-serif select-none">✦</div>
                <div className="absolute bottom-40 left-1/4 text-[#d4af37]/5 text-4xl font-serif select-none">✦</div>
            </div>

            {/* Header */}
            <header className="relative border-b border-[#e8e4dc]/50 bg-[#faf8f5]/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3 text-[#8b7355] hover:text-[#5c4d3c] transition-colors">
                        <span className="w-8 h-8 rounded-full bg-[#8b7355]/10 flex items-center justify-center group-hover:bg-[#8b7355]/20 transition-colors">
                            <span className="transform group-hover:-translate-x-0.5 transition-transform text-sm">←</span>
                        </span>
                        <span className="font-serif text-sm">Return to Library</span>
                    </Link>
                </div>
            </header>

            <main className="relative max-w-3xl mx-auto px-6 py-20">
                {/* Hero */}
                <div className="text-center mb-16 animate-fade-in">
                    {/* Decorative divider */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3 text-[#d4af37]">
                            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/40" />
                            <span className="text-2xl decorative-star">✦</span>
                            <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/40" />
                        </div>
                    </div>

                    <h1 className="font-serif text-5xl text-[#2c261e] mb-5 tracking-tight">
                        Ask the Fathers
                    </h1>

                    <p className="text-lg text-[#6b6358] max-w-md mx-auto leading-relaxed">
                        Consult the wisdom of the early church.
                        <span className="block mt-2 text-[#8b7355] font-medium text-sm uppercase tracking-widest">
                            Grounded in Primary Sources
                        </span>
                    </p>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="mb-16 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <div className="relative group">
                        {/* Decorative border glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 via-[#8b7355]/10 to-[#d4af37]/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                        <div className="relative bg-white rounded-2xl border border-[#e8e4dc] shadow-[0_4px_24px_rgba(139,115,85,0.08)] overflow-hidden">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What did the early church believe about..."
                                className="w-full px-8 py-6 text-xl font-serif text-[#2c261e] bg-transparent focus:outline-none placeholder:text-[#c4bdb0] placeholder:font-normal"
                                disabled={loading}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-[#8b7355] to-[#6b5339] text-white font-medium rounded-xl hover:from-[#6b5339] hover:to-[#5c4d3c] disabled:from-[#d4cfc4] disabled:to-[#c4bdb0] disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span className="text-sm">Consulting...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span>Ask</span>
                                            <span className="text-white/60">→</span>
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Error State */}
                {error && (
                    <div className="text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-4 mb-8 animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Response Card */}
                {response && (
                    <div className="animate-fade-in">
                        {/* Response Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 text-[#d4af37]/60">
                                <span className="w-8 h-[1px] bg-current" />
                                <span className="text-xs">✦</span>
                                <span className="w-8 h-[1px] bg-current" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#9a9285]">
                                From the Sources
                            </span>
                            <div className="flex-1 h-[1px] bg-[#e8e4dc]" />
                        </div>

                        {/* Answer Body */}
                        <div className="bg-white border border-[#e8e4dc] rounded-2xl shadow-[0_8px_32px_rgba(139,115,85,0.08)] overflow-hidden mb-8">
                            <div className="p-10">
                                <div className="prose prose-stone prose-lg max-w-none font-serif text-[#3d3529] leading-[1.85] whitespace-pre-wrap">
                                    {response.answer}
                                </div>
                            </div>
                        </div>

                        {/* Citations */}
                        {response.citations.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#9a9285]">
                                        Sources ({response.citations.length})
                                    </span>
                                    <div className="flex-1 h-[1px] bg-[#e8e4dc]" />
                                </div>

                                <div className="grid gap-4">
                                    {response.citations.map((citation, index) => (
                                        <div
                                            key={citation.id}
                                            className="group p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-[#e8e4dc] hover:border-[#d4af37]/30 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b7355] text-white text-sm font-bold flex items-center justify-center shadow-md">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-serif text-lg text-[#3d3529] mb-2">
                                                        {citation.author}
                                                        <span className="text-[#9a9285] font-normal"> — </span>
                                                        <span className="italic text-[#6b6358]">{citation.work}</span>
                                                    </div>
                                                    <p className="text-sm text-[#6b6358] leading-relaxed line-clamp-3 mb-3">
                                                        "{citation.excerpt}"
                                                    </p>
                                                    {citation.url && (
                                                        <a
                                                            href={citation.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8b7355] hover:text-[#6b5339] transition-colors"
                                                        >
                                                            <span>View Full Text</span>
                                                            <span className="text-[#d4af37]">→</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Example Questions */}
                {!response && !loading && (
                    <div className="text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <p className="text-sm text-[#9a9285] mb-5 font-medium">Suggested inquiries</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                'What did the early church teach about baptism?',
                                'How did the Fathers understand the Eucharist?',
                                'What is the history of Trinitarian doctrine?',
                            ].map((example) => (
                                <button
                                    key={example}
                                    onClick={() => setQuery(example)}
                                    className="group px-5 py-3 text-sm text-[#6b6358] bg-white border border-[#e8e4dc] rounded-full hover:border-[#d4af37]/50 hover:text-[#8b7355] hover:shadow-md transition-all duration-300"
                                >
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37] mr-1">✦</span>
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer flourish */}
                <div className="mt-20 flex justify-center">
                    <div className="flex items-center gap-3 text-[#d4af37]/30">
                        <span className="w-12 h-[1px] bg-current" />
                        <span className="text-sm">✦</span>
                        <span className="w-12 h-[1px] bg-current" />
                    </div>
                </div>
            </main>
        </div>
    );
}
