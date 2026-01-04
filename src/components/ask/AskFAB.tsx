'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

// Custom Proprietary Icon - Library/Temple with Gradient
const LibraryIcon = ({ className = "w-full h-full" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="libraryGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#8b7355" />
            </linearGradient>
            <linearGradient id="libraryAccent" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
        </defs>
        {/* Base/Foundation */}
        <rect x="15" y="78" width="70" height="8" rx="2" fill="url(#libraryGradient)" />
        {/* Pillars */}
        <rect x="22" y="35" width="8" height="43" rx="1" fill="url(#libraryGradient)" />
        <rect x="46" y="35" width="8" height="43" rx="1" fill="url(#libraryGradient)" />
        <rect x="70" y="35" width="8" height="43" rx="1" fill="url(#libraryGradient)" />
        {/* Roof/Pediment */}
        <path d="M10 38 L50 12 L90 38 L10 38 Z" fill="url(#libraryAccent)" />
        {/* Inner triangle detail */}
        <path d="M30 35 L50 20 L70 35 L30 35 Z" fill="#faf8f5" opacity="0.4" />
    </svg>
);

export default function AskFAB() {
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();

    // Don't show on the Ask page - it has its own input
    if (pathname?.startsWith('/ask')) {
        return null;
    }

    return (
        <Link
            href="/ask"
            className="fixed bottom-6 right-6 z-50 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative flex items-center">
                {/* Expanded label on hover */}
                <div
                    className={`
            absolute right-full mr-3 px-4 py-2.5 bg-white border border-[#e8e4dc] rounded-xl shadow-lg
            whitespace-nowrap font-serif text-[#3d3529] text-sm
            transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
          `}
                >
                    <span className="text-[#d4af37] mr-1.5">✦</span>
                    Ask the Fathers
                </div>

                {/* Main FAB button */}
                <div
                    className={`
            w-14 h-14 rounded-full bg-gradient-to-br from-[#8b7355] to-[#6b5339] flex items-center justify-center p-3
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
                >
                    <LibraryIcon className="w-full h-full drop-shadow-sm" />
                </div>
            </div>
        </Link>
    );
}
