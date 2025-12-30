import Link from 'next/link';
import { Claim } from '@/lib/types';
import { ArrowRight, Layers } from 'lucide-react';

export function ClaimCard({ claim }: { claim: Claim }) {
    return (
        <div className="group card-hover bg-white rounded-xl shadow-md border border-stone-200 p-6 hover:shadow-xl hover:border-indigo-200">
            <div className="flex justify-between items-start mb-4">
                <span className="label-caps px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 inline-flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    {claim.cluster}
                </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-indigo-700 transition-colors">
                {claim.short_label}
            </h3>

            <p className="prose-content text-stone-600 mb-6">
                {claim.full_statement}
            </p>

            <Link
                href={`/claim/${claim.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
                Trace this claim <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
