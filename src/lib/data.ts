/**
 * Doctrinal Intelligence Platform — Data Access Layer
 * 
 * Provides functions to query claims, nodes, edges, traditions,
 * sources, and interpretations from the canonical JSON files.
 */

import claimsData from '@/content/claims.json';
import nodesData from '@/content/nodes.json';
import edgesData from '@/content/edges.json';
import sourcesData from '@/content/sources.json';
import traditionsData from '@/content/traditions.json';
import interpretationsData from '@/content/interpretations.json';
import {
    Claim,
    Node,
    Edge,
    Source,
    Tradition,
    Interpretation,
    TraceNode,
    TraditionGroup,
    ConfidenceLevel,
    SearchResult
} from './types';

// ═══════════════════════════════════════════════════════════════════════════
// DATA INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

const claims = claimsData as Claim[];
const nodes = nodesData as Node[];
const edges = edgesData as Edge[];
const sources = sourcesData as Source[];
const traditions = traditionsData as Tradition[];
const interpretations = interpretationsData as Interpretation[];

// Create lookup maps for efficient access
const claimMap = new Map(claims.map(c => [c.id, c]));
const nodeMap = new Map(nodes.map(n => [n.id, n]));
const sourceMap = new Map(sources.map(s => [s.id, s]));
const traditionMap = new Map(traditions.map(t => [t.id, t]));

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse a date range string like "c. 96" or "1529" into a sortable number.
 */
function parseYear(dateRange: string): number {
    if (!dateRange) return 0;
    // Match the first sequence of 3 or 4 digits
    const match = dateRange.match(/(\d{3,4})/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return 0;
}

/**
 * Map tradition family to simplified lens for backward compatibility.
 */
function familyToLens(family: string): string {
    const mapping: Record<string, string> = {
        'Catholic': 'Catholic',
        'Eastern Catholic': 'Catholic',
        'Eastern Orthodox': 'Orthodox',
        'Oriental Orthodox': 'Orthodox',
        'Church of the East': 'Orthodox',
        'Protestant (Reformation)': 'Protestant',
        'Protestant (Reformation-derived)': 'Protestant',
        'Protestant (modern)': 'Protestant',
        'Radical Reformation': 'Protestant',
    };
    return mapping[family] || 'Other';
}

// ═══════════════════════════════════════════════════════════════════════════
// CLAIMS API
// ═══════════════════════════════════════════════════════════════════════════

export function getAllClaims(): Claim[] {
    return claims;
}

export function getClaim(id: string): Claim | undefined {
    return claimMap.get(id);
}

export function getClaimsByCluster(cluster: string): Claim[] {
    return claims.filter(c => c.cluster === cluster);
}

export function getClaimsByConfidence(confidence: ConfidenceLevel): Claim[] {
    return claims.filter(c => c.scoring.derivedConfidence === confidence);
}

export function getClusters(): string[] {
    const clusterSet = new Set(claims.map(c => c.cluster));
    return Array.from(clusterSet).sort();
}

// ═══════════════════════════════════════════════════════════════════════════
// NODES API
// ═══════════════════════════════════════════════════════════════════════════

export function getAllNodes(): Node[] {
    return nodes;
}

export function getNode(id: string): Node | undefined {
    return nodeMap.get(id);
}

export function getNodesByType(type: string): Node[] {
    return nodes.filter(n => n.type === type);
}

// ═══════════════════════════════════════════════════════════════════════════
// TRACE API (Claims → Nodes via Edges)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the historical trace for a claim — all connected nodes with edge metadata.
 * Returns nodes sorted chronologically.
 * 
 * This function handles two cases:
 * 1. Edges pointing to actual historical nodes (EV_*, DOC_*, FATHER_*)
 * 2. Edges pointing to tradition positions (TRAD_*) — creates virtual nodes
 */
export function getTrace(claimId: string): TraceNode[] {
    // Find all edges for this claim
    const claimEdges = edges.filter(e => e.claim_id === claimId);

    // Map to nodes with edge info
    const traceNodes: TraceNode[] = [];

    for (const edge of claimEdges) {
        // Try to find actual historical node
        let node = nodeMap.get(edge.node_id);

        // If node not found and this is a tradition edge, create a virtual node
        if (!node && edge.traditionId) {
            const tradition = traditionMap.get(edge.traditionId);
            if (tradition) {
                // Create a virtual node representing this tradition's position
                node = {
                    id: edge.node_id,
                    type: 'Tradition',
                    title: tradition.name,
                    date_range: tradition.startYear || '',
                    region: tradition.primaryRegions || '',
                    summary: edge.note || `${tradition.name} ${edge.stance?.toLowerCase() || 'engages with'} this doctrine.`,
                    citations: edge.keySources || [],
                };
            }
        }

        if (node) {
            traceNodes.push({
                ...node,
                edge,
                parsedYear: parseYear(node.date_range),
            });
        }
    }

    // Sort chronologically, with traditions grouped by family then year
    return traceNodes.sort((a, b) => {
        // If both have years, sort by year
        if (a.parsedYear && b.parsedYear) {
            return a.parsedYear - b.parsedYear;
        }
        // Items with years come first
        if (a.parsedYear && !b.parsedYear) return -1;
        if (!a.parsedYear && b.parsedYear) return 1;
        // Otherwise sort by title
        return a.title.localeCompare(b.title);
    });
}

/**
 * Get tradition positions as trace nodes for a claim.
 * This provides a compact view of how traditions engage with a doctrine.
 */
export function getTraditionTrace(claimId: string, limit = 10): TraceNode[] {
    const trace = getTrace(claimId);

    // Filter to only tradition nodes and limit
    const traditionNodes = trace.filter(n => n.type === 'Tradition');

    // Group by stance and take a sample from each
    const byStance: Record<string, TraceNode[]> = {};
    for (const node of traditionNodes) {
        const stance = node.edge.stance || 'Other';
        if (!byStance[stance]) byStance[stance] = [];
        byStance[stance].push(node);
    }

    // Take up to 3 from each stance type
    const result: TraceNode[] = [];
    for (const stance of ['Affirm', 'Modify', 'Deny', 'Divide', 'Vary']) {
        if (byStance[stance]) {
            result.push(...byStance[stance].slice(0, 3));
        }
    }

    return result.slice(0, limit);
}

/**
 * Get edges for a claim, optionally filtered by tradition.
 */
export function getEdgesForClaim(claimId: string, traditionId?: string): Edge[] {
    let claimEdges = edges.filter(e => e.claim_id === claimId);
    if (traditionId) {
        claimEdges = claimEdges.filter(e => e.traditionId === traditionId);
    }
    return claimEdges;
}

/**
 * Count edges by confidence level for a claim.
 */
export function getConfidenceCounts(claimId: string): Record<ConfidenceLevel, number> {
    const claimEdges = edges.filter(e => e.claim_id === claimId);
    const counts: Record<ConfidenceLevel, number> = { High: 0, Medium: 0, Mixed: 0, Contested: 0 };

    for (const edge of claimEdges) {
        const conf = edge.confidence;
        if (conf in counts) {
            counts[conf]++;
        }
    }

    return counts;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRADITIONS API
// ═══════════════════════════════════════════════════════════════════════════

export function getAllTraditions(): Tradition[] {
    return traditions;
}

export function getTradition(id: string): Tradition | undefined {
    return traditionMap.get(id);
}

export function getTraditionsByFamily(family: string): Tradition[] {
    return traditions.filter(t => t.family === family);
}

export function getTraditionFamilies(): string[] {
    const familySet = new Set(traditions.map(t => t.family));
    return Array.from(familySet).sort();
}

export function getTraditionsGroupedByFamily(): TraditionGroup[] {
    const groups: Map<string, Tradition[]> = new Map();

    for (const tradition of traditions) {
        const family = tradition.family || 'Other';
        if (!groups.has(family)) {
            groups.set(family, []);
        }
        groups.get(family)!.push(tradition);
    }

    return Array.from(groups.entries())
        .map(([family, traditions]) => ({ family, traditions }))
        .sort((a, b) => a.family.localeCompare(b.family));
}

// ═══════════════════════════════════════════════════════════════════════════
// SOURCES API
// ═══════════════════════════════════════════════════════════════════════════

export function getAllSources(): Source[] {
    return sources;
}

export function getSource(id: string): Source | undefined {
    return sourceMap.get(id);
}

export function getSources(ids: string[]): Source[] {
    return ids
        .map(id => sourceMap.get(id))
        .filter((s): s is Source => !!s);
}

export function getSourcesByType(type: string): Source[] {
    return sources.filter(s => s.type === type);
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERPRETATIONS API
// ═══════════════════════════════════════════════════════════════════════════

export function getInterpretations(claimId: string): Interpretation[] {
    return interpretations.filter(i => i.claim_id === claimId);
}

export function getInterpretationByLens(claimId: string, lens: string): Interpretation | undefined {
    return interpretations.find(i => i.claim_id === claimId && i.lens === lens);
}

export function getAvailableLensesForClaim(claimId: string): string[] {
    const claimInterpretations = interpretations.filter(i => i.claim_id === claimId);
    return claimInterpretations.map(i => i.lens);
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH API
// ═══════════════════════════════════════════════════════════════════════════

export function searchContent(query: string): {
    claims: Claim[];
    nodes: Node[];
    traditions: Tradition[];
} {
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

    const matchedTraditions = traditions.filter(t =>
        t.name.toLowerCase().includes(lower) ||
        t.family.toLowerCase().includes(lower)
    );

    return { claims: matchedClaims, nodes: matchedNodes, traditions: matchedTraditions };
}

export function searchUnified(query: string, limit = 20): SearchResult[] {
    const lower = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search claims
    for (const claim of claims) {
        if (results.length >= limit) break;
        if (
            claim.short_label.toLowerCase().includes(lower) ||
            claim.full_statement.toLowerCase().includes(lower)
        ) {
            results.push({
                type: 'claim',
                id: claim.id,
                title: claim.short_label,
                subtitle: claim.cluster,
                confidence: claim.scoring.derivedConfidence as ConfidenceLevel,
            });
        }
    }

    // Search traditions
    for (const tradition of traditions) {
        if (results.length >= limit) break;
        if (
            tradition.name.toLowerCase().includes(lower) ||
            tradition.family.toLowerCase().includes(lower)
        ) {
            results.push({
                type: 'tradition',
                id: tradition.id,
                title: tradition.name,
                subtitle: tradition.family,
            });
        }
    }

    // Search nodes
    for (const node of nodes) {
        if (results.length >= limit) break;
        if (
            node.title.toLowerCase().includes(lower) ||
            node.summary.toLowerCase().includes(lower)
        ) {
            results.push({
                type: 'node',
                id: node.id,
                title: node.title,
                subtitle: node.type,
            });
        }
    }

    return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATISTICS API
// ═══════════════════════════════════════════════════════════════════════════

export function getStats() {
    return {
        claimCount: claims.length,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        sourceCount: sources.length,
        traditionCount: traditions.length,
        interpretationCount: interpretations.length,
        clusterCount: getClusters().length,
        familyCount: getTraditionFamilies().length,
    };
}
