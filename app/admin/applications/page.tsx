'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CareerApplication, ApplicationStatus } from '@/types/database'

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new:         'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  reviewed:    'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  shortlisted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  rejected:    'bg-red-500/15 text-red-400 border-red-500/25',
  archived:    'bg-white/5 text-gray-600 border-white/10',
}

const ALL_STATUSES: Array<ApplicationStatus | 'all'> = ['all', 'new', 'reviewed', 'shortlisted', 'rejected', 'archived']

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState<ApplicationStatus | 'all'>('all')

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setApplications(data ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Applications</h1>
          <p className="text-gray-500 text-sm mt-1">Candidate submissions from the careers page</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide border transition-all ${
              filter === s
                ? 'bg-white/8 text-white border-white/20'
                : 'text-gray-600 border-white/5 hover:text-gray-400 hover:border-white/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-12 text-center text-gray-600 text-sm">
          No{filter !== 'all' ? ` ${filter}` : ''} applications found.
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Applicant</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Role</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Department</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Status</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {applications.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                    i === applications.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${a.status === 'new' ? 'text-white' : 'text-gray-300'}`}>
                      {a.name}
                    </span>
                    <span className="block text-xs text-gray-600">{a.email}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell max-w-[200px] truncate">
                    {a.role_title}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                      {a.department}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs hidden sm:table-cell">
                    {new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors"
                    >
                      View →
                    </Link>
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
