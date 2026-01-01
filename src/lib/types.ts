/**
 * Doctrinal Intelligence Platform — Type Definitions
 * 
 * Canonical data model for doctrinal claims, historical nodes,
 * tradition interpretations, and source citations.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS & BASIC TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ConfidenceLevel = 'High' | 'Medium' | 'Mixed' | 'Contested';

export type RelationType = 'Supports' | 'Challenges' | 'Defines' | 'Develops';

export type SourceType = 'Primary' | 'Secondary';

export type Stance = 'Affirm' | 'Modify' | 'Deny' | 'Divide' | 'Vary' | 'N/A';

export type TraditionFamily =
  | 'Catholic'
  | 'Eastern Orthodox'
  | 'Oriental Orthodox'
  | 'Eastern Catholic'
  | 'Church of the East'
  | 'Protestant (Reformation)'
  | 'Protestant (Reformation-derived)'
  | 'Protestant (modern)'
  | 'Radical Reformation'
  | 'Reformed/Anglican-influenced (Indian)'
  | 'United Protestant (Anglican/Methodist/etc.)'
  | 'African Initiated / Independent'
  | 'African Initiated / Zionist'
  | 'African Initiated / Aladura'
  | 'Non-Nicene movement'
  | 'Historical African Christianity'
  | 'Other';

// Legacy lens type for backward compatibility with existing components
export type LensType =
  | 'Consensus'
  | 'Catholic'
  | 'Orthodox'
  | 'Lutheran'
  | 'Reformed'
  | 'ZwinglianBaptistic'
  | TraditionFamily;

// ═══════════════════════════════════════════════════════════════════════════
// SCORING & CONFIDENCE
// ═══════════════════════════════════════════════════════════════════════════

export interface ClaimScoring {
  scriptureScore: number;      // 0-3
  scriptureClass: string;      // 'Explicit/strong', 'Implicit/derived', etc.
  patristicBreadth: number;    // 0-3
  councilScore: number;        // 0-2
  consensusScore: number;      // 0-3
  tier: string;                // 'Tier 1 – Ancient/Core', etc.
  confidence: string;          // From Excel
  derivedConfidence: ConfidenceLevel;  // Calculated
}

// ═══════════════════════════════════════════════════════════════════════════
// CORE ENTITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A doctrinal claim — the atomic unit of the system.
 * Claims are falsifiable propositions that can be traced through history.
 */
export interface Claim {
  id: string;
  cluster: string;             // Category (e.g., 'God', 'Salvation', 'Sacraments')
  short_label: string;         // Brief name (e.g., 'Trinity')
  full_statement: string;      // Plain definition
  technicalDefinition?: string;
  definition_variants: string[];
  keyDocs?: string[];          // Related document IDs
  sourceIds?: string[];        // Source IDs
  scoring: ClaimScoring;
}

/**
 * A historical node — Scripture, Person, Council, Text, Event, etc.
 * Nodes are stable facts; interpretations vary by lens.
 */
export interface Node {
  id: string;
  type: string;                // 'Scripture', 'Text', 'Person', 'Confession', 'Council', 'Event'
  title: string;
  date_range: string;
  region: string;
  summary: string;
  citations: string[];         // Source IDs
  keyFigures?: string;
  tradition?: string;
  language?: string;
}

/**
 * An edge connecting a claim to a node with confidence metadata.
 */
export interface Edge {
  id: string;
  claim_id: string;
  node_id: string;
  relation_type: RelationType;
  note: string;
  confidence: ConfidenceLevel;
  traditionId?: string;
  stance?: string;
  keySources?: string[];
}

/**
 * A tradition — a distinct Christian communion or family.
 */
export interface Tradition {
  id: string;
  name: string;
  family: string;
  communion: string;
  primaryRegions: string;
  startYear: string;
  notes: string;
  keySources: string[];
  epistemicPosture: string;    // One-line interpretive stance
}

/**
 * A source — primary or secondary citation.
 */
export interface Source {
  id: string;
  type: string;                // 'Creed', 'Council', 'Confession', 'Commentary', etc.
  title: string;
  author?: string;
  year?: string;
  tradition?: string;
  url?: string;
  notes?: string;
  primary_or_secondary: SourceType;
  citation_chicago: string;
}

/**
 * An interpretation — how a tradition (or family) reads a claim.
 */
export interface Interpretation {
  id: string;
  claim_id: string;
  lens: string;                // Can be tradition family or specific tradition
  summary: string;
  key_points: InterpretationPoint[];
  positions?: TraditionPosition[];
}

export interface InterpretationPoint {
  text: string;
  citations: string[];
}

export interface TraditionPosition {
  traditionId: string;
  traditionName: string;
  stance: string;
  summary: string;
  confidence: ConfidenceLevel;
  keySources: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DERIVED TYPES (for UI components)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A Node in the context of a Trace — includes edge info and parsed year.
 */
export interface TraceNode extends Node {
  edge: Edge;
  parsedYear: number;
}

/**
 * Tradition grouped by family for navigation.
 */
export interface TraditionGroup {
  family: string;
  traditions: Tradition[];
}

/**
 * Search result item.
 */
export interface SearchResult {
  type: 'claim' | 'node' | 'tradition';
  id: string;
  title: string;
  subtitle?: string;
  confidence?: ConfidenceLevel;
}
