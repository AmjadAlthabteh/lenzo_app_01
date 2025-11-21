"use client"
import Link from 'next/link'
import { SignInOut } from '@/components/SignInOut'

export function Navbar() {
  return (
    <header className="border-b border-white/20 backdrop-blur-md bg-white/10">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">
          Lenso
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/feed" className="text-white/90 hover:text-white font-semibold transition-colors text-sm">
            Feed
          </Link>
          <Link href="/upload" className="text-white/90 hover:text-white font-semibold transition-colors text-sm">
            Upload
          </Link>
          <Link href="/about" className="text-white/90 hover:text-white font-semibold transition-colors text-sm">
            About
          </Link>
          <SignInOut />
        </nav>
      </div>
    </header>
  )
}
