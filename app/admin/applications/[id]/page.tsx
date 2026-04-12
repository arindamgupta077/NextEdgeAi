'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { CareerApplication, ApplicationStatus } from '@/types/database'

const STATUS_OPTIONS: ApplicationStatus[] = ['new', 'reviewed', 'shortlisted', 'rejected', 'archived']

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new:         'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  reviewed:    'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  shortlisted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  rejected:    'bg-red-500/15 text-red-400 border-red-500/25',
  archived:    'bg-white/5 text-gray-600 border-white/10',
}

function Field({ label, value, href }: { label: string; value?: string | null; href?: string }) {
  if (!value) return null
  return (
    <div className="border-b border-white/5 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <p className="text-xs uppercase tracking-widest text-gray-600 mb-1.5">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors break-all">
          {value}
        </a>
      ) : (
        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
      )}
    </div>
  )
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [application, setApplication] = useState<CareerApplication | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [status,      setStatus]      = useState<ApplicationStatus>('new')
  const [notes,       setNotes]       = useState('')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    supabase
      .from('career_applications')
      .select('*')
      .eq('id', id)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) { setLoading(false); return }
        setApplication(data)
        setStatus(data.status)
        setNotes(data.notes ?? '')
        setLoading(false)
        // Auto-mark as reviewed when opened
        if (data.status === 'new') {
          await supabase
            .from('career_applications')
            .update({ status: 'reviewed' })
            .eq('id', id)
          setStatus('reviewed')
        }
      })
  }, [id])

  const save = async () => {
    if (!application) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('career_applications')
      .update({ status, notes })
      .eq('id', application.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Application not found.</p>
        <Link href="/admin/applications" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          ← Back to Applications
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Back */}
      <Link href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors mb-6">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Applications
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content */}
        <div className="space-y-4">
          {/* Header card */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-white">{application.name}</h1>
                <p className="text-gray-400 text-sm mt-0.5">{application.email}</p>
              </div>
              <span className={`flex-shrink-0 inline-flex px-3 py-1 rounded-full border text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[status]}`}>
                {status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                {application.department}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-400">
                {application.role_title}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-600">
                {new Date(application.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Application details */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-6 py-5">
            <Field label="Phone" value={application.phone} />
            <Field label="LinkedIn" value={application.linkedin_url} href={application.linkedin_url ?? undefined} />
            <Field label="Portfolio / Website" value={application.portfolio_url} href={application.portfolio_url ?? undefined} />
            <Field label="Cover Letter" value={application.cover_letter} />
            {!application.phone && !application.linkedin_url && !application.portfolio_url && !application.cover_letter && (
              <p className="text-gray-600 text-sm">No additional details provided.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Status</p>
            <div className="space-y-1.5">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium uppercase tracking-wide transition-all ${
                    status === s
                      ? STATUS_STYLES[s]
                      : 'text-gray-600 border-white/5 hover:border-white/10 hover:text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl px-5 py-5">
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Internal Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this candidate…"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 text-sm text-white
                         placeholder-gray-700 focus:outline-none focus:border-cyan-500/30 transition-all resize-none"
            />
          </div>

          {/* Save */}
          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white border border-cyan-500/25
                       bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:border-cyan-400/50
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>

          {/* Delete */}
          <button
            onClick={async () => {
              if (!confirm('Delete this application? This cannot be undone.')) return
              const supabase = createClient()
              await supabase.from('career_applications').delete().eq('id', application.id)
              router.push('/admin/applications')
            }}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-600 border border-white/5
                       hover:text-red-400 hover:border-red-400/20 transition-all"
          >
            Delete Application
          </button>
        </div>
      </div>
    </div>
  )
}
