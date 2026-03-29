'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const BUDGETS = [
  'Under ₹5,00,000',
  '₹5,00,000 – ₹20,00,000',
  '₹20,00,000 – ₹75,00,000',
  '₹75,00,000 – ₹2,00,00,000',
  '₹2,00,00,000+',
  "Let's discuss",
]

type FormState = {
  name:    string
  email:   string
  mobile:  string
  company: string
  type:    string
  budget:  string
  message: string
}

export default function ContactForm() {
  const [form, setForm]             = useState<FormState>({ name: '', email: '', mobile: '', company: '', type: '', budget: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent]             = useState(false)
  const [errors, setErrors]         = useState<Partial<FormState>>({})
  const [serviceTypes, setServiceTypes] = useState<string[]>([])

  useEffect(() => {
    createClient()
      .from('services')
      .select('title')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setServiceTypes(data.map(s => s.title))
      })
  }, [])

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.name.trim())    e.name  = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                               e.email = 'Valid email required'
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
        mobile:       form.mobile.trim() || null,
        company:      form.company.trim() || null,
        project_type: form.type || null,
        budget:       form.budget || null,
        message:      form.message.trim(),
      })
      if (error) throw error
    } catch {
      // Silently fail — don't expose DB errors to visitors
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

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-3xl glass-light border border-cyan-400/20"
      >
        <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-3xl mb-6">
          ✓
        </div>
        <h3 className="text-2xl font-black text-white mb-3">Message Received!</h3>
        <p className="text-gray-400 leading-relaxed">
          Thank you for reaching out. Our creative team will review your brief and respond within 24 hours with a personalised proposal.
        </p>
      </motion.div>
    )
  }

  return (
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
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Mobile Number</label>
          <input
            type="tel"
            value={form.mobile}
            onChange={handleChange('mobile')}
            placeholder="+91 98765 43210"
            className="form-input w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>
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
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Type</label>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="form-input w-full rounded-xl px-4 py-3 text-sm cursor-none"
          >
            <option value="">Select type...</option>
            {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
  )
}
