'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
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
  const fileRef = useRef<HTMLInputElement>(null)

  const [title,    setTitle]    = useState(initialData?.title       ?? '')
  const [tagline,  setTagline]  = useState(initialData?.tagline     ?? '')
  const [desc,     setDesc]     = useState(initialData?.description ?? '')
  const [theme,    setTheme]    = useState(initialData?.color_theme ?? 'cyan')
  const [order,    setOrder]    = useState(String(initialData?.display_order ?? 0))
  const [active,   setActive]   = useState(initialData?.is_active   ?? true)

  // Image upload
  const [imageFile,    setImageFile]    = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url ?? null)
  const [removingImg,  setRemovingImg]  = useState(false)

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

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

    try {
      let imageUrl: string | null = removingImg ? null : (initialData?.image_url ?? null)

      // Upload new image if selected
      if (imageFile) {
        const ext      = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('service-images')
          .upload(fileName, imageFile, { upsert: false })

        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`)

        // Delete old image if replacing
        if (initialData?.image_url && isEdit) {
          const old = initialData.image_url.split('/service-images/').pop()
          if (old) await supabase.storage.from('service-images').remove([old])
        }

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(uploadData.path)
        imageUrl = publicUrl
      }

      // Delete old image if admin opted to remove it
      if (removingImg && initialData?.image_url) {
        const old = initialData.image_url.split('/service-images/').pop()
        if (old) await supabase.storage.from('service-images').remove([old])
      }

      const payload = {
        title:         title.trim(),
        tagline:       tagline.trim(),
        description:   desc.trim(),
        color_theme:   theme,
        image_url:     imageUrl,
        display_order: parseInt(order) || 0,
        is_active:     active,
      }
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

  const selectedTheme = SERVICE_THEMES[theme] ?? SERVICE_THEMES.cyan

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

      {/* ── Card Image ── */}
      <div>
        <label className="admin-label">Card Image</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={onFileChange}
          className="hidden"
          id="service-image-input"
        />

        {imagePreview ? (
          <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 group">
            <div className="relative aspect-video">
              <Image src={imagePreview} alt="Card image preview" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label
                htmlFor="service-image-input"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/80 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer transition-colors"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={removeImage}
                className="px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="service-image-input"
            className="flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-xl border border-dashed border-white/15 hover:border-cyan-400/40 bg-white/2 hover:bg-white/4 cursor-pointer transition-all"
          >
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-xs text-gray-500">Click to upload image</span>
            <span className="text-[10px] text-gray-600 mt-1">JPG, PNG, WebP — max 10 MB</span>
          </label>
        )}
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
        <div className={`mt-4 rounded-2xl overflow-hidden border border-white/6 bg-gradient-to-br ${selectedTheme.color} max-w-xs`}>
          {imagePreview && (
            <div className="relative w-full aspect-video">
              <Image src={imagePreview} alt="preview" fill className="object-cover" />
            </div>
          )}
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: selectedTheme.accent }}>
              {tagline || 'Tagline preview'}
            </p>
            <h3 className="text-sm font-bold text-white">{title || 'Service Title'}</h3>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{desc || 'Description preview…'}</p>
          </div>
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
