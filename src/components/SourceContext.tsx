'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Source } from '@/lib/types';
import { getSource } from '@/lib/data';
import { X, ExternalLink, BookOpen, Copy, Check } from 'lucide-react';

interface SourceContextType {
    openSource: (sourceId: string, returnFocusEl?: HTMLElement | null) => void;
    closeSource: () => void;
    isOpen: boolean;
    activeSource: Source | null;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export function SourceProvider({ children }: { children: ReactNode }) {
    const [activeSource, setActiveSource] = useState<Source | null>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);

    const openSource = (sourceId: string, returnFocusEl?: HTMLElement | null) => {
        const source = getSource(sourceId);
        if (source) {
            setActiveSource(source);
            if (returnFocusEl) {
                returnFocusRef.current = returnFocusEl;
            }
        }
    };

    const closeSource = () => {
        setActiveSource(null);
        if (returnFocusRef.current) {
            returnFocusRef.current.focus();
            returnFocusRef.current = null;
        }
    };

    return (
        <SourceContext.Provider value={{ openSource, closeSource, isOpen: !!activeSource, activeSource }}>
            {children}
            <CitationDrawer
                source={activeSource}
                isOpen={!!activeSource}
                onClose={closeSource}
            />
        </SourceContext.Provider>
    );
}

export function useSource() {
    const context = useContext(SourceContext);
    if (!context) throw new Error('useSource must be used within SourceProvider');
    return context;
}

function CopyButton({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#f5f2ed] hover:bg-[#e8e4dc] text-[#6b6358] rounded-lg transition-colors"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    {label}
                </>
            )}
        </button>
    );
}

function CitationDrawer({ source, isOpen, onClose }: { source: Source | null, isOpen: boolean, onClose: () => void }) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!source) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer - Warm theme */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#faf8f5] shadow-2xl overflow-y-auto"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${source.primary_or_secondary === 'Primary'
                                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                                        : 'bg-[#e3f2fd] text-[#1565c0]'
                                    }`}>
                                    {source.primary_or_secondary} Source
                                </span>
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="p-2 hover:bg-[#e8e4dc] rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6 text-[#6b6358]" />
                                </button>
                            </div>

                            {/* Primary text excerpt */}
                            {source.excerpt && (
                                <div className="mb-6 bg-white rounded-xl p-5 border border-[#e8e4dc]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen className="w-4 h-4 text-[#8b7355]" />
                                        <span className="text-sm font-semibold text-[#8b7355]">
                                            Original Text
                                        </span>
                                    </div>
                                    <blockquote className="font-serif text-xl text-[#3d3529] leading-relaxed italic">
                                        "{source.excerpt}"
                                    </blockquote>
                                    {source.significance && (
                                        <p className="mt-4 pt-4 border-t border-[#e8e4dc] text-[#6b6358]">
                                            {source.significance}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Citation */}
                            <div className="mb-6 p-4 bg-white rounded-xl border border-[#e8e4dc]">
                                <p className="font-serif text-[#3d3529] leading-relaxed">
                                    {source.citation_chicago}
                                </p>
                            </div>

                            {source.url && (
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#3d3529] font-medium mb-6"
                                >
                                    Read full source online <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            <div className="pt-4 border-t border-[#e8e4dc]">
                                <p className="text-sm text-[#9a9285] mb-3">Copy citation:</p>
                                <CopyButton text={source.citation_chicago} label="Copy" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
