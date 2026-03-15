'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SERVICE_ICONS, SERVICE_THEMES } from '@/lib/serviceIcons'
import type { Service } from '@/types/database'

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  const [confirm,  setConfirm]  = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
    setServices(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('services').delete().eq('id', id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  const toggleActive = async (svc: Service) => {
    setToggling(svc.id)
    const supabase = createClient()
    await supabase.from('services').update({ is_active: !svc.is_active }).eq('id', svc.id)
    setToggling(null)
    load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            {services.filter(s => s.is_active).length} active · {services.length} total
          </p>
        </div>
        <Link href="/admin/services/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Service
        </Link>
      </div>

      {/* Info banner */}
      <div className="mb-6 px-4 py-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-cyan-300/80 text-xs">
        Services displayed here appear in the <strong className="text-cyan-300">"Services Built for The Next Era"</strong> section on the website, ordered by Display Order. Inactive services are hidden from visitors.
      </div>

      {services.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm mb-4">No services yet.</p>
          <Link href="/admin/services/new" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Add your first service →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((svc) => {
            const theme = SERVICE_THEMES[svc.color_theme] ?? SERVICE_THEMES.cyan
            const icon  = SERVICE_ICONS[svc.icon_name]   ?? SERVICE_ICONS.sparkles
            return (
              <div
                key={svc.id}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all
                            bg-white/[0.02] hover:bg-white/[0.04]
                            ${svc.is_active ? 'border-white/6' : 'border-white/[0.03] opacity-60'}`}
              >
                {/* Icon preview */}
                <div
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-gray-300"
                  style={{ background: `${theme.accent}18`, border: `1px solid ${theme.accent}30` }}
                >
                  <span style={{ color: theme.accent }}>{icon}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{svc.title}</span>
                    {!svc.is_active && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest bg-white/5 text-gray-600 border border-white/8">
                        hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{svc.tagline}</p>
                </div>

                {/* Order badge */}
                <span className="shrink-0 hidden sm:flex w-7 h-7 rounded-lg bg-white/5 text-gray-600 text-xs items-center justify-center">
                  {svc.display_order}
                </span>

                {/* Theme dot */}
                <span
                  className="w-3 h-3 rounded-full shrink-0 hidden md:block"
                  style={{ background: theme.accent }}
                  title={theme.name}
                />

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle active */}
                  <button
                    onClick={() => toggleActive(svc)}
                    disabled={toggling === svc.id}
                    title={svc.is_active ? 'Hide from website' : 'Show on website'}
                    className={`p-1.5 rounded-lg border transition-all text-xs ${
                      svc.is_active
                        ? 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-white/8 text-gray-600 hover:text-gray-400 hover:border-white/15'
                    }`}
                  >
                    {toggling === svc.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : svc.is_active ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    )}
                  </button>

                  <Link href={`/admin/services/${svc.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs text-cyan-400/70 hover:text-cyan-400 border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                    Edit
                  </Link>

                  {confirm === svc.id ? (
                    <span className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(svc.id)}
                        disabled={deleting === svc.id}
                        className="px-2.5 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/25 hover:bg-red-500/10 transition-all">
                        {deleting === svc.id ? '…' : 'Confirm'}
                      </button>
                      <button onClick={() => setConfirm(null)}
                        className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-1">
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirm(svc.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-red-400/50 hover:text-red-400 border border-white/4 hover:border-red-500/20 transition-all">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
