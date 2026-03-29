'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ContactSubmission, ContactStatus } from '@/types/database'

/* ─── Status config ────────────────────────────────────────────────── */
const STATUS_STYLES: Record<ContactStatus, string> = {
  new:      'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  read:     'bg-gray-500/15 text-gray-400 border-gray-500/25',
  replied:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  archived: 'bg-white/5 text-gray-600 border-white/10',
}

const ALL_STATUSES: Array<ContactStatus | 'all'> = ['all', 'new', 'read', 'replied', 'archived']

function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState<ContactStatus | 'all'>('all')

  useEffect(() => {
    const supabase = createClient()
    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    query.then(({ data }) => {
      setInquiries(data ?? [])
      setLoading(false)
    })
  }, [filter])

  const displayed = inquiries

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Contact form submissions</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true) }}
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
      ) : displayed.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-12 text-center text-gray-600 text-sm">
          No{filter !== 'all' ? ` ${filter}` : ''} inquiries found.
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Name</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Email</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Mobile</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Type</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Budget</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Status</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {displayed.map((inq, i) => (
                <tr key={inq.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${i === displayed.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${inq.status === 'new' ? 'text-white' : 'text-gray-300'}`}>
                      {inq.name}
                    </span>
                    {inq.company && <span className="block text-xs text-gray-600">{inq.company}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{inq.email}</td>
                  <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">{inq.mobile ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{inq.project_type ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{inq.budget ?? '—'}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={inq.status} /></td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs hidden lg:table-cell">
                    {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/inquiries/${inq.id}`}
                      className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors">
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
