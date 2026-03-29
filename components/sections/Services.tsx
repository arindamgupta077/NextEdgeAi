'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createClient } from '@/lib/supabase/client'
import { SERVICE_ICONS, SERVICE_THEMES } from '@/lib/serviceIcons'

gsap.registerPlugin(ScrollTrigger)

type ServiceDisplay = {
  id?:     string | number
  icon:    ReactNode
  title:   string
  tagline: string
  desc:    string
  color:   string
  border:  string
  glow:    string
  image?:  string
}

const HARDCODED: ServiceDisplay[] = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h1.5m-1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M13.125 16.125h7.5" />
      </svg>
    ),
    title:   'AI Film Production',
    tagline: 'Stories at machine speed',
    desc:    'End-to-end AI-assisted film pipeline — from intelligent script breakdowns to automated scene generation, voice synthesis, and cinematic post-production.',
    color:   'from-cyan-500/20 to-blue-500/5',
    border:  'hover:border-cyan-400/30',
    glow:    'rgba(34,211,238,0.12)',
    image:   '/1.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
    title:   'Advertising Campaigns',
    tagline: 'Brand stories that convert',
    desc:    'Data-driven, visually groundbreaking ad campaigns powered by generative AI — from concept ideation to final delivery across every platform.',
    color:   'from-indigo-500/20 to-purple-500/5',
    border:  'hover:border-indigo-400/30',
    glow:    'rgba(99,102,241,0.12)',
    image:   '/2.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
    title:   'Digital Commercials',
    tagline: 'High-impact video ads',
    desc:    'Hyper-targeted video commercials engineered for engagement — combining AI aesthetics, precision storytelling, and performance-optimised editing.',
    color:   'from-blue-500/20 to-cyan-500/5',
    border:  'hover:border-blue-400/30',
    glow:    'rgba(59,130,246,0.12)',
    image:   '/3.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title:   'Virtual Production',
    tagline: 'LED volume · real-time renders',
    desc:    'Cutting-edge virtual production environments merging LED volume stages, Unreal Engine real-time rendering and AI-generated backgrounds.',
    color:   'from-teal-500/20 to-cyan-500/5',
    border:  'hover:border-teal-400/30',
    glow:    'rgba(20,184,166,0.12)',
    image:   '/4.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
      </svg>
    ),
    title:   'Micro-Dramas',
    tagline: 'Short-form narrative content',
    desc:    'Emotionally compact vertical-format micro-dramas crafted for the attention economy — binge-worthy, algorithm-friendly, and beautifully produced.',
    color:   'from-rose-500/20 to-pink-500/5',
    border:  'hover:border-rose-400/30',
    glow:    'rgba(244,63,94,0.12)',
    image:   '/5.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title:   'Visual World-Building',
    tagline: 'Immersive universe creation',
    desc:    'AI-driven concept art, environment design, and visual development that builds rich, coherent universes for your film, series, or brand.',
    color:   'from-violet-500/20 to-purple-500/5',
    border:  'hover:border-violet-400/30',
    glow:    'rgba(139,92,246,0.12)',
    image:   '/6.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title:   'IP Development',
    tagline: 'Original intellectual property',
    desc:    'From a single idea to a transmedia franchise — AI-accelerated concept development, character design, lore creation, and distribution strategy.',
    color:   'from-amber-500/20 to-orange-500/5',
    border:  'hover:border-amber-400/30',
    glow:    'rgba(245,158,11,0.12)',
    image:   '/7.png',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title:   'Storytelling Universes',
    tagline: 'Expanded narrative ecosystems',
    desc:    'Long-form multiverse storytelling across film, series, games, and XR — building cohesive narrative worlds powered by AI continuity engines.',
    color:   'from-emerald-500/20 to-green-500/5',
    border:  'hover:border-emerald-400/30',
    glow:    'rgba(16,185,129,0.12)',
    image:   '/8.png',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [displayServices, setDisplayServices] = useState<ServiceDisplay[]>(HARDCODED)
  const [selectedSvc, setSelectedSvc] = useState<ServiceDisplay | null>(null)

  // Fetch from Supabase; fall back to hardcoded data if DB is empty
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDisplayServices(
            data.map(s => ({
              id:      s.id,
              icon:    SERVICE_ICONS[s.icon_name as string] ?? SERVICE_ICONS.sparkles,
              title:   s.title,
              tagline: s.tagline,
              desc:    s.description,
              color:   SERVICE_THEMES[s.color_theme as string]?.color ?? SERVICE_THEMES.cyan.color,
              border:  SERVICE_THEMES[s.color_theme as string]?.border ?? SERVICE_THEMES.cyan.border,
              glow:    SERVICE_THEMES[s.color_theme as string]?.glow  ?? SERVICE_THEMES.cyan.glow,
              image:   s.image_url ?? undefined,
            }))
          )
        }
      })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.services-heading', start: 'top 85%' } }
      )
      gsap.fromTo('.service-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.services-grid', start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#07070f]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        {/* Heading */}
        <div className="services-heading text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-cyan-400">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            What We Create
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Services Built for<br/>
            <span className="text-gradient">The Next Era</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed">
            Eight specialised capabilities fused with AI to deliver production
            quality that was once unimaginable — now at your fingertips.
          </p>
        </div>

        {/* Grid */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayServices.map((svc) => (
            <div
              key={svc.id != null ? String(svc.id) : svc.title}
              onClick={() => setSelectedSvc(svc)}
              className={`service-card group relative rounded-2xl cursor-pointer
                          border border-white/6 ${svc.border}
                          transition-all duration-400 card-hover overflow-hidden`}
            >
              {/* Full card image */}
              {svc.image && (
                <div className="absolute inset-0">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark gradient over the bottom so text is legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                </div>
              )}

              {/* Fallback gradient background (when no image) */}
              {!svc.image && (
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.color}`} />
              )}

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${svc.glow} 0%, transparent 70%)` }}
              />

              {/* Content — sits over the image */}
              <div className="relative z-10 flex flex-col justify-end min-h-[280px] p-4 sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300 mb-1.5 group-hover:text-cyan-400 transition-colors">
                  {svc.tagline}
                </p>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">{svc.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{svc.desc}</p>

                {/* Arrow */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSvc(svc) }}
                  className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-cyan-400 transition-colors"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Learn more</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
              </div>

              {/* Animated border line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-indigo-400 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedSvc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedSvc(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a] shadow-2xl`}
          >
            {/* Modal image */}
            {selectedSvc.image && (
              <div className="relative w-full aspect-video">
                <Image src={selectedSvc.image} alt={selectedSvc.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d1a]" />
              </div>
            )}

            {/* Glow accent */}
            <div
              className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${selectedSvc.glow} 0%, transparent 70%)` }}
            />

            <div className="relative p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-2">{selectedSvc.tagline}</p>
              <h3 className="text-2xl font-black text-white mb-4 leading-tight">{selectedSvc.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{selectedSvc.desc}</p>

              <button
                onClick={() => setSelectedSvc(null)}
                className="mt-8 w-full py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Close ✕ */}
            <button
              onClick={() => setSelectedSvc(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
