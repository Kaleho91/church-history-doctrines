import Link from 'next/link';
import { SearchBar } from '@/components/domain/SearchBar';
import { ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-serif font-bold text-xl tracking-tight text-slate-800">
                        Church History
                    </Link>
                    <div className="w-full max-w-sm hidden sm:block">
                        <SearchBar />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Explore Doctrines</h1>

                <div className="mb-12">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pilot Doctrine</h2>
                    <div className="flex gap-4">
                        <Link
                            href="/doctrine/baptism-new-birth"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-slate-700 font-medium"
                        >
                            Baptism & New Birth
                        </Link>
                    </div>
                </div>

                <div className="opacity-50 pointer-events-none">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Coming Soon</h2>
                    <div className="flex flex-wrap gap-4">
                        <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400">Christology</span>
                        <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400">Eucharist</span>
                        <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400">Justification</span>
                        <span className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-400">Trinity</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
