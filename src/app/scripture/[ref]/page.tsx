import { notFound } from 'next/navigation';
import {
    getScriptureByRef,
    getClaimsForScripture,
    getEdgesForNode,
    getInterpretations,
    parseScriptureSlug,
    normalizeScriptureRef
} from '@/lib/data';
import ScriptureDetailClient from './ScriptureDetailClient';

interface PageProps {
    params: Promise<{ ref: string }>;
}

export default async function ScriptureDetailPage({ params }: PageProps) {
    const { ref } = await params;

    // Find the scripture node
    const scripture = getScriptureByRef(ref);

    if (!scripture) {
        notFound();
    }

    // Get connected claims
    const claims = getClaimsForScripture(scripture.id);

    // Get edges for this scripture (relation types, notes)
    const edges = getEdgesForNode(scripture.id);

    // Get interpretations for each connected claim
    const claimInterpretations = claims.map(claim => ({
        claim,
        interpretations: getInterpretations(claim.id),
        edge: edges.find(e => e.claim_id === claim.id)
    }));

    return (
        <ScriptureDetailClient
            scripture={scripture}
            claims={claims}
            claimInterpretations={claimInterpretations}
            displayRef={parseScriptureSlug(ref)}
        />
    );
}

// Generate static params for all scripture references
export async function generateStaticParams() {
    const { getScriptureNodes } = await import('@/lib/data');
    const scriptures = getScriptureNodes();

    return scriptures
        .filter(s => s.scripture_ref)
        .map(s => ({
            ref: normalizeScriptureRef(s.scripture_ref!)
        }));
}
