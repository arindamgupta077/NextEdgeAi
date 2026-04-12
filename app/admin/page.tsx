'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ContactSubmission, CareerApplication } from '@/types/database'

/* ─── Helpers ──────────────────────────────────────────────────────── */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ─── Stat card ────────────────────────────────────────────────────── */
function StatCard({
  label, value, href, icon, iconBg, loading,
}: {
  label: string; value: number; href: string; icon: React.ReactNode; iconBg: string; loading: boolean
}) {
  return (
    <Link
      href={href}
      className="group bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-5 transition-all duration-200 flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
        {loading
          ? <div className="h-7 w-10 bg-white/5 rounded-lg animate-pulse mt-1" />
          : <p className="text-2xl font-bold text-white">{value}</p>
        }
      </div>
      <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  )
}

/* ─── Badges ───────────────────────────────────────────────────────── */
const INQUIRY_BADGE: Record<string, string> = {
  new:      'bg-cyan-500/15 text-cyan-400',
  read:     'bg-gray-500/15 text-gray-400',
  replied:  'bg-emerald-500/15 text-emerald-400',
  archived: 'bg-white/5 text-gray-600',
}
const APP_BADGE: Record<string, string> = {
  new:         'bg-cyan-500/15 text-cyan-400',
  reviewed:    'bg-indigo-500/15 text-indigo-400',
  shortlisted: 'bg-emerald-500/15 text-emerald-400',
  rejected:    'bg-red-500/15 text-red-400',
  archived:    'bg-white/5 text-gray-600',
}
function Badge({ status, map }: { status: string; map: Record<string, string> }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize shrink-0 ${map[status] ?? 'bg-white/5 text-gray-600'}`}>
      {status}
    </span>
  )
}

/* ─── Section header ───────────────────────────────────────────────── */
function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-medium">{title}</h2>
      <Link href={href} className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors">View all →</Link>
    </div>
  )
}

/* ─── Activity row skeleton ────────────────────────────────────────── */
function SkeletonRows() {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
            <div className="h-2.5 w-24 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-white/5 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────── */
interface Stats {
  portfolio: number; services: number; team: number
  openRoles: number; newInquiries: number; newApps: number
}

export default function AdminDashboard() {
  const [stats,     setStats]     = useState<Stats>({ portfolio: 0, services: 0, team: 0, openRoles: 0, newInquiries: 0, newApps: 0 })
  const [inquiries, setInquiries] = useState<ContactSubmission[]>([])
  const [apps,      setApps]      = useState<CareerApplication[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [
        { count: portfolio },
        { count: services },
        { count: team },
        { count: openRoles },
        { count: newInquiries },
        { count: newApps },
        { data: recentInquiries },
        { data: recentApps },
      ] = await Promise.all([
        supabase.from('portfolio_projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('career_roles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('career_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('career_applications').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        portfolio:    portfolio    ?? 0,
        services:     services     ?? 0,
        team:         team         ?? 0,
        openRoles:    openRoles    ?? 0,
        newInquiries: newInquiries ?? 0,
        newApps:      newApps      ?? 0,
      })
      setInquiries(recentInquiries ?? [])
      setApps(recentApps ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting()}</h1>
          <p className="text-gray-500 text-sm mt-1">{today}</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-gray-500 border border-white/8 hover:text-white hover:border-white/20 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          View Website
        </a>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard
          label="Portfolio Projects" value={stats.portfolio} href="/admin/portfolio" loading={loading}
          iconBg="bg-cyan-500/15"
          icon={<svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h1.5m-1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5" /></svg>}
        />
        <StatCard
          label="Active Services" value={stats.services} href="/admin/services" loading={loading}
          iconBg="bg-violet-500/15"
          icon={<svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>}
        />
        <StatCard
          label="Team Members" value={stats.team} href="/admin/team" loading={loading}
          iconBg="bg-emerald-500/15"
          icon={<svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <StatCard
          label="Open Positions" value={stats.openRoles} href="/admin/careers" loading={loading}
          iconBg="bg-amber-500/15"
          icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>}
        />
        <StatCard
          label="New Inquiries" value={stats.newInquiries} href="/admin/inquiries" loading={loading}
          iconBg="bg-rose-500/15"
          icon={<svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
        />
        <StatCard
          label="New Applications" value={stats.newApps} href="/admin/applications" loading={loading}
          iconBg="bg-indigo-500/15"
          icon={<svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
        />
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-medium mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Add Project',     href: '/admin/portfolio/new' },
            { label: '+ Add Service',     href: '/admin/services/new' },
            { label: '+ Add Team Member', href: '/admin/team/new' },
            { label: '+ Post Role',       href: '/admin/careers/new' },
            { label: 'View Inquiries',    href: '/admin/inquiries' },
            { label: 'View Applications', href: '/admin/applications' },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="px-4 py-2 rounded-xl text-sm font-medium border transition-all text-gray-400 border-white/8 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Inquiries */}
        <div>
          <SectionHeader title="Recent Inquiries" href="/admin/inquiries" />
          {loading ? <SkeletonRows /> : inquiries.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-8 text-center text-gray-600 text-sm">
              No inquiries yet.
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
              {inquiries.map((inq) => (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.025] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0">
                    {inq.name[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                    <p className="text-xs text-gray-500 truncate">{inq.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={inq.status} map={INQUIRY_BADGE} />
                    <span className="text-xs text-gray-600">{fmtDate(inq.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <SectionHeader title="Recent Applications" href="/admin/applications" />
          {loading ? <SkeletonRows /> : apps.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-8 text-center text-gray-600 text-sm">
              No applications yet.
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/[0.04]">
              {apps.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/applications/${app.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.025] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                    {app.name[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{app.name}</p>
                    <p className="text-xs text-gray-500 truncate">{app.role_title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={app.status} map={APP_BADGE} />
                    <span className="text-xs text-gray-600">{fmtDate(app.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
