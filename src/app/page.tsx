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
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl text-[#5c5346]">
            Church History Explorer
          </h1>
          <span className="text-xs text-[#9a9285] bg-[#f5f2ed] px-2 py-1 rounded-full">
            30+ Sources
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero section - animated entrance */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Decorative element */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <span className="w-8 h-[1px] bg-[#d4af37]/50" />
              <span className="text-2xl decorative-star">✦</span>
              <span className="w-8 h-[1px] bg-[#d4af37]/50" />
            </div>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-[#3d3529] mb-4 leading-tight text-reveal">
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

        {/* Topic cards - Grid Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide mb-6 text-center animate-fade-in">
            Choose a Topic to Explore
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOPICS.map((topic, index) => (
              <Link
                key={topic.slug}
                href={`/topic/${topic.slug}`}
                className="group relative block animate-fade-in-up h-full"
                style={{ animationDelay: `${index * 100 + 150}ms` }}
              >
                {/* Card Background & Border */}
                <div className="absolute inset-0 bg-[#fffaf5] rounded-xl border border-[#e8e4dc] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out group-hover:shadow-[0_12px_24px_rgba(139,115,85,0.1)] group-hover:border-[#d4cfc4] group-hover:-translate-y-1.5" />

                {/* Content Container */}
                <div className="relative p-8 flex flex-col items-center text-center h-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
                  {/* Icon with elegant styling */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner bg-white"
                    style={{
                      color: topic.color,
                      border: `1px solid ${topic.color}20`,
                      boxShadow: `inset 0 2px 4px ${topic.color}05`
                    }}
                  >
                    {topic.emoji}
                  </div>

                  {/* Title & Sources */}
                  <h3 className="font-serif text-2xl text-[#3d3529] mb-2 group-hover:text-[#8b7355] transition-colors duration-300">
                    {topic.title}
                  </h3>

                  <span className="text-[10px] uppercase tracking-widest text-[#9a9285] mb-4 font-medium border-b border-[#e8e4dc] pb-4 w-12 group-hover:border-[#8b7355]/30 transition-colors">
                    {topic.sources} Sources
                  </span>

                  {/* Subtitle */}
                  <p className="text-[#6b6358] text-sm leading-relaxed mb-8 text-opacity-90">
                    {topic.subtitle}
                  </p>

                  {/* Call to Action - anchored at bottom */}
                  <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a9285] group-hover:text-[#8b7355] transition-colors">
                    Begin Trace
                    <svg
                      className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scripture Quick Access */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#9a9285] uppercase tracking-wide">
              Explore by Scripture
            </h3>
            <Link
              href="/scripture"
              className="text-sm text-[#8b7355] hover:text-[#6b5339] font-medium transition-colors ink-underline"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { ref: 'John 3:5', slug: 'john-3-5', claims: 1 },
              { ref: 'John 1:1', slug: 'john-1-1', claims: 1 },
              { ref: 'Matthew 28:19', slug: 'matthew-28-19', claims: 1 },
              { ref: 'John 6:51-56', slug: 'john-6-51-56', claims: 1 },
              { ref: 'Acts 2:38', slug: 'acts-2-38', claims: 1 },
              { ref: '1 Peter 3:21', slug: '1-peter-3-21', claims: 1 },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/scripture/${item.slug}`}
                className="group bg-white rounded-lg p-3 border border-[#e8e4dc] hover:border-[#d4cfc4] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <div>
                    <span className="text-sm font-medium text-[#3d3529] group-hover:text-[#8b7355] transition-colors block">
                      {item.ref}
                    </span>
                    <span className="text-xs text-[#9a9285]">
                      {item.claims} {item.claims === 1 ? 'claim' : 'claims'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust statement - animated */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
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
