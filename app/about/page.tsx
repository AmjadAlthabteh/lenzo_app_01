import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container-page py-12 sm:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6 text-center">About Lenso</h1>

        <div className="glass rounded-3xl p-8 sm:p-10 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
          <p className="text-gray-100 text-lg leading-relaxed mb-4">
            Lenso is an AI-powered platform for sharing photos and videos of life's moments—completely anonymously.
            Upload your content, and our AI automatically organizes, tags, and moderates it for you.
          </p>
          <p className="text-gray-100 text-lg leading-relaxed">
            No profiles. No followers. No pressure. Just authentic moments shared freely with the world.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-10 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">How AI Powers Everything</h2>
          <div className="space-y-4 text-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">🤖 Smart Summaries</h3>
              <p>AI reads your content and generates concise summaries automatically—no manual work needed.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">#️⃣ Auto Hashtags</h3>
              <p>Relevant hashtags are created instantly to help your moments get discovered.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">🛡️ Content Moderation</h3>
              <p>Every upload is automatically screened to keep the community safe and welcoming.</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 sm:p-10 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">What's Next</h2>
          <ul className="space-y-3 text-gray-100 text-lg">
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 text-xl">•</span>
              <span>Multiple media uploads per post</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 text-xl">•</span>
              <span>Enhanced discovery with search and curated collections</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 text-xl">•</span>
              <span>Community features like reactions and comments</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3 text-xl">•</span>
              <span>Advanced AI tools with user controls</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/upload"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            Share Your First Moment
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

