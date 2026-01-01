#!/usr/bin/env python3
"""
ETL Pipeline: Excel → Canonical JSON

Transforms Global_Church_History_Doctrine_Traceability_Atlas_v4.xlsx
into normalized JSON files for the Doctrinal Intelligence Platform.

Output files:
- claims.json (150 doctrines with scoring)
- nodes.json (Timeline Events + Key Documents + Scripture refs)
- edges.json (doctrine-tradition relationships with confidence)
- sources.json (105 sources)
- traditions.json (38 traditions with epistemic metadata)
- interpretations.json (tradition-grouped summaries per doctrine)
"""

import pandas as pd
import json
import os
import sys
import re
from typing import Dict, List, Any, Optional

# Paths
EXCEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'Global_Church_History_Doctrine_Traceability_Atlas_v4.xlsx')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content')


def safe_str(val: Any) -> str:
    """Convert value to string, handling NaN/None."""
    if pd.isna(val):
        return ""
    return str(val).strip()


def safe_list(val: Any, delimiter: str = ';') -> List[str]:
    """Convert delimited string to list, handling NaN."""
    if pd.isna(val):
        return []
    return [s.strip() for s in str(val).split(delimiter) if s.strip()]


def derive_confidence(scoring: Dict) -> str:
    """
    Derive overall confidence from scoring components.
    
    Formula weights:
    - ScriptureScore (0-3): weight 3
    - PatristicBreadth (0-3): weight 2  
    - CouncilScore (0-2): weight 1.5
    - ConsensusScore (0-3): weight 2
    
    Max possible: 9 + 6 + 3 + 6 = 24
    High: >= 18 (75%)
    Mixed: >= 12 (50%)
    Contested: < 12
    """
    index = (
        (scoring.get('scriptureScore', 0) or 0) * 3 +
        (scoring.get('patristicBreadth', 0) or 0) * 2 +
        (scoring.get('councilScore', 0) or 0) * 1.5 +
        (scoring.get('consensusScore', 0) or 0) * 2
    )
    
    if index >= 18:
        return 'High'
    elif index >= 12:
        return 'Mixed'
    else:
        return 'Contested'


def extract_claims(xlsx: pd.ExcelFile) -> List[Dict]:
    """Extract claims from Doctrines + Doctrine_Scoring sheets."""
    print("  Extracting claims from Doctrines + Doctrine_Scoring...")
    
    doctrines_df = pd.read_excel(xlsx, sheet_name='Doctrines')
    scoring_df = pd.read_excel(xlsx, sheet_name='Doctrine_Scoring')
    
    # Create scoring lookup
    scoring_lookup = {}
    for _, row in scoring_df.iterrows():
        doctrine_id = safe_str(row['DoctrineID'])
        scoring_lookup[doctrine_id] = {
            'scriptureScore': int(row['ScriptureScore']) if pd.notna(row['ScriptureScore']) else 0,
            'scriptureClass': safe_str(row['ScriptureClass']),
            'patristicBreadth': int(row['PatristicBreadth']) if pd.notna(row['PatristicBreadth']) else 0,
            'councilScore': int(row['CouncilScore']) if pd.notna(row['CouncilScore']) else 0,
            'consensusScore': int(row['ConsensusScore']) if pd.notna(row['ConsensusScore']) else 0,
            'tier': safe_str(row['Tier']),
            'confidence': safe_str(row['Confidence']),
        }
    
    claims = []
    for _, row in doctrines_df.iterrows():
        doctrine_id = safe_str(row['DoctrineID'])
        
        # Get scoring data
        scoring = scoring_lookup.get(doctrine_id, {})
        if not scoring.get('confidence'):
            scoring['derivedConfidence'] = derive_confidence(scoring)
        else:
            scoring['derivedConfidence'] = scoring['confidence']
        
        claim = {
            'id': doctrine_id,
            'cluster': safe_str(row['Category']),
            'short_label': safe_str(row['Term']),
            'full_statement': safe_str(row['PlainDefinition']),
            'technicalDefinition': safe_str(row['TechnicalDefinition']),
            'definition_variants': [
                safe_str(row['PlainDefinition']),
                safe_str(row['TechnicalDefinition']),
            ] if safe_str(row['TechnicalDefinition']) else [safe_str(row['PlainDefinition'])],
            'keyDocs': safe_list(row.get('KeyDocs', '')),
            'sourceIds': safe_list(row.get('SourceIDs', '')),
            'scoring': scoring,
        }
        claims.append(claim)
    
    print(f"    → Extracted {len(claims)} claims")
    return claims


def extract_traditions(xlsx: pd.ExcelFile) -> List[Dict]:
    """Extract traditions with epistemic posture."""
    print("  Extracting traditions...")
    
    df = pd.read_excel(xlsx, sheet_name='Traditions')
    
    # Epistemic posture templates by family
    EPISTEMIC_POSTURES = {
        'Catholic': 'Scripture + Tradition + Magisterium; development of doctrine under papal authority.',
        'Orthodox': 'Scripture + Tradition + Councils; emphasizes theosis, mystery, and patristic continuity.',
        'Protestant': 'Scripture as primary authority; tradition valued but subordinate to biblical witness.',
        'Oriental': 'Ancient christological formulations; non-Chalcedonian tradition with patristic roots.',
        'Reformed': 'Scripture alone; covenant theology and divine sovereignty in salvation.',
        'Lutheran': 'Scripture + confessions; justification by grace through faith and the means of grace.',
        'Anglican': 'Scripture, tradition, reason; via media between Catholic and Protestant.',
        'Baptist': 'Scripture alone; believer\'s profession and memorial understanding of sacraments.',
        'Pentecostal': 'Scripture + Spirit; emphasis on gifts, experience, and charismatic renewal.',
    }
    
    traditions = []
    for _, row in df.iterrows():
        family = safe_str(row['Family'])
        name = safe_str(row['Name'])
        
        # Determine epistemic posture based on family or name keywords
        posture = EPISTEMIC_POSTURES.get(family, '')
        if not posture:
            if 'Reformed' in name or 'Presbyterian' in name:
                posture = EPISTEMIC_POSTURES['Reformed']
            elif 'Lutheran' in name:
                posture = EPISTEMIC_POSTURES['Lutheran']
            elif 'Baptist' in name:
                posture = EPISTEMIC_POSTURES['Baptist']
            elif 'Anglican' in name:
                posture = EPISTEMIC_POSTURES['Anglican']
            elif 'Pentecostal' in name:
                posture = EPISTEMIC_POSTURES['Pentecostal']
            else:
                posture = 'Holds to historic Christian orthodoxy within its distinctive tradition.'
        
        tradition = {
            'id': safe_str(row['TraditionID']),
            'name': name,
            'family': family,
            'communion': safe_str(row['Communion']),
            'primaryRegions': safe_str(row['PrimaryRegions']),
            'startYear': safe_str(row['StartYear']),
            'notes': safe_str(row['Notes']),
            'keySources': safe_list(row.get('KeySources', '')),
            'epistemicPosture': posture,
        }
        traditions.append(tradition)
    
    print(f"    → Extracted {len(traditions)} traditions")
    return traditions


def extract_sources(xlsx: pd.ExcelFile) -> List[Dict]:
    """Extract sources with type classification."""
    print("  Extracting sources...")
    
    df = pd.read_excel(xlsx, sheet_name='Sources')
    
    sources = []
    for _, row in df.iterrows():
        source = {
            'id': safe_str(row['SourceID']),
            'type': safe_str(row['Type']),
            'title': safe_str(row['Title']),
            'author': safe_str(row['AuthorBody']),
            'year': safe_str(row['Year']),
            'tradition': safe_str(row['Tradition']),
            'url': safe_str(row['URL']),
            'notes': safe_str(row['Notes']),
            'primary_or_secondary': 'Primary' if safe_str(row['Type']) in ['Creed', 'Council', 'Confession', 'Scripture'] else 'Secondary',
            'citation_chicago': f"{safe_str(row['Title'])}. {safe_str(row['AuthorBody'])}. {safe_str(row['Year'])}.",
        }
        sources.append(source)
    
    print(f"    → Extracted {len(sources)} sources")
    return sources


def extract_nodes(xlsx: pd.ExcelFile, sources: List[Dict]) -> List[Dict]:
    """Extract nodes from Timeline_Events + Key_Documents."""
    print("  Extracting nodes from Timeline_Events + Key_Documents...")
    
    nodes = []
    
    # Timeline Events
    events_df = pd.read_excel(xlsx, sheet_name='Timeline_Events')
    for _, row in events_df.iterrows():
        node = {
            'id': f"EV_{safe_str(row['EventID'])}",
            'type': safe_str(row['Type']) or 'Event',
            'title': safe_str(row['Event']),
            'date_range': safe_str(row['Year']),
            'region': safe_str(row['Region']),
            'summary': safe_str(row['WhyItMatters']),
            'keyFigures': safe_str(row['KeyFigures']),
            'citations': safe_list(row.get('SourceIDs', '')),
        }
        nodes.append(node)
    
    # Key Documents
    docs_df = pd.read_excel(xlsx, sheet_name='Key_Documents')
    for _, row in docs_df.iterrows():
        node = {
            'id': f"DOC_{safe_str(row['DocID'])}",
            'type': safe_str(row['Type']) or 'Text',
            'title': safe_str(row['Name']),
            'date_range': safe_str(row['Year']),
            'region': '',
            'summary': f"Key topics: {safe_str(row['KeyTopics'])}",
            'tradition': safe_str(row['Tradition']),
            'citations': safe_list(row.get('SourceIDs', '')),
        }
        nodes.append(node)
    
    # Church Fathers
    fathers_df = pd.read_excel(xlsx, sheet_name='Church_Fathers_Index')
    for _, row in fathers_df.iterrows():
        father_name = safe_str(row['Father'])
        node = {
            'id': f"FATHER_{father_name.upper().replace(' ', '_').replace('.', '')}",
            'type': 'Person',
            'title': father_name,
            'date_range': safe_str(row['Dates']),
            'region': safe_str(row['Region']),
            'summary': f"{safe_str(row['WhyRead'])} Key works: {safe_str(row['KeyWorks'])}",
            'language': safe_str(row['Language']),
            'citations': [safe_str(row.get('Link', ''))] if safe_str(row.get('Link', '')) else [],
        }
        nodes.append(node)
    
    print(f"    → Extracted {len(nodes)} nodes")
    return nodes


def extract_edges_and_interpretations(xlsx: pd.ExcelFile, claims: List[Dict], traditions: List[Dict]) -> tuple:
    """Extract edges from Positions_Long and generate interpretations."""
    print("  Extracting edges from Positions_Long...")
    
    positions_df = pd.read_excel(xlsx, sheet_name='Positions_Long')
    
    # Create lookups
    claim_lookup = {c['id']: c for c in claims}
    tradition_lookup = {t['id']: t for t in traditions}
    
    edges = []
    interpretations_map = {}  # {claim_id: {tradition_family: [positions]}}
    
    edge_id = 1
    for _, row in positions_df.iterrows():
        doctrine_id = safe_str(row['DoctrineID'])
        tradition_id = safe_str(row['TraditionID'])
        
        if not doctrine_id or not tradition_id:
            continue
        
        confidence_raw = safe_str(row['Confidence'])
        confidence = 'High' if confidence_raw == 'High' else ('Medium' if confidence_raw == 'Medium' else 'Contested')
        
        stance = safe_str(row['Stance'])
        
        # Determine relation type from stance
        if stance in ['Affirm', 'affirm']:
            relation_type = 'Supports'
        elif stance in ['Deny', 'deny', 'Reject']:
            relation_type = 'Challenges'
        elif stance in ['Modify', 'modify', 'Nuance']:
            relation_type = 'Develops'
        else:
            relation_type = 'Defines'
        
        edge = {
            'id': f"E{edge_id}",
            'claim_id': doctrine_id,
            'node_id': f"TRAD_{tradition_id}",  # Virtual node for tradition
            'relation_type': relation_type,
            'note': safe_str(row['Summary']),
            'confidence': confidence,
            'traditionId': tradition_id,
            'stance': stance,
            'keySources': safe_list(row.get('KeySources', '')),
        }
        edges.append(edge)
        edge_id += 1
        
        # Build interpretations map
        tradition = tradition_lookup.get(tradition_id, {})
        family = tradition.get('family', 'Other')
        
        if doctrine_id not in interpretations_map:
            interpretations_map[doctrine_id] = {}
        if family not in interpretations_map[doctrine_id]:
            interpretations_map[doctrine_id][family] = []
        
        interpretations_map[doctrine_id][family].append({
            'traditionId': tradition_id,
            'traditionName': tradition.get('name', tradition_id),
            'stance': stance,
            'summary': safe_str(row['Summary']),
            'confidence': confidence,
            'keySources': safe_list(row.get('KeySources', '')),
        })
    
    print(f"    → Extracted {len(edges)} edges")
    
    # Generate interpretations (grouped by family)
    print("  Generating interpretations from positions...")
    interpretations = []
    
    for claim_id, families in interpretations_map.items():
        for family, positions in families.items():
            # Create a summary from positions
            affirm_count = sum(1 for p in positions if p['stance'] in ['Affirm', 'affirm'])
            total = len(positions)
            
            if affirm_count == total:
                summary = f"All {family} traditions affirm this doctrine."
            elif affirm_count > total / 2:
                summary = f"Most {family} traditions affirm this doctrine, with some variations."
            else:
                summary = f"{family} traditions show varied positions on this doctrine."
            
            # Collect key points
            key_points = []
            for pos in positions[:5]:  # Limit to 5 key points
                if pos['summary']:
                    key_points.append({
                        'text': f"{pos['traditionName']}: {pos['summary']}",
                        'citations': pos['keySources'],
                    })
            
            interpretation = {
                'id': f"INT_{claim_id}_{family.upper()}",
                'claim_id': claim_id,
                'lens': family,
                'summary': summary,
                'key_points': key_points,
                'positions': positions,
            }
            interpretations.append(interpretation)
    
    print(f"    → Generated {len(interpretations)} interpretations")
    
    return edges, interpretations


def write_json(data: Any, filename: str):
    """Write data to JSON file."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"    → Wrote {filepath}")


def validate_output():
    """Basic validation of output files."""
    print("\n  Validating output...")
    
    files = ['claims.json', 'nodes.json', 'edges.json', 'sources.json', 'traditions.json', 'interpretations.json']
    
    for filename in files:
        filepath = os.path.join(OUTPUT_DIR, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                print(f"    ✓ {filename}: {len(data)} records")
        except Exception as e:
            print(f"    ✗ {filename}: {e}")
            return False
    
    return True


def main():
    """Main ETL pipeline."""
    print("=" * 60)
    print("Doctrinal Intelligence Platform — ETL Pipeline")
    print("=" * 60)
    
    # Check input file exists
    if not os.path.exists(EXCEL_PATH):
        print(f"ERROR: Excel file not found: {EXCEL_PATH}")
        sys.exit(1)
    
    print(f"\nInput: {EXCEL_PATH}")
    print(f"Output: {OUTPUT_DIR}\n")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load Excel
    print("Loading Excel file...")
    xlsx = pd.ExcelFile(EXCEL_PATH)
    print(f"  Found sheets: {xlsx.sheet_names}\n")
    
    # Extract data
    print("Extracting data...")
    claims = extract_claims(xlsx)
    traditions = extract_traditions(xlsx)
    sources = extract_sources(xlsx)
    nodes = extract_nodes(xlsx, sources)
    edges, interpretations = extract_edges_and_interpretations(xlsx, claims, traditions)
    
    # Write output
    print("\nWriting JSON files...")
    write_json(claims, 'claims.json')
    write_json(traditions, 'traditions.json')
    write_json(sources, 'sources.json')
    write_json(nodes, 'nodes.json')
    write_json(edges, 'edges.json')
    write_json(interpretations, 'interpretations.json')
    
    # Validate
    if '--validate' in sys.argv:
        if validate_output():
            print("\n✓ Validation passed")
        else:
            print("\n✗ Validation failed")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    print("ETL Pipeline Complete")
    print("=" * 60)


if __name__ == '__main__':
    main()
