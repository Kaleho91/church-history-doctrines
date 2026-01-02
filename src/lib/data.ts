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

// ═══════════════════════════════════════════════════════════════════════════
// SCRIPTURE LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalize a Scripture reference for URL-safe slug
 * "John 3:5" -> "john-3-5"
 * "1 Corinthians 11:23-29" -> "1-corinthians-11-23-29"
 */
export function normalizeScriptureRef(ref: string): string {
    return ref
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/:/g, '-')
        .replace(/–/g, '-'); // em-dash
}

/**
 * Parse a URL slug back to a displayable reference
 * "john-3-5" -> "John 3:5"
 */
export function parseScriptureSlug(slug: string): string {
    // Handle books with numbers (1-john, 1-corinthians, etc.)
    const parts = slug.split('-');
    let result: string[] = [];
    let i = 0;

    // Check if first part is a number (like "1" in "1-peter")
    if (/^\d+$/.test(parts[0]) && parts.length > 1) {
        result.push(parts[0]);
        i = 1;
    }

    // Book name - capitalize
    if (i < parts.length) {
        result.push(parts[i].charAt(0).toUpperCase() + parts[i].slice(1));
        i++;
    }

    // Chapter:verse
    if (i < parts.length) {
        const chapter = parts[i];
        i++;
        if (i < parts.length) {
            const verseStart = parts[i];
            i++;
            if (i < parts.length) {
                const verseEnd = parts[i];
                result.push(`${chapter}:${verseStart}-${verseEnd}`);
            } else {
                result.push(`${chapter}:${verseStart}`);
            }
        } else {
            result.push(chapter);
        }
    }

    return result.join(' ');
}

/**
 * Get all Scripture-type nodes
 */
export function getScriptureNodes(): Node[] {
    return nodes.filter(n => n.type === 'Scripture');
}

/**
 * Get a Scripture node by its reference (e.g., "John 3:5" or "john-3-5")
 */
export function getScriptureByRef(ref: string): Node | undefined {
    const normalized = normalizeScriptureRef(ref);
    return nodes.find(n =>
        n.type === 'Scripture' &&
        n.scripture_ref &&
        normalizeScriptureRef(n.scripture_ref) === normalized
    );
}

/**
 * Get all claims that cite a specific Scripture node
 */
export function getClaimsForScripture(nodeId: string): Claim[] {
    // Find all edges that connect to this node
    const nodeEdges = edges.filter(e => e.node_id === nodeId);

    // Get unique claim IDs
    const claimIds = [...new Set(nodeEdges.map(e => e.claim_id))];

    // Return the claims
    return claimIds.map(id => claims.find(c => c.id === id)).filter((c): c is Claim => !!c);
}

/**
 * Get edges for a specific Scripture node (includes relation details)
 */
export function getEdgesForNode(nodeId: string): Edge[] {
    return edges.filter(e => e.node_id === nodeId);
}

/**
 * Get Scripture nodes grouped by book
 */
export function getScripturesByBook(): Map<string, Node[]> {
    const scriptureNodes = getScriptureNodes();
    const byBook = new Map<string, Node[]>();

    for (const node of scriptureNodes) {
        const book = node.book || 'Unknown';
        if (!byBook.has(book)) {
            byBook.set(book, []);
        }
        byBook.get(book)!.push(node);
    }

    return byBook;
}
