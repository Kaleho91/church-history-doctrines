
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE_PATH = 'Global_Church_History_Doctrine_Traceability_Atlas_v4.xlsx';
const OUTPUT_DIR = 'src/content';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('Reading Excel file...');
const workbook = XLSX.readFile(FILE_PATH);

// Helper to get sheet data
const getSheet = (name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet) {
        console.warn(`Warning: Sheet ${name} not found`);
        return [];
    }
    return XLSX.utils.sheet_to_json(sheet);
};

// --- READ DATA ---
const rawDoctrines = getSheet('Doctrines');
const rawPositions = getSheet('Positions_Long');
const rawSources = getSheet('Sources');
const rawMatrix = getSheet('Matrix_Core');

console.log(`Loaded:
- ${rawDoctrines.length} Doctrines (Claims)
- ${rawPositions.length} Positions (Interpretations)
- ${rawSources.length} Sources (Nodes)
- ${rawMatrix.length} Matrix Rows`);

// --- 1. MODULES / TOPICS ---
const modulesMap = {};
rawDoctrines.forEach(d => {
    const cat = d.Category || 'Uncategorized';
    if (!modulesMap[cat]) {
        modulesMap[cat] = {
            id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            label: cat,
            description: `Doctrines related to ${cat}`,
            claims: []
        };
    }
    modulesMap[cat].claims.push(d.DoctrineID);
});

const modules = Object.values(modulesMap);
console.log(`Generated ${modules.length} Modules`);

// --- 2. CLAIMS ---
const claims = rawDoctrines.map(d => ({
    id: d.DoctrineID,
    cluster: d.Category || 'Uncategorized',
    short_label: d.Term,
    full_statement: d.PlainDefinition || d.TechnicalDefinition || 'No definition provided',
    definition_variants: d.TechnicalDefinition ? [d.TechnicalDefinition] : [],
    slug: (d.Category + '-' + d.Term).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    excelDoctrineId: d.DoctrineID,
    description: d.PlainDefinition
}));
console.log(`Generated ${claims.length} Claims`);

// --- 3. NODES (Sources) ---
function mapSourceTypeToNodeType(type) {
    const t = (type || '').toLowerCase();
    if (t.includes('council')) return 'Council';
    if (t.includes('creed') || t.includes('confession')) return 'Creed';
    if (t.includes('scripture') || t.includes('bible')) return 'Scripture';
    if (t.includes('person') || t.includes('father')) return 'Person';
    return 'Text';
}

const nodes = rawSources.map(s => ({
    id: s.SourceID,
    type: mapSourceTypeToNodeType(s.Type),
    title: s.Title || 'Untitled Source',
    date_range: s.Year ? s.Year.toString() : 'Unknown',
    region: 'Global',
    summary: s.Notes || '',
    citations: [s.SourceID],
    citation: s.AuthorBody ? `${s.AuthorBody}, ${s.Title}` : s.Title,
}));
console.log(`Generated ${nodes.length} Nodes`);


// --- 4. EDGES (from Doctrines.SourceIDs - the CORRECT doctrine-to-source mapping) ---
const edges = [];
const seenEdges = new Set();

rawDoctrines.forEach(d => {
    if (!d.SourceIDs) return;

    // SourceIDs is the direct link from a doctrine to its supporting primary sources
    const sourceIds = d.SourceIDs.split(';').map(s => s.trim()).filter(s => s);

    sourceIds.forEach(sourceId => {
        // Check source exists
        const nodeExists = nodes.find(n => n.id === sourceId);
        if (!nodeExists) {
            console.warn(`Skipping edge: source ${sourceId} not found for doctrine ${d.DoctrineID}`);
            return;
        }

        const edgeId = `${d.DoctrineID}-${sourceId}`;
        if (!seenEdges.has(edgeId)) {
            edges.push({
                id: edgeId,
                claim_id: d.DoctrineID,
                node_id: sourceId,
                relation_type: 'Supports', // Doctrinal sources are primary evidence
                note: `Primary source for ${d.Term}`,
                confidence: 'High'
            });
            seenEdges.add(edgeId);
        }
    });
});
console.log(`Generated ${edges.length} Edges (from Doctrines.SourceIDs)`);


// --- 5. INTERPRETATIONS (AGGREGATED by lens) ---
// Group positions by (DoctrineID, Lens) to avoid 38 duplicate entries per claim

function getLensFromTradition(tradName) {
    const t = (tradName || '').toLowerCase();
    if (t.includes('catholic') && !t.includes('old catholic')) return 'Catholic';
    if (t.includes('orthodox')) return 'Orthodox';
    if (t.includes('lutheran')) return 'Lutheran';
    if (t.includes('reformed') || t.includes('calvinist') || t.includes('presbyterian')) return 'Reformed';
    if (t.includes('baptist') || t.includes('zwingli') || t.includes('anabaptist') || t.includes('mennonite')) return 'ZwinglianBaptistic';
    if (t.includes('anglican') || t.includes('methodist') || t.includes('pentecostal')) return 'Protestant';
    return 'Consensus'; // Historical/general traditions
}

// Build aggregation map: { "DO001-Catholic": { traditions: [...], summaries: [...] } }
const interpMap = {};

rawPositions.forEach(p => {
    const lens = getLensFromTradition(p.Tradition);
    const key = `${p.DoctrineID}-${lens}`;

    if (!interpMap[key]) {
        interpMap[key] = {
            claim_id: p.DoctrineID,
            lens: lens,
            traditions: [],
            summaries: [],
            stances: []
        };
    }

    interpMap[key].traditions.push(p.Tradition);
    if (p.Summary && !interpMap[key].summaries.includes(p.Summary)) {
        interpMap[key].summaries.push(p.Summary);
    }
    if (p.Stance) {
        interpMap[key].stances.push(p.Stance);
    }
});

// Convert aggregated map to final interpretations array
const interpretations = Object.entries(interpMap).map(([key, data], idx) => {
    // Pick the best summary (longest/most detailed, or first)
    const bestSummary = data.summaries.sort((a, b) => b.length - a.length)[0] || '';

    // Determine dominant stance
    const stanceCounts = {};
    data.stances.forEach(s => { stanceCounts[s] = (stanceCounts[s] || 0) + 1; });
    const dominantStance = Object.entries(stanceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Affirm';

    return {
        id: `INT-${idx}`,
        claim_id: data.claim_id,
        lens: data.lens,
        summary: bestSummary,
        key_points: [],
        // Enrichment: show tradition consensus
        tradition_count: data.traditions.length,
        dominant_stance: dominantStance,
        unique_summaries: data.summaries.length
    };
});
console.log(`Generated ${interpretations.length} Interpretations`);


// --- 6. MATRIX ---
const matrix = {};
rawMatrix.forEach(row => {
    matrix[row.DoctrineID] = row;
});

// --- WRITE FILES ---
const writeJson = (filename, data) => {
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(data, null, 2));
    console.log(`Wrote ${filename}`);
};

writeJson('modules.json', modules);
writeJson('claims.json', claims);
writeJson('nodes.json', nodes);
writeJson('edges.json', edges);
writeJson('interpretations.json', interpretations);
writeJson('matrix.json', matrix);

console.log('IMPORT COMPLETE.');
