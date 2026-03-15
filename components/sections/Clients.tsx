'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Brand placeholder logos (text-based wordmarks)
const ROW_A = [
  { name: 'APEX MEDIA',   color: '#22d3ee' },
  { name: 'LUMINARY',     color: '#f59e0b' },
  { name: 'NOVU',         color: '#818cf8' },
  { name: 'STORMCAST',    color: '#34d399' },
  { name: 'VANTA AI',     color: '#f472b6' },
  { name: 'DEEPFRAME',    color: '#60a5fa' },
  { name: 'CINEX LABS',   color: '#a78bfa' },
  { name: 'PARALLAX CO',  color: '#6ee7b7' },
]

const ROW_B = [
  { name: 'NEONBRIDGE',   color: '#fb923c' },
  { name: 'RIFTWORKS',    color: '#38bdf8' },
  { name: 'CELESTIQ',     color: '#c084fc' },
  { name: 'IRONLEAF',     color: '#4ade80' },
  { name: 'AXIOM FILMS',  color: '#fbbf24' },
  { name: 'HELIX BRAND',  color: '#22d3ee' },
  { name: 'PRISMWORKS',   color: '#f87171' },
  { name: 'ZENHIVE',      color: '#a3e635' },
]

function LogoStrip({ items, reverse = false }: { items: typeof ROW_A; reverse?: boolean }) {
  const doubled = [...items, ...items]

  return (
    <div className="flex overflow-hidden mask-fade-x">
      <div
        className={`flex items-center gap-12 whitespace-nowrap ${
          reverse ? 'animate-marquee2' : 'animate-marquee'
        }`}
        style={{ willChange: 'transform' }}
      >
        {doubled.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex items-center justify-center h-12 px-6 rounded-xl glass-light
                       group cursor-none transition-all duration-300 hover:scale-105 shrink-0"
          >
            <span
              className="text-sm font-black tracking-[0.18em] uppercase transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = brand.color)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
            >
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.clients-heading',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.clients-heading', start: 'top 95%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="clients" ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#06060c]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10 mb-12 px-6">
        <div className="clients-heading text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-violet-400">
            <span className="w-1 h-1 rounded-full bg-violet-400" />
            Our Clients
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Trusted by <span className="text-gradient">Forward-Thinking Brands</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            From emerging DTC startups to global entertainment conglomerates — they all chose NextEdgeAI.
          </p>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4 relative z-10">
        <LogoStrip items={ROW_A} />
        <LogoStrip items={ROW_B} reverse />
      </div>

      {/* CSS for fade edges */}
      <style jsx>{`
        .mask-fade-x {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
      `}</style>
    </section>
  )
}
