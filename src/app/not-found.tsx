import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 text-center">
      <div>
        <p className="text-sm uppercase tracking-wider text-zinc-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-400">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <Link href="/" className="btn-neo mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
          Go Home
        </Link>
      </div>
    </div>
  );
}
