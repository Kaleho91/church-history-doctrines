import Link from 'next/link';
import { SearchBar } from '@/components/domain/SearchBar';
import { ArrowRight, Compass, Database, Shield, BookOpen, Globe } from 'lucide-react';
import { getStats, getClusters, getAllClaims } from '@/lib/data';

export default function Home() {
  const stats = getStats();
  const clusters = getClusters();
  const claims = getAllClaims();

  // Get a few example claims for quick links
  const exampleClaims = claims.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-stone-50 to-white">
      <div className="w-full max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold uppercase tracking-widest mb-4">
          <Database className="w-3.5 h-3.5" />
          Doctrinal Intelligence
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight font-serif">
          The authoritative system for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            doctrinal traceability
          </span>.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
          Trace claims. Compare traditions. Surface confidence.{' '}
          <span className="text-stone-400">No polemics.</span>
        </p>

        {/* Search */}
        <div className="pt-6 flex flex-col items-center gap-4 w-full">
          <SearchBar />

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-stone-500">
            <span className="font-medium">Try:</span>
            {exampleClaims.slice(0, 3).map(claim => (
              <Link
                key={claim.id}
                href={`/claim/${claim.id}`}
                className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4 transition-colors"
              >
                {claim.short_label}
              </Link>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
            <Shield className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="font-bold text-stone-800 text-sm mb-1">Trust</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every claim traced to primary sources with explicit confidence levels.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
            <BookOpen className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-bold text-stone-800 text-sm mb-1">Traceability</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              See how doctrines developed across 2,000 years of history.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-100 shadow-sm">
            <Globe className="w-5 h-5 text-violet-500 mb-2" />
            <h3 className="font-bold text-stone-800 text-sm mb-1">Integration</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {stats.traditionCount} traditions compared fairly with epistemic transparency.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
          <div className="text-center">
            <div className="font-bold text-3xl text-stone-900 font-mono">{stats.claimCount}</div>
            <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">Doctrines</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-stone-900 font-mono">{stats.traditionCount}</div>
            <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">Traditions</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-stone-900 font-mono">{stats.sourceCount}</div>
            <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">Sources</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-3xl text-stone-900 font-mono">{stats.edgeCount.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-widest text-stone-500 mt-1">Positions</div>
          </div>
        </div>

        {/* Clusters quick nav */}
        <div className="pt-8">
          <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Browse by Category</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {clusters.slice(0, 8).map(cluster => (
              <Link
                key={cluster}
                href={`/explore?cluster=${encodeURIComponent(cluster)}`}
                className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {cluster}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer tagline */}
        <div className="pt-12 pb-8">
          <p className="text-xs text-stone-400 italic">
            This system teaches <strong>how</strong> beliefs are justified, not <strong>what</strong> to believe.
          </p>
        </div>

      </div>
    </div>
  );
}
