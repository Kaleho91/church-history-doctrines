import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClaim, getTrace, getInterpretations, getAllClaims } from '@/lib/data';
import ClaimPageClient from './ClaimPageClient';

// Map claim prefixes to doctrine slugs
function getDoctrineSlug(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'baptism-new-birth';
    if (claimId.startsWith('CLM_TR')) return 'trinity';
    if (claimId.startsWith('CLM_EU')) return 'eucharist';
    return 'baptism-new-birth';
}

function getDoctrineName(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'Baptism';
    if (claimId.startsWith('CLM_TR')) return 'Trinity';
    if (claimId.startsWith('CLM_EU')) return 'Eucharist';
    return 'Doctrine';
}

export function generateStaticParams() {
    const claims = getAllClaims();
    return claims.map((claim) => ({
        id: claim.id,
    }));
}

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const claim = getClaim(id);

    if (!claim) {
        notFound();
    }

    const nodes = getTrace(claim.id);
    const interpretations = getInterpretations(claim.id);
    const doctrineSlug = getDoctrineSlug(id);
    const doctrineName = getDoctrineName(id);

    return (
        <ClaimPageClient
            claim={claim}
            nodes={nodes}
            interpretations={interpretations}
            doctrineSlug={doctrineSlug}
            doctrineName={doctrineName}
        />
    );
}
