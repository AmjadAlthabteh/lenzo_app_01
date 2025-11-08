import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative container-page py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto fade-in">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight text-white">
            AI-Powered
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600">
              Anonymous Moments
            </span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
            Share your photos and videos anonymously.
            Let AI organize, tag, and moderate your moments automatically.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/upload"
              className="inline-flex items-center rounded-full bg-white px-10 py-5 text-purple-600 font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Share a Moment
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center rounded-full glass px-10 py-5 text-white font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              View Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-page pb-20">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple. Smart. Safe.
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Everything you need to share moments without the complexity
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <Feature
            icon="🤖"
            title="AI Organization"
            desc="Automatic summaries and hashtags for every upload. No manual tagging needed."
          />
          <Feature
            icon="🔒"
            title="100% Anonymous"
            desc="Share freely without revealing your identity. Your moments, your privacy."
          />
          <Feature
            icon="🛡️"
            title="Auto Moderation"
            desc="AI-powered content filtering keeps the community safe and welcoming."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container-page pb-20">
        <div className="glass rounded-3xl p-8 sm:p-12 fade-in max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Step
              number="1"
              title="Upload"
              desc="Add your photo or video with a title and description"
            />
            <Step
              number="2"
              title="AI Processing"
              desc="Our AI creates summaries, tags, and moderates content automatically"
            />
            <Step
              number="3"
              title="Share"
              desc="Your moment appears in the feed instantly and anonymously"
            />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Get Started
              <svg className="ml-2 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center glass rounded-2xl p-8 hover:scale-105 transition-all duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-200 leading-relaxed">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-200">{desc}</p>
    </div>
  )
}

