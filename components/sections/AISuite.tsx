'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SCENE_IMAGES = ['/1.png', '/2.png', '/3.png', '/4.png']

function VisualGenesisGrid() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950/60 to-[#0a0a18] border border-white/8">
        <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
          {SCENE_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}
              className="rounded-xl overflow-hidden relative cursor-pointer group"
              onClick={() => setLightbox(i)}
            >
              <img
                src={src}
                alt={`Scene ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <span className="absolute bottom-1 left-1 text-[9px] text-white/60 uppercase tracking-wider bg-black/40 px-1 rounded">Scene {i + 1}</span>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 glass-light rounded-xl px-3 py-2 text-xs text-gray-300">
          <span className="text-indigo-400">●</span> Generating 4 variations...
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={SCENE_IMAGES[lightbox]}
                alt={`Scene ${lightbox + 1}`}
                className="w-full rounded-2xl shadow-2xl"
              />
              <span className="absolute bottom-4 left-4 text-xs text-white/60 uppercase tracking-wider bg-black/50 px-2 py-1 rounded-lg">
                Scene {lightbox + 1}
              </span>
              {/* Prev / Next */}
              {lightbox > 0 && (
                <button
                  onClick={() => setLightbox(lightbox - 1)}
                  className="absolute left-[-3rem] top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {lightbox < SCENE_IMAGES.length - 1 && (
                <button
                  onClick={() => setLightbox(lightbox + 1)}
                  className="absolute right-[-3rem] top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors bg-black/50 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const FEATURES = [
  {
    id:      'script',
    label:   '01',
    title:   'Script Intelligence',
    sub:     'AI-powered narrative analysis',
    desc:    'Our proprietary NLP engine reads your screenplay, identifies pacing issues, character arc gaps, and market viability signals — then offers scene-by-scene rewrites to strengthen narrative tension and audience retention.',
    bullets: ['Automated script coverage', 'Character emotion mapping', 'Genre tone calibration', 'Market comparison analysis'],
    accent:  '#22d3ee',
    visual: (
      <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#0a0a18] border border-white/8 p-6">
        <div className="space-y-3">
          {['INT. NEXUS LAB — NIGHT', '  ARIA:', '    "The model is learning faster than we', '     anticipated. It\'s rewriting itself."', 'Beat. A long silence.', '  DIRECTOR:', '    "How much faster?"'].map((line, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`font-mono text-xs leading-relaxed ${
                line.startsWith('  ') ? 'text-cyan-300' : 'text-gray-400'
              } ${line.startsWith('INT') ? 'text-amber-300 font-semibold' : ''}`}
            >
              {line}
            </motion.div>
          ))}
        </div>
        {/* AI score overlay */}
        <div className="absolute bottom-4 right-4 glass-light rounded-xl p-3 text-xs">
          <div className="text-gray-400 mb-1">Tension Score</div>
          <div className="text-2xl font-black text-cyan-400">9.2<span className="text-xs text-gray-500">/10</span></div>
        </div>
      </div>
    ),
  },
  {
    id:      'visual',
    label:   '02',
    title:   'Visual Genesis',
    sub:     'Generative world creation',
    desc:    'Transform text prompts and mood boards into fully realised photorealistic environments. Our diffusion-based pipeline generates production-ready concept art, location references, and lighting studies at 10× the speed of traditional design.',
    bullets: ['Photorealistic concept art', 'Environment mood-boarding', 'Style-locked generation', 'Lighting & atmosphere control'],
    accent:  '#818cf8',
    visual: <VisualGenesisGrid />,
  },
  {
    id:      'neural',
    label:   '03',
    title:   'Neural Cinema',
    sub:     'AI rendering pipeline',
    desc:    'Our Neural Cinema engine combines deep learning super-resolution, AI-driven colour science, and temporal upscaling to produce feature-film-grade footage from any source — automatically colour-graded to your chosen cinematic reference.',
    bullets: ['4K → 8K AI upscaling', 'Cinematic colour grading', 'Temporal noise reduction', 'Auto-grade per scene'],
    accent:  '#f59e0b',
    visual: (
      <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#0a0a18] border border-white/8 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500 ml-2 font-mono">neural_render.pipeline</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Input Quality',    val: 40,  color: 'bg-gray-600' },
            { label: 'AI Enhancement',   val: 88,  color: 'bg-amber-500' },
            { label: 'Colour Science',   val: 95,  color: 'bg-cyan-400' },
            { label: 'Final Output',     val: 100, color: 'bg-gradient-to-r from-cyan-400 to-amber-400' },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 shrink-0">{row.label}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.val}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  className={`h-full ${row.color} rounded-full`}
                />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{row.val}%</span>
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 right-5 glass-light rounded-xl p-3 text-xs text-center">
          <div className="text-2xl font-black text-amber-400">8K</div>
          <div className="text-gray-500">Output</div>
        </div>
      </div>
    ),
  },
  {
    id:      'character',
    label:   '04',
    title:   'Deep Character',
    sub:     'AI actor simulation',
    desc:    'Create photorealistic synthetic performers or enhance real talent with AI. Our Deep Character system delivers consistent facial performance, emotional nuance, and age/appearance transformations — fully non-destructive and ethically licensed.',
    bullets: ['Synthetic actor generation', 'Facial performance transfer', 'Age-range transformation', 'Ethical licence framework'],
    accent:  '#f472b6',
    visual: (
      <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#0a0a18] border border-white/8 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 p-6 w-full">
          {['Frame 001', 'Frame 048', 'Frame 120'].map((f, i) => (
            <div key={f} className="aspect-[3/4] rounded-xl bg-gradient-to-b from-pink-900/30 to-[#0a0a18] border border-white/8 flex flex-col items-center justify-end pb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 mb-2 border border-white/10" />
              <span className="text-[9px] text-gray-500">{f}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-4 right-4 glass-light rounded-xl px-3 py-2 text-xs text-pink-400">
          ● Deep Character Active
        </div>
      </div>
    ),
  },
]

export default function AISuite() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.suite-intro',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.suite-intro', start: 'top 80%' } }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const feature = FEATURES[active]

  return (
    <section id="suite" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#06060c]" />
      {/* Radial accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)` }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        {/* Heading */}
        <div className="suite-intro text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-indigo-400">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            Technology
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight mb-6">
            The AI Production <span className="text-gradient">Suite</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-base sm:text-lg">
            Four interconnected AI engines that cover every stage of cinematic creation —
            from the first word to the final frame.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={`cursor-none px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                active === i
                  ? 'text-white border border-white/20'
                  : 'text-gray-500 border border-white/5 hover:text-gray-300 hover:border-white/15'
              }`}
              style={active === i ? { background: `${f.accent}22`, borderColor: `${f.accent}44`, color: f.accent } : {}}
            >
              <span className="mr-2 text-xs opacity-50">{f.label}</span>
              {f.title}
            </button>
          ))}
        </div>

        {/* Feature content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text */}
            <div>
              <div className="section-divider mb-6" style={{ background: `linear-gradient(90deg, ${feature.accent}, transparent)` }} />
              <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: feature.accent }}>
                {feature.sub}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {feature.desc}
              </p>
              <ul className="space-y-3">
                {feature.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: feature.accent }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual */}
            <div>{feature.visual}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
