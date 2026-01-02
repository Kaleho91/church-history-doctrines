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

    // Get a color based on the topic
    const topicColor = slug === 'baptism' ? '#4a90a4' : slug === 'trinity' ? '#7c6a9a' : '#8b7355';

    return (
        <div className="min-h-screen">
            {/* Simple header */}
            <header className="border-b border-[#e8e4dc] bg-white/50 backdrop-blur-sm">
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
                {/* Topic intro - animated */}
                <div className="mb-12 animate-fade-in">
                    {/* Decorative accent */}
                    <div className="flex items-center gap-2 mb-4" style={{ color: topicColor }}>
                        <span className="w-6 h-[1px]" style={{ backgroundColor: topicColor, opacity: 0.5 }} />
                        <span className="text-sm">✦</span>
                        <span className="w-6 h-[1px]" style={{ backgroundColor: topicColor, opacity: 0.5 }} />
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl text-[#3d3529] mb-4">
                        {topic.title}
                    </h1>
                    <p className="text-xl text-[#6b6358] leading-relaxed">
                        {topic.intro}
                    </p>
                </div>

                {/* Questions list - staggered animation */}
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-5 animate-fade-in">
                        Questions to Explore
                    </h2>

                    {claims.map((claim, index) => (
                        <Link
                            key={claim.id}
                            href={`/answer/${claim.id}`}
                            className="group relative block animate-fade-in-up"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            {/* Decorative accent bar */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1 rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                                style={{
                                    background: `linear-gradient(to bottom, ${topicColor}, ${topicColor}40)`
                                }}
                            />

                            <div className="ml-0 group-hover:ml-4 bg-gradient-to-br from-white to-[#faf8f5] rounded-xl p-6 shadow-sm border border-[#e8e4dc] hover:shadow-md hover:border-[#d4cfc4] transition-all duration-300">
                                <h3 className="font-serif text-2xl text-[#3d3529] mb-2 group-hover:text-[#2a2520] transition-colors">
                                    {toFriendlyQuestion(claim.short_label, topic.cluster)}
                                </h3>
                                <div className="flex items-center gap-2 text-base text-[#8b7355] font-medium">
                                    <span>See what early Christians taught</span>
                                    <svg
                                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
