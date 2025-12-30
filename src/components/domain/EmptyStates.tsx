import React from 'react';
import { FileQuestion, Scroll, Split } from 'lucide-react';

export function EmptyTrace() {
    return (
        <div className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center">
            <Scroll className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-700 mb-2">No Historical Trace Yet</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
                This claim hasn't been mapped to historical sources yet. Check back soon as we continue building the archive.
            </p>
        </div>
    );
}

export function EmptyInterpretations() {
    return (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-8 text-center">
            <Split className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-amber-900 mb-2">No Interpretations Available</h3>
            <p className="text-sm text-amber-700">
                Theological perspectives for this claim are still being researched.
            </p>
        </div>
    );
}

export function EmptyConsensus() {
    return (
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-8">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <FileQuestion className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-emerald-900 mb-2">Remarkable Consensus</h3>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                        This claim shows <strong>unanimous agreement</strong> across traditions with no major recorded debates.
                        This is exceptionally rare in church history.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function NoResults({ query }: { query: string }) {
    return (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-sm">
            <FileQuestion className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-800 mb-2">No results for "{query}"</h3>
            <p className="text-stone-500 max-w-md mx-auto mb-6">
                Try searching for baptism, eucharist, justification, or other doctrinal terms.
            </p>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Browse all doctrines →
            </button>
        </div>
    );
}
