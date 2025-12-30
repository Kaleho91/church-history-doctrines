'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Source } from '@/lib/types';
import { getSource } from '@/lib/data';
import { X, ExternalLink, BookOpen, Copy, Check } from 'lucide-react';
import { transitions, variants } from '@/lib/motion';

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
        // Return focus to trigger element
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

// Helper: Generate BibTeX from source
function generateBibTeX(source: Source): string {
    const author = source.citation_chicago.split('.')[0] || 'Unknown';
    // Extract year from citation string
    const yearMatch = source.citation_chicago.match(/(\d{3,4})/);
    const year = yearMatch ? yearMatch[1] : 'n.d.';
    const key = source.id.toLowerCase().replace(/_/g, '');

    return `@misc{${key},
  author = {${author}},
  title = {${source.citation_chicago}},
  year = {${year}},
  note = {${source.primary_or_secondary} source},
  url = {${source.url || ''}}
}`;
}

// Copy Button Component
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
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            {copied ? (
                <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-3 h-3" />
                    {label}
                </>
            )}
        </button>
    );
}

// Citation Drawer Component
function CitationDrawer({ source, isOpen, onClose }: { source: Source | null, isOpen: boolean, onClose: () => void }) {
    const shouldReduceMotion = useReducedMotion();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus close button when opened
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // ESC key handler
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
                    {/* Backdrop with dim + blur */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        initial={shouldReduceMotion ? undefined : variants.overlay.initial}
                        animate={shouldReduceMotion ? undefined : variants.overlay.animate}
                        exit={shouldReduceMotion ? undefined : variants.overlay.exit}
                        transition={transitions.short}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="citation-title"
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto"
                        initial={shouldReduceMotion ? undefined : variants.drawerRight.initial}
                        animate={shouldReduceMotion ? undefined : variants.drawerRight.animate}
                        exit={shouldReduceMotion ? undefined : variants.drawerRight.exit}
                        transition={transitions.drawer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${source.primary_or_secondary === 'Primary'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {source.primary_or_secondary} Source
                                </span>
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="p-1 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="Close citation drawer"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <div id="citation-title" className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 font-serif text-lg leading-relaxed text-slate-800">
                                    {source.citation_chicago}
                                </div>

                                {source.notes && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" /> Relevance
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">{source.notes}</p>
                                    </div>
                                )}

                                {source.url && (
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                    >
                                        View Source Online <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}

                                {/* Copy Citation Buttons */}
                                <div className="mt-6 pt-6 border-t border-stone-200">
                                    <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">
                                        Copy Citation
                                    </h4>
                                    <div className="flex gap-2">
                                        <CopyButton
                                            text={source.citation_chicago}
                                            label="Chicago"
                                        />
                                        <CopyButton
                                            text={generateBibTeX(source)}
                                            label="BibTeX"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
