'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AskFAB() {
    const [isHovered, setIsHovered] = useState(false);

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
            absolute right-full mr-3 px-4 py-2 bg-white border border-[#e8e4dc] rounded-xl shadow-lg
            whitespace-nowrap font-serif text-[#3d3529] text-sm
            transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
          `}
                >
                    Ask the Fathers
                </div>

                {/* Main FAB button */}
                <div
                    className={`
            w-14 h-14 rounded-full bg-[#8b7355] text-white flex items-center justify-center
            shadow-lg hover:shadow-xl hover:bg-[#6b5339]
            transition-all duration-300 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
                >
                    <span className="text-2xl">🏛️</span>
                </div>
            </div>
        </Link>
    );
}
