'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember } from '@/types/database'

export default function AdminTeamPage() {
  const [members,  setMembers]  = useState<TeamMember[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm,  setConfirm]  = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
    setMembers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('team_members').delete().eq('id', id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  const toggleActive = async (member: TeamMember) => {
    const supabase = createClient()
    await supabase
      .from('team_members')
      .update({ is_active: !member.is_active })
      .eq('id', member.id)
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
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm mb-4">No team members yet.</p>
          <Link href="/admin/team/new" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Add your first member →
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Name</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Role</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Department</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Order</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Active</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                    i === members.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-white">{m.name}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">{m.role}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                      {m.department}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{m.display_order}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <button
                      onClick={() => toggleActive(m)}
                      className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                        m.is_active
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-white/5 border border-white/10 text-gray-600 hover:bg-white/8'
                      }`}
                    >
                      {m.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/team/${m.id}/edit`}
                        className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
                      >
                        Edit
                      </Link>
                      {confirm === m.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deleting === m.id}
                            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            {deleting === m.id ? 'Deleting…' : 'Confirm'}
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
                          onClick={() => setConfirm(m.id)}
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
