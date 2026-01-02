import Link from 'next/link';

const TOPICS = [
  {
    slug: 'baptism',
    emoji: '💧',
    title: 'Baptism',
    subtitle: 'What does baptism mean? Is it necessary for salvation?',
    sources: 9,
    color: '#4a90a4',
  },
  {
    slug: 'trinity',
    emoji: '✝️',
    title: 'The Trinity',
    subtitle: 'How did the early church understand Father, Son, and Holy Spirit?',
    sources: 8,
    color: '#7c6a9a',
  },
  {
    slug: 'communion',
    emoji: '🍞',
    title: "The Lord's Supper",
    subtitle: 'What happens at communion? How is Christ present?',
    sources: 7,
    color: '#8b7355',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header with subtle accent */}
      <header className="border-b border-[#e8e4dc] bg-[#faf8f5]/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl text-[#5c5346]">
            Church History Explorer
          </h1>
          <span className="text-xs text-[#9a9285] bg-[#f5f2ed] px-2 py-1 rounded-full">
            30+ Sources
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Hero section - more engaging */}
        <div className="text-center mb-16">
          {/* Decorative element */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <span className="w-8 h-[1px] bg-[#d4af37]/50" />
              <span className="text-2xl">✦</span>
              <span className="w-8 h-[1px] bg-[#d4af37]/50" />
            </div>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-[#3d3529] mb-4 leading-tight">
            What did the earliest <br className="hidden sm:block" />
            Christians believe?
          </h2>

          <p className="text-xl text-[#6b6358] leading-relaxed mb-6 max-w-lg mx-auto">
            Explore church history through primary sources—from Scripture to the Reformation.
          </p>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 text-sm text-[#9a9285]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6b8e23]" />
              6 Historical Eras
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8b7355]" />
              30+ Primary Sources
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7c6a9a]" />
              Original Texts
            </span>
          </div>
        </div>

        {/* Topic cards - more visually interesting */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-4 text-center">
            Choose a Topic to Explore
          </h3>

          {TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topic/${topic.slug}`}
              className="group block bg-white rounded-2xl p-6 shadow-sm border border-[#e8e4dc] hover:shadow-lg hover:border-[#d4cfc4] transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-5">
                {/* Icon with colored background */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${topic.color}15` }}
                >
                  {topic.emoji}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-2xl text-[#3d3529]">
                      {topic.title}
                    </h3>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: topic.color,
                        backgroundColor: `${topic.color}15`
                      }}
                    >
                      {topic.sources} sources
                    </span>
                  </div>
                  <p className="text-[#6b6358] text-lg">
                    {topic.subtitle}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="text-[#d4cfc4] group-hover:text-[#8b7355] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Trust statement */}
        <div className="mt-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-[#d4af37]/60">
              <span className="w-12 h-[1px] bg-current" />
              <span className="text-sm">✦</span>
              <span className="w-12 h-[1px] bg-current" />
            </div>
          </div>
          <p className="text-[#9a9285] text-base max-w-md mx-auto leading-relaxed">
            All quotes come from early church fathers and historical documents.
            <span className="block mt-1 text-[#8b7355] font-medium">
              See what they actually wrote.
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
