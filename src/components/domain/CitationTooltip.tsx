'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSource } from '@/lib/data';
import { useSource } from '../SourceContext';
import { ExternalLink } from 'lucide-react';

export function CitationTooltip({ sourceId, children }: { sourceId: string, children: React.ReactNode }) {
    const [isHovered, setIsHovered] = useState(false);
    const { openSource } = useSource();
    const source = getSource(sourceId);

    if (!source) return <>{children}</>;

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 z-50 pointer-events-none"
                    >
                        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-stone-200 p-4" style={{
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div className="flex items-start justify-between mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${source.primary_or_secondary === 'Primary'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {source.primary_or_secondary}
                                </span>
                                <ExternalLink className="w-3 h-3 text-stone-400" />
                            </div>

                            <p className="text-xs text-stone-700 font-serif leading-relaxed">
                                {source.citation_chicago.slice(0, 150)}{source.citation_chicago.length > 150 ? '...' : ''}
                            </p>

                            <div className="mt-2 pt-2 border-t border-stone-100">
                                <p className="text-[10px] text-stone-500 italic">
                                    Click to view full citation
                                </p>
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/95"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
