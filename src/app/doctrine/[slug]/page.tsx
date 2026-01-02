import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllClaims } from '@/lib/data';
import { ArrowLeft, Clock, ArrowRight, Layers } from 'lucide-react';
import { DoctrinePageClient } from './DoctrineClient';

const DOCTRINE_MAP: Record<string, { name: string; description: string; gradient: string; year: string }> = {
    'baptism-new-birth': {
        name: 'Baptism & New Birth',
        description: 'What does baptism effect? Explore claims about regeneration, remission of sins, and incorporation into Christ.',
        gradient: 'from-blue-500 via-cyan-500 to-teal-500',
        year: '155 AD'
    },
    'trinity': {
        name: 'Trinity',
        description: 'One God in three persons. Trace the development of Trinitarian doctrine from Scripture through the great councils.',
        gradient: 'from-amber-500 via-orange-500 to-rose-500',
        year: '325 AD'
    },
    'eucharist': {
        name: 'Eucharist',
        description: 'How is Christ present in the Lord\'s Supper? Explore competing understandings from transubstantiation to memorial.',
        gradient: 'from-rose-500 via-pink-500 to-purple-500',
        year: '1215 AD'
    }
};

export function generateStaticParams() {
    return [
        { slug: 'baptism-new-birth' },
        { slug: 'trinity' },
        { slug: 'eucharist' }
    ];
}

export default async function DoctrinePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const doctrine = DOCTRINE_MAP[slug];

    if (!doctrine) return notFound();

    const allClaims = getAllClaims();
    const claims = allClaims.filter(c => c.cluster === doctrine.name);

    return (
        <DoctrinePageClient
            doctrine={doctrine}
            claims={claims}
            slug={slug}
        />
    );
}
