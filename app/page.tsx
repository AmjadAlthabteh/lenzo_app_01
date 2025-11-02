import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <section className="container-page py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Lenso — see the world through someone else’s eyes
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Share the experiences you witness so others can feel like they were there.
              Post moments, explore the feed, and let AI craft concise summaries and tags.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/upload"
                className="inline-flex items-center rounded-md bg-brand px-5 py-3 text-white font-medium hover:bg-brand-dark"
              >
                Share an experience
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center rounded-md border border-gray-300 px-5 py-3 text-gray-800 hover:bg-gray-50"
              >
                Explore the feed
              </Link>
            </div>
          </div>
          <div className="relative rounded-xl border bg-white p-6 shadow-sm">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <span>Preview: your moments go here</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Lenso is a place for authentic, first-person experiences — short videos, photos, and the stories behind them.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="text-xl font-semibold">What’s inside</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature title="AI summaries + tags" desc="OpenAI-powered helper suggests a crisp summary and up to five hashtags for every post." />
          <Feature title="Moderation pipeline" desc="Content runs through an AI moderation check before publishing." />
          <Feature title="Real-time feed" desc="New posts stream into the feed via Server-Sent Events (SSE)." />
          <Feature title="Auth (Guest + GitHub)" desc="Sign in quickly as Guest or with GitHub using NextAuth + Prisma." />
          <Feature title="SQLite dev DB" desc="Prisma with a local SQLite database for simple, fast development." />
          <Feature title="S3 uploads (optional)" desc="Upload media to S3 with presigned URLs, or import by public URL." />
        </div>
      </section>

      <section className="container-page pb-20">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-3 list-decimal pl-5 text-gray-700">
          <li>Write a title and story. Optionally attach media or a link.</li>
          <li>Click “AI: summarize + tags” to get suggested copy.</li>
          <li>Publish. The AI Task Manager moderates and enriches your post.</li>
          <li>See it appear instantly in the community feed.</li>
        </ol>
        <div className="mt-8">
          <Link href="/upload" className="inline-flex items-center rounded-md bg-brand px-5 py-3 text-white font-medium hover:bg-brand-dark">
            Start creating
          </Link>
        </div>
      </section>
    </>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

