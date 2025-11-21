"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPasswordErrors([])

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          setPasswordErrors(Array.isArray(data.details) ? data.details : [data.details])
        }
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
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
              Create Account
            </h1>
            <p className="text-gray-200">
              Join Lenso and start sharing moments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
            {error && (
              <div className="glass rounded-xl p-4 border-2 border-red-400/50 bg-red-500/10">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {passwordErrors.length > 0 && (
              <div className="glass rounded-xl p-4 border-2 border-yellow-400/50 bg-yellow-500/10">
                <p className="text-sm font-semibold text-yellow-200 mb-2">Password requirements:</p>
                <ul className="text-xs text-yellow-200 space-y-1">
                  {passwordErrors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-cyan-400 focus:outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-purple-400 focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-white font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center">
              <p className="text-gray-200">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
