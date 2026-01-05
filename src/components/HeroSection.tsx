'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isHovering, setIsHovering] = useState(false);

    // Track mouse position relative to container
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    // Calculate parallax offsets
    const parallaxX = (mousePosition.x - 0.5) * 30;
    const parallaxY = (mousePosition.y - 0.5) * 30;
    const gradientX = mousePosition.x * 100;
    const gradientY = mousePosition.y * 100;

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Dynamic gradient background that follows mouse */}
            <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 60% at ${gradientX}% ${gradientY}%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 40% at ${100 - gradientX}% ${100 - gradientY}%, rgba(139, 115, 85, 0.06) 0%, transparent 50%),
                        linear-gradient(to bottom, #faf8f5 0%, #f5f2ed 100%)
                    `,
                }}
            />

            {/* Floating decorative elements with parallax */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large accent star - moves opposite to mouse */}
                <div
                    className="absolute top-[15%] left-[10%] text-[#d4af37]/20 text-8xl font-serif transition-transform duration-700 ease-out"
                    style={{ transform: `translate(${-parallaxX * 1.5}px, ${-parallaxY * 1.5}px)` }}
                >
                    ✦
                </div>

                {/* Medium star - moves with mouse */}
                <div
                    className="absolute top-[25%] right-[15%] text-[#d4af37]/10 text-5xl font-serif transition-transform duration-500 ease-out"
                    style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
                >
                    ✦
                </div>

                {/* Small stars scattered */}
                <div
                    className="absolute bottom-[30%] left-[20%] text-[#8b7355]/15 text-3xl font-serif transition-transform duration-600 ease-out"
                    style={{ transform: `translate(${parallaxX * 0.5}px, ${-parallaxY * 0.5}px)` }}
                >
                    ✦
                </div>
                <div
                    className="absolute top-[60%] right-[25%] text-[#d4af37]/10 text-2xl font-serif transition-transform duration-800 ease-out"
                    style={{ transform: `translate(${-parallaxX * 0.8}px, ${parallaxY * 0.8}px)` }}
                >
                    ✦
                </div>

                {/* Subtle floating lines */}
                <div
                    className="absolute top-[40%] left-[5%] w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(${parallaxX * 2}px)` }}
                />
                <div
                    className="absolute bottom-[25%] right-[8%] w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b7355]/15 to-transparent transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(${-parallaxX * 1.5}px)` }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/50" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7355]">
                        30+ Primary Sources
                    </span>
                    <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/50" />
                </div>

                {/* Main Headline - Provocative */}
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#2c261e] mb-6 leading-[1.1] animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <span className="block">Before the debates.</span>
                    <span className="block mt-2 text-[#8b7355]">Before the divisions.</span>
                    <span className="block mt-4 text-3xl sm:text-4xl md:text-5xl text-[#5c5346] font-normal italic">
                        What did they believe?
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-[#6b6358] leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
                    Go back to the source. Ask any question and hear the answer
                    <span className="text-[#8b7355] font-medium"> in their words</span>—the Church Fathers
                    who shaped 2,000 years of Christian thought.
                </p>

                {/* CTA Section */}
                <div className="flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    {/* Primary CTA */}
                    <Link
                        href="/ask"
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#3d3529] via-[#5c4d3c] to-[#3d3529] text-white font-medium text-lg rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                    >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        {/* Gold accent border */}
                        <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/30 group-hover:border-[#d4af37]/50 transition-colors" />

                        <span className="relative z-10">Ask the Fathers</span>
                        <span className="relative z-10 text-[#d4af37] group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>

                    {/* Secondary prompt */}
                    <p className="text-sm text-[#9a9285] italic">
                        &ldquo;What did the early church believe about baptism?&rdquo;
                    </p>
                </div>
            </div>

            {/* Bottom fade to content */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in opacity-60" style={{ animationDelay: '500ms' }}>
                <span className="text-xs text-[#9a9285] uppercase tracking-widest">Explore</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-[#d4af37]/40 to-transparent animate-pulse" />
            </div>
        </div>
    );
}
