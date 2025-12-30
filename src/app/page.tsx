import Link from 'next/link';
import { SearchBar } from '@/components/domain/SearchBar';
import { ArrowRight, Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
          <Compass className="w-4 h-4" />
          Mapping History
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
          Trace doctrinal claims through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">2,000 years</span> of history.
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Search a doctrine, choose a specific claim, and see how it developed through scripture, tradition, and controversy without the polemics.
        </p>

        <div className="pt-8 flex flex-col items-center gap-6 w-full">
          <SearchBar />

          <div className="flex gap-4 text-sm font-medium text-slate-500">
            <span>Try searching:</span>
            <Link href="/claim/CLM_BR_C1" className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4">
              "Baptismal Regeneration"
            </Link>
          </div>
        </div>

        <div className="pt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-60">
          {/* Decorative stats/labels */}
          <div className="text-center">
            <div className="font-bold text-2xl text-slate-900">12</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Eras</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-slate-900">5+</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Lenses</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-slate-900">100%</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Cited</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-slate-900">Zero</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">Polemics</div>
          </div>
        </div>

      </div>
    </div>
  );
}
