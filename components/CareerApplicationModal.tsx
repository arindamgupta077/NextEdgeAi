'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { CareerRole } from '@/types/database'

interface Props {
  role: CareerRole | null
  onClose: () => void
}

type Step = 'form' | 'success'

export default function CareerApplicationModal({ role, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')

  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [linkedinUrl,  setLinkedinUrl]  = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [coverLetter,  setCoverLetter]  = useState('')

  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  // Reset form when a new role is opened
  useEffect(() => {
    if (role) {
      setStep('form')
      setName('')
      setEmail('')
      setPhone('')
      setLinkedinUrl('')
      setPortfolioUrl('')
      setCoverLetter('')
      setError(null)
    }
  }, [role?.id])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!role) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [role])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim())  { setError('Name is required.'); return }
    if (!email.trim()) { setError('Email is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (!role) return

    setSaving(true)
    const supabase = createClient()

    const { error: dbErr } = await supabase.from('career_applications').insert({
      role_id:       role.id,
      role_title:    role.title,
      department:    role.department,
      name:          name.trim(),
      email:         email.trim(),
      phone:         phone.trim() || null,
      linkedin_url:  linkedinUrl.trim() || null,
      portfolio_url: portfolioUrl.trim() || null,
      cover_letter:  coverLetter.trim() || null,
    })

    if (dbErr) {
      setError('Failed to submit. Please try again.')
      setSaving(false)
      return
    }

    setSaving(false)
    setStep('success')
  }

  return (
    <AnimatePresence>
      {role && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Scroll container — covers viewport, handles all wheel/touch scroll */}
          <div
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
            onClick={onClose}
          >
            <div className="flex min-h-full items-end sm:items-center justify-center p-4">
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg bg-[#0c0c18] border border-white/10 rounded-2xl shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
              {step === 'form' ? (
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="bg-[#0c0c18] border-b border-white/8 px-6 py-5 flex items-start justify-between gap-4 rounded-t-2xl">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-cyan-400 mb-1">{role.department}</p>
                      <h2 className="text-lg font-bold text-white leading-tight">{role.title}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{role.location} · {role.type}</p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/10
                                 text-gray-500 hover:text-white hover:border-white/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-6 space-y-5">
                    {error && (
                      <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                        <input
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                     placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                     placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 555 000 0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                   placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                      />
                    </div>

                    {/* LinkedIn + Portfolio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={e => setLinkedinUrl(e.target.value)}
                          placeholder="linkedin.com/in/…"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                     placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Portfolio / Website</label>
                        <input
                          type="url"
                          value={portfolioUrl}
                          onChange={e => setPortfolioUrl(e.target.value)}
                          placeholder="yoursite.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                     placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all"
                        />
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Letter</label>
                      <textarea
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        rows={5}
                        placeholder="Tell us why you're the perfect fit for this role…"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-sm text-white
                                   placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white
                                 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 border border-cyan-500/30
                                 hover:border-cyan-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Submitting…' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Success state */
                <div className="px-8 py-14 text-center">
                  <div className="w-16 h-16 rounded-full border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-2">
                    Thank you for applying to <span className="text-white font-medium">{role.title}</span>.
                  </p>
                  <p className="text-gray-600 text-sm mb-8">
                    We review every application and will be in touch if your profile is a match.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-xl text-sm font-semibold text-white border border-white/10
                               hover:border-white/20 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
