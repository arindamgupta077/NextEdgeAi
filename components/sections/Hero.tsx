'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'

/* ─── Particle canvas ───────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number }
    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.2 + 0.3,
      a:  Math.random() * 0.5 + 0.1,
      da: (Math.random() - 0.5) * 0.002,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x  += p.vx; p.y  += p.vy; p.a  += p.da
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        if (p.a > 0.7 || p.a < 0.05)        p.da *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34,211,238,${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden />
}

/* ─── Floating badge ────────────────────────────────────────────────── */
function FloatingBadge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl glass-light text-sm font-medium ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────── */
export default function Hero() {
  const heroRef  = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yHeading = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Magnetic CTA buttons
  const btnRef1 = useRef<HTMLButtonElement>(null)
  const btnRef2 = useRef<HTMLButtonElement>(null)

  const makeMagnetic = useCallback((ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current
    if (!btn) return
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect()
      const x = e.clientX - r.left - r.width  / 2
      const y = e.clientY - r.top  - r.height / 2
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
    }
    const onLeave = () => { btn.style.transform = '' }
    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave) }
  }, [])

  useEffect(() => {
    const cleanup1 = makeMagnetic(btnRef1)
    const cleanup2 = makeMagnetic(btnRef2)
    return () => { cleanup1?.(); cleanup2?.() }
  }, [makeMagnetic])

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-tag',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
      )
      gsap.fromTo('.hero-line-1',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out', delay: 0.5 }
      )
      gsap.fromTo('.hero-line-2',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out', delay: 0.65 }
      )
      gsap.fromTo('.hero-line-3',
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out', delay: 0.8 }
      )
      gsap.fromTo('.hero-sub',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.1 }
      )
      gsap.fromTo('.hero-ctas',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.3 }
      )
      gsap.fromTo('.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2 }
      )
      gsap.fromTo('.hero-stats .stat-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.6, stagger: 0.15 }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const scrollToContact = () => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Layered background ── */}
      <div className="absolute inset-0 bg-[#06060c]" />

      {/* Gradient nebulas */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-100"
          style={{ background: 'radial-gradient(circle at 30% 40%, rgba(34,211,238,0.09) 0%, transparent 65%)' }} />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(99,102,241,0.08) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[500px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 80%, rgba(6,182,212,0.06) 0%, transparent 65%)' }} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Particle field */}
      <ParticleField />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-[1px] pointer-events-none z-10 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)',
          animation: 'scanLine 5s linear infinite',
        }}
      />

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #06060c)' }} />

      {/* ── Content ── */}
      <motion.div
        style={{ y: yHeading, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-20 sm:pt-24"
      >
        {/* Studio tag */}
        <div className="hero-tag opacity-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-light mb-10 text-xs uppercase tracking-[0.2em] text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
          AI Film Production Studio · Est. 2024
        </div>

        {/* Headline */}
        <div className="overflow-hidden mb-2">
          <h1 className="hero-line-1 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]
                          font-black leading-none tracking-tight">
            <span className="text-gradient-hero">THE FUTURE</span>
          </h1>
        </div>
        <div className="overflow-hidden mb-2">
          <h1 className="hero-line-2 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]
                          font-black leading-none tracking-tight text-white">
            OF CINEMA IS
          </h1>
        </div>
        <div className="overflow-hidden mb-10">
          <h1 className="hero-line-3 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem]
                          font-black leading-none tracking-tight">
            <span className="text-gradient">INTELLIGENT</span>
          </h1>
        </div>

        {/* Sub */}
        <p className="hero-sub opacity-0 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-8 sm:mb-12">
          We merge the power of artificial intelligence with cinematic artistry to create
          films, campaigns, and visual universes that captivate, convert, and endure.
        </p>

        {/* CTAs */}
        <div className="hero-ctas opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            ref={btnRef1}
            onClick={scrollToContact}
            className="magnetic-btn cursor-none group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base font-semibold overflow-hidden transition-transform duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full" />
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-40 group-hover:opacity-70 transition-opacity duration-300 scale-110" />
            <span className="relative z-10 flex items-center gap-2 text-white">
              Work With Us
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </button>

          <button
            ref={btnRef2}
            onClick={scrollToPortfolio}
            className="magnetic-btn cursor-none group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base font-medium overflow-hidden transition-transform duration-300"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
            <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors" />
            <span className="relative z-10 flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Portfolio
            </span>
          </button>
        </div>

        {/* Mini stats */}
        <div className="hero-stats flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-14">
          {[
            { value: '500+', label: 'Projects Delivered' },
            { value: '98%',  label: 'Client Satisfaction' },
            { value: '50+',  label: 'Global Awards' },
          ].map((s) => (
            <div key={s.label} className="stat-item opacity-0 flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-black text-gradient">{s.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating badges */}
      <FloatingBadge className="top-[28%] left-[5%]">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-gray-300">AI Rendering Active</span>
      </FloatingBadge>
      <FloatingBadge className="top-[38%] right-[5%]">
        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14M3 8h12v8H3z"/>
        </svg>
        <span className="text-gray-300">4K · RAW · AI-Enhanced</span>
      </FloatingBadge>
      <FloatingBadge className="bottom-[25%] left-[7%]">
        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        <span className="text-gray-300">Award-winning studio</span>
      </FloatingBadge>

      {/* Scroll indicator */}
      <div className="hero-scroll opacity-0 absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-cyan-400" />
        </motion.div>
      </div>
    </section>
  )
}
