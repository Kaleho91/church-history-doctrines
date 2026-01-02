import { notFound } from 'next/navigation';
import { getSource, getClaimsForScripture, getClaim } from '@/lib/data';
import SourceReaderClient from './SourceReaderClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SourcePage({ params }: PageProps) {
    const { id } = await params;

    const source = getSource(id);

    if (!source) {
        notFound();
    }

    return <SourceReaderClient source={source} />;
}
