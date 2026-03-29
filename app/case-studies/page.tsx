'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'
import ContactModal from '@/components/ContactModal'

/* ─── Types ─────────────────────────────────────────────────────────── */
type Metric = { value: string; label: string }

type CaseStudy = {
  id: number
  tag: string
  title: string
  subtitle: string
  client: string
  industry: string
  challenge: string
  solution: string
  outcome: string
  metrics: Metric[]
  accentColor: string
  accentBg: string
  borderColor: string
  glowColor: string
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    tag: 'AI Feature Film',
    title: 'Odyssey',
    subtitle: 'A sci-fi epic built entirely inside an AI pipeline — from script to screen in 8 weeks.',
    client: 'Independent Studio',
    industry: 'Feature Film',
    challenge:
      'The production house had a €2.4M traditional budget estimate and an 18-month shoot schedule. Locations, cast, crews, VFX vendors, and post-production houses each added layers of cost, coordination overhead, and schedule risk. A single weather delay or performer conflict could derail the entire production.',
    solution:
      'We replaced the conventional pipeline with our end-to-end Neural Cinema system. AI-driven script breakdowns informed procedural environment generation, eliminating location costs entirely. Generative character rigs replaced costly extras. Our real-time render engine produced final-quality frames on set, cutting traditional post-production by 80%. A three-person human creative team directed and art-directed everything — the AI executed.',
    outcome:
      'The film wrapped principal photography in 6 weeks, delivered final cut at week 8, and came in at €380,000 total — 84% under the original estimate. It premiered at an international film festival, won Best Visual Innovation, and secured a streaming deal within 10 days of its premiere.',
    metrics: [
      { value: '84%', label: 'Budget Reduction' },
      { value: '8 wks', label: 'Total Delivery' },
      { value: '€380K', label: 'Final Cost' },
      { value: '1 Award', label: 'Best Visual Innovation' },
    ],
    accentColor: '#22d3ee',
    accentBg: 'from-cyan-900/30 via-blue-900/10 to-transparent',
    borderColor: 'border-cyan-400/20',
    glowColor: 'rgba(34,211,238,0.08)',
  },
  {
    id: 2,
    tag: 'AI Commercial',
    title: 'TechVision Global Launch',
    subtitle: 'One global product launch. 14 markets. 92 distinct creative assets. Three weeks.',
    client: 'TechVision Corp',
    industry: 'Consumer Electronics',
    challenge:
      'TechVision needed a simultaneous global campaign across 14 countries, each requiring culturally localised visuals, language-adapted voice-overs, and market-specific calls-to-action. Traditional production would have required 14 separate shoots, local directors, and a minimum 4-month lead time — at a projected cost of €3.1M.',
    solution:
      'Our AI campaign engine generated a single master visual language and then auto-adapted every asset for each market: background environments, talent iterations, on-screen text, and lip-sync voice-overs were all AI-generated and localised in parallel. A human creative director approved every variant. The entire asset library was delivered in three production sprints over 21 days.',
    outcome:
      '92 unique assets delivered across digital, broadcast, and OOH formats. The campaign drove a 4.2× return on ad spend in its first 30 days. TechVision cited the speed-to-market advantage as a key reason they outpaced a competitor who launched the same week with a traditional campaign.',
    metrics: [
      { value: '92', label: 'Unique Assets' },
      { value: '21 days', label: 'Full Delivery' },
      { value: '4.2×', label: 'Return on Ad Spend' },
      { value: '14', label: 'Markets Localised' },
    ],
    accentColor: '#6366f1',
    accentBg: 'from-indigo-900/30 via-purple-900/10 to-transparent',
    borderColor: 'border-indigo-400/20',
    glowColor: 'rgba(99,102,241,0.08)',
  },
  {
    id: 3,
    tag: 'AI Virtual Pre-Production',
    title: 'Meridian — Before the First Camera Rolled',
    subtitle: 'Complete virtual pre-production reduced pre-vis costs by 91% and eliminated shoot day surprises.',
    client: 'Meridian Pictures',
    industry: 'Studio Feature Film',
    challenge:
      'Meridian Pictures had greenlit a large-scale action feature with 34 distinct locations across three continents. Traditional pre-production — location scouting trips, physical pre-visualisation (pre-vis) reels, storyboard iterations, and director tech scouts — was budgeted at €900K and estimated at 7 months before a single scene could shoot.',
    solution:
      'We built fully navigable AI-generated virtual environments for all 34 locations. The director and DPs walked through photorealistic recreations in real time, locking camera angles, lighting rigs, and blocking digitally. Our AI generated 340 storyboard frames from natural-language director notes in under 48 hours. Every department — art, costume, VFX — reviewed and approved their sequences in the virtual environment before production began.',
    outcome:
      'Pre-production completed in 6 weeks at a cost of €82,000 — a 91% reduction. Shoot days ran 23% faster than the schedule because every department had already walked every shot. The film came in €1.8M under its production budget. The director called it "the most prepared I have ever been before day one."',
    metrics: [
      { value: '91%', label: 'Pre-Vis Cost Reduction' },
      { value: '6 wks', label: 'Full Pre-Production' },
      { value: '23%', label: 'Faster Shoot Days' },
      { value: '€1.8M', label: 'Saved on Production' },
    ],
    accentColor: '#f59e0b',
    accentBg: 'from-amber-900/30 via-orange-900/10 to-transparent',
    borderColor: 'border-amber-400/20',
    glowColor: 'rgba(245,158,11,0.08)',
  },
  {
    id: 4,
    tag: 'AI Automotive Commercial',
    title: 'Apex Motors — Zero Location Shoots',
    subtitle: 'Photorealistic AI environments delivered a luxury automotive campaign with no location costs, no weather risk, no permits.',
    client: 'Apex Motors',
    industry: 'Automotive',
    challenge:
      'Luxury automotive campaigns typically require weeks on exotic roads — Iceland, Amalfi Coast, Scottish Highlands — at a fully loaded cost of €600K–€1.2M per hero film. Weather delays alone have cost brands six-figure budget overruns. Apex needed three hero films in eight weeks for a new model launch.',
    solution:
      "We filmed the vehicles in a controlled studio environment against our AI-generated photorealistic environments — mountain roads at golden hour, coastal cliffs in storm light, desert salt flats at dawn. Every environment was art-directed to match the brand's visual style guide. AI compositing seamlessly integrated real vehicle footage with the generated worlds. The result is indistinguishable from a physical location shoot.",
    outcome:
      'Three hero films delivered in 7 weeks at a combined cost of €210,000 versus the €1.8M traditional estimate. Zero weather delays. No permit costs. Infinite iteration capability — Apex requested 14 colour grade variations and alternate environment cuts at no additional shoot cost.',
    metrics: [
      { value: '€210K', label: 'vs €1.8M Traditional' },
      { value: '3 films', label: 'in 7 Weeks' },
      { value: '0', label: 'Location / Permit Costs' },
      { value: '14+', label: 'Free Iterations' },
    ],
    accentColor: '#10b981',
    accentBg: 'from-emerald-900/30 via-teal-900/10 to-transparent',
    borderColor: 'border-emerald-400/20',
    glowColor: 'rgba(16,185,129,0.08)',
  },
  {
    id: 5,
    tag: 'AI Series Pilot',
    title: 'StreamMax — Three Pilots, One Greenlight Decision',
    subtitle: 'A streaming platform needed to evaluate three series concepts before committing to a full production deal.',
    client: 'StreamMax Originals',
    industry: 'Streaming / OTT',
    challenge:
      'StreamMax\'s commissioning process required fully produced pilot episodes before greenlighting a series. Producing even one traditional pilot costs €800K–€2M. Evaluating three distinct concepts simultaneously would have required €3M+ and a 6-month development window — making the process prohibitively expensive for most concepts.',
    solution:
      'We produced AI-generated pilot pre-visualisations for all three concepts in parallel: developed AI character models, generated environment worlds, produced dialogue-driven scene sequences with AI voice performance, and delivered 22-minute pre-vis cuts for each concept. StreamMax\'s creative team and test audiences evaluated all three as if they were complete pilots.',
    outcome:
      'All three pilot pre-vis packages were delivered in 5 weeks at a combined cost of €310,000. StreamMax greenlit two series — a decision they made in week 6 rather than week 32. The commissioned series went into full production with all world-building, character design, and audience research already validated.',
    metrics: [
      { value: '3 pilots', label: 'in 5 Weeks' },
      { value: '€310K', label: 'vs €3M+ Traditional' },
      { value: '2', label: 'Series Greenlit' },
      { value: '26 wks', label: 'Decision Accelerated' },
    ],
    accentColor: '#a78bfa',
    accentBg: 'from-violet-900/30 via-purple-900/10 to-transparent',
    borderColor: 'border-violet-400/20',
    glowColor: 'rgba(167,139,250,0.08)',
  },
]

const WHY_AI_REASONS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Speed to Market',
    body: 'AI pipelines compress months into weeks. In an attention economy, a campaign that launches in 3 weeks beats one that launches in 5 months — regardless of quality parity.',
    accent: '#22d3ee',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Radical Cost Efficiency',
    body: 'Eliminate location fees, per-diem costs, permit delays, weather risk, and logistics overhead. AI production typically delivers 60–90% cost reductions on equivalent creative quality.',
    accent: '#6366f1',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Infinite Iteration',
    body: 'Traditional shoots are locked the moment the set wraps. AI production means you can change the location, the colour grade, the performer\'s wardrobe, or the background country — without reshooting.',
    accent: '#f59e0b',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Data-Driven Creative',
    body: 'AI systems can test dozens of creative directions simultaneously and surface which visual language, pacing, and narrative arc performs best with your audience — before a dollar of media spend.',
    accent: '#10b981',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Borderless Scale',
    body: 'One shoot, 40 markets. AI localisation adapts visuals, voice, on-screen text, and cultural context simultaneously — making global campaigns economically viable for brands of any size.',
    accent: '#a78bfa',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Human Vision, Amplified',
    body: 'AI does not replace creative direction — it removes everything that gets in the way of it. Directors, writers, and brand strategists focus entirely on what matters: the story, the emotion, the idea.',
    accent: '#22d3ee',
  },
]

const AGGREGATE_STATS = [
  { value: '83%', label: 'Average Cost Reduction', sub: 'across all AI-first productions' },
  { value: '5×', label: 'Faster Delivery', sub: 'vs traditional pipeline average' },
  { value: '40+', label: 'Markets Served', sub: 'from a single AI production run' },
  { value: '€9.2M', label: 'Client Savings', sub: 'in 2024–2025 alone' },
]

/* ─── Components ────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase
                     bg-white/5 border border-white/10 text-gray-400">
      <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block" />
      {children}
    </span>
  )
}

function MetricPill({ value, label }: Metric) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-3 rounded-xl bg-white/4 border border-white/8">
      <span className="text-xl font-bold text-white leading-none">{value}</span>
      <span className="text-xs text-gray-500 mt-1 leading-tight">{label}</span>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function CaseStudiesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [openStudy, setOpenStudy] = useState<number | null>(null)

  // Lenis smooth scroll
  useEffect(() => {
    let lenis: InstanceType<typeof import('lenis').default> | null = null
    const init = async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({ duration: 1.3, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
      const raf = (t: number) => { lenis?.raf(t); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    }
    init()
    return () => { lenis?.destroy() }
  }, [])

  return (
    <main className="bg-[#06060c] text-white overflow-x-hidden">
      <CustomCursor />
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-6">
        {/* Background glow grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.07) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionLabel>Case Studies</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
          >
            The Numbers That{' '}
            <span className="text-gradient bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Make the Case
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Real productions. Real clients. Documented results that show why every forward-thinking brand, studio, and filmmaker is going AI-first — and why waiting is the most expensive choice you can make.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
              className="cursor-none group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
            >
              Start Your AI Project
            </button>
            <a href="#case-studies-list"
              className="cursor-none px-7 py-3.5 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300 font-medium text-sm">
              Read the Studies ↓
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Aggregate Stats Bar ──────────────────────────────────── */}
      <section className="relative z-10 py-12 px-6 border-y border-white/6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {AGGREGATE_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-sm font-medium text-white mt-1">{s.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Case Studies List ────────────────────────────────────── */}
      <section id="case-studies-list" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl border ${cs.borderColor} overflow-hidden`}
              style={{ boxShadow: `0 0 60px ${cs.glowColor}` }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cs.accentBg} pointer-events-none`} />

              <div className="relative p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
                      style={{ background: `${cs.accentColor}20`, color: cs.accentColor, border: `1px solid ${cs.accentColor}30` }}
                    >
                      {cs.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{cs.title}</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed">{cs.subtitle}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Client</div>
                      <div className="text-gray-300 font-medium mt-0.5">{cs.client}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Industry</div>
                      <div className="text-gray-300 font-medium mt-0.5">{cs.industry}</div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {cs.metrics.map((m) => (
                    <MetricPill key={m.label} {...m} />
                  ))}
                </div>

                {/* Expandable body */}
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">The Challenge</h4>
                      <p className={`text-gray-400 leading-relaxed text-sm ${openStudy !== cs.id ? 'line-clamp-4 md:line-clamp-none' : ''}`}>
                        {cs.challenge}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Our Solution</h4>
                      <p className={`text-gray-400 leading-relaxed text-sm ${openStudy !== cs.id ? 'line-clamp-4 md:line-clamp-none' : ''}`}>
                        {cs.solution}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500">The Outcome</h4>
                      <p className={`text-gray-400 leading-relaxed text-sm ${openStudy !== cs.id ? 'line-clamp-4 md:line-clamp-none' : ''}`}>
                        {cs.outcome}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenStudy(openStudy === cs.id ? null : cs.id)}
                    className="cursor-none flex items-center gap-2 text-xs font-medium transition-colors duration-200 md:hidden"
                    style={{ color: cs.accentColor }}
                  >
                    {openStudy === cs.id ? 'Show less' : 'Read full case study'}
                    <svg className={`w-3.5 h-3.5 transition-transform ${openStudy === cs.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>

                {/* Footer CTA */}
                <div className="mt-8 pt-6 border-t border-white/6 flex items-center justify-between flex-wrap gap-4">
                  <p className="text-xs text-gray-600">
                    Interested in similar results for your project?
                  </p>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                    className="cursor-none text-xs font-semibold tracking-wide uppercase px-5 py-2 rounded-full transition-all duration-200 hover:brightness-110"
                    style={{ background: `${cs.accentColor}18`, color: cs.accentColor, border: `1px solid ${cs.accentColor}30` }}
                  >
                    Discuss Your Project →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why AI-First ─────────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16 space-y-4"
          >
            <SectionLabel>The Argument for AI-First</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Why Every Forward-Thinking Brand<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"> Is Making the Switch</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              The question is no longer whether AI will change film production and advertising. It already has. The question is whether your competitors will adopt it before you do.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_AI_REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-7 rounded-2xl bg-white/3 border border-white/7 hover:border-white/15 transition-all duration-300"
                style={{ '--glow': r.accent } as React.CSSProperties}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${r.accent}18`, color: r.accent }}>
                  {r.icon}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{r.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Future Section ───────────────────────────────────── */}
      <section className="relative py-24 px-6 border-y border-white/6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-4"
          >
            <SectionLabel>The Near Future</SectionLabel>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              What AI Film Production Looks Like{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">in 2026 and Beyond</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                year: 'Now',
                title: 'Full-Length AI Features at Studio Quality',
                body: 'AI is no longer limited to short-form or stylised content. Full theatrical-quality features are being produced with AI pipelines at a fraction of traditional cost. The barrier between indie and studio quality has effectively collapsed.',
                color: '#22d3ee',
              },
              {
                year: 'Now',
                title: 'Real-Time Brand Campaigns',
                body: 'Brands are running always-on creative pipelines where campaign assets are generated, A/B tested, and refreshed in real time based on audience performance data. Static seasonal campaigns are being replaced by dynamic, AI-driven creative systems.',
                color: '#6366f1',
              },
              {
                year: '2026',
                title: 'AI-Native Virtual Production Studios',
                body: 'Physical LED volume stages are being augmented — and in some cases replaced — by fully virtual AI production environments where directors, DPs, and clients collaborate in photorealistic real-time spaces. No stage rental. No travel. No boundaries.',
                color: '#f59e0b',
              },
              {
                year: '2027',
                title: 'Personalised Film & Advertising at Scale',
                body: 'Hyper-personalisation is the next frontier: the same film or advertisement dynamically adapted at the individual viewer level — tailored city, language, cultural context, product variant, and narrative arc — served in real time. The era of one-size-fits-all content is ending.',
                color: '#10b981',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="p-7 rounded-2xl bg-white/3 border border-white/7 space-y-3"
              >
                <span
                  className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold tracking-widest uppercase"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  {item.year}
                </span>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34,211,238,0.06) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Your Next Production Should Be<br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              AI-First
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            Every week you delay is a week your competitors are closing the gap. Let's talk about your project — what it needs, what it costs traditionally, and what we can deliver instead.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
              className="cursor-none group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(34,211,238,0.35)] hover:scale-[1.02]"
            >
              Start a Conversation
            </button>
            <a
              href="/"
              className="cursor-none px-8 py-4 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/30 transition-all duration-300 font-medium"
            >
              View Our Work
            </a>
          </div>
          <p className="text-xs text-gray-600">
            No obligation. No sales pressure. Just a straight conversation about what's possible.
          </p>
        </motion.div>
      </section>

      <Footer />
      <ContactModal />
    </main>
  )
}
