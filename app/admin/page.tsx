"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, router])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/users')

      if (res.status === 403) {
        router.push('/dashboard')
        return
      }

      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await res.json()
      setUsers(data.users)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setSuccess('Role updated successfully')
      await fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-16">
      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-8 fade-in">
            Admin Panel
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

          <div className="glass rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <div className="text-gray-200">
                Total Users: <span className="font-bold text-white">{users.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">2FA</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Posts</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-200 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          className="glass rounded-lg px-3 py-1 text-white text-sm border border-white/20 focus:border-cyan-400 focus:outline-none"
                          disabled={user.id === (session?.user as any)?.id}
                        >
                          <option value="USER">USER</option>
                          <option value="MODERATOR">MODERATOR</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            user.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        />
                      </td>
                      <td className="py-3 px-4 text-white">{user._count?.posts || 0}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.locked
                              ? 'bg-red-500/20 text-red-200 border border-red-400/50'
                              : 'bg-green-500/20 text-green-200 border border-green-400/50'
                          }`}
                        >
                          {user.locked ? 'Locked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-cyan-400">{users.length}</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">Admins</h3>
              <p className="text-4xl font-bold text-purple-400">
                {users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">2FA Enabled</h3>
              <p className="text-4xl font-bold text-green-400">
                {users.filter((u) => u.twoFactorEnabled).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
