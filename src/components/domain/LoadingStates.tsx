import React from 'react';
import { Loader2 } from 'lucide-react';

export function TraceSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative flex items-start gap-6 animate-pulse">
                    {/* Date skeleton */}
                    <div className="w-20 flex-shrink-0 text-right">
                        <div className="h-4 w-16 bg-stone-200 rounded ml-auto" />
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0" style={{ marginTop: '1.5rem' }}>
                        <div className="w-3 h-3 rounded-full bg-stone-200" />
                    </div>

                    {/* Card skeleton */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                            <div className="h-5 w-32 bg-stone-200 rounded mb-3" />
                            <div className="h-4 w-full bg-stone-100 rounded mb-2" />
                            <div className="h-4 w-5/6 bg-stone-100 rounded mb-2" />
                            <div className="h-4 w-4/6 bg-stone-100 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ClaimSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mb-8">
                <div className="h-6 w-32 bg-stone-200 rounded-full mb-4" />
                <div className="h-8 w-3/4 bg-stone-200 rounded mb-4" />
                <div className="h-5 w-full bg-stone-100 rounded mb-2" />
                <div className="h-5 w-5/6 bg-stone-100 rounded" />
            </div>
        </div>
    );
}

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <p className="text-sm text-stone-500 italic">{message}</p>
        </div>
    );
}
