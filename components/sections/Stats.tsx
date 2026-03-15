'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  {
    value:  500,
    suffix: '+',
    label:  'Projects Delivered',
    sub:    'Across film, ads & digital',
    color:  'text-cyan-400',
    bg:     'from-cyan-500/10 to-transparent',
  },
  {
    value:  98,
    suffix: '%',
    label:  'Client Satisfaction',
    sub:    'Average across all engagements',
    color:  'text-indigo-400',
    bg:     'from-indigo-500/10 to-transparent',
  },
  {
    value:  50,
    suffix: '+',
    label:  'International Awards',
    sub:    'Cannes, Clio, D&AD & more',
    color:  'text-amber-400',
    bg:     'from-amber-500/10 to-transparent',
  },
  {
    value:  12,
    suffix: '+',
    label:  'Countries Served',
    sub:    'Global creative presence',
    color:  'text-emerald-400',
    bg:     'from-emerald-500/10 to-transparent',
  },
]

function AnimatedCounter({ end, suffix, color, started }: {
  end: number; suffix: string; color: string; started: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    const duration = 2200
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [started, end])

  return (
    <span className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tabular-nums ${color}`}>
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top 95%',
        onEnter: () => setStarted(true),
      })
      gsap.fromTo('.stats-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats-heading', start: 'top 95%' } }
      )
      gsap.fromTo('.stat-block',
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.stats-grid', start: 'top 95%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="stats" ref={sectionRef} className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #07070f 0%, #06060c 50%, #07070f 100%)'
      }} />
      <div className="absolute inset-0 grid-bg opacity-30" />
      {/* Accent radial */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        {/* Heading */}
        <div className="stats-heading text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-amber-400">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            By the Numbers
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight">
            Numbers That<br/>
            <span className="text-gradient">Define Our Impact</span>
          </h2>
        </div>

        {/* Stats grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`stat-block relative rounded-3xl p-5 sm:p-8 border border-white/6 overflow-hidden card-hover`}
              style={{ background: `linear-gradient(135deg, ${s.bg.split(' ')[1].replace('from-','').replace('/10','')}18, transparent)` }}
            >
              {/* Gradient fill */}
              <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} pointer-events-none`} />

              <div className="relative">
                <AnimatedCounter end={s.value} suffix={s.suffix} color={s.color} started={started} />
                <h3 className="text-lg font-bold text-white mt-3 mb-1">{s.label}</h3>
                <p className="text-sm text-gray-500">{s.sub}</p>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-gray-600">
                <span className="text-xs font-mono">0{i + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-1 p-1 rounded-2xl glass-light">
          {[
            { label: 'Average Delivery Time',   value: '3–6 weeks' },
            { label: 'Pipeline Throughput',     value: '10× faster than traditional' },
            { label: 'Cost Reduction',          value: 'Up to 70% vs. legacy production' },
          ].map((item) => (
            <div key={item.label} className="p-5 text-center">
              <div className="text-xl font-black text-gradient mb-1">{item.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
