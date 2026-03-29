'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types/database'

const PRESET_COLORS = [
  '#22d3ee', '#f59e0b', '#818cf8', '#34d399', '#f472b6',
  '#60a5fa', '#a78bfa', '#6ee7b7', '#fb923c', '#38bdf8',
  '#c084fc', '#4ade80', '#fbbf24', '#f87171', '#a3e635',
]

export default function AdminClientsPage() {
  const [clients,      setClients]      = useState<Client[]>([])
  const [loading,      setLoading]      = useState(true)
  const [confirm,      setConfirm]      = useState<string | null>(null)
  const [deleting,     setDeleting]     = useState<string | null>(null)
  const [toggling,     setToggling]     = useState<string | null>(null)
  const [saving,       setSaving]       = useState(false)
  const [newName,      setNewName]      = useState('')
  const [newColor,     setNewColor]     = useState('#22d3ee')
  const [logoFile,     setLogoFile]     = useState<File | null>(null)
  const [logoPreview,  setLogoPreview]  = useState<string | null>(null)
  const [formError,    setFormError]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true })
    setClients(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) { setFormError('Brand name is required.'); return }
    setSaving(true)
    setFormError('')
    const supabase = createClient()
    const maxOrder = clients.reduce((m, c) => Math.max(m, c.display_order), -1)

    let logoUrl: string | null = null
    if (logoFile) {
      const ext      = logoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('client-logos')
        .upload(fileName, logoFile, { upsert: false })
      if (uploadErr) {
        setFormError(`Logo upload failed: ${uploadErr.message}`)
        setSaving(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage
        .from('client-logos')
        .getPublicUrl(uploadData.path)
      logoUrl = publicUrl
    }

    await supabase.from('clients').insert({
      name: name.toUpperCase(),
      color: newColor,
      logo_url: logoUrl,
      display_order: maxOrder + 1,
      is_active: true,
    })

    if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
    setNewName('')
    setNewColor('#22d3ee')
    setLogoFile(null)
    setLogoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setSaving(false)
    load()
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    // Remove logo from storage if present
    const client = clients.find(c => c.id === id)
    if (client?.logo_url) {
      const path = client.logo_url.split('/client-logos/').pop()
      if (path) await supabase.storage.from('client-logos').remove([path])
    }
    await supabase.from('clients').delete().eq('id', id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  const toggleActive = async (client: Client) => {
    setToggling(client.id)
    const supabase = createClient()
    await supabase.from('clients').update({ is_active: !client.is_active }).eq('id', client.id)
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
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-gray-500 text-sm mt-1">
          {clients.filter(c => c.is_active).length} active · {clients.length} total
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 px-4 py-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-cyan-300/80 text-xs">
        Brands added here appear in the{' '}
        <strong className="text-cyan-300">&ldquo;Trusted by Forward-Thinking Brands&rdquo;</strong>{' '}
        section on the website. Hidden brands are not visible to visitors.
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/6"
      >
        <h2 className="text-sm font-semibold text-white mb-4">Add New Brand</h2>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setFormError('') }}
            placeholder="Brand name (e.g. APEX MEDIA)"
            maxLength={40}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm
                       placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white shrink-0 transition-all
                       bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                       hover:border-cyan-400/50 disabled:opacity-50"
          >
            {saving ? 'Adding…' : '+ Add Brand'}
          </button>
        </div>

        {/* Color picker */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-gray-500 shrink-0">Highlight color:</span>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full transition-all ${
                  newColor === c ? 'ring-2 ring-white/60 scale-125' : 'opacity-50 hover:opacity-100 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Logo upload */}
        <div className="mt-4">
          <span className="text-xs text-gray-500 block mb-2">Brand logo <span className="text-gray-600">(optional — PNG/SVG with transparency works best)</span></span>
          <div className="flex items-center gap-3">
            {logoPreview ? (
              <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                <Image src={logoPreview} alt="Logo preview" fill className="object-contain p-1" />
              </div>
            ) : (
              <div className="w-16 h-10 rounded-lg bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-white/[0.05]
                           border border-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                {logoPreview ? 'Change logo' : 'Upload logo'}
              </button>
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    if (logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
                    setLogoFile(null)
                    setLogoPreview(null)
                    if (fileRef.current) fileRef.current.value = ''
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500
                             hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
                setLogoFile(file)
                setLogoPreview(URL.createObjectURL(file))
              }}
            />
          </div>
        </div>

        {/* Live preview */}
        {newName.trim() && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-500">Preview:</span>
            <div className="flex items-center justify-center h-10 px-5 rounded-xl bg-white/[0.04] border border-white/8">
              <span
                className="text-sm font-black tracking-[0.18em] uppercase"
                style={{ color: newColor }}
              >
                {newName.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {formError && <p className="mt-2 text-xs text-red-400">{formError}</p>}
      </form>

      {/* Brand list */}
      {clients.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm">No brands yet. Add your first brand above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all
                          bg-white/[0.02] hover:bg-white/[0.04]
                          ${client.is_active ? 'border-white/6' : 'border-white/[0.03] opacity-60'}`}
            >
              {/* Logo / color swatch */}
              {client.logo_url ? (
                <div className="w-14 h-9 shrink-0 rounded-xl overflow-hidden bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <Image src={client.logo_url} alt={client.name} width={56} height={36} className="object-contain p-1 w-full h-full" />
                </div>
              ) : (
                <div
                  className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${client.color}18`, border: `1px solid ${client.color}35` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: client.color }} />
                </div>
              )}

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-black tracking-[0.14em] uppercase"
                  style={{ color: client.color }}
                >
                  {client.name}
                </span>
              </div>

              {/* Status badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                client.is_active
                  ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                  : 'text-gray-500 bg-white/4 border-white/8'
              }`}>
                {client.is_active ? 'Active' : 'Hidden'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(client)}
                  disabled={toggling === client.id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white
                             hover:bg-white/8 transition-all disabled:opacity-50"
                >
                  {toggling === client.id ? '…' : client.is_active ? 'Hide' : 'Show'}
                </button>

                {confirm === client.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(client.id)}
                      disabled={deleting === client.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-white
                                 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      {deleting === client.id ? '…' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => setConfirm(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500
                                 hover:text-gray-300 hover:bg-white/4 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirm(client.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500
                               hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
