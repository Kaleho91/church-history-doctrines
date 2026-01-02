import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllClaims } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

// Map friendly slugs to cluster names and user-friendly labels
const TOPIC_MAP: Record<string, {
    cluster: string;
    title: string;
    intro: string;
}> = {
    'baptism': {
        cluster: 'Baptism & New Birth',
        title: 'Baptism',
        intro: 'Throughout history, Christians have asked: What happens when we are baptized? Here are the key questions and what church history tells us.',
    },
    'trinity': {
        cluster: 'Trinity',
        title: 'The Trinity',
        intro: 'The doctrine of the Trinity developed over centuries. Here are the questions early Christians wrestled with and how they answered them.',
    },
    'communion': {
        cluster: 'Eucharist',
        title: "The Lord's Supper",
        intro: 'What happens at communion? Christians have understood this sacred meal in different ways throughout history.',
    },
};

// Convert technical claim labels to friendly questions
function toFriendlyQuestion(label: string, cluster: string): string {
    // Make claims into questions
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

    // Try to find a match
    for (const [key, question] of Object.entries(questions)) {
        if (label.toLowerCase().includes(key.toLowerCase())) {
            return question;
        }
    }

    // Fallback: just add question mark
    return label.endsWith('?') ? label : `What about "${label}"?`;
}

export function generateStaticParams() {
    return [
        { slug: 'baptism' },
        { slug: 'trinity' },
        { slug: 'communion' },
    ];
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const topic = TOPIC_MAP[slug];

    if (!topic) return notFound();

    const allClaims = getAllClaims();
    const claims = allClaims.filter(c => c.cluster === topic.cluster);

    return (
        <div className="min-h-screen">
            {/* Simple header */}
            <header className="border-b border-[#e8e4dc] bg-white/50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[#6b6358] hover:text-[#3d3529] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Topic intro */}
                <div className="mb-10">
                    <h1 className="font-serif text-3xl sm:text-4xl text-[#3d3529] mb-4">
                        {topic.title}
                    </h1>
                    <p className="text-lg text-[#6b6358] leading-relaxed">
                        {topic.intro}
                    </p>
                </div>

                {/* Questions list */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-4">
                        Questions to Explore
                    </h2>

                    {claims.map((claim) => (
                        <Link
                            key={claim.id}
                            href={`/answer/${claim.id}`}
                            className="block bg-white rounded-xl p-5 shadow-sm border border-[#e8e4dc] hover:shadow-md hover:border-[#d4cfc4] transition-all"
                        >
                            <h3 className="font-serif text-xl text-[#3d3529] mb-1">
                                {toFriendlyQuestion(claim.short_label, topic.cluster)}
                            </h3>
                            <p className="text-[#6b6358] text-sm">
                                See what early Christians taught →
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
