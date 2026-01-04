'use client';

import { useState, useEffect } from 'react';

const SEARCH_STAGES = [
    { text: 'Searching sources', subtext: 'Scanning 30+ primary texts...' },
    { text: 'Reading the Fathers', subtext: 'Consulting patristic writings...' },
    { text: 'Cross-referencing', subtext: 'Connecting historical threads...' },
    { text: 'Composing response', subtext: 'Synthesizing insights...' },
];

interface Props {
    query: string;
}

export default function ExtendedThinking({ query }: Props) {
    const [stageIndex, setStageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Smooth stage progression
    useEffect(() => {
        const stageInterval = setInterval(() => {
            setStageIndex((prev) => Math.min(prev + 1, SEARCH_STAGES.length - 1));
        }, 2200);
        return () => clearInterval(stageInterval);
    }, []);

    // Smooth progress bar
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 1, 95));
        }, 100);
        return () => clearInterval(progressInterval);
    }, []);

    const currentStage = SEARCH_STAGES[stageIndex];

    return (
        <div className="flex gap-4 animate-fade-in">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b7355] flex items-center justify-center shadow-md relative">
                    <span className="text-white text-sm font-serif">✦</span>
                    {/* Subtle pulse ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/30 animate-ping-slow" />
                </div>
            </div>

            {/* Thinking content */}
            <div className="flex-1 max-w-2xl">
                <div className="bg-white border border-[#e8e4dc] rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
                    {/* Main content */}
                    <div className="p-5">
                        {/* Current stage */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce-gentle" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce-gentle" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce-gentle" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[#3d3529] font-medium">
                                {currentStage.text}
                            </span>
                        </div>

                        {/* Subtext */}
                        <p className="text-sm text-[#9a9285] mb-4 transition-opacity duration-500">
                            {currentStage.subtext}
                        </p>

                        {/* Progress bar */}
                        <div className="relative h-1 bg-[#f5f2ed] rounded-full overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#d4af37] to-[#8b7355] rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow" />
                        </div>
                    </div>

                    {/* Stage indicators */}
                    <div className="border-t border-[#f5f2ed] px-5 py-3 bg-[#faf8f5]/50">
                        <div className="flex items-center justify-between">
                            {SEARCH_STAGES.map((stage, idx) => (
                                <div
                                    key={stage.text}
                                    className={`flex items-center gap-1.5 transition-all duration-500 ${idx < stageIndex
                                            ? 'text-[#8b7355]'
                                            : idx === stageIndex
                                                ? 'text-[#3d3529]'
                                                : 'text-[#d4cfc4]'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${idx < stageIndex
                                            ? 'bg-[#8b7355] text-white'
                                            : idx === stageIndex
                                                ? 'bg-[#d4af37] text-white scale-110'
                                                : 'bg-[#e8e4dc] text-[#9a9285]'
                                        }`}>
                                        {idx < stageIndex ? '✓' : idx + 1}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">
                                        {stage.text.split(' ')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
