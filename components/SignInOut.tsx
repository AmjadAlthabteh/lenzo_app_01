"use client"
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export function SignInOut() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const user = session?.user as any

  if (session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors font-semibold px-4 py-2.5 rounded-lg hover:bg-white/10"
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold border-2 border-white/30">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span>{user.name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-56 card rounded-xl shadow-xl z-50 py-2">
              <Link
                href="/dashboard"
                className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/feed"
                className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/upload"
                className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Upload
              </Link>
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="block px-5 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <hr className="my-2 border-gray-200" />
              <button
                onClick={() => {
                  setMenuOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="px-5 py-2.5 text-white hover:text-blue-100 font-semibold transition-colors rounded-lg hover:bg-white/10"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="btn btn-primary"
      >
        Get Started
      </Link>
    </div>
  )
}
