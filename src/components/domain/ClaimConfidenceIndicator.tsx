import React from 'react';
import { getTrace } from '@/lib/data';

interface ClaimConfidenceProps {
    claimId: string;
}

type ConfidenceLevel = 'High' | 'Mixed' | 'Contested';

/**
 * PART 1: Claim-Level Confidence
 * 
 * Derives overall confidence from edge data.
 * Displays as a subtle, calm indicator near the claim header.
 */
export function ClaimConfidenceIndicator({ claimId }: ClaimConfidenceProps) {
    const trace = getTrace(claimId);

    if (trace.length === 0) return null;

    // Count confidence levels
    const counts = { High: 0, Medium: 0, Contested: 0 };
    trace.forEach(node => {
        const conf = node.edge.confidence;
        if (conf in counts) counts[conf as keyof typeof counts]++;
    });

    // Derive overall confidence
    let overallConfidence: ConfidenceLevel;
    let description: string;

    if (counts.Contested >= 2 || counts.Contested > counts.High) {
        overallConfidence = 'Contested';
        description = 'Multiple interpretations exist in the sources';
    } else if (counts.Medium > counts.High || (counts.High > 0 && counts.Medium > 0)) {
        overallConfidence = 'Mixed';
        description = 'Sources agree on core claims; details debated';
    } else {
        overallConfidence = 'High';
        description = 'Strong agreement across historical sources';
    }

    const styles = {
        High: 'border-l-stone-300 bg-stone-50/50',
        Mixed: 'border-l-amber-300/60 bg-amber-50/30',
        Contested: 'border-l-rose-300/60 bg-rose-50/30',
    };

    const textStyles = {
        High: 'text-stone-500',
        Mixed: 'text-amber-700/70',
        Contested: 'text-rose-700/70',
    };

    return (
        <div className={`border-l-2 pl-4 py-2 ${styles[overallConfidence]}`}>
            <div className="flex items-baseline gap-2">
                <span className={`text-xs font-medium ${textStyles[overallConfidence]}`}>
                    Historical confidence: {overallConfidence.toLowerCase()}
                </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
                {description}
            </p>
        </div>
    );
}
