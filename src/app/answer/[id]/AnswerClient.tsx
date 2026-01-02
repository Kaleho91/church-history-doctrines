'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronRight, BookOpen, Quote, Clock, Church, Compass, X } from 'lucide-react';

interface SourceData {
    excerpt?: string;
    url?: string;
}

interface NodeData {
    id: string;
    title: string;
    summary: string;
    date_range: string;
    type: string;
    parsedYear: number;
    relationType: string;
    source?: SourceData;
    scriptureText?: string;
    scriptureTranslation?: string;
}

interface AnswerPageClientProps {
    question: string;
    fullStatement: string;
    topicSlug: string;
    nodes: NodeData[];
    quotes: Array<{
        excerpt: string;
        significance?: string;
        author: string;
        date: string;
        url?: string;
    }>;
    variants: string[];
    historicSummary: string;
    interpretations: Array<{
        lens: string;
        summary: string;
        keyPoints: string[];
        traditionCount?: number;
        dominantStance?: string;
    }>;
}

// Determine era from year
function getEra(year: number): { name: string; color: string } {
    if (year <= 100) return { name: 'Scripture', color: '#6b8e23' };
    if (year <= 313) return { name: 'Early Fathers', color: '#8b7355' };
    if (year <= 600) return { name: 'Patristic', color: '#7c6a9a' };
    if (year <= 1054) return { name: 'Early Medieval', color: '#5c7a8a' };
    if (year <= 1500) return { name: 'Medieval', color: '#8b6969' };
    if (year <= 1650) return { name: 'Reformation', color: '#6a8b6b' };
    return { name: 'Modern', color: '#7a7a8a' };
}

// Get relation style
function getRelationStyle(relationType: string): { label: string; color: string; bg: string } {
    const map: Record<string, { label: string; color: string; bg: string }> = {
        'Supports': { label: 'Supports', color: '#2e7d32', bg: '#e8f5e9' },
        'Defines': { label: 'Defines', color: '#1565c0', bg: '#e3f2fd' },
        'Develops': { label: 'Develops', color: '#7b1fa2', bg: '#f3e5f5' },
        'Challenges': { label: 'Diverges', color: '#c62828', bg: '#ffebee' },
    };
    return map[relationType] || { label: relationType, color: '#666', bg: '#f5f5f5' };
}

// Get tradition color
function getTraditionColor(lens: string): string {
    const colors: Record<string, string> = {
        'Consensus': '#6b8e23',
        'Catholic': '#d4af37',
        'Orthodox': '#c9a227',
        'Coptic': '#8b4513',  // Sienna - distinct but warm
        'Lutheran': '#4a90d9',
        'Reformed': '#2e7d32',
        'ZwinglianBaptistic': '#8b7355',
    };
    return colors[lens] || '#6b6358';
}

// Group nodes by era
function groupNodesByEra(nodes: NodeData[]): Array<{ era: { name: string; color: string }; nodes: NodeData[] }> {
    const groups: Array<{ era: { name: string; color: string }; nodes: NodeData[] }> = [];
    let currentEra: { name: string; color: string } | null = null;

    nodes.forEach(node => {
        const era = getEra(node.parsedYear);
        if (!currentEra || era.name !== currentEra.name) {
            currentEra = era;
            groups.push({ era, nodes: [node] });
        } else {
            groups[groups.length - 1].nodes.push(node);
        }
    });

    return groups;
}

type PanelType = 'timeline' | 'traditions' | 'quotes' | null;

export function AnswerPageClient({
    question,
    fullStatement,
    topicSlug,
    nodes,
    quotes,
    variants,
    historicSummary,
    interpretations,
}: AnswerPageClientProps) {
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const [collapsedEras, setCollapsedEras] = useState<Set<string>>(new Set());
    const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const eraGroups = groupNodesByEra(nodes);
    const isPanelOpen = activePanel !== null;

    const toggleEra = (eraName: string) => {
        setCollapsedEras(prev => {
            const next = new Set(prev);
            if (next.has(eraName)) {
                next.delete(eraName);
            } else {
                next.add(eraName);
            }
            return next;
        });
    };

    const closePanel = () => setActivePanel(null);

    const exploreButtons = [
        { id: 'timeline' as PanelType, icon: Clock, label: 'Timeline', desc: 'Historical sources' },
        { id: 'traditions' as PanelType, icon: Church, label: 'Traditions', desc: 'Church views' },
        { id: 'quotes' as PanelType, icon: Quote, label: 'Key Quotes', desc: `${quotes.length} sources` },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href={`/topic/${topicSlug}`}
                        className="flex items-center gap-2 text-[#6b6358] hover:text-[#3d3529] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Link>
                    {isPanelOpen && (
                        <button
                            onClick={closePanel}
                            className="lg:hidden flex items-center gap-1 text-sm text-[#6b6358]"
                        >
                            <X className="w-4 h-4" /> Close
                        </button>
                    )}
                </div>
            </header>

            {/* Main layout with slide */}
            <div className="flex">
                {/* Main content - slides left when panel opens */}
                <main
                    className={`
                        transition-all duration-300 ease-out
                        ${isPanelOpen
                            ? 'lg:w-[45%] lg:min-w-[400px]'
                            : 'w-full max-w-2xl mx-auto'
                        }
                        px-6 py-12
                    `}
                >
                    {/* The Question - Animated entrance */}
                    <div className="mb-8 animate-fade-in">
                        {/* Decorative accent */}
                        <div className="flex items-center gap-2 mb-4 text-[#d4af37]">
                            <span className="w-6 h-[1px] bg-[#d4af37]/50" />
                            <span className="text-sm">✦</span>
                            <span className="w-6 h-[1px] bg-[#d4af37]/50" />
                        </div>
                        <h1 className="font-serif text-4xl sm:text-5xl text-[#3d3529] leading-tight">
                            {question}
                        </h1>
                    </div>

                    {/* The Answer - Elegant card with gradient and gold accent */}
                    <div className="relative mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {/* Gold accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#d4af37] to-[#d4af37]/30" />

                        <div className="ml-5 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 border border-[#e8e4dc] shadow-sm">
                            <p className="text-[#5c5346] leading-relaxed text-lg">
                                <span className="font-semibold text-[#3d3529]">According to the historic witness of the Church: </span>
                                {historicSummary}
                            </p>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-8 h-[1px] bg-[#d4af37]/40" />
                                <p className="text-sm text-[#9a9285] italic">
                                    Based on {nodes.length} historical sources from Scripture through the Reformation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Buttons - Elegant animated cards */}
                    <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-5">
                            Explore Further
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {exploreButtons.map((btn, idx) => {
                                const Icon = btn.icon;
                                const isActive = activePanel === btn.id;
                                return (
                                    <button
                                        key={btn.id}
                                        onClick={() => setActivePanel(isActive ? null : btn.id)}
                                        className={`
                                            group relative flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-300
                                            ${isActive
                                                ? 'bg-gradient-to-br from-[#3d3529] to-[#2a2520] text-white border-[#3d3529] shadow-lg scale-[1.02]'
                                                : 'bg-gradient-to-br from-white to-[#faf8f5] border-[#e8e4dc] text-[#6b6358] hover:border-[#d4cfc4] hover:shadow-md hover:-translate-y-0.5'
                                            }
                                        `}
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <Icon className={`w-7 h-7 transition-transform group-hover:scale-110 ${isActive ? 'text-[#d4af37]' : 'text-[#8b7355]'}`} />
                                        <span className="font-semibold">{btn.label}</span>
                                        <span className={`text-xs ${isActive ? 'text-white/70' : 'text-[#9a9285]'}`}>
                                            {btn.desc}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Doctrine Through History - Elegant Era Summary */}
                    {!isPanelOpen && (
                        <button
                            onClick={() => setActivePanel('timeline')}
                            className="w-full relative group animate-fade-in-up"
                            style={{ animationDelay: '300ms' }}
                        >
                            {/* Subtle accent on hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-[#6b8e23] opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                            <div className="ml-0 group-hover:ml-4 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 border border-[#e8e4dc] mb-8 hover:shadow-lg hover:border-[#d4cfc4] transition-all duration-300 text-left">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide">
                                        Sources Through History
                                    </h3>
                                    <span className="text-sm text-[#8b7355] group-hover:text-[#3d3529] font-medium flex items-center gap-1 transition-colors">
                                        Explore timeline <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </div>

                                {/* Era pills - refined and elegant */}
                                <div className="flex flex-wrap gap-3">
                                    {eraGroups.map((group, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all hover:scale-105"
                                            style={{
                                                background: `linear-gradient(135deg, ${group.era.color}15, ${group.era.color}08)`,
                                                border: `1px solid ${group.era.color}25`
                                            }}
                                        >
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: group.era.color }}
                                            />
                                            <span
                                                className="text-sm font-medium"
                                                style={{ color: group.era.color }}
                                            >
                                                {group.era.name}
                                            </span>
                                            <span className="text-xs text-[#6b6358] bg-white/80 px-2 py-0.5 rounded-full font-medium">
                                                {group.nodes.length}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </button>
                    )}

                    {/* Back link */}
                    <div className="mt-8 pt-8 border-t border-[#e8e4dc] text-center">
                        <Link
                            href={`/topic/${topicSlug}`}
                            className="text-[#8b7355] hover:text-[#3d3529] font-medium"
                        >
                            ← Explore more questions
                        </Link>
                    </div>
                </main >

                {/* Side Panel - slides in from right on desktop, bottom drawer on mobile */}
                {
                    isPanelOpen && (
                        <>
                            {/* Desktop: Side panel */}
                            <aside className="hidden lg:block flex-1 border-l border-[#e8e4dc] bg-white overflow-y-auto max-h-[calc(100vh-65px)] sticky top-[65px]">
                                <div className="p-6">
                                    {/* Panel Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif text-xl text-[#3d3529]">
                                            {activePanel === 'timeline' && 'Historical Timeline'}
                                            {activePanel === 'traditions' && 'Tradition Perspectives'}
                                            {activePanel === 'quotes' && 'Key Quotes'}
                                        </h2>
                                        <button
                                            onClick={closePanel}
                                            className="p-2 rounded-full hover:bg-[#f5f2ed] text-[#6b6358]"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Timeline Panel - Elegant Historical Trace */}
                                    {activePanel === 'timeline' && (
                                        <div className="space-y-5">
                                            {/* Panel intro */}
                                            <p className="text-sm text-[#9a9285] italic border-b border-[#e8e4dc] pb-4">
                                                Tracing this doctrine through {nodes.length} historical sources
                                            </p>

                                            {eraGroups.map((group, groupIdx) => {
                                                const isCollapsed = collapsedEras.has(group.era.name);
                                                return (
                                                    <div
                                                        key={groupIdx}
                                                        ref={el => { nodeRefs.current[group.era.name] = el; }}
                                                        className="animate-fade-in-up"
                                                        style={{ animationDelay: `${groupIdx * 60}ms` }}
                                                    >
                                                        {/* Era header button */}
                                                        <button
                                                            onClick={() => toggleEra(group.era.name)}
                                                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all hover:shadow-md group"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${group.era.color}12, ${group.era.color}06)`,
                                                                border: `1px solid ${group.era.color}25`
                                                            }}
                                                        >
                                                            <div
                                                                className="w-3 h-3 rotate-45 transition-transform group-hover:scale-110"
                                                                style={{ backgroundColor: group.era.color }}
                                                            />
                                                            <span className="font-serif text-lg font-semibold text-[#3d3529] flex-grow text-left">
                                                                {group.era.name}
                                                            </span>
                                                            <span className="text-base text-[#8b7355]">{group.nodes.length} sources</span>
                                                            {isCollapsed ? <ChevronRight className="w-5 h-5 text-[#9a9285]" /> : <ChevronDown className="w-5 h-5 text-[#9a9285]" />}
                                                        </button>

                                                        {/* Era nodes */}
                                                        {!isCollapsed && (
                                                            <div className="mt-3 space-y-4">
                                                                {group.nodes.map((node, nodeIdx) => {
                                                                    const relation = getRelationStyle(node.relationType);
                                                                    return (
                                                                        <div
                                                                            key={node.id}
                                                                            className="group relative animate-fade-in-up"
                                                                            style={{ animationDelay: `${nodeIdx * 50}ms` }}
                                                                        >
                                                                            {/* Decorative era-colored accent */}
                                                                            <div
                                                                                className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                                                                                style={{
                                                                                    background: `linear-gradient(to bottom, ${group.era.color}, ${group.era.color}30)`
                                                                                }}
                                                                            />

                                                                            <div className="ml-5 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-5 border border-[#e8e4dc] shadow-sm hover:shadow-md transition-all duration-300">
                                                                                {/* Header row */}
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <span
                                                                                        className="text-sm font-semibold px-3 py-1 rounded-full"
                                                                                        style={{ color: relation.color, backgroundColor: relation.bg }}
                                                                                    >
                                                                                        {relation.label}
                                                                                    </span>
                                                                                    <span className="text-base font-medium text-[#8b7355]">{node.date_range}</span>
                                                                                </div>

                                                                                {/* Title */}
                                                                                <h4 className="font-serif text-xl text-[#3d3529] mb-3">{node.title}</h4>

                                                                                {/* Scripture text with elegant styling */}
                                                                                {node.type === 'Scripture' && node.scriptureText && (
                                                                                    <div className="relative bg-gradient-to-br from-[#faf8f5] to-white rounded-xl p-5 mb-4 border border-[#e8e4dc]">
                                                                                        <div className="absolute -top-2 left-4 text-4xl text-[#6b8e23]/30 font-serif select-none">"</div>
                                                                                        <blockquote className="font-serif text-lg text-[#3d3529] leading-relaxed italic pt-2">
                                                                                            {node.scriptureText}
                                                                                        </blockquote>
                                                                                        {node.scriptureTranslation && (
                                                                                            <div className="flex items-center gap-2 mt-3">
                                                                                                <div className="w-6 h-[1px] bg-[#6b8e23]/40" />
                                                                                                <span className="text-sm text-[#8b7355]">{node.scriptureTranslation}</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}

                                                                                {/* Summary */}
                                                                                <p className="text-base text-[#5c5346] leading-relaxed">{node.summary}</p>

                                                                                {/* Source link */}
                                                                                {node.source?.url && (
                                                                                    <a
                                                                                        href={node.source.url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-2 mt-4 text-base text-[#8b7355] hover:text-[#3d3529] font-medium transition-colors"
                                                                                    >
                                                                                        Read primary source <ExternalLink className="w-4 h-4" />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Traditions Panel - Theological Lenses */}
                                    {activePanel === 'traditions' && (
                                        <div className="space-y-6">
                                            {/* Panel intro */}
                                            <p className="text-sm text-[#9a9285] italic border-b border-[#e8e4dc] pb-4">
                                                {interpretations.length} theological perspectives on this claim
                                            </p>

                                            {/* Lens pills with animation */}
                                            <div className="flex flex-wrap gap-2 animate-fade-in">
                                                {interpretations.map((interp, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 text-sm font-medium rounded-full transition-all hover:scale-105"
                                                        style={{
                                                            backgroundColor: `${getTraditionColor(interp.lens)}15`,
                                                            color: getTraditionColor(interp.lens),
                                                            border: `1px solid ${getTraditionColor(interp.lens)}30`
                                                        }}
                                                    >
                                                        {interp.lens === 'ZwinglianBaptistic' ? 'Baptist/Zwinglian' : interp.lens}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Tradition cards with elegant styling */}
                                            {interpretations.map((interp, i) => (
                                                <div
                                                    key={i}
                                                    className="group relative animate-fade-in-up"
                                                    style={{ animationDelay: `${i * 80}ms` }}
                                                >
                                                    {/* Decorative vertical gradient accent */}
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                                        style={{
                                                            background: `linear-gradient(to bottom, ${getTraditionColor(interp.lens)}, ${getTraditionColor(interp.lens)}40)`
                                                        }}
                                                    />

                                                    <div className="ml-5 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-5 border border-[#e8e4dc] shadow-sm hover:shadow-md transition-all duration-300">
                                                        {/* Header with tradition name and badge */}
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-serif text-lg font-semibold text-[#3d3529]">
                                                                {interp.lens === 'ZwinglianBaptistic' ? 'Baptist / Zwinglian' : interp.lens}
                                                            </h4>
                                                            {interp.traditionCount && interp.traditionCount > 1 ? (
                                                                <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8b7355]/10 to-[#8b7355]/5 text-[#8b7355] font-medium">
                                                                    {interp.traditionCount} traditions
                                                                </span>
                                                            ) : interp.lens === 'Consensus' ? (
                                                                <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#2e7d32]/10 to-[#2e7d32]/5 text-[#2e7d32] font-medium">
                                                                    ✦ Ecumenical
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        {/* Summary with larger text */}
                                                        <p className="text-base text-[#5c5346] leading-relaxed mb-4">
                                                            {interp.summary}
                                                        </p>

                                                        {/* Key points with refined styling */}
                                                        {interp.keyPoints.length > 0 && (
                                                            <div className="space-y-2.5 pt-3 border-t border-[#e8e4dc]/60">
                                                                <span className="text-xs font-semibold text-[#9a9285] uppercase tracking-wide">
                                                                    Key Evidence
                                                                </span>
                                                                {interp.keyPoints.map((point, j) => (
                                                                    <div key={j} className="flex gap-3 text-sm group/point">
                                                                        <span
                                                                            className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                                                                            style={{ backgroundColor: getTraditionColor(interp.lens) }}
                                                                        />
                                                                        <span className="text-[#5c5346] group-hover/point:text-[#3d3529] transition-colors">
                                                                            {point}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Fallback to variants if no interpretations */}
                                            {interpretations.length === 0 && variants.map((variant, i) => (
                                                <div key={i} className="p-4 bg-[#f5f2ed] rounded-lg border-l-4 border-[#8b7355]">
                                                    <p className="text-[#3d3529] leading-relaxed">{variant}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Quotes Panel - Elegant & Animated */}
                                    {activePanel === 'quotes' && (
                                        <div className="space-y-6">
                                            {/* Panel intro */}
                                            <p className="text-sm text-[#9a9285] italic border-b border-[#e8e4dc] pb-4">
                                                Primary sources from {quotes.length} historical witnesses
                                            </p>

                                            {quotes.map((quote, i) => (
                                                <div
                                                    key={i}
                                                    className="group relative animate-fade-in-up"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                >
                                                    {/* Decorative vertical accent */}
                                                    <div
                                                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#d4af37] via-[#8b7355] to-[#d4af37]/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                                    />

                                                    <div className="ml-5 bg-gradient-to-br from-[#faf8f5] to-white rounded-xl p-6 border border-[#e8e4dc] shadow-sm hover:shadow-md transition-all duration-300">
                                                        {/* Opening quote mark */}
                                                        <div className="text-5xl text-[#d4af37]/30 font-serif leading-none mb-2 select-none">"</div>

                                                        {/* Quote text - larger, more impactful */}
                                                        <blockquote className="font-serif text-xl text-[#3d3529] leading-relaxed mb-4 -mt-4">
                                                            {quote.excerpt}
                                                        </blockquote>

                                                        {/* Attribution with elegant separator */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-[2px] bg-gradient-to-r from-[#d4af37] to-transparent rounded-full" />
                                                            <div className="flex flex-col">
                                                                <span className="text-base font-semibold text-[#5c5346]">
                                                                    {quote.author}
                                                                </span>
                                                                <span className="text-sm text-[#9a9285]">
                                                                    {quote.date}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Significance - appears on hover with subtle animation */}
                                                        {quote.significance && (
                                                            <div className="mt-4 pt-4 border-t border-[#e8e4dc]/60">
                                                                <p className="text-sm text-[#6b6358] leading-relaxed italic">
                                                                    <span className="text-[#8b7355] font-medium not-italic">Why this matters: </span>
                                                                    {quote.significance}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Source link */}
                                                        {quote.url && (
                                                            <a
                                                                href={quote.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#8b7355] hover:text-[#3d3529] font-medium transition-colors"
                                                            >
                                                                Read full source <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </aside>

                            {/* Mobile: Bottom Drawer - Elegant */}
                            <div className="lg:hidden fixed inset-0 z-40">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePanel} />
                                <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gradient-to-br from-white to-[#faf8f5] rounded-t-3xl shadow-2xl overflow-hidden animate-slide-in-up">
                                    {/* Drawer handle */}
                                    <div className="flex justify-center pt-3 pb-1">
                                        <div className="w-10 h-1 rounded-full bg-[#d4cfc4]" />
                                    </div>

                                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#e8e4dc] px-5 py-4 flex items-center justify-between">
                                        <h2 className="font-serif text-xl text-[#3d3529]">
                                            {activePanel === 'timeline' && 'Historical Timeline'}
                                            {activePanel === 'traditions' && 'Theological Lenses'}
                                            {activePanel === 'quotes' && 'Key Quotes'}
                                        </h2>
                                        <button onClick={closePanel} className="p-2 rounded-full hover:bg-[#f5f2ed] transition-colors">
                                            <X className="w-5 h-5 text-[#6b6358]" />
                                        </button>
                                    </div>

                                    <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
                                        {/* Timeline drawer */}
                                        {activePanel === 'timeline' && (
                                            <div className="space-y-4">
                                                {eraGroups.map((group, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-4 rounded-xl"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${group.era.color}10, ${group.era.color}05)`,
                                                            border: `1px solid ${group.era.color}20`
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: group.era.color }} />
                                                            <span className="font-serif text-lg font-semibold text-[#3d3529]">{group.era.name}</span>
                                                            <span className="text-sm text-[#9a9285]">({group.nodes.length})</span>
                                                        </div>
                                                        {group.nodes.map(node => (
                                                            <div
                                                                key={node.id}
                                                                className="ml-4 py-3 border-l-2 pl-4 mb-2"
                                                                style={{ borderColor: group.era.color }}
                                                            >
                                                                <p className="font-medium text-[#3d3529] text-base">{node.title}</p>
                                                                <p className="text-sm text-[#8b7355] mb-2">{node.date_range}</p>
                                                                {node.type === 'Scripture' && node.scriptureText && (
                                                                    <div className="bg-white rounded-lg p-3 mt-2 border border-[#e8e4dc]">
                                                                        <p className="font-serif text-sm text-[#3d3529] italic">"{node.scriptureText}"</p>
                                                                        {node.scriptureTranslation && (
                                                                            <p className="text-xs text-[#9a9285] mt-1">— {node.scriptureTranslation}</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Traditions drawer */}
                                        {activePanel === 'traditions' && (
                                            <div className="space-y-4">
                                                {interpretations.map((interp, i) => (
                                                    <div
                                                        key={i}
                                                        className="relative p-4 bg-white rounded-xl border border-[#e8e4dc]"
                                                    >
                                                        <div
                                                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                                                            style={{ backgroundColor: getTraditionColor(interp.lens) }}
                                                        />
                                                        <h4 className="font-serif text-lg font-semibold text-[#3d3529] mb-2 pl-2">
                                                            {interp.lens === 'ZwinglianBaptistic' ? 'Baptist / Zwinglian' : interp.lens}
                                                        </h4>
                                                        <p className="text-sm text-[#5c5346] leading-relaxed pl-2">{interp.summary}</p>
                                                    </div>
                                                ))}
                                                {interpretations.length === 0 && variants.map((v, i) => (
                                                    <div key={i} className="p-4 bg-[#f5f2ed] rounded-xl border-l-4 border-[#8b7355]">
                                                        <p className="text-base text-[#3d3529]">{v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Quotes drawer */}
                                        {activePanel === 'quotes' && (
                                            <div className="space-y-5">
                                                {quotes.map((q, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#d4af37] to-[#d4af37]/30" />
                                                        <div className="ml-4 p-4 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl border border-[#e8e4dc]">
                                                            <div className="text-3xl text-[#d4af37]/30 font-serif leading-none mb-1">"</div>
                                                            <blockquote className="font-serif text-lg text-[#3d3529] leading-relaxed -mt-3">{q.excerpt}</blockquote>
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <div className="w-6 h-[1px] bg-[#d4af37]/50" />
                                                                <span className="text-sm font-medium text-[#5c5346]">{q.author}, {q.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div >
        </div >
    );
}
