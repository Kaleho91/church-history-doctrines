'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// === ELEGANT PARTICLE CONSTELLATION ===
// Subtle floating particles with gentle connections - like dust motes in cathedral light

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    opacity: number;
    phase: number;
    speed: number;
}

function ElegantConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    const initParticles = useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        const count = Math.floor((width * height) / 25000); // Sparse, elegant

        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            particles.push({
                x,
                y,
                baseX: x,
                baseY: y,
                size: 1 + Math.random() * 1.5,
                opacity: 0.15 + Math.random() * 0.15,
                phase: Math.random() * Math.PI * 2,
                speed: 0.2 + Math.random() * 0.3,
            });
        }

        particlesRef.current = particles;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 1.5;
            initParticles(canvas.width, canvas.height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            timeRef.current += 0.003;

            const particles = particlesRef.current;
            const mouse = mouseRef.current;
            const influenceRadius = 180;

            // Update and draw particles
            particles.forEach((p) => {
                // Gentle floating motion
                p.x = p.baseX + Math.sin(timeRef.current + p.phase) * 15;
                p.y = p.baseY + Math.cos(timeRef.current * 0.7 + p.phase) * 10;

                // Subtle mouse influence
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.hypot(dx, dy);

                let opacity = p.opacity;
                let size = p.size;

                if (dist < influenceRadius) {
                    const intensity = (1 - dist / influenceRadius) ** 2;
                    opacity += intensity * 0.2;
                    size += intensity * 1;
                    // Gentle push away from mouse
                    p.x -= dx * intensity * 0.02;
                    p.y -= dy * intensity * 0.02;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(184, 134, 11, ${opacity})`;
                ctx.fill();
            });

            // Draw subtle connections
            const connectionDist = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);

                    if (dist < connectionDist) {
                        const opacity = (1 - dist / connectionDist) * 0.06;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(139, 90, 43, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [initParticles]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}

// === ICONS - Refined, softer ===
const BaptismIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
            <linearGradient id="dropGradLight" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        <path d="M50 12 C50 12 25 45 25 62 C25 76 36 87 50 87 C64 87 75 76 75 62 C75 45 50 12 50 12Z" fill="url(#dropGradLight)" opacity="0.85" />
    </svg>
);

const TrinityIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
            <linearGradient id="triGradLight" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <path d="M50 15 L50 85 M25 42 L75 42" stroke="url(#triGradLight)" strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <circle cx="50" cy="42" r="10" stroke="#b8860b" strokeWidth="2.5" fill="none" opacity="0.6" />
    </svg>
);

const EucharistIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
            <radialGradient id="breadGradLight" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill="url(#breadGradLight)" opacity="0.85" />
        <path d="M50 30 L50 70 M30 50 L70 50" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
    </svg>
);

const TOPICS = [
    { slug: 'baptism', icon: <BaptismIcon />, title: 'Baptism', question: 'Was it necessary for salvation?', sources: 9, accent: '#0ea5e9' },
    { slug: 'trinity', icon: <TrinityIcon />, title: 'Trinity', question: 'One essence, three persons?', sources: 8, accent: '#8b5cf6' },
    { slug: 'communion', icon: <EucharistIcon />, title: "Eucharist", question: 'Real presence in the bread?', sources: 7, accent: '#f59e0b' },
];

const SCRIPTURES = [
    { ref: 'John 3:5', slug: 'john-3-5', context: '"born of water and the Spirit"' },
    { ref: 'John 1:1', slug: 'john-1-1', context: '"the Word was God"' },
    { ref: 'Matthew 28:19', slug: 'matthew-28-19', context: 'the baptismal formula' },
    { ref: 'John 6:53', slug: 'john-6-51-56', context: '"eat my flesh, drink my blood"' },
    { ref: 'Acts 2:38', slug: 'acts-2-38', context: '"repent and be baptized"' },
];

const FATHERS = [
    { name: 'Clement of Rome', years: 'c. 35–99 AD', role: 'Bishop' },
    { name: 'Ignatius of Antioch', years: 'c. 35–108 AD', role: 'Martyr' },
    { name: 'Justin Martyr', years: 'c. 100–165 AD', role: 'Apologist' },
    { name: 'Irenaeus of Lyon', years: 'c. 130–202 AD', role: 'Theologian' },
    { name: 'Origen of Alexandria', years: 'c. 185–253 AD', role: 'Scholar' },
    { name: 'Augustine of Hippo', years: '354–430 AD', role: 'Doctor' },
];

export default function LandingPage() {
    const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
    const [hoveredScripture, setHoveredScripture] = useState<string | null>(null);
    const [hoveredFather, setHoveredFather] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#faf8f4] text-[#1a1612] overflow-hidden relative">
            {/* Elegant particle constellation */}
            <ElegantConstellation />

            {/* Warm ambient gradient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f4] via-[#f8f5ef] to-[#faf8f4]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(184,134,11,0.04),transparent)]" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Refined Era Context */}
                    <div className="mb-10 animate-fade-in">
                        <div className="inline-flex items-center gap-4">
                            <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#b8860b]/40" />
                            <span className="text-[#8b5a2b] text-[11px] uppercase tracking-[0.35em] font-medium">
                                The Early Church · 100–500 AD
                            </span>
                            <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#b8860b]/40" />
                        </div>
                    </div>

                    {/* Main headline - Elegant serif */}
                    <h1 className="font-serif mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <span className="block text-[#4a423a] text-xl sm:text-2xl font-normal tracking-wide mb-4">
                            Before the schisms. Before the reformations.
                        </span>
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold leading-[1.1] text-[#1a1612]">
                            What did the first Christians
                        </span>
                        <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold leading-[1.1] mt-1">
                            <span className="text-[#8b5a2b]">actually believe?</span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-[#7a7068] mb-4 max-w-xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '200ms' }}>
                        Direct quotes from the bishops, theologians, and martyrs
                        who shaped Christianity—in their own words.
                    </p>

                    {/* Value prop */}
                    <p className="text-sm text-[#a89a8a] mb-12 animate-fade-in" style={{ animationDelay: '250ms' }}>
                        Primary sources. Scholarly references. Zero modern spin.
                    </p>

                    {/* CTA - Warm, inviting */}
                    <div className="animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '300ms' }}>
                        <Link
                            href="/ask"
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#8b5a2b] text-white text-base font-medium rounded-full transition-all duration-300 hover:bg-[#7a4d24] shadow-[0_4px_20px_rgba(139,90,43,0.25)] hover:shadow-[0_8px_30px_rgba(139,90,43,0.35)]"
                        >
                            <span>Ask the Fathers</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </Link>

                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-2 px-6 py-3.5 text-[#7a7068] hover:text-[#4a423a] text-base font-medium transition-colors"
                        >
                            <span>Explore topics</span>
                            <span className="text-[#b8860b]">↓</span>
                        </Link>
                    </div>

                    {/* Subtle trust line */}
                    <div className="mt-16 flex items-center justify-center gap-6 text-xs text-[#a89a8a] animate-fade-in" style={{ animationDelay: '500ms' }}>
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#b8860b]/50" />
                            30+ primary sources
                        </span>
                        <span className="text-[#d4c4a8]">·</span>
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#b8860b]/50" />
                            Scholarly citations
                        </span>
                        <span className="text-[#d4c4a8]">·</span>
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#b8860b]/50" />
                            Multiple perspectives
                        </span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in opacity-50" style={{ animationDelay: '700ms' }}>
                    <div className="w-px h-10 bg-gradient-to-b from-[#b8860b]/50 to-transparent" />
                </div>
            </section>

            {/* Doctrines Section */}
            <section className="relative py-28 px-6 z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <p className="text-[#b8860b] text-xs uppercase tracking-[0.3em] mb-4 font-medium">Explore</p>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1612] font-semibold mb-3">
                            Central Doctrines
                        </h2>
                        <p className="text-[#7a7068] text-base max-w-lg mx-auto">
                            The debates that shaped Christianity. Trace each teaching to its origins.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TOPICS.map((topic, i) => (
                            <Link
                                key={topic.slug}
                                href={`/topic/${topic.slug}`}
                                className="group relative block animate-fade-in-up"
                                style={{ animationDelay: `${i * 80}ms` }}
                                onMouseEnter={() => setHoveredTopic(topic.slug)}
                                onMouseLeave={() => setHoveredTopic(null)}
                            >
                                <div
                                    className={`
                                        relative overflow-hidden rounded-2xl border transition-all duration-400 p-8
                                        ${hoveredTopic === topic.slug
                                            ? 'bg-white border-[#e8e0d4] shadow-[0_12px_40px_-12px_rgba(139,90,43,0.15)]'
                                            : 'bg-white/60 border-[#ede8de] hover:border-[#e0d8c8]'}
                                    `}
                                >
                                    {/* Subtle top accent */}
                                    <div
                                        className={`absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 ${hoveredTopic === topic.slug ? 'opacity-100' : 'opacity-0'}`}
                                        style={{ background: `linear-gradient(90deg, transparent, ${topic.accent}40, transparent)` }}
                                    />

                                    <div className="text-center">
                                        {/* Icon */}
                                        <div className="w-20 h-20 mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                                            {topic.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-serif text-xl text-[#1a1612] font-semibold mb-2 group-hover:text-[#8b5a2b] transition-colors">
                                            {topic.title}
                                        </h3>

                                        {/* Question */}
                                        <p className="text-sm text-[#7a7068] italic mb-5">
                                            {topic.question}
                                        </p>

                                        {/* Source count */}
                                        <div className="flex items-center justify-center gap-1.5 text-sm text-[#8b5a2b] font-medium">
                                            <span>{topic.sources} sources</span>
                                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scripture Section */}
            <section className="relative py-24 px-6 z-10 bg-gradient-to-b from-transparent via-[#f6f3ec]/50 to-transparent">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-[#b8860b] text-xs uppercase tracking-[0.3em] mb-3 font-medium">By Passage</p>
                            <h2 className="font-serif text-2xl sm:text-3xl text-[#1a1612] font-semibold">
                                Key Scriptures
                            </h2>
                        </div>
                        <Link
                            href="/scripture"
                            className="group flex items-center gap-1.5 text-sm text-[#8b5a2b] hover:text-[#6d4420] font-medium transition-colors"
                        >
                            <span>View all</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SCRIPTURES.map((s, i) => (
                            <Link
                                key={s.slug}
                                href={`/scripture/${s.slug}`}
                                className="group block animate-fade-in-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                                onMouseEnter={() => setHoveredScripture(s.slug)}
                                onMouseLeave={() => setHoveredScripture(null)}
                            >
                                <div
                                    className={`
                                        relative p-5 rounded-xl border transition-all duration-300
                                        ${hoveredScripture === s.slug
                                            ? 'bg-white border-[#d4c4a8] shadow-sm'
                                            : 'bg-white/40 border-[#ede8de] hover:bg-white/70'}
                                    `}
                                >
                                    {/* Reference */}
                                    <h3 className={`font-serif text-lg font-semibold mb-1 transition-colors ${hoveredScripture === s.slug ? 'text-[#8b5a2b]' : 'text-[#1a1612]'}`}>
                                        {s.ref}
                                    </h3>

                                    {/* Context */}
                                    <p className="text-sm text-[#7a7068] italic leading-relaxed">
                                        {s.context}
                                    </p>

                                    {/* Arrow indicator */}
                                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#b8860b] transition-all duration-300 ${hoveredScripture === s.slug ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                                        →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Fathers Section */}
            <section className="relative py-28 px-6 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#d4c4a8] mb-6">
                            <span className="text-[#b8860b] text-lg">✦</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#1a1612] font-semibold mb-4">
                            Who were the Church Fathers?
                        </h2>
                        <p className="text-[#7a7068] text-lg max-w-2xl mx-auto leading-relaxed">
                            The bishops, theologians, and martyrs of the first five centuries
                            who defined what Christians believed—before the East-West Schism,
                            before the Reformation.
                        </p>
                    </div>

                    {/* Father cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {FATHERS.map((f, i) => (
                            <div
                                key={f.name}
                                className="group p-5 rounded-xl bg-white/50 border border-[#ede8de] hover:bg-white hover:border-[#d4c4a8] hover:shadow-sm transition-all duration-300 cursor-default animate-fade-in-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                                onMouseEnter={() => setHoveredFather(f.name)}
                                onMouseLeave={() => setHoveredFather(null)}
                            >
                                <p className={`font-serif text-base font-semibold mb-1 transition-colors ${hoveredFather === f.name ? 'text-[#8b5a2b]' : 'text-[#1a1612]'}`}>
                                    {f.name}
                                </p>
                                <p className="text-xs text-[#a89a8a]">
                                    {f.years}
                                </p>
                                <p className="text-xs text-[#b8860b] mt-1 font-medium">
                                    {f.role}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-sm text-[#a89a8a] mt-8 italic">
                        ...and many more voices from the ancient church
                    </p>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="relative py-20 px-6 text-center border-t border-[#ede8de] z-10">
                <p className="text-[#a89a8a] text-sm mb-6 max-w-sm mx-auto">
                    Every quote sourced directly from patristic writings.
                </p>
                <Link
                    href="/ask"
                    className="inline-flex items-center gap-2 text-[#8b5a2b] hover:text-[#6d4420] font-medium transition-colors"
                >
                    <span>Start exploring</span>
                    <span>→</span>
                </Link>
            </section>
        </div>
    );
}
