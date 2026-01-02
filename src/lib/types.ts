export type ConfidenceLevel = 'High' | 'Medium' | 'Contested';

export type RelationType = 'Supports' | 'Challenges' | 'Defines' | 'Develops';

export type SourceType = 'Primary' | 'Secondary';

export type LensType = 'Consensus' | 'Catholic' | 'Orthodox' | 'Lutheran' | 'Reformed' | 'ZwinglianBaptistic';

export type TraditionFamily =
  | 'Catholic'
  | 'Eastern Orthodox'
  | 'Oriental Orthodox'
  | 'Protestant'
  | 'Other';

export type Stance = 'Affirm' | 'Modify' | 'Deny' | 'Divide' | 'Vary';

// ═══════════════════════════════════════════════════════════════════════════
// SCORING (enrichment from Excel)
// ═══════════════════════════════════════════════════════════════════════════

export interface ClaimScoring {
  scriptureScore: number;      // 0-3
  scriptureClass: string;      // 'Explicit/strong', 'Implicit/derived', etc.
  patristicBreadth: number;    // 0-3
  councilScore: number;        // 0-2
  consensusScore: number;      // 0-3
  tier: string;                // 'Tier 1 – Ancient/Core', etc.
  derivedConfidence: ConfidenceLevel;
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE ENTITIES
// ═══════════════════════════════════════════════════════════════════════════

export interface Topic {
  id: string;
  label: string;
  description: string;
  claims: string[]; // Claim IDs
}

export interface Claim {
  id: string;
  cluster: string;
  short_label: string;
  full_statement: string;
  definition_variants: string[];

  // Enrichment from Excel (optional)
  excelDoctrineId?: string;
  scoring?: ClaimScoring;
}

export interface Node {
  id: string;
  type: string; // "Scripture", "Text", "Person", "Confession", etc.
  title: string;
  date_range: string;
  region: string;
  summary: string;
  citations: string[]; // Source IDs

  // Enrichment (optional)
  epistemicWeight?: number;  // 1-5 based on source type
}

export interface Edge {
  id: string;
  claim_id: string;
  node_id: string;
  relation_type: RelationType;
  note: string;
  confidence: ConfidenceLevel;
}

export interface Interpretation {
  id: string;
  claim_id: string;
  lens: LensType;
  summary: string;
  key_points: {
    text: string;
    citations: string[];
  }[];
}

export interface Source {
  id: string;
  primary_or_secondary: SourceType;
  citation_chicago: string;
  url?: string;
  notes?: string;

  // Enrichment (optional)
  type?: string;  // 'Scripture', 'Creed', 'Council', 'Confession', etc.
  epistemicWeight?: number;

  // Source X-Ray (optional) - primary text excerpts
  excerpt?: string;      // Actual quote from the primary source
  significance?: string; // Why this quote matters for the claim
}


// ═══════════════════════════════════════════════════════════════════════════
// TRADITION PERSPECTIVES (new from Excel)
// ═══════════════════════════════════════════════════════════════════════════

export interface Tradition {
  id: string;
  name: string;
  family: TraditionFamily;
  epistemicPosture: string;
}

export interface TraditionPosition {
  traditionId: string;
  traditionName: string;
  family: TraditionFamily;
  stance: Stance;
  summary: string;
  confidence: ConfidenceLevel;
  keySources: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DERIVED TYPES
// ═══════════════════════════════════════════════════════════════════════════

// Node in the context of a Trace (includes edge info)
export interface TraceNode extends Node {
  edge: Edge;
  parsedYear: number;
}

// Tradition stance summary for a claim
export interface TraditionBreadth {
  affirm: number;
  modify: number;
  deny: number;
  total: number;
}
