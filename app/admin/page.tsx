'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ContactSubmission } from '@/types/database'

/* ─── Status badge ─────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  new:      'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  read:     'bg-gray-500/15 text-gray-400 border-gray-500/25',
  replied:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  archived: 'bg-white/5 text-gray-600 border-white/10',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[status] ?? STATUS_STYLES.read}`}>
      {status}
    </span>
  )
}

/* ─── Stat card ────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-5">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [inquiries,      setInquiries]      = useState<ContactSubmission[]>([])
  const [projectCount,   setProjectCount]   = useState(0)
  const [newCount,       setNewCount]       = useState(0)
  const [totalCount,     setTotalCount]     = useState(0)
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const [
        { count: pc },
        { count: tc },
        { count: nc },
        { data: recent },
      ] = await Promise.all([
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(6),
      ])

      setProjectCount(pc ?? 0)
      setTotalCount(tc ?? 0)
      setNewCount(nc ?? 0)
      setInquiries(recent ?? [])
      setLoading(false)
    }

    load()
  }, [])

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your NextEdgeAI content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Portfolio Projects" value={projectCount} accent="#22d3ee" />
        <StatCard label="New Inquiries"       value={newCount}      accent="#f59e0b" />
        <StatCard label="Total Inquiries"     value={totalCount}    accent="#818cf8" />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Project
        </Link>
        <Link href="/admin/inquiries"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400
                     border border-white/8 hover:border-white/20 hover:text-white transition-all">
          View All Inquiries
        </Link>
      </div>

      {/* Recent Inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View all →
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-10 text-center text-gray-600 text-sm">
            No inquiries yet. Contact form submissions will appear here.
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Name</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Type</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Status</th>
                  <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, i) => (
                  <tr key={inq.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === inquiries.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3.5 text-white font-medium">{inq.name}</td>
                    <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{inq.email}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{inq.project_type ?? '—'}</td>
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
    </div>
  )
}
