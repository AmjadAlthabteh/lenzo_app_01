"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [totpToken, setTotpToken] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUser()
    }
  }, [status, router])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users/me')
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      console.error('Failed to fetch user', err)
    }
  }

  const handleSetup2FA = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setQrCode(data.qrCode)
      setBackupCodes(data.backupCodes)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totpToken }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess('2FA enabled successfully!')
      setQrCode(null)
      setBackupCodes(null)
      setTotpToken('')
      await fetchUser()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA?')) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess('2FA disabled successfully')
      setPassword('')
      await fetchUser()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-8 fade-in">
            Dashboard
          </h1>

          {error && (
            <div className="glass rounded-xl p-4 border-2 border-red-400/50 bg-red-500/10 mb-6">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="glass rounded-xl p-4 border-2 border-green-400/50 bg-green-500/10 mb-6">
              <p className="text-sm text-green-200">{success}</p>
            </div>
          )}

          <div className="grid gap-6">
            {/* Profile Card */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300">Name</label>
                  <p className="text-white font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-300">Email</label>
                  <p className="text-white font-semibold">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-300">Role</label>
                  <span className="inline-block px-3 py-1 rounded-full glass text-sm text-white font-medium border border-white/30">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-300">Member Since</label>
                  <p className="text-white font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 2FA Settings Card */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Two-Factor Authentication
              </h2>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-white font-semibold">
                    Status: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-gray-200 text-sm">
                  Two-factor authentication adds an extra layer of security to your account.
                </p>
              </div>

              {!user.twoFactorEnabled && !qrCode && (
                <button
                  onClick={handleSetup2FA}
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Enable 2FA'}
                </button>
              )}

              {qrCode && (
                <div className="space-y-6">
                  <div className="glass rounded-xl p-6 border-2 border-cyan-400/50">
                    <h3 className="text-white font-semibold mb-4">
                      Scan QR Code
                    </h3>
                    <div className="bg-white p-4 rounded-xl inline-block">
                      <Image
                        src={qrCode}
                        alt="2FA QR Code"
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className="text-sm text-gray-200 mt-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                  </div>

                  {backupCodes && backupCodes.length > 0 && (
                    <div className="glass rounded-xl p-6 border-2 border-yellow-400/50 bg-yellow-500/10">
                      <h3 className="text-white font-semibold mb-2">
                        Backup Codes
                      </h3>
                      <p className="text-sm text-yellow-200 mb-4">
                        Save these codes in a secure place. Each can be used once if you lose access to your authenticator.
                      </p>
                      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                        {backupCodes.map((code, i) => (
                          <div key={i} className="glass px-3 py-2 rounded text-white">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Verify Setup - Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      value={totpToken}
                      onChange={(e) => setTotpToken(e.target.value)}
                      className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-cyan-400 focus:outline-none transition-all text-center text-xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={handleEnable2FA}
                    disabled={loading || totpToken.length !== 6}
                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
                  </button>
                </div>
              )}

              {user.twoFactorEnabled && (
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4 border-2 border-green-400/50 bg-green-500/10">
                    <p className="text-sm text-green-200">
                      Your account is protected with two-factor authentication.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Enter password to disable 2FA
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl glass px-4 py-3 text-white placeholder-gray-300 border-2 border-white/20 focus:border-red-400 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={handleDisable2FA}
                    disabled={loading || !password}
                    className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              )}
            </div>

            {/* Admin Link */}
            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <div className="glass rounded-3xl p-6 border-2 border-purple-400/50">
                <h3 className="text-white font-semibold mb-2">Admin Access</h3>
                <p className="text-gray-200 text-sm mb-4">
                  You have administrative privileges
                </p>
                <a
                  href="/admin"
                  className="inline-block rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-bold hover:shadow-lg transition-all"
                >
                  Go to Admin Panel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
