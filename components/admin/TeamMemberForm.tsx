'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember, Department } from '@/types/database'

interface Props {
  initialData?: TeamMember
}

export default function TeamMemberForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [departments, setDepartments] = useState<Department[]>([])
  const [name,       setName]       = useState(initialData?.name           ?? '')
  const [role,       setRole]       = useState(initialData?.role           ?? '')
  const [department, setDepartment] = useState(initialData?.department     ?? '')
  const [bio,        setBio]        = useState(initialData?.bio            ?? '')

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
  const [order,      setOrder]      = useState(String(initialData?.display_order ?? 0))
  const [active,     setActive]     = useState(initialData?.is_active      ?? true)

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) { setError('Name is required.'); return }
    if (!role.trim()) { setError('Role is required.'); return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      name:          name.trim(),
      role:          role.trim(),
      department:    department.trim(),
      bio:           bio.trim(),
      display_order: Number(order) || 0,
      is_active:     active,
    }

    try {
      if (isEdit) {
        const { error: err } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', initialData.id)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('team_members')
          .insert(payload)
        if (err) throw err
      }
      router.push('/admin/team')
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

      {/* Name */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name *</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                     focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Role / Title *</label>
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="e.g. Lead AI Engineer"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                     focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>

      {/* Department */}
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

      {/* Bio */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={4}
          placeholder="Short biography or description…"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white placeholder-gray-600
                     focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all resize-none"
        />
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
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Member'}
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
