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
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2 text-[#8b7355] hover:text-[#5c4d3c] transition-colors">
                        <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-serif">Return to Library</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl">🏛️</span>
                    </div>
                    <h1 className="font-serif text-4xl text-[#2c261e] mb-3">
                        Ask the Fathers
                    </h1>
                    <p className="text-[#6b6358] max-w-lg mx-auto leading-relaxed">
                        Consult the wisdom of the early church. Your question will be answered using
                        <span className="text-[#8b7355] font-medium"> only primary sources</span> from
                        the Church Fathers, Councils, and Confessions.
                    </p>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What did the early church believe about..."
                            className="w-full px-6 py-4 text-lg font-serif text-[#2c261e] bg-white border-2 border-[#e8e4dc] rounded-xl shadow-sm focus:outline-none focus:border-[#8b7355] focus:ring-4 focus:ring-[#8b7355]/10 transition-all placeholder:text-[#b8b0a3]"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#8b7355] text-white font-medium rounded-lg hover:bg-[#6b5339] disabled:bg-[#d4cfc4] disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Consulting...
                                </span>
                            ) : (
                                'Ask'
                            )}
                        </button>
                    </div>
                </form>

                {/* Error State */}
                {error && (
                    <div className="text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-4 mb-8">
                        {error}
                    </div>
                )}

                {/* Response Card */}
                {response && (
                    <div className="bg-white border border-[#e8e4dc] rounded-2xl shadow-lg overflow-hidden animate-fade-in">
                        {/* Response Header */}
                        <div className="bg-[#f5f2ed] px-6 py-4 border-b border-[#e8e4dc]">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#9a9285]">
                                Response from the Sources
                            </span>
                        </div>

                        {/* Answer Body */}
                        <div className="p-8">
                            <div className="prose prose-stone prose-lg max-w-none font-serif text-[#3d3529] leading-relaxed whitespace-pre-wrap">
                                {response.answer}
                            </div>
                        </div>

                        {/* Citations */}
                        {response.citations.length > 0 && (
                            <div className="border-t border-[#e8e4dc] bg-[#fdfcfa] px-6 py-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#9a9285] mb-4">
                                    Sources Consulted ({response.citations.length})
                                </h3>
                                <div className="space-y-4">
                                    {response.citations.map((citation, index) => (
                                        <div
                                            key={citation.id}
                                            className="group p-4 bg-white rounded-lg border border-[#e8e4dc] hover:border-[#8b7355]/30 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#8b7355] text-white text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-[#3d3529] mb-1">
                                                        {citation.author} — <span className="italic">{citation.work}</span>
                                                    </div>
                                                    <p className="text-sm text-[#6b6358] leading-relaxed line-clamp-3">
                                                        "{citation.excerpt}"
                                                    </p>
                                                    {citation.url && (
                                                        <a
                                                            href={citation.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-block mt-2 text-xs text-[#8b7355] hover:underline"
                                                        >
                                                            View Full Source →
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
                    <div className="text-center">
                        <p className="text-sm text-[#9a9285] mb-4">Try asking:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                'What did the early church teach about baptism?',
                                'How did the Fathers understand the Eucharist?',
                                'What is the history of the Trinity doctrine?',
                            ].map((example) => (
                                <button
                                    key={example}
                                    onClick={() => setQuery(example)}
                                    className="px-4 py-2 text-sm text-[#6b6358] bg-white border border-[#e8e4dc] rounded-full hover:border-[#8b7355] hover:text-[#8b7355] transition-colors"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
