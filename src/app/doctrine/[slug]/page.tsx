import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllClaims } from '@/lib/data';
import { ClaimCard } from '@/components/domain/ClaimCard';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
    return [{ slug: 'baptism-new-birth' }];
}

export default async function DoctrinePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Mock slug mapping for MVP
    const clusterName = slug === 'baptism-new-birth' ? 'Baptism & New Birth' : null;

    if (!clusterName) return notFound();

    const allClaims = getAllClaims();
    const claims = allClaims.filter(c => c.cluster === clusterName);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Explore</span>
                    </Link>
                    <div className="font-serif font-bold text-xl tracking-tight text-slate-800">
                        Church History
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
                        Doctrine Cluster
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{clusterName}</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Explore the core claims that define this doctrine and trace their development through history.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {claims.map(claim => (
                        <ClaimCard key={claim.id} claim={claim} />
                    ))}
                </div>
            </main>
        </div>
    );
}
