"use client"
import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [show2FA, setShow2FA] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Please log in.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        totpToken: show2FA ? totpToken : undefined,
      })

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setShow2FA(true)
          setError('Please enter your 2FA token')
        } else {
          setError(result.error)
        }
      } else if (result?.ok) {
        router.push('/feed')
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="container-page">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 fade-in">
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-200">
              Sign in to your Lenso account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
            {successMessage && (
              <div className="glass rounded-xl p-4 border-2 border-green-400/50 bg-green-500/10">
                <p className="text-sm text-green-200">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="glass rounded-xl p-4 border-2 border-red-400/50 bg-red-500/10">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                placeholder="your@email.com"
                required
                disabled={show2FA}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={show2FA}
              />
            </div>

            {show2FA && (
              <div className="glass rounded-xl p-6 border-2 border-cyan-400/50">
                <label className="block text-sm font-semibold text-white mb-2">
                  2FA Token
                </label>
                <input
                  type="text"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-cyan-400 focus:outline-none transition-all text-center text-xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-300 mt-2 text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-white font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : show2FA ? 'Verify & Sign In' : 'Sign In'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-gray-200">
                Don't have an account?{' '}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
