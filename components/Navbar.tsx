import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignInOut } from '@/components/SignInOut'

export async function Navbar() {
  const session = await auth()
  return (
    <header className="border-b">
      <div className="container-page flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">Lenso</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/feed" className="text-gray-600 hover:text-gray-900">Feed</Link>
          <Link href="/upload" className="text-gray-600 hover:text-gray-900">Upload</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <SignInOut userName={session?.user?.name || null} />
        </nav>
      </div>
    </header>
  )
}
