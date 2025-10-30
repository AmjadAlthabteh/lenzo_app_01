"use client"
import { signIn, signOut } from 'next-auth/react'

export function SignInOut({ userName }: { userName: string | null }) {
  if (userName) {
    return (
      <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-900">
        Sign out ({userName})
      </button>
    )
  }
  return (
    <button
      onClick={() => signIn('credentials', { name: 'Guest', callbackUrl: '/' })}
      className="text-gray-600 hover:text-gray-900"
    >
      Sign in
    </button>
  )
}

