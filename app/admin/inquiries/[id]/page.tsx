'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ContactSubmission, ContactStatus } from '@/types/database'

const STATUS_OPTIONS: ContactStatus[] = ['new', 'read', 'replied', 'archived']

const STATUS_STYLES: Record<ContactStatus, string> = {
  new:      'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  read:     'bg-gray-500/15 text-gray-400 border-gray-500/25',
  replied:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  archived: 'bg-white/5 text-gray-600 border-white/10',
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="border-b border-white/5 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <p className="text-xs uppercase tracking-widest text-gray-600 mb-1.5">{label}</p>
      <p className="text-gray-200 text-sm leading-relaxed">{value}</p>
    </div>
  )
}

export default function InquiryDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const router   = useRouter()

  const [inquiry, setInquiry] = useState<ContactSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [status,  setStatus]  = useState<ContactStatus>('new')
  const [notes,   setNotes]   = useState('')
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()

    supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) { setLoading(false); return }
        setInquiry(data)
        setStatus(data.status)
        setNotes(data.notes ?? '')
        setLoading(false)

        // Auto-mark as read
        if (data.status === 'new') {
          await supabase
            .from('contact_submissions')
            .update({ status: 'read' })
            .eq('id', id)
          setStatus('read')
        }
      })
  }, [id])

  const save = async () => {
    if (!inquiry) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('contact_submissions')
      .update({ status, notes })
      .eq('id', inquiry.id)
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

  if (!inquiry) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-red-400">Inquiry not found.</p>
        <Link href="/admin/inquiries" className="text-sm text-cyan-400 mt-3 inline-block">← Back to Inquiries</Link>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Back + Header */}
      <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Inquiries
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{inquiry.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(inquiry.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full border text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: inquiry details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-5">Inquiry Details</h2>
            <Field label="Name"          value={inquiry.name} />
            <Field label="Email"         value={inquiry.email} />
            <Field label="Mobile"        value={inquiry.mobile} />
            <Field label="Company"       value={inquiry.company} />
            <Field label="Project Type"  value={inquiry.project_type} />
            <Field label="Budget"        value={inquiry.budget} />
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-6">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-4">Message</p>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </div>

        {/* Right: status & notes */}
        <div className="space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-3">Status</p>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all ${
                    status === s
                      ? STATUS_STYLES[s]
                      : 'border-white/5 text-gray-600 hover:text-gray-400 hover:border-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${status === s ? 'bg-current' : 'bg-white/10'}`} />
                  <span className="capitalize">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-medium mb-3">Internal Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add private notes…"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white
                         placeholder-white/20 outline-none resize-none focus:border-cyan-400/50 focus:ring-2
                         focus:ring-cyan-400/10 transition"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-semibold relative overflow-hidden
                       disabled:opacity-60 transition-opacity"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25 rounded-xl" />
            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
              {saving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : saved ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : null}
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
            </span>
          </button>

          <a
            href={`mailto:${inquiry.email}?subject=Re: Your inquiry to NextEdgeAI`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/8
                       hover:border-white/20 text-sm text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  )
}
