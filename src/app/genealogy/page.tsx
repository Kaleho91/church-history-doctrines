'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the client component with no SSR to avoid window issues with canvas
const GraphClient = dynamic(() => import('./GraphClient'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] text-[#8b7355]">
            <div className="flex flex-col items-center gap-4">
                <span className="text-3xl animate-pulse">🕸️</span>
                <p className="font-serif italic animate-pulse">Tracing the genealogy of belief...</p>
            </div>
        </div>
    ),
});

export default function GenealogyPage() {
    return (
        <Suspense>
            <GraphClient />
        </Suspense>
    );
}
