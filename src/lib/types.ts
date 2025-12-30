export type ConfidenceLevel = 'High' | 'Medium' | 'Contested';

export type RelationType = 'Supports' | 'Challenges' | 'Defines' | 'Develops';

export type SourceType = 'Primary' | 'Secondary';

export type LensType = 'Consensus' | 'Catholic' | 'Orthodox' | 'Lutheran' | 'Reformed' | 'ZwinglianBaptistic';

export interface Claim {
  id: string;
  cluster: string;
  short_label: string;
  full_statement: string;
  definition_variants: string[];
}

export interface Node {
  id: string;
  type: string; // "Scripture", "Text", "Person", "Confession", etc.
  title: string;
  date_range: string;
  region: string;
  summary: string;
  citations: string[]; // Source IDs
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
}

// Derived type for a Node in the context of a Trace (includes edge info)
export interface TraceNode extends Node {
  edge: Edge;
  parsedYear: number;
}
