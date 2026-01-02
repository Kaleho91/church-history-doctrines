/**
 * Claim-to-Doctrine Scoring Mappings
 * 
 * Maps original Claim Checker claims to scoring data derived from
 * the Excel Doctrine_Scoring sheet. This provides confidence metrics
 * without replacing the curated claim content.
 * 
 * Mapping strategy: Baptism claims map to DO056 (Baptismal Regeneration)
 * which is the closest Excel doctrine to the original claim set.
 */

import { ClaimScoring, TraditionPosition, TraditionFamily, Stance, ConfidenceLevel } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// SCORING DATA (derived from Excel Doctrine_Scoring)
// ═══════════════════════════════════════════════════════════════════════════

// Baptism-related claims map to this scoring profile
const BAPTISM_SCORING: ClaimScoring = {
    scriptureScore: 3,           // Explicit: Acts 2:38, Titus 3:5, 1 Pet 3:21
    scriptureClass: 'Explicit/strong',
    patristicBreadth: 3,         // Justin, Cyprian, Augustine all use regeneration language
    councilScore: 2,             // Council of Carthage, Trent address baptism
    consensusScore: 2,           // Widespread agreement on baptism's significance, debate on mechanics
    tier: 'Tier 1 – Ancient/Core',
    derivedConfidence: 'High',
};

// Trinity-related claims
const TRINITY_SCORING: ClaimScoring = {
    scriptureScore: 3,           // John 1:1, Matt 28:19, John 10:30
    scriptureClass: 'Explicit/strong',
    patristicBreadth: 3,         // Justin, Tertullian, Athanasius, Cappadocians
    councilScore: 3,             // Nicaea 325, Constantinople 381 — definitive
    consensusScore: 3,           // Near-universal agreement across traditions
    tier: 'Tier 1 – Ancient/Core',
    derivedConfidence: 'High',
};

// Eucharist-related claims
const EUCHARIST_SCORING: ClaimScoring = {
    scriptureScore: 3,           // John 6, 1 Cor 11, Synoptic institution narratives
    scriptureClass: 'Explicit/strong',
    patristicBreadth: 3,         // Ignatius, Cyril, Augustine all speak of real presence
    councilScore: 3,             // Lateran IV, Trent define transubstantiation
    consensusScore: 2,           // Wide agreement on importance, major debate on mode
    tier: 'Tier 1 – Ancient/Core',
    derivedConfidence: 'Medium', // More contested than Trinity
};

// Map of claim IDs to their scoring profiles
export const CLAIM_SCORING_MAP: Record<string, ClaimScoring> = {
    // Baptism claims
    'CLM_BR_C1': BAPTISM_SCORING,  // Baptism effects regeneration
    'CLM_BR_C2': BAPTISM_SCORING,  // Baptism remits sins
    'CLM_BR_C3': BAPTISM_SCORING,  // Baptism incorporates into Christ
    'CLM_BR_C4': {                 // Efficacy relates to faith/timing
        ...BAPTISM_SCORING,
        consensusScore: 1,           // More debated across traditions
        derivedConfidence: 'Medium',
    },
    'CLM_BR_C5': {                 // Not automatic magic
        ...BAPTISM_SCORING,
        consensusScore: 2,
        derivedConfidence: 'High',   // Wide agreement on anti-mechanical framing
    },
    // Trinity claims
    'CLM_TR_C1': TRINITY_SCORING,  // Son co-eternal
    'CLM_TR_C2': {                 // Filioque
        ...TRINITY_SCORING,
        consensusScore: 1,           // East-West divide
        derivedConfidence: 'Medium',
    },
    'CLM_TR_C3': TRINITY_SCORING,  // Three persons, one essence
    'CLM_TR_C4': TRINITY_SCORING,  // Economic vs ontological
    // Eucharist claims
    'CLM_EU_C1': EUCHARIST_SCORING,  // Real presence
    'CLM_EU_C2': {                   // Transformation mode
        ...EUCHARIST_SCORING,
        consensusScore: 1,
        derivedConfidence: 'Medium',
    },
    'CLM_EU_C3': {                   // Sacrifice/memorial
        ...EUCHARIST_SCORING,
        consensusScore: 1,
        derivedConfidence: 'Medium',
    },
    'CLM_EU_C4': EUCHARIST_SCORING,  // Worthy reception
};

// ═══════════════════════════════════════════════════════════════════════════
// TRADITION POSITIONS (derived from Excel Positions_Long)
// ═══════════════════════════════════════════════════════════════════════════

// Helper to create tradition position
function pos(
    id: string,
    name: string,
    family: TraditionFamily,
    stance: Stance,
    confidence: ConfidenceLevel,
    summary: string
): TraditionPosition {
    return { traditionId: id, traditionName: name, family, stance, summary, confidence, keySources: [] };
}

// ═══════════════════════════════════════════════════════════════════════════
// BAPTISM POSITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const BAPTISM_REGENERATION_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'Baptism effects regeneration and remission of sins ex opere operato when properly administered.'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        'Baptism is the beginning of theosis, conferring new birth and incorporation into Christ.'),
    pos('TR003', 'Oriental Orthodox', 'Oriental Orthodox', 'Affirm', 'High',
        'Baptism effects spiritual rebirth in the ancient pattern of the early church.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        'Baptism works forgiveness of sins, delivers from death and the devil, and gives eternal salvation (SC).'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Affirm', 'Medium',
        'Baptism is a sign and seal of covenant promises; efficacy not tied to moment of administration (WCF 28).'),
    pos('TR012', 'Anglican', 'Protestant', 'Affirm', 'Medium',
        'Baptism is a sign of regeneration "as by an instrument" (Article 27); wide internal debate.'),
    pos('TR016', 'Baptist', 'Protestant', 'Modify', 'High',
        'Baptism is an ordinance testifying to prior regeneration; does not effect it.'),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Modify', 'High',
        'Baptism follows conversion as an act of obedience; regeneration precedes baptism.'),
    pos('TR018', 'Pentecostal', 'Protestant', 'Modify', 'Medium',
        'Emphasis varies; many see baptism as obedient response to Spirit-worked regeneration.'),
];

// ═══════════════════════════════════════════════════════════════════════════
// TRINITY POSITIONS
// ═══════════════════════════════════════════════════════════════════════════

const TRINITY_CO_ETERNAL_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'The Son is eternally begotten, homoousios with the Father — defined at Nicaea 325.'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        'The Son is eternally begotten from the Father, sharing the same divine essence.'),
    pos('TR003', 'Oriental Orthodox', 'Oriental Orthodox', 'Affirm', 'High',
        'Full affirmation of Nicene faith: the Son is true God from true God.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        'Affirms Nicene and Athanasian Creeds; Son co-eternal with Father (Augsburg, Art. I).'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Affirm', 'High',
        'Westminster Confession affirms the eternal generation of the Son (WCF 2.3).'),
    pos('TR012', 'Anglican', 'Protestant', 'Affirm', 'High',
        '39 Articles affirm creedal Trinitarianism; Son of one substance with the Father.'),
    pos('TR016', 'Baptist', 'Protestant', 'Affirm', 'High',
        'Historic Baptist confessions affirm the Trinity; Son eternally begotten.'),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Affirm', 'High',
        "Affirms Nicene orthodoxy on Christ's eternal deity."),
    pos('TR018', 'Pentecostal', 'Protestant', 'Affirm', 'High',
        'Mainstream Pentecostalism affirms Trinitarian orthodoxy (some Oneness exceptions).'),
];

const FILIOQUE_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'Spirit proceeds from the Father and the Son as from one principle (Filioque).'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Deny', 'High',
        'Spirit proceeds from the Father alone; Filioque is an uncanonical Western addition.'),
    pos('TR003', 'Oriental Orthodox', 'Oriental Orthodox', 'Deny', 'Medium',
        'Generally reject Filioque; hold to original creedal formula.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        'Confesses the Western Creed with Filioque (Augsburg Confession).'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Affirm', 'High',
        'Affirms Filioque in Western creedal tradition.'),
    pos('TR012', 'Anglican', 'Protestant', 'Affirm', 'Medium',
        'Traditionally uses Filioque; recent ecumenical discussions vary.'),
    pos('TR016', 'Baptist', 'Protestant', 'Affirm', 'Medium',
        'Generally accepts Western Trinitarian formula with Filioque.'),
];

const TRINITY_ESSENCE_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'One divine essence in three distinct persons — foundational dogma.'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        'One ousia, three hypostases — core of Orthodox theology.'),
    pos('TR003', 'Oriental Orthodox', 'Oriental Orthodox', 'Affirm', 'High',
        'Affirms Nicene Trinitarianism after Christological differences with Chalcedon.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        "Affirms Athanasian Creed's precise Trinitarian formulation."),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Affirm', 'High',
        'One God in three persons, co-equal and co-eternal (WCF 2.3).'),
    pos('TR012', 'Anglican', 'Protestant', 'Affirm', 'High',
        'Affirms the three creeds; one God in Trinity.'),
    pos('TR016', 'Baptist', 'Protestant', 'Affirm', 'High',
        'One God eternally existing in three persons.'),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Affirm', 'High',
        'Confesses one God: Father, Son, and Holy Spirit.'),
    pos('TR018', 'Pentecostal', 'Protestant', 'Affirm', 'High',
        'Trinitarian Pentecostals affirm three persons, one God.'),
];

// ═══════════════════════════════════════════════════════════════════════════
// EUCHARIST POSITIONS
// ═══════════════════════════════════════════════════════════════════════════

const EUCHARIST_REAL_PRESENCE_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'Christ substantially present under forms of bread and wine (transubstantiation).'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        'True body and blood of Christ; mystery not defined philosophically.'),
    pos('TR003', 'Oriental Orthodox', 'Oriental Orthodox', 'Affirm', 'High',
        'Real presence affirmed in ancient liturgical tradition.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        'True body and blood present "in, with, and under" bread and wine (sacramental union).'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Modify', 'High',
        'Spiritual real presence; believers lifted to commune with Christ by the Spirit.'),
    pos('TR012', 'Anglican', 'Protestant', 'Modify', 'Medium',
        'Wide range: some affirm real presence, others more receptionist or memorial.'),
    pos('TR016', 'Baptist', 'Protestant', 'Deny', 'High',
        "Memorial view: bread and wine symbolize but do not contain Christ's presence."),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Deny', 'High',
        "Lord's Supper is a remembrance and fellowship meal, not a means of grace."),
    pos('TR018', 'Pentecostal', 'Protestant', 'Modify', 'Medium',
        'Varies widely; many hold memorial view, some more sacramental.'),
];

const EUCHARIST_TRANSFORMATION_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'Substance of bread/wine changed into body/blood (transubstantiation).'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'Medium',
        'Real change occurs; mechanism not defined — holy mystery.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Modify', 'High',
        'No substantial change; body/blood truly present alongside bread/wine.'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Deny', 'High',
        'Bread and wine remain unchanged; presence is spiritual, not physical.'),
    pos('TR016', 'Baptist', 'Protestant', 'Deny', 'High',
        'Elements are symbols only; no transformation of any kind.'),
];

const EUCHARIST_SACRIFICE_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        "Mass is a propitiatory sacrifice making present Christ's once-for-all offering."),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        "Divine Liturgy is a sacrifice of thanksgiving and makes present Christ's sacrifice."),
    pos('TR013', 'Lutheran', 'Protestant', 'Modify', 'High',
        'Eucharist is a sacrifice of thanksgiving and praise, not propitiation for sins.'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Deny', 'High',
        "Christ's sacrifice was once for all; the Supper is a memorial, not a sacrifice."),
    pos('TR016', 'Baptist', 'Protestant', 'Deny', 'High',
        "The Lord's Supper is purely a memorial; no sacrificial element."),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Deny', 'High',
        'Memorial ordinance; rejects any understanding of Eucharistic sacrifice.'),
];

const EUCHARIST_RECEPTION_POSITIONS: TraditionPosition[] = [
    pos('TR001', 'Roman Catholic', 'Catholic', 'Affirm', 'High',
        'Worthy reception requires state of grace; unworthy eating brings judgment.'),
    pos('TR002', 'Eastern Orthodox', 'Eastern Orthodox', 'Affirm', 'High',
        'Preparation through fasting, confession, and prayer required.'),
    pos('TR013', 'Lutheran', 'Protestant', 'Affirm', 'High',
        'Faith is necessary for worthy reception; unbelievers receive to their harm.'),
    pos('TR014', 'Reformed/Presbyterian', 'Protestant', 'Affirm', 'High',
        'Self-examination and faith required; unworthy eating brings judgment.'),
    pos('TR016', 'Baptist', 'Protestant', 'Affirm', 'High',
        'Self-examination required; typically restricted to baptized believers.'),
    pos('TR017', 'Anabaptist/Mennonite', 'Protestant', 'Affirm', 'High',
        'Communal discernment and holy living expected for participation.'),
];

// Map of claim IDs to their tradition positions
export const CLAIM_POSITIONS_MAP: Record<string, TraditionPosition[]> = {
    // Baptism
    'CLM_BR_C1': BAPTISM_REGENERATION_POSITIONS,
    'CLM_BR_C2': BAPTISM_REGENERATION_POSITIONS,
    'CLM_BR_C3': BAPTISM_REGENERATION_POSITIONS,
    'CLM_BR_C4': BAPTISM_REGENERATION_POSITIONS.map(p => ({
        ...p,
        confidence: p.traditionId === 'TR014' ? 'High' as ConfidenceLevel : p.confidence,
    })),
    'CLM_BR_C5': BAPTISM_REGENERATION_POSITIONS.map(p => ({
        ...p,
        stance: 'Affirm' as Stance,
        confidence: 'High' as ConfidenceLevel,
    })),
    // Trinity
    'CLM_TR_C1': TRINITY_CO_ETERNAL_POSITIONS,
    'CLM_TR_C2': FILIOQUE_POSITIONS,
    'CLM_TR_C3': TRINITY_ESSENCE_POSITIONS,
    'CLM_TR_C4': TRINITY_ESSENCE_POSITIONS,
    // Eucharist
    'CLM_EU_C1': EUCHARIST_REAL_PRESENCE_POSITIONS,
    'CLM_EU_C2': EUCHARIST_TRANSFORMATION_POSITIONS,
    'CLM_EU_C3': EUCHARIST_SACRIFICE_POSITIONS,
    'CLM_EU_C4': EUCHARIST_RECEPTION_POSITIONS,
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getClaimScoring(claimId: string): ClaimScoring | undefined {
    return CLAIM_SCORING_MAP[claimId];
}

export function getClaimPositions(claimId: string): TraditionPosition[] {
    return CLAIM_POSITIONS_MAP[claimId] || [];
}

export function getTraditionBreadth(claimId: string) {
    const positions = getClaimPositions(claimId);
    return {
        affirm: positions.filter(p => p.stance === 'Affirm').length,
        modify: positions.filter(p => p.stance === 'Modify').length,
        deny: positions.filter(p => p.stance === 'Deny').length,
        total: positions.length,
    };
}

