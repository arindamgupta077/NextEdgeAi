'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CareerRole, Department } from '@/types/database'

const LOCATIONS   = ['Remote', 'Hybrid', 'On-site']
const TYPES       = ['Full-time', 'Part-time', 'Contract', 'Internship']

interface Props {
  initialData?: CareerRole
}

export default function CareerRoleForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [departments,  setDepartments]  = useState<Department[]>([])
  const [title,       setTitle]       = useState(initialData?.title           ?? '')
  const [department,  setDepartment]  = useState(initialData?.department      ?? '')
  const [location,    setLocation]    = useState(initialData?.location        ?? LOCATIONS[0])
  const [type,        setType]        = useState(initialData?.type            ?? TYPES[0])
  const [description, setDescription] = useState(initialData?.description     ?? '')
  const [reqs,        setReqs]        = useState<string[]>(initialData?.requirements ?? [''])
  const [order,       setOrder]       = useState(String(initialData?.display_order  ?? 0))
  const [active,      setActive]      = useState(initialData?.is_active       ?? true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true })
      .then(({ data }) => {
        const list = data ?? []
        setDepartments(list)
        if (!initialData?.department && list.length > 0) {
          setDepartment(list[0].name)
        }
      })
  }, [initialData?.department])

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const updateReq = (i: number, val: string) =>
    setReqs(prev => prev.map((r, idx) => (idx === i ? val : r)))
  const addReq    = () => setReqs(prev => [...prev, ''])
  const removeReq = (i: number) => setReqs(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!title.trim()) { setError('Title is required.'); return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      title:         title.trim(),
      department:    department.trim(),
      location:      location.trim(),
      type:          type.trim(),
      description:   description.trim(),
      requirements:  reqs.map(r => r.trim()).filter(Boolean),
      display_order: Number(order) || 0,
      is_active:     active,
    }

    try {
      if (isEdit) {
        const { error: err } = await supabase
          .from('career_roles')
          .update(payload)
          .eq('id', initialData.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('career_roles')
          .insert(payload)
        if (err) throw err
      }
      router.push('/admin/careers')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Job Title *</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Senior AI Engineer"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                     focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Department / Location / Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Department</label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                       focus:outline-none focus:border-cyan-500/40 transition-all appearance-none"
          >
            {departments.map(d => (
              <option key={d.id} value={d.name} className="bg-[#0a0a14]">{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Location</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                       focus:outline-none focus:border-cyan-500/40 transition-all appearance-none"
          >
            {LOCATIONS.map(l => (
              <option key={l} value={l} className="bg-[#0a0a14]">{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                       focus:outline-none focus:border-cyan-500/40 transition-all appearance-none"
          >
            {TYPES.map(t => (
              <option key={t} value={t} className="bg-[#0a0a14]">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the role and what the candidate will be working on…"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                     focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all resize-none"
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Requirements</label>
        <div className="space-y-2">
          {reqs.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={req}
                onChange={e => updateReq(i, e.target.value)}
                placeholder={`Requirement ${i + 1}`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                           focus:outline-none focus:border-cyan-500/40 transition-all"
              />
              {reqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReq(i)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-white/8
                             text-gray-600 hover:text-red-400 hover:border-red-400/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addReq}
          className="mt-2 text-xs text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add requirement
        </button>
      </div>

      {/* Order + Active */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Display Order</label>
          <input
            type="number"
            value={order}
            onChange={e => setOrder(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                       focus:outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>
        <div className="pt-5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setActive(v => !v)}
              className={`w-11 h-6 rounded-full border transition-colors duration-200 relative ${
                active ? 'bg-cyan-500/30 border-cyan-500/40' : 'bg-white/5 border-white/10'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                active ? 'translate-x-5' : ''
              }`} />
            </div>
            <span className="text-sm text-gray-400">Active</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Role'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-7 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
