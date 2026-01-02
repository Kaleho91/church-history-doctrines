import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

const ERAS = [
    "Jesus & Apostolic Age (30–100)",
    "Persecution & Apologists (100–313)",
    "Imperial Church & Councils (313–451)",
    "Late Antiquity (451–600)",
    "Early Medieval (600–800)",
    "Carolingians & Islam (800–1054)",
    "Schism & High Medieval (1054–1200)",
    "Crusades & Universities (1200–1300)",
    "Late Medieval Crisis (1300–1500)",
    "Reformations (1500–1650)",
    "Modernity & Missions (1650–1900)",
    "Global Christianity (1900–present)",
];

const ERA_GRADIENTS = [
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-yellow-500',
    'from-rose-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-stone-500 to-slate-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-green-500',
];

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Background decoration */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Timeline</span>
                    </div>
                    <div className="w-24" />
                </div>
            </nav>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-white mb-4">
                        2,000 Years at a Glance
                    </h1>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Every doctrine traces through these eras. Understanding the context helps interpret the sources.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ERAS.map((era, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/10 p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all"
                        >
                            {/* Gradient accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ERA_GRADIENTS[i]}`} />

                            <div className="relative">
                                <div className={`text-xs font-bold uppercase tracking-widest mb-2 bg-gradient-to-r ${ERA_GRADIENTS[i]} text-transparent bg-clip-text`}>
                                    Era {i + 1}
                                </div>
                                <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                                    {era}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-white/30 text-sm">
                    Timeline context helps understand the development of doctrine across claim traces.
                </p>
            </main>
        </div>
    );
}
