'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Source } from '@/lib/types';
import { getSource } from '@/lib/data';
import { X, ExternalLink, BookOpen, Copy, Check, Shield, Calendar, MapPin, FileText, Scroll, Landmark, Church } from 'lucide-react';
import { transitions, variants } from '@/lib/motion';

/**
 * SYSTEM 4: Epistemic Depth — Citation Drawer
 * 
 * Opening a citation feels like entering a deeper reality layer.
 * This is where credibility is earned.
 * 
 * Features:
 * - Dim + blur backdrop for focus
 * - Source type badges with semantic colors
 * - Epistemic weight indicator
 * - Chicago citation with copy buttons
 * - Focus trap and keyboard navigation
 */

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

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE TYPE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SOURCE_TYPE_CONFIG: Record<string, {
    color: string;
    icon: React.ReactNode;
    weight: number;
    label: string;
}> = {
    'Creed': {
        color: 'bg-violet-100 text-violet-800 border-violet-200',
        icon: <Church className="w-4 h-4" />,
        weight: 5,
        label: 'Creed',
    },
    'Council': {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <Landmark className="w-4 h-4" />,
        weight: 5,
        label: 'Council',
    },
    'Confession': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Scroll className="w-4 h-4" />,
        weight: 4,
        label: 'Confession',
    },
    'Scripture': {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <BookOpen className="w-4 h-4" />,
        weight: 5,
        label: 'Scripture',
    },
    'Commentary': {
        color: 'bg-stone-100 text-stone-700 border-stone-200',
        icon: <FileText className="w-4 h-4" />,
        weight: 3,
        label: 'Commentary',
    },
    'Academic': {
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: <BookOpen className="w-4 h-4" />,
        weight: 3,
        label: 'Academic',
    },
    'Primary': {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <FileText className="w-4 h-4" />,
        weight: 4,
        label: 'Primary',
    },
    'Secondary': {
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: <FileText className="w-4 h-4" />,
        weight: 2,
        label: 'Secondary',
    },
};

function getSourceConfig(source: Source) {
    return SOURCE_TYPE_CONFIG[source.type] ||
        SOURCE_TYPE_CONFIG[source.primary_or_secondary] ||
        SOURCE_TYPE_CONFIG['Secondary'];
}

// ═══════════════════════════════════════════════════════════════════════════
// BIBTEX GENERATION
// ═══════════════════════════════════════════════════════════════════════════

function generateBibTeX(source: Source): string {
    const author = source.author || source.citation_chicago.split('.')[0] || 'Unknown';
    const yearMatch = source.year || source.citation_chicago.match(/(\d{3,4})/)?.[1] || 'n.d.';
    const key = source.id.toLowerCase().replace(/_/g, '');

    return `@misc{${key},
  author = {${author}},
  title = {${source.title}},
  year = {${yearMatch}},
  note = {${source.primary_or_secondary} source},
  url = {${source.url || ''}}
}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// COPY BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// EPISTEMIC WEIGHT INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

function EpistemicWeight({ source }: { source: Source }) {
    const config = getSourceConfig(source);
    const weight = config.weight;

    return (
        <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500">Epistemic weight:</span>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                    <div
                        key={n}
                        className={`w-2 h-2 rounded-full transition-colors ${n <= weight ? 'bg-indigo-500' : 'bg-stone-200'
                            }`}
                    />
                ))}
            </div>
            <span className="text-[10px] text-stone-400">
                {weight >= 5 ? 'Foundational' : weight >= 4 ? 'Primary' : weight >= 3 ? 'Scholarly' : 'Reference'}
            </span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CITATION DRAWER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function CitationDrawer({
    source,
    isOpen,
    onClose
}: {
    source: Source | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const shouldReduceMotion = useReducedMotion();
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

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

    // Focus trap
    useEffect(() => {
        if (!isOpen || !drawerRef.current) return;

        const focusableElements = drawerRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable?.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    if (!source) return null;

    const config = getSourceConfig(source);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with dim + blur — creates the "deeper reality" feel */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer — slides in calmly from right */}
                    <motion.div
                        ref={drawerRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="citation-title"
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto"
                        initial={shouldReduceMotion ? undefined : { x: '100%' }}
                        animate={shouldReduceMotion ? undefined : { x: 0 }}
                        exit={shouldReduceMotion ? undefined : { x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex justify-between items-center z-10">
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${config.color}`}>
                                    {config.icon}
                                    {config.label}
                                </span>
                                <span className="text-xs text-stone-400">
                                    {source.primary_or_secondary}
                                </span>
                            </div>
                            <button
                                ref={closeButtonRef}
                                onClick={onClose}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                aria-label="Close citation drawer"
                            >
                                <X className="w-5 h-5 text-stone-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <h2 id="citation-title" className="text-xl font-bold text-stone-900 leading-tight mb-2">
                                    {source.title}
                                </h2>
                                {source.author && (
                                    <p className="text-sm text-stone-500">{source.author}</p>
                                )}
                            </div>

                            {/* Metadata row */}
                            <div className="flex flex-wrap gap-4 text-xs text-stone-500">
                                {source.year && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {source.year}
                                    </span>
                                )}
                                {source.tradition && (
                                    <span className="flex items-center gap-1.5">
                                        <Church className="w-3.5 h-3.5" />
                                        {source.tradition}
                                    </span>
                                )}
                            </div>

                            {/* Epistemic Weight */}
                            <EpistemicWeight source={source} />

                            {/* Chicago Citation */}
                            <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5" /> Citation
                                </h3>
                                <p className="font-serif text-stone-800 leading-relaxed text-sm">
                                    {source.citation_chicago}
                                </p>
                            </div>

                            {/* Notes / Relevance */}
                            {source.notes && (
                                <div>
                                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                                        Why This Source Matters
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed text-sm">
                                        {source.notes}
                                    </p>
                                </div>
                            )}

                            {/* External Link */}
                            {source.url && (
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                                >
                                    View Source Online <ExternalLink className="w-4 h-4" />
                                </a>
                            )}

                            {/* Copy Buttons */}
                            <div className="pt-4 border-t border-stone-100">
                                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                                    Export Citation
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
                                    {source.url && (
                                        <CopyButton
                                            text={source.url}
                                            label="URL"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer tagline */}
                        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                            <p className="text-[10px] text-stone-400 text-center italic">
                                This is where credibility is earned.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
