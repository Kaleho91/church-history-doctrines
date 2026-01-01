'use client';

import React from 'react';
import { useSource } from '../SourceContext';
import { CitationTooltip } from './CitationTooltip';

/**
 * SYSTEM 5: Micro-interactions that reward attention
 * 
 * Citation superscripts gently highlight on hover.
 * Motion should be felt, not seen.
 */
export function CitationList({ citationIds }: { citationIds: string[] }) {
    const { openSource } = useSource();

    if (!citationIds || citationIds.length === 0) return null;

    return (
        <span className="inline-flex gap-0.5 ml-1 align-super text-xs font-semibold">
            {citationIds.map((id, i) => (
                <CitationTooltip key={id} sourceId={id}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openSource(id, e.currentTarget);
                        }}
                        className="text-indigo-500 hover:text-indigo-700 hover:underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-offset-1 rounded-sm transition-all duration-150"
                        aria-label={`View citation ${i + 1}`}
                    >
                        [{i + 1}]
                    </button>
                </CitationTooltip>
            ))}
        </span>
    );
}
