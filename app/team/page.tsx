'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember } from '@/types/database'

const DEPT_STYLES: Record<string, { color: string; border: string; accent: string }> = {
  'Creative Direction': { color: 'from-cyan-500/20 to-cyan-500/5',    border: 'border-cyan-400/20',   accent: 'text-cyan-400'   },
  'AI & Engineering':   { color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-400/20', accent: 'text-indigo-400' },
  'Production':         { color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-400/20', accent: 'text-violet-400' },
  'Strategy & Brand':   { color: 'from-pink-500/20 to-pink-500/5',     border: 'border-pink-400/20',   accent: 'text-pink-400'   },
}
const FALLBACK_STYLE = { color: 'from-gray-500/20 to-gray-500/5', border: 'border-gray-400/20', accent: 'text-gray-400' }

export default function TeamPage() {
  const [members,  setMembers]  = useState<TeamMember[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        setMembers(data ?? [])
        setLoading(false)
      })
  }, [])

  // Group by department preserving insertion order
  const departments: string[] = []
  const byDept: Record<string, TeamMember[]> = {}
  for (const m of members) {
    if (!byDept[m.department]) {
      departments.push(m.department)
      byDept[m.department] = []
    }
    byDept[m.department].push(m)
  }

  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Creative Team</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              The Humans Behind<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                the Intelligence
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NextEdgeAI is built by a multidisciplinary team of filmmakers, AI researchers, artists, and strategists
              united by one conviction: that the best stories are told by humans and machines working as one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Culture strip */}
      <section className="py-10 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {['Remote-First', 'Cross-Disciplinary', 'Filmmaker + Engineer', 'Global Talent', '15+ Nationalities', 'Radical Creativity'].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-sm text-gray-500 font-medium"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Team by Department */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-600 py-24">No team members found.</p>
          ) : (
            <div className="space-y-16">
              {departments.map((dept, di) => {
                const style = DEPT_STYLES[dept] ?? FALLBACK_STYLE
                return (
                  <motion.div
                    key={dept}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: di * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <span className={`text-xs uppercase tracking-[0.25em] font-semibold ${style.accent}`}>{dept}</span>
                      <div className={`flex-1 h-px bg-gradient-to-r ${style.color}`} />
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {byDept[dept].map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-2xl border ${style.border} bg-gradient-to-br ${style.color} p-6 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
                        >
                          <div className={`w-14 h-14 rounded-xl border ${style.border} bg-gradient-to-br ${style.color} flex items-center justify-center mb-4`}>
                            <span className={`text-xl font-black ${style.accent}`}>{m.name.charAt(0)}</span>
                          </div>
                          <h3 className="font-bold text-base mb-0.5">{m.name}</h3>
                          <p className={`text-xs font-semibold ${style.accent} mb-3`}>{m.role}</p>
                          <p className="text-sm text-gray-400 leading-relaxed">{m.bio}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Our Culture</p>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Built Different, On Purpose</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We don't separate creative from technical. Every AI researcher at NextEdgeAI has watched a thousand films.
                Every filmmaker on our team has paired with an AI model. This cross-pollination is not accidental — it is our edge.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We operate as a fully distributed studio, with team members across 12 time zones collaborating through
                asynchronous-first workflows. Ideas don't wait for office hours.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Team Members', value: members.length > 0 ? `${members.length}+` : '60+' },
                { label: 'Countries', value: '15+' },
                { label: 'Avg. Experience', value: '12 yrs' },
                { label: 'Open Roles', value: '8' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-5 text-center">
                  <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-1">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Want to Join This Team?</h2>
            <p className="text-gray-400 mb-8">We're always looking for the next filmmakers, AI researchers, and storytellers who think differently.</p>
            <Link
              href="/careers"
              className="cursor-none inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow duration-500"
            >
              View Open Roles
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
