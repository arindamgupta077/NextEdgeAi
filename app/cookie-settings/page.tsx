'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

type CookieCategory = {
  id: string
  name: string
  description: string
  required: boolean
  examples: string[]
  accent: string
  border: string
  bg: string
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'These cookies are strictly necessary for the website to function. They enable core features such as security, session management, and accessibility. The website cannot function properly without these cookies — they cannot be disabled.',
    required: true,
    examples: ['Session tokens', 'CSRF protection tokens', 'Load balancer cookies', 'Authentication state'],
    accent: 'text-emerald-400',
    border: 'border-emerald-400/20',
    bg: 'bg-emerald-400/5',
  },
  {
    id: 'analytics',
    name: 'Analytics & Performance Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our website and your experience.',
    required: false,
    examples: ['Google Analytics (anonymized)', 'Hotjar heatmaps', 'Page load performance metrics', 'Error tracking (Sentry)'],
    accent: 'text-cyan-400',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-400/5',
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'These cookies enable enhanced functionality and personalization — such as remembering your preferences, language settings, and previous interactions. Disabling these may affect your experience.',
    required: false,
    examples: ['Language preference', 'Theme / display preferences', 'Previously viewed projects', 'Form auto-fill preferences'],
    accent: 'text-indigo-400',
    border: 'border-indigo-400/20',
    bg: 'bg-indigo-400/5',
  },
  {
    id: 'marketing',
    name: 'Marketing & Targeting Cookies',
    description: 'These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit ad frequency and measure the effectiveness of marketing campaigns.',
    required: false,
    examples: ['LinkedIn Insight Tag', 'Meta Pixel', 'Google Ads conversion tracking', 'Retargeting cookies'],
    accent: 'text-pink-400',
    border: 'border-pink-400/20',
    bg: 'bg-pink-400/5',
  },
]

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false,
  })
  const [saved, setSaved] = useState(false)

  function toggle(id: string) {
    if (id === 'essential') return
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }))
    setSaved(false)
  }

  function acceptAll() {
    setPreferences({ essential: true, analytics: true, functional: true, marketing: true })
    setSaved(false)
  }

  function rejectAll() {
    setPreferences({ essential: true, analytics: false, functional: false, marketing: false })
    setSaved(false)
  }

  function savePreferences() {
    setSaved(true)
    // In a real implementation: persist to localStorage / cookie consent API
  }

  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Cookie Settings</h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              We use cookies to provide a great experience on our website. You are in control — manage
              your preferences below. Essential cookies are always active.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={acceptAll}
              className="cursor-none px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-shadow duration-500"
            >
              Accept All
            </button>
            <button
              onClick={rejectAll}
              className="cursor-none px-5 py-2.5 rounded-full border border-white/10 text-white text-sm font-semibold hover:border-white/25 transition-colors duration-300"
            >
              Reject All Optional
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6 space-y-5">
          {COOKIE_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border ${cat.border} ${cat.bg} p-7`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-bold">{cat.name}</h3>
                    {cat.required && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-medium">
                        Always Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{cat.description}</p>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-600 mb-2">Examples</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.examples.map((ex) => (
                        <span key={ex} className={`text-xs px-2.5 py-1 rounded-full border ${cat.border} ${cat.accent} bg-white/2`}>
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex-shrink-0 pt-1">
                  <button
                    onClick={() => toggle(cat.id)}
                    disabled={cat.required}
                    aria-label={`Toggle ${cat.name}`}
                    className={`cursor-none relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                      preferences[cat.id]
                        ? cat.id === 'essential'
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                        : 'bg-white/10'
                    } ${cat.required ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                        preferences[cat.id] ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Save bar */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 p-6"
          >
            <div>
              <p className="text-sm font-semibold mb-1">Your Cookie Preferences</p>
              <p className="text-xs text-gray-500">
                {Object.values(preferences).filter(Boolean).length} of {COOKIE_CATEGORIES.length} categories enabled.
                {saved && <span className="ml-2 text-emerald-400 font-medium">Preferences saved.</span>}
              </p>
            </div>
            <button
              onClick={savePreferences}
              className="cursor-none flex-shrink-0 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-shadow duration-500"
            >
              Save My Preferences
            </button>
          </motion.div>
        </div>
      </section>

      {/* More info */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold mb-2">What are cookies?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Cookies are small text files stored on your device that help websites remember information about your visit —
                such as your login state, preferences, and usage patterns.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-bold mb-2">How long do they last?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Session cookies expire when you close your browser. Persistent cookies remain on your device for a set period —
                typically between 30 days and 2 years depending on their purpose.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold mb-2">Full Privacy Details</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                For more information about how we handle your data, including cookies, please read our{' '}
                <a href="/privacy-policy" className="cursor-none text-cyan-400 hover:underline">Privacy Policy</a>.
                Questions? Email privacy@nextedgeai.com.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
