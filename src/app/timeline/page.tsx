import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Explore</span>
                    </Link>
                    <div className="font-serif font-bold text-xl tracking-tight text-slate-800">
                        Timeline Context
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ERAS.map((era, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                            <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Era {i + 1}</div>
                            <div className="font-bold text-slate-800">{era}</div>
                        </div>
                    ))}
                </div>
                <p className="text-center mt-12 text-slate-400 text-sm">
                    Timeline view is secondary context for the Claim Traces.
                </p>
            </main>
        </div>
    );
}
