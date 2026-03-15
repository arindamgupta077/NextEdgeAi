/**
 * lib/animations.ts
 * ─────────────────────────────────────────────────────────────────────
 * Reusable GSAP ScrollTrigger animation presets used across sections.
 * Import the function you need and call it inside useEffect with
 * gsap.context() for automatic cleanup.
 *
 * Usage example:
 *   import { fadeUp, staggerFadeUp } from '@/lib/animations'
 *   useEffect(() => {
 *     const ctx = gsap.context(() => {
 *       fadeUp('.my-element', { trigger: '.my-section' })
 *     }, sectionRef)
 *     return () => ctx.revert()
 *   }, [])
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ─── Types ─────────────────────────────────────────────────────────── */
type TriggerOptions = {
  trigger?:    string | Element
  start?:      string
  end?:        string
  scrub?:      boolean | number
  markers?:    boolean
  pin?:        boolean
}

type AnimOptions = TriggerOptions & {
  delay?:    number
  duration?: number
  ease?:     string
}

/* ─── Core presets ───────────────────────────────────────────────────── */

/** Fade & slide up */
export function fadeUp(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 85%', delay = 0, duration = 0.85, ease = 'power3.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0, duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Staggered fade up for lists/grids */
export function staggerFadeUp(selector: string, opts: AnimOptions & { stagger?: number } = {}) {
  const { trigger, start = 'top 80%', delay = 0, duration = 0.75, ease = 'power3.out', stagger = 0.1 } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 50, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1, duration, delay, ease, stagger,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Slide in from left */
export function slideLeft(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 85%', delay = 0, duration = 0.9, ease = 'power3.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, x: -60 },
    {
      opacity: 1, x: 0, duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Slide in from right */
export function slideRight(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 85%', delay = 0, duration = 0.9, ease = 'power3.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0, duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Scale into view */
export function scaleIn(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 85%', delay = 0, duration = 0.7, ease = 'back.out(1.4)' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, scale: 0.75 },
    {
      opacity: 1, scale: 1, duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Parallax scrolling — pin free, scrubbed */
export function parallax(selector: string, yPercent: number, opts: TriggerOptions = {}) {
  const { trigger, start = 'top bottom', end = 'bottom top', scrub = 1 } = opts
  return gsap.fromTo(
    selector,
    { yPercent: -yPercent },
    {
      yPercent,
      ease:          'none',
      scrollTrigger: { trigger: trigger ?? selector, start, end, scrub },
    }
  )
}

/** Horizontal marquee-like scroll reveal — scrubbed */
export function scrollRevealX(selector: string, distance: number, opts: TriggerOptions = {}) {
  const { trigger, start = 'top bottom', end = 'bottom top', scrub = 1.5 } = opts
  return gsap.fromTo(
    selector,
    { x: distance },
    {
      x:             0,
      ease:          'none',
      scrollTrigger: { trigger: trigger ?? selector, start, end, scrub },
    }
  )
}

/** Counter animation — must be called outside gsap.context */
export function animateCounter(
  element: HTMLElement,
  end: number,
  duration = 2,
  onUpdate: (v: number) => void
) {
  const obj = { value: 0 }
  return gsap.to(obj, {
    value:    end,
    duration,
    ease:     'power2.out',
    onUpdate: () => onUpdate(Math.round(obj.value)),
    scrollTrigger: {
      trigger: element,
      start:   'top 75%',
      once:    true,
    },
  })
}

/** Section divider line draw */
export function drawLine(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 85%', duration = 0.8, delay = 0 } = opts
  return gsap.fromTo(
    selector,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1, duration, delay, ease: 'power3.inOut',
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/* ─── ScrollTrigger helpers ──────────────────────────────────────────── */

/** Refresh all ScrollTrigger instances (call after dynamic content loads) */
export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}

/** Kill all ScrollTrigger instances */
export function killAll() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
