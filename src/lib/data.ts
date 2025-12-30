import claimsData from '@/content/claims.json';
import nodesData from '@/content/nodes.json';
import edgesData from '@/content/edges.json';
import sourcesData from '@/content/sources.json';
import interpretationsData from '@/content/interpretations.json';
import { Claim, Node, Edge, Source, Interpretation, TraceNode } from './types';

// Cast imports to types
const claims = claimsData as Claim[];
const nodes = nodesData as Node[];
const edges = edgesData as Edge[];
const sources = sourcesData as Source[];
const interpretations = interpretationsData as unknown as Interpretation[]; // Double cast might be needed if structure slightly off in JSON typings, but single usually fine.

// Helper to parse "c. 96" or "1529" into a sortable number
function parseYear(dateRange: string): number {
    if (!dateRange) return 0;
    // Match the first sequence of 3 or 4 digits
    const match = dateRange.match(/(\d{3,4})/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 0; // Fallback
}

export function getAllClaims(): Claim[] {
    return claims;
}

export function getClaim(id: string): Claim | undefined {
    return claims.find(c => c.id === id);
}

export function getTrace(claimId: string): TraceNode[] {
    // 1. Find all edges for this claim
    const claimEdges = edges.filter(e => e.claim_id === claimId);

    // 2. Map to nodes with edge info
    const traceNodes: TraceNode[] = claimEdges.map(edge => {
        const node = nodes.find(n => n.id === edge.node_id);
        if (!node) throw new Error(`Node not found: ${edge.node_id}`);

        return {
            ...node,
            edge,
            parsedYear: parseYear(node.date_range)
        };
    });

    // 3. Sort chronologically
    return traceNodes.sort((a, b) => a.parsedYear - b.parsedYear);
}

export function getSources(ids: string[]): Source[] {
    return ids.map(id => sources.find(s => s.id === id)).filter((s): s is Source => !!s);
}

export function getSource(id: string): Source | undefined {
    return sources.find(s => s.id === id);
}

export function getInterpretations(claimId: string): Interpretation[] {
    return interpretations.filter(i => i.claim_id === claimId);
}

export function searchContent(query: string) {
    const lower = query.toLowerCase();

    const matchedClaims = claims.filter(c =>
        c.short_label.toLowerCase().includes(lower) ||
        c.full_statement.toLowerCase().includes(lower) ||
        c.cluster.toLowerCase().includes(lower)
    );

    const matchedNodes = nodes.filter(n =>
        n.title.toLowerCase().includes(lower) ||
        n.summary.toLowerCase().includes(lower)
    );

    return { claims: matchedClaims, nodes: matchedNodes };
}
