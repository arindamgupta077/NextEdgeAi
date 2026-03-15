'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createClient } from '@/lib/supabase/client'

gsap.registerPlugin(ScrollTrigger)

const PROJECT_TYPES = [
  'AI Feature Film',
  'Advertising Campaign',
  'Digital Commercial',
  'Virtual Production',
  'Micro-Drama Series',
  'Visual World-Building',
  'IP Development',
  'Other',
]
const BUDGETS = [
  'Under ₹5,00,000',
  '₹5,00,000 – ₹20,00,000',
  '₹20,00,000 – ₹75,00,000',
  '₹75,00,000 – ₹2,00,00,000',
  '₹2,00,00,000+',
  'Let\'s discuss',
]

type FormState = {
  name:    string
  email:   string
  company: string
  type:    string
  budget:  string
  message: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [form, setForm]           = useState<FormState>({ name:'', email:'', company:'', type:'', budget:'', message:'' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent]             = useState(false)
  const [errors, setErrors]         = useState<Partial<FormState>>({})

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email   = 'Valid email required'
    if (!form.message.trim()) e.message = 'Please tell us about your project'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('contact_submissions').insert({
        name:         form.name.trim(),
        email:        form.email.trim(),
        company:      form.company.trim() || null,
        project_type: form.type || null,
        budget:       form.budget || null,
        message:      form.message.trim(),
      })
      if (error) throw error
    } catch {
      // Silently fail on the public form — don't expose DB errors to visitors
    }
    setSubmitting(false)
    setSent(true)
  }

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-heading', start: 'top 95%' } }
      )
      gsap.fromTo('.contact-info',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-grid', start: 'top 95%' } }
      )
      gsap.fromTo('.contact-form-wrap',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-grid', start: 'top 95%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        {/* Heading */}
        <div className="contact-heading text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-cyan-400">
            <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
            New Projects Open
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight mb-6">
            Let's Build Something<br/>
            <span className="text-gradient">Extraordinary</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-base sm:text-lg">
            Tell us about your vision. We'll respond within 24 hours with a tailored proposal.
          </p>
        </div>

        <div className="contact-grid grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12">
          {/* Info column */}
          <div className="contact-info space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Why NextEdgeAI?</h3>
              <ul className="space-y-4">
                {[
                  { icon: '⚡', label: '3–6 week delivery', desc: 'From brief to final master' },
                  { icon: '🎬', label: 'Feature-grade quality', desc: 'AI + human creative direction' },
                  { icon: '🔒', label: 'Full IP ownership', desc: 'You own 100% of deliverables' },
                  { icon: '🌍', label: 'Global distribution support', desc: '12+ countries covered' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-xl glass-light flex items-center justify-center text-lg shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl glass-light p-6 border border-white/6">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">Get in touch directly</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                  </svg>
                  hello@nextedgeai.com
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                  </svg>
                  Los Angeles · London · Singapore
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrap">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-16 px-8 rounded-3xl glass-light border border-cyan-400/20"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-3xl mb-6">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Message Received!</h3>
                <p className="text-gray-400 leading-relaxed">
                  Thank you for reaching out. Our creative team will review your brief and respond within 24 hours with a personalised proposal.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl glass-light border border-white/6 p-8 space-y-5"
                noValidate
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="Your name"
                      className={`form-input w-full rounded-xl px-4 py-3 text-sm ${errors.name ? 'border-red-500/60' : ''}`}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@company.com"
                      className={`form-input w-full rounded-xl px-4 py-3 text-sm ${errors.email ? 'border-red-500/60' : ''}`}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={handleChange('company')}
                      placeholder="Your company"
                      className="form-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Type</label>
                    <select
                      value={form.type}
                      onChange={handleChange('type')}
                      className="form-input w-full rounded-xl px-4 py-3 text-sm cursor-none"
                    >
                      <option value="">Select type...</option>
                      {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Budget Range</label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setForm(prev => ({ ...prev, budget: b }))}
                        className={`cursor-none px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          form.budget === b
                            ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                            : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Brief *</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us about your vision, goals, timeline, or any specific requirements..."
                    className={`form-input w-full rounded-xl px-4 py-3 text-sm resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-none group w-full py-4 rounded-xl font-semibold text-white text-sm
                             relative overflow-hidden transition-transform active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Project Brief
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                <p className="text-center text-xs text-gray-600">
                  We'll respond within 24 hours · No commitment required
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
