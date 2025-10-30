import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Lenso — see the world through someone else’s eyes
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Share the experiences you witness so others can feel like they were
            there. Post moments, explore the feed, and let AI craft concise
            summaries and tags.
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
            Lenso is a place for authentic, first-person experiences — short
            videos, photos, and the stories behind them.
          </p>
        </div>
      </div>
    </section>
  );
}
