'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const PRESS_RELEASES = [
  {
    date: 'March 28, 2026',
    category: 'Product Launch',
    title: 'NextEdgeAI Unveils Second-Generation Generative Visual Intelligence Engine',
    excerpt: 'The new GVI 2.0 engine delivers 4K cinematic-quality video generation with full temporal coherence and sub-second prompt response, marking a leap forward in AI film production capabilities.',
    tag: 'New',
  },
  {
    date: 'February 10, 2026',
    category: 'Partnership',
    title: 'NextEdgeAI Partners with Global Brand Consortium to Define AI Advertising Standards',
    excerpt: "A landmark partnership with ten of the world's largest advertising networks to co-develop ethical and quality standards for AI-generated commercial content.",
    tag: '',
  },
  {
    date: 'January 5, 2026',
    category: 'Award',
    title: 'NextEdgeAI Wins "Best AI Innovation in Film" at International Cinematic Technology Awards 2025',
    excerpt: "The international jury recognized NextEdgeAI's virtual production suite as the most transformative AI production technology of the year.",
    tag: '',
  },
  {
    date: 'November 20, 2025',
    category: 'Funding',
    title: 'NextEdgeAI Closes $42M Series B to Accelerate Global Expansion',
    excerpt: 'Led by Horizon Ventures with participation from existing investors, the round will fuel international studios, new technology hires, and expanded client services.',
    tag: '',
  },
  {
    date: 'September 8, 2025',
    category: 'Launch',
    title: 'NextEdgeAI Launches Audience Intelligence Platform for Real-Time Campaign Optimization',
    excerpt: 'The AIP system uses predictive emotion modeling to simulate audience response before distribution, helping brands maximize impact at every budget level.',
    tag: '',
  },
  {
    date: 'June 15, 2025',
    category: 'Case Study',
    title: '"Edge of Tomorrow" Global Campaign Delivers 2.3B Impressions Using AI Production',
    excerpt: 'An entirely AI-produced campaign for a Fortune 100 automotive brand set records for engagement and cost efficiency across 28 markets simultaneously.',
    tag: '',
  },
]

const MEDIA_COVERAGE = [
  { outlet: 'Wired', headline: "\"The AI Studio That's Making Hollywood Nervous\"", date: 'February 2026' },
  { outlet: 'The Verge', headline: '"How NextEdgeAI Turned a $50K Budget Into a Super Bowl Quality Ad"', date: 'January 2026' },
  { outlet: 'Forbes', headline: '"The 10 AI Companies Reshaping the Creative Economy — NextEdgeAI at #3"', date: 'December 2025' },
  { outlet: 'Fast Company', headline: '"Most Innovative Companies in AI Filmmaking: NextEdgeAI Leads the Pack"', date: 'November 2025' },
  { outlet: 'TechCrunch', headline: "\"NextEdgeAI's $42M Round Signals Advertisers Are Ready for AI Production at Scale\"", date: 'November 2025' },
  { outlet: 'Variety', headline: '"The New Studios: AI-Native Production Companies and What They Mean for Hollywood"', date: 'October 2025' },
]

const MEDIA_ASSETS = [
  { name: 'Brand Logo Pack (SVG, PNG)', size: '2.4 MB', type: 'Logos' },
  { name: 'Executive Headshots', size: '18.2 MB', type: 'Photography' },
  { name: 'Product Screenshots & Demos', size: '34.7 MB', type: 'Screenshots' },
  { name: 'Company Overview One-Pager', size: '1.1 MB', type: 'Documents' },
  { name: 'Brand Style Guide', size: '5.8 MB', type: 'Documents' },
  { name: 'B-Roll & Demo Footage', size: '1.2 GB', type: 'Video' },
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Press & Media</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              News &<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Press Coverage
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The latest from NextEdgeAI — announcements, awards, partnerships, and media coverage
              from around the world.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:press@nextedgeai.com"
                className="cursor-none inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-shadow duration-500"
              >
                Press Inquiries: press@nextedgeai.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Official Statements</p>
            <h2 className="text-3xl md:text-4xl font-black">Press Releases</h2>
          </motion.div>
          <div className="space-y-5">
            {PRESS_RELEASES.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group rounded-2xl border border-white/8 bg-white/2 p-7 hover:border-cyan-400/20 hover:bg-white/3 transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs text-gray-600">{p.date}</span>
                  <span className="text-xs text-gray-700">·</span>
                  <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{p.category}</span>
                  {p.tag && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400 font-semibold">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.excerpt}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">As Featured In</p>
            <h2 className="text-3xl md:text-4xl font-black">Media Coverage</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {MEDIA_COVERAGE.map((m, i) => (
              <motion.div
                key={m.headline}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white/8 bg-white/2 p-6 hover:border-indigo-400/20 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-black text-indigo-400">{m.outlet}</span>
                  <span className="text-xs text-gray-600">{m.date}</span>
                </div>
                <p className="text-sm text-gray-300 font-medium leading-snug italic">"{m.headline}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">Resources</p>
            <h2 className="text-3xl md:text-4xl font-black">Media Kit</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Approved brand assets, executive portraits, and company materials for editorial use.
              Please read our brand guidelines before use.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MEDIA_ASSETS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-white/8 bg-white/3 p-5 flex items-start gap-4 hover:border-cyan-400/20 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg border border-cyan-400/20 bg-cyan-400/5 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors duration-300">{a.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-cyan-400 font-medium">{a.type}</span>
                    <span className="text-xs text-gray-600">{a.size}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href="mailto:press@nextedgeai.com"
              className="cursor-none inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-400/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-400/5 transition-colors duration-300"
            >
              Request media kit access
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Press Contact</h2>
            <p className="text-gray-400 mb-2">For interview requests, press passes, and exclusive access:</p>
            <p className="text-lg font-semibold text-cyan-400 mb-8">press@nextedgeai.com</p>
            <p className="text-sm text-gray-500">We respond to all press inquiries within one business day.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
