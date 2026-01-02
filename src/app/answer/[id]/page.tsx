import { notFound } from 'next/navigation';
import { getClaim, getTrace, getAllClaims, getSource, getInterpretations } from '@/lib/data';
import { AnswerPageClient } from './AnswerClient';

// Scripture texts with translations
const SCRIPTURE_TEXTS: Record<string, { text: string; translation: string }> = {
    'John 3:5': {
        text: 'Jesus answered, "Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God."',
        translation: 'English Standard Version (ESV)',
    },
    'Titus 3:5': {
        text: 'He saved us, not because of works done by us in righteousness, but according to his own mercy, by the washing of regeneration and renewal of the Holy Spirit.',
        translation: 'English Standard Version (ESV)',
    },
    'Romans 6:3-4': {
        text: 'Do you not know that all of us who have been baptized into Christ Jesus were baptized into his death? We were buried therefore with him by baptism into death, in order that, just as Christ was raised from the dead by the glory of the Father, we too might walk in newness of life.',
        translation: 'English Standard Version (ESV)',
    },
    '1 Peter 3:21': {
        text: 'Baptism, which corresponds to this, now saves you, not as a removal of dirt from the body but as an appeal to God for a good conscience, through the resurrection of Jesus Christ.',
        translation: 'English Standard Version (ESV)',
    },
    'Acts 2:38': {
        text: 'And Peter said to them, "Repent and be baptized every one of you in the name of Jesus Christ for the forgiveness of your sins, and you will receive the gift of the Holy Spirit."',
        translation: 'English Standard Version (ESV)',
    },
    'Matthew 28:19': {
        text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
        translation: 'English Standard Version (ESV)',
    },
    'John 1:1': {
        text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        translation: 'English Standard Version (ESV)',
    },
    'John 10:30': {
        text: 'I and the Father are one.',
        translation: 'English Standard Version (ESV)',
    },
    'John 6:53-56': {
        text: 'Jesus said to them, "Truly, truly, I say to you, unless you eat the flesh of the Son of Man and drink his blood, you have no life in you. Whoever feeds on my flesh and drinks my blood has eternal life, and I will raise him up on the last day."',
        translation: 'English Standard Version (ESV)',
    },
    '1 Corinthians 11:23-26': {
        text: 'For I received from the Lord what I also delivered to you, that the Lord Jesus on the night when he was betrayed took bread, and when he had given thanks, he broke it, and said, "This is my body, which is for you. Do this in remembrance of me."',
        translation: 'English Standard Version (ESV)',
    },
};

function getTopicSlug(claimId: string): string {
    if (claimId.startsWith('CLM_BR')) return 'baptism';
    if (claimId.startsWith('CLM_TR')) return 'trinity';
    if (claimId.startsWith('CLM_EU')) return 'communion';
    return 'baptism';
}

function toQuestion(label: string): string {
    const questions: Record<string, string> = {
        'Baptism regenerates': 'Does baptism bring new life?',
        'Remits sin': 'Does baptism wash away sins?',
        'Infants should be baptised': 'Should babies be baptized?',
        'Baptism incorporates into Christ': 'Does baptism unite us with Christ?',
        'Necessity of water baptism': 'Is water baptism necessary?',
        'Son co-eternal': 'Is Jesus eternal like the Father?',
        'Procession of Spirit': 'How does the Holy Spirit relate to Father and Son?',
        'Co-equality of Persons': 'Are Father, Son, and Spirit equal?',
        'Divine Simplicity': 'Is God one simple being or three parts?',
        'Real Presence': 'Is Christ truly present in communion?',
        'Eucharistic Sacrifice': 'Is communion a sacrifice?',
        'Necessity for Salvation': 'Is communion necessary for salvation?',
        'Proper Minister': 'Who can serve communion?',
    };

    for (const [key, question] of Object.entries(questions)) {
        if (label.toLowerCase().includes(key.toLowerCase())) {
            return question;
        }
    }
    return label;
}

// Generate historic summary based on node data
function generateHistoricSummary(nodes: ReturnType<typeof getTrace>, claimLabel: string): string {
    const supportsCount = nodes.filter(n => n.edge.relation_type === 'Supports' || n.edge.relation_type === 'Defines').length;
    const divergesCount = nodes.filter(n => n.edge.relation_type === 'Challenges').length;

    if (divergesCount === 0) {
        return `${claimLabel.replace(/\.$/, '')} has been consistently affirmed across ${supportsCount} historical sources, from the apostolic writings through the church fathers, councils, and confessions. This represents the unified testimony of the historic Church.`;
    } else {
        return `${claimLabel.replace(/\.$/, '')} was the predominant teaching of the early Church, affirmed by ${supportsCount} sources. However, ${divergesCount} notable divergence${divergesCount > 1 ? 's' : ''} emerged, particularly during the Reformation. The trace below shows this development.`;
    }
}

// Extract scripture reference from title
function extractScriptureRef(title: string): string | null {
    const match = title.match(/([1-3]?\s?[A-Za-z]+\s+\d+:\d+(?:-\d+)?)/);
    return match ? match[1] : null;
}

export function generateStaticParams() {
    const claims = getAllClaims();
    return claims.map((claim) => ({ id: claim.id }));
}

export default async function AnswerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const claim = getClaim(id);

    if (!claim) return notFound();

    const nodes = getTrace(id);
    const topicSlug = getTopicSlug(id);
    const historicSummary = generateHistoricSummary(nodes, claim.full_statement);

    // Pre-process nodes to include source data and scripture text
    const processedNodes = nodes.map((node, i) => {
        const source = node.citations.length > 0 ? getSource(node.citations[0]) : null;
        const scriptureRef = node.type === 'Scripture' ? extractScriptureRef(node.title) : null;
        const scriptureData = scriptureRef ? SCRIPTURE_TEXTS[scriptureRef] : null;

        return {
            id: `node-${i}`,
            title: node.title,
            summary: node.summary,
            date_range: node.date_range,
            type: node.type,
            parsedYear: node.parsedYear,
            relationType: node.edge.relation_type,
            source: source ? {
                excerpt: source.excerpt,
                url: source.url,
            } : undefined,
            scriptureText: scriptureData?.text,
            scriptureTranslation: scriptureData?.translation,
        };
    });

    // Get primary sources with excerpts
    const quotes = nodes
        .filter(node => node.citations.length > 0)
        .flatMap(node => {
            return node.citations.map(citId => {
                const source = getSource(citId);
                if (source?.excerpt) {
                    return {
                        excerpt: source.excerpt,
                        significance: source.significance,
                        author: source.citation_chicago.split('.')[0],
                        date: node.date_range,
                        url: source.url,
                    };
                }
                return null;
            }).filter((q): q is NonNullable<typeof q> => q !== null);
        })
        .slice(0, 5);

    // Get theological interpretations
    const interpretations = getInterpretations(id).map(interp => ({
        lens: interp.lens,
        summary: interp.summary,
        keyPoints: interp.key_points.map(kp => kp.text),
    }));

    return (
        <AnswerPageClient
            question={toQuestion(claim.short_label)}
            fullStatement={claim.full_statement}
            topicSlug={topicSlug}
            nodes={processedNodes}
            quotes={quotes}
            variants={claim.definition_variants}
            historicSummary={historicSummary}
            interpretations={interpretations}
        />
    );
}
