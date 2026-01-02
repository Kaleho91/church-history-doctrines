import Link from 'next/link';

const ERAS = [
    { era: "Apostolic Age", years: "30–100", color: "#6b8e23", icon: "📜" },
    { era: "Persecution & Apologists", years: "100–313", color: "#8b7355", icon: "⚔️" },
    { era: "Imperial Church & Councils", years: "313–451", color: "#7c6a9a", icon: "🏛️" },
    { era: "Late Antiquity", years: "451–600", color: "#4a90a4", icon: "📚" },
    { era: "Early Medieval", years: "600–800", color: "#5c7a8a", icon: "🕯️" },
    { era: "Carolingians", years: "800–1054", color: "#8b6969", icon: "👑" },
    { era: "Schism & High Medieval", years: "1054–1200", color: "#6a7b8b", icon: "⛪" },
    { era: "Crusades & Universities", years: "1200–1300", color: "#8b7355", icon: "🎓" },
    { era: "Late Medieval Crisis", years: "1300–1500", color: "#7a6a5a", icon: "🔥" },
    { era: "Reformations", years: "1500–1650", color: "#6a8b6b", icon: "✝️" },
    { era: "Modernity & Missions", years: "1650–1900", color: "#5a7a8a", icon: "🌍" },
    { era: "Global Christianity", years: "1900–present", color: "#7c6a9a", icon: "🌐" },
];

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Header */}
            <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[#9a9285] hover:text-[#6b6358] transition-colors"
                    >
                        ← Home
                    </Link>
                    <span className="text-[#d4cfc4]">|</span>
                    <h1 className="font-serif text-xl text-[#5c5346]">
                        Timeline
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl">⏳</span>
                    </div>
                    <h2 className="font-serif text-4xl text-[#3d3529] mb-4">
                        2,000 Years at a Glance
                    </h2>
                    <p className="text-lg text-[#6b6358] max-w-lg mx-auto leading-relaxed">
                        Every doctrine traces through these eras. Understanding the context
                        helps interpret the sources.
                    </p>
                </div>

                {/* Era Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ERAS.map((item, i) => (
                        <div
                            key={i}
                            className="group relative bg-white rounded-xl p-5 border border-[#e8e4dc] hover:border-[#d4cfc4] hover:shadow-lg transition-all duration-300"
                        >
                            {/* Top accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                                style={{ backgroundColor: item.color }}
                            />

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wide"
                                        style={{ color: item.color }}
                                    >
                                        Era {i + 1}
                                    </span>
                                    <h3 className="font-serif text-lg text-[#3d3529] group-hover:text-[#8b7355] transition-colors">
                                        {item.era}
                                    </h3>
                                    <p className="text-sm text-[#9a9285]">
                                        {item.years}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative footer */}
                <div className="mt-16 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 text-[#d4af37]/60">
                            <span className="w-12 h-[1px] bg-current" />
                            <span className="text-sm">✦</span>
                            <span className="w-12 h-[1px] bg-current" />
                        </div>
                    </div>
                    <p className="text-[#9a9285] text-sm">
                        Timeline context helps understand the development of doctrine
                        across claim traces.
                    </p>
                </div>
            </main>
        </div>
    );
}
