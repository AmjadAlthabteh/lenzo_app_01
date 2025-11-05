import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">About Lenso</h1>
        <p className="text-gray-200 mb-6">
          Lenso is a community for sharing authentic moments so others can feel
          like they were there. We’re building simple tools that help you
          capture, enhance, and share real experiences—responsibly and safely.
        </p>
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Our Vision</h2>
          <p className="text-gray-200">
            Empower people to see the world through each other’s eyes while
            keeping creator control, community safety, and performance at the
            core. AI helps when it adds value, never getting in the way of the
            human story.
          </p>
        </div>
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Plans</h2>
          <ul className="list-disc pl-6 text-gray-200 space-y-1">
            <li>Richer posts: multiple media, light editing</li>
            <li>Better discovery: tags, search, curated sets</li>
            <li>Social basics: comments, reactions, profiles</li>
            <li>AI assists: summaries and hashtags with controls</li>
            <li>Safety: smart moderation and reporting</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/about-and-plans.txt"
            className="inline-flex items-center rounded-full bg-white text-purple-700 font-semibold px-5 py-3 hover:shadow-lg transition"
          >
            Read Full Vision (TXT)
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center rounded-full glass px-5 py-3 text-white border border-white/20 hover:bg-white/10 transition"
          >
            Explore the Feed
          </Link>
        </div>
      </div>
    </div>
  )
}

