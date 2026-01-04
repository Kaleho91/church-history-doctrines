'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ExtendedThinking from '@/components/ask/ExtendedThinking';

interface Citation {
    id: string;
    author: string;
    work: string;
    excerpt: string;
    url?: string;
}

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
    timestamp: Date;
}

export default function AskPage() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Scroll to the START of the last message when a new response arrives
    const scrollToLastMessage = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Scroll to loading indicator during loading
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (loading) {
            scrollToBottom();
        }
    }, [loading]);

    // When new assistant message arrives, scroll to start of that message
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].type === 'assistant') {
            // Small delay to ensure DOM is updated
            setTimeout(scrollToLastMessage, 100);
        }
    }, [messages]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!query.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: query.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setQuery('');
        setLoading(true);
        setError(null);

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage.content }),
            });

            if (!res.ok) {
                throw new Error('Failed to get response');
            }

            const data = await res.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: data.answer,
                citations: data.citations,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            setError('Unable to consult the Fathers at this time. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        inputRef.current?.focus();
    };

    const isConversationStarted = messages.length > 0 || loading;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#faf8f5] via-[#faf8f5] to-[#f5f2ed]">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-[#e8e4dc]/50 bg-[#faf8f5]/95 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2 text-[#8b7355] hover:text-[#5c4d3c] transition-colors">
                        <span className="w-7 h-7 rounded-full bg-[#8b7355]/10 flex items-center justify-center group-hover:bg-[#8b7355]/20 transition-colors text-sm">
                            ←
                        </span>
                        <span className="font-serif text-sm hidden sm:inline">Library</span>
                    </Link>

                    <h1 className="font-serif text-lg text-[#3d3529] flex items-center gap-2">
                        <span className="text-[#d4af37]">✦</span>
                        Ask the Fathers
                    </h1>

                    <div className="w-7" /> {/* Spacer for alignment */}
                </div>
            </header>

            {/* Messages Area - Scrollable */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    {/* Empty State */}
                    {!isConversationStarted && (
                        <div className="text-center py-16 animate-fade-in">
                            {/* Decorative */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#8b7355]/10 flex items-center justify-center">
                                    <span className="text-3xl">📜</span>
                                </div>
                            </div>

                            <h2 className="font-serif text-2xl sm:text-3xl text-[#2c261e] mb-3">
                                What would you like to know?
                            </h2>
                            <p className="text-[#6b6358] max-w-md mx-auto mb-8">
                                Ask any question about early church history, doctrine, or what the Church Fathers taught.
                            </p>

                            {/* Suggestions */}
                            <div className="flex flex-wrap justify-center gap-2">
                                {[
                                    'What did the early church believe about baptism?',
                                    'How did the Fathers understand the Eucharist?',
                                    'What is the history of Trinitarian doctrine?',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestion(suggestion)}
                                        className="px-4 py-2.5 text-sm text-[#6b6358] bg-white border border-[#e8e4dc] rounded-full hover:border-[#d4af37]/50 hover:text-[#8b7355] hover:shadow-sm transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="space-y-6">
                        {messages.map((message, msgIdx) => (
                            <div
                                key={message.id}
                                ref={msgIdx === messages.length - 1 ? lastMessageRef : null}
                                className={`flex gap-4 animate-fade-in ${message.type === 'user' ? 'justify-end' : ''}`}
                            >
                                {message.type === 'assistant' && (
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b7355] flex items-center justify-center shadow-md">
                                        <span className="text-white text-sm font-serif">✦</span>
                                    </div>
                                )}

                                <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                                    {message.type === 'user' ? (
                                        <div className="bg-[#8b7355] text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-sm">
                                            <p className="font-serif">{message.content}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-[#e8e4dc] rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
                                            <div className="p-5">
                                                <div className="prose prose-stone prose-sm max-w-none font-serif text-[#3d3529] leading-relaxed whitespace-pre-wrap">
                                                    {message.content}
                                                </div>
                                            </div>

                                            {/* Citations */}
                                            {message.citations && message.citations.length > 0 && (
                                                <div className="border-t border-[#e8e4dc] bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] p-4">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-[#8b7355] mb-3 flex items-center gap-2">
                                                        <span className="text-sm">📜</span>
                                                        Primary Sources ({message.citations.length})
                                                    </p>
                                                    <div className="space-y-3">
                                                        {message.citations.map((citation, idx) => (
                                                            <div
                                                                key={citation.id}
                                                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e8e4dc] hover:border-[#d4af37]/30 hover:shadow-sm transition-all"
                                                            >
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b7355] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                                                                    {idx + 1}
                                                                </span>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm">
                                                                        <span className="font-semibold text-[#3d3529]">{citation.author}</span>
                                                                        <span className="text-[#9a9285]"> — </span>
                                                                        <span className="italic text-[#6b6358]">{citation.work}</span>
                                                                    </div>
                                                                    {citation.url && (
                                                                        <a
                                                                            href={citation.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-[#8b7355] to-[#6b5339] rounded-lg hover:from-[#6b5339] hover:to-[#5c4d3c] transition-all shadow-sm"
                                                                        >
                                                                            <span>View Primary Source</span>
                                                                            <span>→</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {message.type === 'user' && (
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#6b6358] flex items-center justify-center shadow-md order-2">
                                        <span className="text-white text-sm">You</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading State */}
                        {loading && messages.length > 0 && (
                            <ExtendedThinking query={messages[messages.length - 1]?.content || ''} />
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="flex gap-4 animate-fade-in">
                                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                                    <span className="text-rose-500">!</span>
                                </div>
                                <div className="bg-rose-50 border border-rose-200 rounded-2xl rounded-tl-sm px-5 py-3 text-rose-600 text-sm">
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Scroll anchor */}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </main>

            {/* Sticky Input Bar */}
            <div className="sticky bottom-0 border-t border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative bg-white rounded-2xl border border-[#e8e4dc] shadow-sm focus-within:border-[#d4af37]/50 focus-within:shadow-md transition-all">
                            <textarea
                                ref={inputRef}
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about early church history..."
                                rows={1}
                                disabled={loading}
                                className="w-full px-5 py-4 pr-14 text-[#2c261e] bg-transparent resize-none focus:outline-none placeholder:text-[#c4bdb0] font-serif"
                                style={{ minHeight: '56px', maxHeight: '200px' }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-[#8b7355] to-[#6b5339] text-white flex items-center justify-center hover:from-[#6b5339] hover:to-[#5c4d3c] disabled:from-[#d4cfc4] disabled:to-[#c4bdb0] disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-center text-xs text-[#9a9285] mt-2">
                            Answers grounded in primary sources from the early church
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
