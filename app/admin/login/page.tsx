'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })

    if (authErr) {
      setError(authErr.message)
      setLoading(false)
    } else {
      router.replace('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1a3e 0%, #050508 60%)' }}>

      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" fill="white" fillOpacity=".9"/>
                <path d="M10 6L14 8.5V11.5L10 14L6 11.5V8.5L10 6Z" fill="white" fillOpacity=".4"/>
              </svg>
            </div>
            <span className="text-white font-bold tracking-wide">NextEdgeAI</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your site</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-7 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white
                           placeholder-white/20 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition"
                placeholder="admin@nextedgeai.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white
                           placeholder-white/20 outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-[#050508] relative overflow-hidden
                         disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-400" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                )}
                {loading ? 'Signing In…' : 'Sign In'}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Access restricted to authorised personnel only.
        </p>
      </div>
    </div>
  )
}
