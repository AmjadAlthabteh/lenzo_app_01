import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignInOut } from '@/components/SignInOut'

export async function Navbar() {
  const session = await auth()
  return (
    <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white hover:text-cyan-300 transition">
          Lenso
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/feed" className="text-gray-200 hover:text-white font-medium transition">
            Feed
          </Link>
          <Link href="/upload" className="text-gray-200 hover:text-white font-medium transition">
            Upload
          </Link>
          <Link href="/about" className="text-gray-200 hover:text-white font-medium transition">
            About
          </Link>
          <SignInOut userName={session?.user?.name || null} />
        </nav>
      </div>
    </header>
  )
}
