'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CareerRole } from '@/types/database'

export default function AdminCareersPage() {
  const [roles,    setRoles]    = useState<CareerRole[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm,  setConfirm]  = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('career_roles')
      .select('*')
      .order('display_order', { ascending: true })
    setRoles(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('career_roles').delete().eq('id', id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  const toggleActive = async (role: CareerRole) => {
    const supabase = createClient()
    await supabase
      .from('career_roles')
      .update({ is_active: !role.is_active })
      .eq('id', role.id)
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Career Roles</h1>
          <p className="text-gray-500 text-sm mt-1">{roles.length} role{roles.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/careers/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Role
        </Link>
      </div>

      {roles.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm mb-4">No career roles yet.</p>
          <Link href="/admin/careers/new" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Add your first role →
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Title</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Department</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Location</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Type</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Order</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Active</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {roles.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                    i === roles.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-white">{r.title}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                      {r.department}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">{r.location}</td>
                  <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{r.type}</td>
                  <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{r.display_order}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <button
                      onClick={() => toggleActive(r)}
                      className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                        r.is_active
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-white/5 border border-white/10 text-gray-600 hover:bg-white/8'
                      }`}
                    >
                      {r.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/careers/${r.id}/edit`}
                        className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
                      >
                        Edit
                      </Link>
                      {confirm === r.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            {deleting === r.id ? 'Deleting…' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirm(null)}
                            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirm(r.id)}
                          className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
