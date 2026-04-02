'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'

/* ─── Aurora Plasma canvas ──────────────────────────────────────────── */
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    resize()

    /* ── Aurora ribbon streams ─────────────────────────────────────── */
    type Stream = {
      yBase:  number       // vertical centre (0–1 of H)
      height: number       // ribbon thickness (0–1 of H)
      peakAlpha: number    // max fill opacity
      rgb:    string       // r,g,b
      phases: number[]     // per-segment wave phase offsets
      freqs:  number[]     // per-segment frequency multipliers
      amps:   number[]     // per-segment wave amplitude (0–1 of H)
      speed:  number       // time multiplier
    }

    const STREAMS: Stream[] = [
      {
        yBase:     0.15,  height: 0.30, peakAlpha: 0.11, rgb: '34,211,238',
        phases:    [0, 1.4, 2.8, 4.2, 5.6, 0.7, 2.1],
        freqs:     [0.5, 0.8, 0.4, 0.7, 0.6, 0.5, 0.9],
        amps:      [0.06, 0.09, 0.05, 0.08, 0.07, 0.06, 0.08],
        speed:     0.20,
      },
      {
        yBase:     0.38,  height: 0.26, peakAlpha: 0.09, rgb: '99,102,241',
        phases:    [1.6, 3.1, 0.4, 4.5, 2.0, 3.8, 1.1],
        freqs:     [0.6, 0.4, 0.9, 0.5, 0.7, 0.6, 0.4],
        amps:      [0.08, 0.05, 0.10, 0.06, 0.09, 0.07, 0.05],
        speed:     0.15,
      },
      {
        yBase:     0.58,  height: 0.28, peakAlpha: 0.08, rgb: '139,92,246',
        phases:    [3.2, 0.6, 2.3, 5.1, 1.4, 4.0, 2.9],
        freqs:     [0.4, 0.7, 0.5, 0.9, 0.6, 0.4, 0.7],
        amps:      [0.05, 0.08, 0.07, 0.09, 0.05, 0.08, 0.06],
        speed:     0.17,
      },
      {
        yBase:     0.76,  height: 0.22, peakAlpha: 0.08, rgb: '6,182,212',
        phases:    [2.4, 4.0, 1.2, 5.8, 0.9, 3.1, 4.7],
        freqs:     [0.7, 0.5, 0.6, 0.4, 0.8, 0.7, 0.5],
        amps:      [0.06, 0.07, 0.05, 0.08, 0.06, 0.05, 0.07],
        speed:     0.22,
      },
    ]

    /* ── Depth bokeh orbs ──────────────────────────────────────────── */
    type Bokeh = {
      xF: number; yF: number; r: number
      alpha: number; phase: number; freqY: number; ampY: number; rgb: string
    }
    const BOKEH_RGB = ['34,211,238','99,102,241','139,92,246','6,182,212','59,130,246']
    const bokeh: Bokeh[] = Array.from({ length: 15 }, (_, i) => ({
      xF:    Math.random(),
      yF:    Math.random(),
      r:     90 + Math.random() * 180,
      alpha: 0.022 + Math.random() * 0.038,
      phase: Math.random() * Math.PI * 2,
      freqY: 0.12 + Math.random() * 0.28,
      ampY:  25 + Math.random() * 60,
      rgb:   BOKEH_RGB[i % BOKEH_RGB.length],
    }))

    /* ── Horizontal energy pulses ──────────────────────────────────── */
    type Pulse = { y: number; alpha: number; life: number; maxLife: number; lw: number; rgb: string }
    let pulses: Pulse[] = []
    let nextPulse = 100 + Math.random() * 160

    let time = 0
    let raf: number

    /* Draw one aurora ribbon */
    const drawStream = (s: Stream, t: number) => {
      const SEGS = s.phases.length
      const segW = W / (SEGS - 1)
      const halfH = s.height * H * 0.5

      const midY = (i: number) =>
        s.yBase * H + Math.sin(t * s.speed * s.freqs[i] + s.phases[i]) * s.amps[i] * H
      const topY = (i: number) =>
        midY(i) - halfH * (0.55 + 0.45 * Math.cos(t * s.speed * 0.45 + s.phases[i] * 0.6))
      const botY = (i: number) =>
        midY(i) + halfH * (0.55 + 0.45 * Math.sin(t * s.speed * 0.45 + s.phases[i] * 0.6 + 1.1))

      const topPts = Array.from({ length: SEGS }, (_, i) => ({ x: i * segW, y: topY(i) }))
      const botPts = Array.from({ length: SEGS }, (_, i) => ({ x: i * segW, y: botY(i) }))

      ctx.beginPath()
      ctx.moveTo(topPts[0].x, topPts[0].y)
      for (let i = 0; i < topPts.length - 1; i++) {
        const mx = (topPts[i].x + topPts[i + 1].x) / 2
        const my = (topPts[i].y + topPts[i + 1].y) / 2
        ctx.quadraticCurveTo(topPts[i].x, topPts[i].y, mx, my)
      }
      ctx.lineTo(topPts[SEGS - 1].x, topPts[SEGS - 1].y)
      ctx.lineTo(botPts[SEGS - 1].x, botPts[SEGS - 1].y)
      for (let i = SEGS - 1; i > 0; i--) {
        const mx = (botPts[i].x + botPts[i - 1].x) / 2
        const my = (botPts[i].y + botPts[i - 1].y) / 2
        ctx.quadraticCurveTo(botPts[i].x, botPts[i].y, mx, my)
      }
      ctx.closePath()

      // Vertical gradient — transparent edges, bright centre
      const minY = Math.min(...topPts.map(p => p.y), ...botPts.map(p => p.y))
      const maxY = Math.max(...topPts.map(p => p.y), ...botPts.map(p => p.y))
      const vg = ctx.createLinearGradient(0, minY, 0, maxY)
      const a = s.peakAlpha * (0.8 + 0.2 * Math.sin(t * s.speed * 1.8 + s.phases[0]))
      vg.addColorStop(0,   `rgba(${s.rgb},0)`)
      vg.addColorStop(0.25, `rgba(${s.rgb},${a})`)
      vg.addColorStop(0.5, `rgba(${s.rgb},${a})`)
      vg.addColorStop(0.75, `rgba(${s.rgb},${a * 0.8})`)
      vg.addColorStop(1,   `rgba(${s.rgb},0)`)
      ctx.fillStyle = vg
      ctx.fill()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      time += 0.007

      /* Bokeh orbs */
      bokeh.forEach(b => {
        const x = b.xF * W
        const y = b.yF * H + Math.sin(time * b.freqY + b.phase) * b.ampY
        const a = b.alpha * (0.7 + 0.3 * Math.sin(time * b.freqY * 1.6 + b.phase))
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r)
        g.addColorStop(0,    `rgba(${b.rgb},${a})`)
        g.addColorStop(0.4,  `rgba(${b.rgb},${a * 0.45})`)
        g.addColorStop(1,    `rgba(${b.rgb},0)`)
        ctx.beginPath()
        ctx.arc(x, y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      /* Aurora ribbons */
      STREAMS.forEach(s => drawStream(s, time))

      /* Edge-fade overlay — blend ribbons into background on left/right */
      const lf = ctx.createLinearGradient(0, 0, W * 0.1, 0)
      lf.addColorStop(0, 'rgba(6,6,12,1)')
      lf.addColorStop(1, 'rgba(6,6,12,0)')
      ctx.fillStyle = lf
      ctx.fillRect(0, 0, W * 0.1, H)

      const rf = ctx.createLinearGradient(W * 0.9, 0, W, 0)
      rf.addColorStop(0, 'rgba(6,6,12,0)')
      rf.addColorStop(1, 'rgba(6,6,12,1)')
      ctx.fillStyle = rf
      ctx.fillRect(W * 0.9, 0, W * 0.1, H)

      /* Energy scan pulses */
      nextPulse--
      if (nextPulse <= 0) {
        const PULSE_RGB = ['34,211,238','99,102,241','139,92,246']
        pulses.push({
          y:       0.1 * H + Math.random() * 0.8 * H,
          alpha:   0,
          life:    0,
          maxLife: 60 + Math.floor(Math.random() * 50),
          lw:      0.35 + Math.random() * 0.55,
          rgb:     PULSE_RGB[Math.floor(Math.random() * PULSE_RGB.length)],
        })
        nextPulse = 80 + Math.floor(Math.random() * 130)
      }
      pulses = pulses.filter(p => p.life < p.maxLife)
      pulses.forEach(p => {
        p.life++
        p.alpha =
          p.life < 12            ? p.life / 12
          : p.life > p.maxLife - 16 ? (p.maxLife - p.life) / 16
          : 1
        const pg = ctx.createLinearGradient(0, p.y, W, p.y)
        pg.addColorStop(0,    `rgba(${p.rgb},0)`)
        pg.addColorStop(0.12, `rgba(${p.rgb},${p.alpha * 0.3})`)
        pg.addColorStop(0.5,  `rgba(${p.rgb},${p.alpha * 0.55})`)
        pg.addColorStop(0.88, `rgba(${p.rgb},${p.alpha * 0.3})`)
        pg.addColorStop(1,    `rgba(${p.rgb},0)`)
        ctx.beginPath()
        ctx.moveTo(0, p.y)
        ctx.lineTo(W, p.y)
        ctx.strokeStyle = pg
        ctx.lineWidth = p.lw
        ctx.stroke()
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

/* ─── CountUp ──────────────────────────────────────────────────────── */
function CountUp({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = (now - startTime) / 1000
            const progress = Math.min(elapsed / duration, 1)
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count}{suffix}</span>
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
      // Stagger all hero elements from a timeline for perfect choreography
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo('.hero-tag',
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.9 },
        0.3
      )
      tl.fromTo('.hero-line-1',
        { opacity: 0, y: 90, skewY: 5, filter: 'blur(8px)' },
        { opacity: 1, y: 0,  skewY: 0, filter: 'blur(0px)', duration: 1.1 },
        0.5
      )
      tl.fromTo('.hero-line-2',
        { opacity: 0, y: 90, skewY: 5, filter: 'blur(8px)' },
        { opacity: 1, y: 0,  skewY: 0, filter: 'blur(0px)', duration: 1.1 },
        0.65
      )
      tl.fromTo('.hero-line-3',
        { opacity: 0, y: 90, skewY: 5, filter: 'blur(8px)' },
        { opacity: 1, y: 0,  skewY: 0, filter: 'blur(0px)', duration: 1.1 },
        0.8
      )
      tl.fromTo('.hero-sub',
        { opacity: 0, y: 36, filter: 'blur(4px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 1.0 },
        1.1
      )
      tl.fromTo('.hero-ctas',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0,  duration: 0.9 },
        1.3
      )

      tl.fromTo('.hero-stats .stat-item',
        { opacity: 0, y: 28, scale: 0.88 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.8, stagger: 0.18 },
        1.55
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

      {/* Gradient nebulas — animated aurora drift */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-nebula-1 absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 45%, rgba(34,211,238,0.11) 0%, transparent 60%)', animation: 'nebulaDrift 18s ease-in-out infinite alternate' }} />
        <div className="hero-nebula-2 absolute top-10 right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle at 65% 28%, rgba(99,102,241,0.1) 0%, transparent 60%)', animation: 'nebulaDrift 22s ease-in-out 4s infinite alternate-reverse' }} />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle at 50% 80%, rgba(6,182,212,0.07) 0%, transparent 60%)', animation: 'nebulaDrift 26s ease-in-out 8s infinite alternate' }} />
        <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)', animation: 'nebulaDrift 14s ease-in-out 2s infinite alternate-reverse' }} />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Aurora Plasma — flowing ribbon bands + bokeh depth */}
      <AuroraCanvas />

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
        className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-16 sm:pt-20"
      >
        {/* Studio tag */}
        <div className="hero-tag opacity-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-light mb-4 text-xs uppercase tracking-[0.2em] text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
          AI Film Production Studio · Est. 2024
        </div>

        {/* Headline */}
        <div className="overflow-hidden mb-2">
          <h1 className="hero-line-1 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]
                          font-black leading-none tracking-tight">
            <span className="text-gradient-hero">THE FUTURE</span>
          </h1>
        </div>
        <div className="overflow-hidden mb-2">
          <h1 className="hero-line-2 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]
                          font-black leading-none tracking-tight text-white">
            OF CINEMA IS
          </h1>
        </div>
        <div className="overflow-hidden mb-4">
          <h1 className="hero-line-3 opacity-0 text-[1.85rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]
                          font-black leading-none tracking-tight">
            <span className="text-gradient">INTELLIGENT</span>
          </h1>
        </div>

        {/* Sub */}
        <p className="hero-sub opacity-0 max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed mb-4 sm:mb-5">
          We merge the power of artificial intelligence with cinematic artistry to create
          films, campaigns, and visual universes that captivate, convert, and endure.
        </p>

        {/* CTAs */}
        <div className="hero-ctas opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
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
            { end: 500, suffix: '+', label: 'Projects Delivered' },
            { end: 98,  suffix: '%', label: 'Client Satisfaction' },
            { end: 50,  suffix: '+', label: 'Global Awards' },
          ].map((s) => (
            <div key={s.label} className="stat-item opacity-0 flex flex-col items-center gap-1">
              <span className="text-2xl md:text-3xl font-black text-gradient">
                <CountUp end={s.end} suffix={s.suffix} duration={4} />
              </span>
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


    </section>
  )
}
