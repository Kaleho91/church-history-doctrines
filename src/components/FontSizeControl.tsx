'use client';

import { useState, useEffect, useCallback } from 'react';

const FONT_SIZES = ['normal', 'large', 'larger'] as const;
type FontSize = typeof FONT_SIZES[number];

const FONT_SIZE_CLASSES: Record<FontSize, string> = {
    normal: '',
    large: 'text-scale-large',
    larger: 'text-scale-larger',
};

export function FontSizeControl() {
    const [fontSize, setFontSize] = useState<FontSize>('normal');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('fontSize') as FontSize | null;
        if (saved && FONT_SIZES.includes(saved)) {
            setFontSize(saved);
            if (FONT_SIZE_CLASSES[saved]) {
                document.documentElement.classList.add(FONT_SIZE_CLASSES[saved]);
            }
        }
    }, []);

    const cycleFontSize = useCallback(() => {
        const currentIndex = FONT_SIZES.indexOf(fontSize);
        const nextIndex = (currentIndex + 1) % FONT_SIZES.length;
        const nextSize = FONT_SIZES[nextIndex];

        // Remove old class
        if (FONT_SIZE_CLASSES[fontSize]) {
            document.documentElement.classList.remove(FONT_SIZE_CLASSES[fontSize]);
        }
        // Add new class
        if (FONT_SIZE_CLASSES[nextSize]) {
            document.documentElement.classList.add(FONT_SIZE_CLASSES[nextSize]);
        }

        setFontSize(nextSize);
        localStorage.setItem('fontSize', nextSize);
    }, [fontSize]);

    if (!mounted) return null;

    return (
        <button
            type="button"
            onClick={cycleFontSize}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-sm text-[#6b6358] rounded-full shadow-lg border border-[#e8e4dc] hover:shadow-xl transition-all text-sm font-medium cursor-pointer select-none"
            title={`Font size: ${fontSize}. Click to change.`}
        >
            <span className="text-lg">Aa</span>
            <span className="text-xs text-[#9a9285]">
                {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large' : 'Larger'}
            </span>
        </button>
    );
}

export default FontSizeControl;
