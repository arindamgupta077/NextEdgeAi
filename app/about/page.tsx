'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const MILESTONES = [
  { year: '2022', title: 'Founded', desc: 'NextEdgeAI was born from a vision to unite artificial intelligence with the art of cinematic storytelling.' },
  { year: '2023', title: 'First AI Film', desc: 'Produced our inaugural AI-generated short film, demonstrating the power of generative visuals in narrative cinema.' },
  { year: '2024', title: 'Global Campaigns', desc: 'Delivered AI-powered advertising campaigns for brands across three continents, reaching over 500 million viewers.' },
  { year: '2025', title: 'Virtual Production Suite', desc: 'Launched our proprietary virtual production platform, enabling real-time AI environment generation.' },
  { year: '2026', title: 'IP Universe', desc: 'Expanded into original IP development, building entire storytelling universes powered by generative AI.' },
]

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Creative Innovation',
    desc: 'We push the boundaries of what is possible when AI and human creativity collaborate.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Cinematic Vision',
    desc: 'Every frame is crafted with the same care and artistry as the greatest films in history.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Human-AI Synergy',
    desc: 'Technology amplifies human talent — it never replaces the soul behind every story.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Global Impact',
    desc: 'Our stories transcend borders, resonating with audiences across cultures and continents.',
  },
]

const STATS = [
  { value: '1M+', label: 'Viewers Reached' },
  { value: '20+', label: 'Projects Delivered' },
  { value: '14+', label: 'Brand Partners' },
  { value: '2+', label: 'Industry Awards' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">About NextEdgeAI</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Where AI Meets<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Cinematic Art
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NextEdgeAI is a pioneering AI film production studio redefining storytelling through the fusion of
              cutting-edge artificial intelligence and the timeless craft of cinema.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Our Mission</p>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                Redefining the Future of Film & Brand Storytelling
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                We believe the most powerful stories are those that blur the line between imagination and reality.
                Our mission is to harness the full potential of artificial intelligence — not to replace filmmakers,
                but to give them tools that were previously unimaginable.
              </p>
              <p className="text-gray-400 leading-relaxed">
                From AI-generated visual worlds to intelligent narrative engines, every project at NextEdgeAI
                represents a new frontier in creative expression. We serve brands, studios, and visionary creators
                who refuse to be limited by conventional production constraints.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-2xl border border-white/8 bg-white/3 p-8 backdrop-blur-sm">
                <blockquote className="text-xl md:text-2xl font-light text-white/80 leading-relaxed italic mb-6">
                  "Every great story begins with a spark of imagination. We give that spark the power of an entire universe."
                </blockquote>
                <p className="text-sm text-cyan-400 font-semibold">— NextEdgeAI Founding Vision</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-black">Our Core Values</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-white/8 bg-white/3 p-7 hover:border-cyan-400/20 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-black">Key Milestones</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/40 via-indigo-400/20 to-transparent" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="pl-16 relative"
                >
                  <div className="absolute left-0 w-12 h-12 rounded-full border border-cyan-400/30 bg-[#06060c] flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">{m.year}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Create Something Remarkable?</h2>
            <p className="text-gray-400 mb-8">Join the studios, brands, and creators who are shaping the future of storytelling.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="cursor-none inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow duration-500"
              >
                Start Your Project
              </Link>
              <Link
                href="/team"
                className="cursor-none inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white font-semibold hover:border-white/30 transition-colors duration-300"
              >
                Meet the Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
