'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  SERVICE_ICONS,
  SERVICE_ICON_LABELS,
  SERVICE_ICON_NAMES,
  SERVICE_THEMES,
  SERVICE_THEME_NAMES,
} from '@/lib/serviceIcons'
import type { Service } from '@/types/database'

interface Props {
  initialData?: Service
  onSuccess?:   () => void
}

export default function ServiceForm({ initialData, onSuccess }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [title,    setTitle]    = useState(initialData?.title       ?? '')
  const [tagline,  setTagline]  = useState(initialData?.tagline     ?? '')
  const [desc,     setDesc]     = useState(initialData?.description ?? '')
  const [iconName, setIconName] = useState(initialData?.icon_name   ?? 'sparkles')
  const [theme,    setTheme]    = useState(initialData?.color_theme ?? 'cyan')
  const [order,    setOrder]    = useState(String(initialData?.display_order ?? 0))
  const [active,   setActive]   = useState(initialData?.is_active   ?? true)

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const selectedTheme = SERVICE_THEMES[theme] ?? SERVICE_THEMES.cyan

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError('Title is required.'); return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      title:         title.trim(),
      tagline:       tagline.trim(),
      description:   desc.trim(),
      icon_name:     iconName,
      color_theme:   theme,
      display_order: parseInt(order) || 0,
      is_active:     active,
    }

    try {
      if (isEdit && initialData) {
        const { error: dbErr } = await supabase
          .from('services')
          .update(payload)
          .eq('id', initialData.id)
        if (dbErr) throw new Error(dbErr.message)
      } else {
        const { error: dbErr } = await supabase
          .from('services')
          .insert(payload)
        if (dbErr) throw new Error(dbErr.message)
      }

      onSuccess?.()
      router.push('/admin/services')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Title + Tagline ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Title *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. AI Film Production" className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Tagline</label>
          <input type="text" value={tagline} onChange={e => setTagline(e.target.value)}
            placeholder="e.g. Stories at machine speed" className="admin-input" />
        </div>
      </div>

      {/* ── Description ── */}
      <div>
        <label className="admin-label">Description</label>
        <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Short description shown on the service card (3 lines max)…"
          className="admin-input resize-none" />
      </div>

      {/* ── Icon picker ── */}
      <div>
        <label className="admin-label">Icon</label>
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mt-2">
          {SERVICE_ICON_NAMES.map(name => (
            <button
              key={name}
              type="button"
              title={SERVICE_ICON_LABELS[name]}
              onClick={() => setIconName(name)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                iconName === name
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400'
                  : 'border-white/6 text-gray-500 hover:text-gray-300 hover:border-white/15'
              }`}
            >
              {SERVICE_ICONS[name]}
              <span className="text-[9px] leading-none text-center">
                {SERVICE_ICON_LABELS[name]?.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Colour theme picker ── */}
      <div>
        <label className="admin-label">Colour Theme</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {SERVICE_THEME_NAMES.map(key => {
            const t = SERVICE_THEMES[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  theme === key
                    ? 'text-white'
                    : 'border-white/8 text-gray-500 hover:text-gray-300'
                }`}
                style={theme === key
                  ? { borderColor: `${t.accent}60`, color: t.accent, background: `${t.accent}18` }
                  : {}}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: t.accent }} />
                {t.name}
              </button>
            )
          })}
        </div>

        {/* Live preview card */}
        <div className={`mt-4 rounded-2xl p-5 border border-white/6 bg-gradient-to-br ${selectedTheme.color} max-w-xs`}>
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-300 mb-3">
            {SERVICE_ICONS[iconName]}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: selectedTheme.accent }}>
            {tagline || 'Tagline preview'}
          </p>
          <h3 className="text-sm font-bold text-white">{title || 'Service Title'}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{desc || 'Description preview…'}</p>
        </div>
      </div>

      {/* ── Order + Active ── */}
      <div className="flex flex-wrap items-end gap-5">
        <div className="w-32">
          <label className="admin-label">Display Order</label>
          <input type="number" value={order} onChange={e => setOrder(e.target.value)}
            min={0} className="admin-input" />
        </div>
        <div className="pb-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-400 hover:text-gray-200 transition-colors">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)}
              className="w-4 h-4 rounded accent-cyan-400" />
            Visible on website
          </label>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-xl font-semibold text-sm text-white relative overflow-hidden
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500" />
          <span className="relative z-10 flex items-center gap-2">
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Service'}
          </span>
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 border border-white/8 hover:border-white/20 transition-all">
          Cancel
        </button>
      </div>

      <style jsx global>{`
        .admin-label { display:block; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.12em; color:#6b7280; margin-bottom:0.4rem; }
        .admin-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#fff; border-radius:0.75rem; padding:0.65rem 0.875rem; font-size:0.875rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .admin-input:focus { border-color:rgba(34,211,238,0.45); box-shadow:0 0 0 3px rgba(34,211,238,0.08); }
        .admin-input::placeholder { color:rgba(255,255,255,0.22); }
        .admin-input option { background:#0d0d1a; }
      `}</style>
    </form>
  )
}
