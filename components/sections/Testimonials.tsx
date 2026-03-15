'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    quote:   "NextEdgeAI didn't just produce a film for us — they built an entirely new creative language for our brand. The speed and quality were unlike anything we'd experienced with a traditional production house.",
    name:    'Serena Malone',
    role:    'Chief Marketing Officer',
    company: 'Apex Media Group',
    avatar:  'SM',
    rating:  5,
    accent:  '#22d3ee',
  },
  {
    quote:   "I was sceptical that AI could match the emotional depth of human filmmaking. What NextEdgeAI delivered with 'EchoVerse' changed my entire perspective. This is the future — and it's already here.",
    name:    'David Kowalski',
    role:    'Executive Producer',
    company: 'Luminary Studios',
    avatar:  'DK',
    rating:  5,
    accent:  '#f59e0b',
  },
  {
    quote:   "Six weeks from brief to premiere. Twelve million viewers in month one. The 'Silent Protocol' series exceeded every KPI we set. NextEdgeAI is genuinely in a class of their own.",
    name:    'Yuki Tanaka',
    role:    'Head of Content Strategy',
    company: 'Novu Streaming',
    avatar:  'YT',
    rating:  5,
    accent:  '#818cf8',
  },
  {
    quote:   "The Virtual Production environment they built for 'Aurora' was breathtaking — you'd never know it wasn't Iceland. Our engagement rates tripled compared to our previous fragrance campaign.",
    name:    'Isabelle Fontaine',
    role:    'VP Brand Experience',
    company: 'Celestiq Parfums',
    avatar:  'IF',
    rating:  5,
    accent:  '#f472b6',
  },
  {
    quote:   "What sets NextEdgeAI apart is the rare combination of cutting-edge technology AND genuine storytelling instinct. They understand both the algorithm and the human heart — which is extraordinarily rare.",
    name:    'Marcus Reid',
    role:    'Creative Director',
    company: 'Stormcast Entertainment',
    avatar:  'MR',
    rating:  5,
    accent:  '#34d399',
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.testimonials-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-heading', start: 'top 95%' } }
      )
      gsap.fromTo('.testimonial-card',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 95%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        {/* Heading */}
        <div className="testimonials-heading text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-rose-400">
            <span className="w-1 h-1 rounded-full bg-rose-400" />
            Social Proof
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            What Our Clients<br/>
            <span className="text-gradient">Have to Say</span>
          </h2>
          <p className="max-w-md mx-auto text-gray-400 text-lg">
            Real results. Real relationships. Real stories from the brands we've helped transform.
          </p>
        </div>

        {/* Cards — first row */}
        <div className="testimonials-grid space-y-5">
          {/* Top row — 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div
                key={t.name}
                className="testimonial-card group relative rounded-2xl p-7 border border-white/6 glass-light card-hover overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
                  style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />

                <div className="quote-mark select-none">"</div>
                <StarRating count={t.rating} />
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: `${t.accent}33`, border: `1px solid ${t.accent}44` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Bottom row — 2 wide cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.slice(3).map((t) => (
              <div
                key={t.name}
                className="testimonial-card group relative rounded-2xl p-7 border border-white/6 glass-light card-hover overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
                  style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />

                <div className="quote-mark select-none">"</div>
                <StarRating count={t.rating} />
                <p className="text-gray-300 text-base leading-relaxed mb-6 italic">"{t.quote}"</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: `${t.accent}33`, border: `1px solid ${t.accent}44` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {[
            { label: 'Verified Reviews', value: '500+', icon: '✓' },
            { label: 'Net Promoter Score', value: '94', icon: '↑' },
            { label: 'Repeat Client Rate', value: '87%', icon: '⟳' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 font-bold">
                {item.icon}
              </span>
              <div>
                <div className="font-black text-white">{item.value}</div>
                <div className="text-gray-500 text-xs">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
