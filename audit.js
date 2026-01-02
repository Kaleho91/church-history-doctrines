const claims = require('./src/content/claims.json');
const edges = require('./src/content/edges.json');
const nodes = require('./src/content/nodes.json');
const interps = require('./src/content/interpretations.json');

console.log('=== SYSTEMATIC DATA AUDIT ===\n');

// 1. Check claims without Scripture in trace
console.log('1. CLAIMS WITHOUT SCRIPTURE TRACE:');
claims.forEach(c => {
    const claimEdges = edges.filter(e => e.claim_id === c.id);
    const nodeIds = claimEdges.map(e => e.node_id);
    const traceNodes = nodeIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);
    const hasScripture = traceNodes.some(n => n.type === 'Scripture');
    if (!hasScripture) {
        console.log('   ⚠', c.id, '-', c.short_label);
    }
});

// 2. Check claims missing key traditions  
console.log('\n2. CLAIMS MISSING KEY TRADITIONS:');
const keyLenses = ['Consensus', 'Catholic', 'Orthodox', 'Lutheran', 'Reformed'];
claims.forEach(c => {
    const claimInterps = interps.filter(i => i.claim_id === c.id);
    const lenses = claimInterps.map(i => i.lens);
    const missing = keyLenses.filter(l => !lenses.includes(l));
    if (missing.length > 0) {
        console.log('   ', c.id, 'missing:', missing.join(', '));
    }
});

// 3. Orphaned edges
console.log('\n3. ORPHANED EDGES:');
let orphans = 0;
edges.forEach(e => {
    if (!nodes.find(n => n.id === e.node_id)) {
        console.log('   ❌', e.id, '-> missing node', e.node_id);
        orphans++;
    }
});
if (orphans === 0) console.log('   (none)');

// 4. Summary
console.log('\n=== SUMMARY ===');
console.log('Claims:', claims.length);
console.log('Nodes:', nodes.length);
console.log('Edges:', edges.length);
console.log('Interpretations:', interps.length);
