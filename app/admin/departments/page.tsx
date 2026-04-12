'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Department } from '@/types/database'

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading,     setLoading]     = useState(true)
  const [newName,     setNewName]     = useState('')
  const [saving,      setSaving]      = useState(false)
  const [deleting,    setDeleting]    = useState<string | null>(null)
  const [confirm,     setConfirm]     = useState<string | null>(null)
  const [error,       setError]       = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true })
    setDepartments(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const name = newName.trim()
    if (!name) { setError('Department name is required.'); return }

    setSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.from('departments').insert({ name })
    if (err) {
      setError(err.message)
    } else {
      setNewName('')
      await load()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('departments').delete().eq('id', id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Departments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage departments used across team members and career roles.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-widest">
          Add Department
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. AI & Engineering"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                       placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8
                       transition-all"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                       bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                       hover:border-cyan-400/50 disabled:opacity-40 transition-all"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
            Create
          </button>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm">No departments yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="flex items-center justify-between bg-white/[0.03] border border-white/8
                         rounded-2xl px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
                <span className="text-sm font-medium text-white">{dept.name}</span>
              </div>

              {confirm === dept.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Delete?</span>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    disabled={deleting === dept.id}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/15 text-red-400
                               border border-red-500/20 hover:bg-red-500/25 disabled:opacity-40 transition-all"
                  >
                    {deleting === dept.id ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500
                               hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(dept.id)}
                  className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10
                             transition-all"
                  title="Delete department"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
