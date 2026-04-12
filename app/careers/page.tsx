'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'
import { createClient } from '@/lib/supabase/client'
import type { CareerRole } from '@/types/database'
import CareerApplicationModal from '@/components/CareerApplicationModal'

// Per-department colour palette (cycles through departments dynamically)
const PALETTE = [
  { accent: 'text-cyan-400',    border: 'border-cyan-400/20',    bg: 'bg-cyan-400/5'    },
  { accent: 'text-indigo-400',  border: 'border-indigo-400/20',  bg: 'bg-indigo-400/5'  },
  { accent: 'text-violet-400',  border: 'border-violet-400/20',  bg: 'bg-violet-400/5'  },
  { accent: 'text-pink-400',    border: 'border-pink-400/20',    bg: 'bg-pink-400/5'    },
  { accent: 'text-amber-400',   border: 'border-amber-400/20',   bg: 'bg-amber-400/5'   },
  { accent: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5' },
]

const BENEFITS = [
  { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere on the planet. We are async-first and time-zone flexible.' },
  { icon: '🎬', title: 'Creative Credit', desc: 'Your name on globally distributed productions. We believe in crediting our creators.' },
  { icon: '🤖', title: 'AI Tools Budget', desc: '$3,000/year personal AI tools and software budget to stay at the cutting edge.' },
  { icon: '📚', title: 'Learning Fund', desc: '$2,500/year for courses, conferences, and books. We invest in your growth.' },
  { icon: '🏥', title: 'Health & Wellness', desc: 'Comprehensive health coverage plus a monthly wellness stipend for full-time employees.' },
  { icon: '🚀', title: 'Equity Participation', desc: 'All full-time roles include meaningful equity. You build it, you own a piece of it.' },
]

export default function CareersPage() {
  const [roles,       setRoles]       = useState<CareerRole[]>([])
  const [loading,     setLoading]     = useState(true)
  const [expandedId,  setExpandedId]  = useState<string | null>(null)
  const [applyRole,   setApplyRole]   = useState<CareerRole | null>(null)

  // Build a stable dept→palette mapping
  const deptPalette: Record<string, typeof PALETTE[0]> = {}
  let paletteIdx = 0
  for (const r of roles) {
    if (!deptPalette[r.department]) {
      deptPalette[r.department] = PALETTE[paletteIdx % PALETTE.length]
      paletteIdx++
    }
  }

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('career_roles')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setRoles(data ?? [])
        setLoading(false)
      })
  }, [])


  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Careers</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Build the Future<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                of Cinema
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We are looking for filmmakers who think in code, engineers who dream in frames, and strategists who
              understand that the greatest ROI is an audience moved to tears.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">
                {loading ? 'Loading...' : `${roles.length} Open Role${roles.length !== 1 ? 's' : ''} · Actively Hiring`}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Open Positions</p>
            <h2 className="text-3xl md:text-4xl font-black">Current Openings</h2>
          </motion.div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : roles.length === 0 ? (
              <p className="text-center text-gray-500 py-16">No open roles at this time. Check back soon.</p>
            ) : roles.map((role, i) => {
              const style = deptPalette[role.department] ?? PALETTE[0]
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}
                >
                  <button
                    className="cursor-none w-full text-left px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    onClick={() => setExpandedId(expandedId === role.id ? null : role.id)}
                  >
                    <div>
                      <h3 className="font-bold text-base mb-1">{role.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs font-semibold ${style.accent}`}>{role.department}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{role.location}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{role.type}</span>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border ${style.border} flex items-center justify-center transition-transform duration-300 ${expandedId === role.id ? 'rotate-45' : ''}`}>
                      <svg className={`w-4 h-4 ${style.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedId === role.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-7 border-t border-white/5 pt-5">
                          <p className="text-sm text-gray-400 leading-relaxed mb-5">{role.description}</p>
                          <div className="mb-6">
                            <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Key Requirements</p>
                            <ul className="space-y-2">
                              {role.requirements.map((req) => (
                                <li key={req} className="flex items-start gap-2 text-sm text-gray-400">
                                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.accent.replace('text-', 'bg-')}`} />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            type="button"
                            onClick={() => setApplyRole(role)}
                            className={`cursor-none inline-flex items-center gap-2 px-6 py-3 rounded-full border ${style.border} ${style.accent} text-sm font-semibold hover:bg-white/5 transition-colors duration-300`}
                          >
                            Apply for this role
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Why NextEdgeAI</p>
            <h2 className="text-3xl md:text-4xl font-black">What We Offer</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-white/16 transition-colors duration-300"
              >
                <span className="text-3xl mb-4 block">{b.icon}</span>
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open application CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Don't See Your Role?</h2>
            <p className="text-gray-400 mb-8">
              We always want to hear from exceptional talent. Send us your portfolio and tell us how you'd change the future of filmmaking.
            </p>
            <Link
              href="/"
              className="cursor-none inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow duration-500"
            >
              Send an Open Application
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <CareerApplicationModal role={applyRole} onClose={() => setApplyRole(null)} />
    </div>
  )
}
