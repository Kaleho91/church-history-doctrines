'use client';

import React from 'react';
import { useSource } from '../SourceContext';
import { CitationTooltip } from './CitationTooltip';

/**
 * Renders clickable citation superscripts with hover tooltips
 */

export function CitationList({ citationIds }: { citationIds: string[] }) {
    const { openSource } = useSource();

    if (!citationIds || citationIds.length === 0) return null;

    return (
        <span className="inline-flex gap-0.5 ml-1 align-super text-xs font-semibold text-blue-600">
            {citationIds.map((id, i) => (
                <CitationTooltip key={id} sourceId={id}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openSource(id, e.currentTarget);
                        }}
                        className="hover:underline hover:text-blue-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm transition-colors"
                        aria-label={`View citation ${i + 1}`}
                    >
                        [{i + 1}]
                    </button>
                </CitationTooltip>
            ))}
        </span>
    );
}
