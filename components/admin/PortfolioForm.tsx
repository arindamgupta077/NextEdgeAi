'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import type { PortfolioProject } from '@/types/database'

/* ─── Constants ──────────────────────────────────────────────────── */
const CATEGORIES = [
  'AI Feature Film', 'Brand Campaign', 'Web Series', 'Digital Commercial',
  'Virtual Production', 'IP Development', 'Micro-Drama', 'Documentary', 'Other',
]

const THEMES = [
  { id: 'cyan',    name: 'Cyan / Blue',     gradient: 'from-cyan-900/80 via-blue-900/60 to-[#0a0a18]',    accent: '#22d3ee' },
  { id: 'indigo',  name: 'Indigo / Purple', gradient: 'from-indigo-900/80 via-purple-900/60 to-[#0a0a18]', accent: '#818cf8' },
  { id: 'amber',   name: 'Amber / Gold',    gradient: 'from-amber-900/80 via-orange-900/60 to-[#0a0a18]',  accent: '#f59e0b' },
  { id: 'rose',    name: 'Rose / Pink',     gradient: 'from-rose-900/80 via-pink-900/60 to-[#0a0a18]',     accent: '#f472b6' },
  { id: 'emerald', name: 'Emerald / Teal',  gradient: 'from-emerald-900/80 via-teal-900/60 to-[#0a0a18]',  accent: '#34d399' },
  { id: 'violet',  name: 'Violet / Blue',   gradient: 'from-violet-900/80 via-blue-900/60 to-[#0a0a18]',   accent: '#a78bfa' },
]

/* ─── Helpers ────────────────────────────────────────────────────── */
function findThemeId(gradient: string) {
  return THEMES.find(t => t.gradient === gradient)?.id ?? 'cyan'
}

/* ─── Component ──────────────────────────────────────────────────── */
interface Props {
  initialData?: PortfolioProject
  onSuccess?: () => void
}

export default function PortfolioForm({ initialData, onSuccess }: Props) {
  const router    = useRouter()
  const isEdit    = !!initialData
  const fileRef   = useRef<HTMLInputElement>(null)

  // Form state
  const [title,    setTitle]    = useState(initialData?.title    ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'AI Feature Film')
  const [year,     setYear]     = useState(initialData?.year     ?? String(new Date().getFullYear()))
  const [desc,     setDesc]     = useState(initialData?.description ?? '')
  const [tagsStr,  setTagsStr]  = useState((initialData?.tags ?? []).join(', '))
  const [themeId,  setThemeId]  = useState(findThemeId(initialData?.gradient ?? ''))
  const [ytUrl,    setYtUrl]    = useState(initialData?.youtube_url ?? '')
  const [order,    setOrder]    = useState(String(initialData?.display_order ?? 0))
  const [featured, setFeatured] = useState(initialData?.is_featured ?? false)

  // Image
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.thumbnail_url ?? null)
  const [removingImg,  setRemovingImg]  = useState(false)

  // Derived YouTube ID for preview
  const ytId    = extractYouTubeId(ytUrl)
  const ytThumb = ytId ? getYouTubeThumbnail(ytId) : null
  const previewSrc = imagePreview ?? (ytThumb ?? null)

  // UI state
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  // Revoke blob URL on cleanup
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setRemovingImg(false)
  }, [imagePreview])

  const removeImage = () => {
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setRemovingImg(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError('Title is required.'); return }

    setSaving(true)
    const supabase = createClient()
    const theme    = THEMES.find(t => t.id === themeId) ?? THEMES[0]

    try {
      let thumbnailUrl: string | null = removingImg ? null : (initialData?.thumbnail_url ?? null)

      // Upload new image if selected
      if (imageFile) {
        const ext      = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('portfolio-thumbnails')
          .upload(fileName, imageFile, { upsert: false })

        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`)

        // Delete old thumbnail if replacing
        if (initialData?.thumbnail_url && isEdit) {
          const old = initialData.thumbnail_url.split('/portfolio-thumbnails/').pop()
          if (old) await supabase.storage.from('portfolio-thumbnails').remove([old])
        }

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-thumbnails')
          .getPublicUrl(uploadData.path)
        thumbnailUrl = publicUrl
      }

      // Delete old thumbnail if admin opted to remove it
      if (removingImg && initialData?.thumbnail_url) {
        const old = initialData.thumbnail_url.split('/portfolio-thumbnails/').pop()
        if (old) await supabase.storage.from('portfolio-thumbnails').remove([old])
      }

      const payload = {
        title:         title.trim(),
        category,
        year:          year.trim() || String(new Date().getFullYear()),
        description:   desc.trim(),
        tags:          tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        gradient:      theme.gradient,
        accent:        theme.accent,
        thumbnail_url: thumbnailUrl,
        youtube_url:   ytUrl.trim() || null,
        youtube_id:    ytId ?? null,
        display_order: parseInt(order) || 0,
        is_featured:   featured,
      }

      if (isEdit && initialData) {
        const { error: dbErr } = await supabase
          .from('portfolio_projects')
          .update(payload)
          .eq('id', initialData.id)
        if (dbErr) throw new Error(dbErr.message)
      } else {
        const { error: dbErr } = await supabase
          .from('portfolio_projects')
          .insert(payload)
        if (dbErr) throw new Error(dbErr.message)
      }

      onSuccess?.()
      router.push('/admin/portfolio')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSaving(false)
    }
  }

  /* ─── Render ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Row 1: Title + Category ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="admin-label">Title *</label>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Nexus"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="admin-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Row 2: Year + Order + Featured ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <div>
          <label className="admin-label">Year</label>
          <input type="text" value={year} onChange={e => setYear(e.target.value)}
            placeholder="2025" className="admin-input" maxLength={4} />
        </div>
        <div>
          <label className="admin-label">Display Order</label>
          <input type="number" value={order} onChange={e => setOrder(e.target.value)}
            min={0} className="admin-input" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-400 hover:text-gray-200 transition-colors">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-cyan-400" />
            Featured Project
          </label>
        </div>
      </div>

      {/* ── Description ── */}
      <div>
        <label className="admin-label">Description</label>
        <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Brief description shown on hover..."
          className="admin-input resize-none" />
      </div>

      {/* ── Tags ── */}
      <div>
        <label className="admin-label">Tags <span className="text-gray-600">(comma-separated)</span></label>
        <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)}
          placeholder="e.g. Sci-Fi, Feature, 2hr 15min"
          className="admin-input" />
      </div>

      {/* ── Color Theme ── */}
      <div>
        <label className="admin-label">Color Theme</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {THEMES.map(t => (
            <button
              key={t.id} type="button"
              onClick={() => setThemeId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                themeId === t.id
                  ? 'border-white/30 text-white bg-white/8'
                  : 'border-white/8 text-gray-500 hover:text-gray-300'
              }`}
              style={themeId === t.id ? { borderColor: `${t.accent}60`, color: t.accent, background: `${t.accent}18` } : {}}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: t.accent }} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── YouTube URL ── */}
      <div>
        <label className="admin-label">YouTube URL or Video ID</label>
        <input type="text" value={ytUrl} onChange={e => setYtUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... or video ID"
          className="admin-input" />
        {ytUrl && !ytId && (
          <p className="mt-1 text-xs text-amber-400">⚠ Could not extract a valid YouTube video ID</p>
        )}
        {ytId && (
          <p className="mt-1 text-xs text-emerald-400">✓ Video ID: <span className="font-mono">{ytId}</span></p>
        )}
      </div>

      {/* ── Thumbnail Upload ── */}
      <div>
        <label className="admin-label">Thumbnail Image
          <span className="text-gray-600 ml-1">(optional — YouTube thumbnail used if omitted)</span>
        </label>

        {previewSrc && (
          <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-white/10 mb-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button" onClick={removeImage}
                className="px-3 py-1.5 bg-red-500/80 text-white text-xs rounded-lg"
              >
                Remove
              </button>
            </div>
            {!imagePreview?.startsWith('blob:') && ytThumb && imagePreview === ytThumb && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] text-gray-300">
                YouTube thumb
              </span>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={onFileChange}
          className="hidden"
          id="thumbnail-upload"
        />
        <label
          htmlFor="thumbnail-upload"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-400
                     hover:text-white hover:border-white/25 cursor-pointer transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {imagePreview ? 'Replace Image' : 'Upload Thumbnail'}
        </label>
        {imageFile && (
          <span className="ml-3 text-xs text-gray-500">{imageFile.name}</span>
        )}
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-xl font-semibold text-sm text-white relative overflow-hidden
                     disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500" />
          <span className="relative z-10 flex items-center gap-2">
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 border border-white/8 hover:border-white/20 transition-all"
        >
          Cancel
        </button>
      </div>

      {/* Common admin input styles */}
      <style jsx global>{`
        .admin-label  { display:block; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.12em; color:#6b7280; margin-bottom:0.4rem; }
        .admin-input  { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#fff; border-radius:0.75rem; padding:0.65rem 0.875rem; font-size:0.875rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .admin-input:focus { border-color:rgba(34,211,238,0.45); box-shadow:0 0 0 3px rgba(34,211,238,0.08); }
        .admin-input::placeholder { color:rgba(255,255,255,0.22); }
        .admin-input option { background:#0d0d1a; }
      `}</style>
    </form>
  )
}
