/**
 * lib/animations.ts
 * ─────────────────────────────────────────────────────────────────────
 * Reusable GSAP ScrollTrigger animation presets used across sections.
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

/** Fade & slide up — cinematic blur dissolve */
export function fadeUp(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 88%', delay = 0, duration = 1.0, ease = 'power4.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 65, filter: 'blur(6px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)', duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Staggered fade up for lists/grids — premium stagger with scale */
export function staggerFadeUp(selector: string, opts: AnimOptions & { stagger?: number } = {}) {
  const { trigger, start = 'top 82%', delay = 0, duration = 0.9, ease = 'power4.out', stagger = 0.12 } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 60, scale: 0.93, filter: 'blur(4px)' },
    {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration, delay, ease, stagger,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Cinematic text reveal — skew + blur + rise */
export function textReveal(selector: string, opts: AnimOptions & { stagger?: number } = {}) {
  const { trigger, start = 'top 88%', delay = 0, duration = 1.1, ease = 'power4.out', stagger = 0.08 } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 80, skewY: 4, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', duration, delay, ease, stagger,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Slide in from left */
export function slideLeft(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 88%', delay = 0, duration = 1.0, ease = 'power4.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, x: -80, filter: 'blur(4px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)', duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Slide in from right */
export function slideRight(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 88%', delay = 0, duration = 1.0, ease = 'power4.out' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, x: 80, filter: 'blur(4px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)', duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Scale into view with spring feel */
export function scaleIn(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 88%', delay = 0, duration = 0.85, ease = 'back.out(1.6)' } = opts
  return gsap.fromTo(
    selector,
    { opacity: 0, scale: 0.72, filter: 'blur(6px)' },
    {
      opacity: 1, scale: 1, filter: 'blur(0px)', duration, delay, ease,
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Cinematic stagger for section headings — label then heading then sub */
export function sectionEntrance(
  labelSel: string,
  headingSel: string,
  subSel: string,
  triggerEl: string | Element
) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: triggerEl, start: 'top 82%' }
  })
  tl.fromTo(labelSel,
    { opacity: 0, y: 20, scale: 0.9 },
    { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: 'power3.out' }
  )
  .fromTo(headingSel,
    { opacity: 0, y: 55, skewY: 3, filter: 'blur(8px)' },
    { opacity: 1, y: 0,  skewY: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' },
    '-=0.4'
  )
  .fromTo(subSel,
    { opacity: 0, y: 30, filter: 'blur(4px)' },
    { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
    '-=0.6'
  )
  return tl
}

/** Parallax scrolling — pin free, scrubbed */
export function parallax(selector: string, yPercent: number, opts: TriggerOptions = {}) {
  const { trigger, start = 'top bottom', end = 'bottom top', scrub = 1.5 } = opts
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

/** Horizontal scroll reveal — scrubbed with momentum feel */
export function scrollRevealX(selector: string, distance: number, opts: TriggerOptions = {}) {
  const { trigger, start = 'top bottom', end = 'bottom top', scrub = 2 } = opts
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

/** Subtle background parallax for section orbs/blobs */
export function bgParallax(selector: string, opts: TriggerOptions = {}) {
  const { trigger, start = 'top bottom', end = 'bottom top', scrub = 2 } = opts
  return gsap.fromTo(
    selector,
    { yPercent: -18 },
    {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? selector, start, end, scrub },
    }
  )
}

/** Counter animation — must be called outside gsap.context */
export function animateCounter(
  element: HTMLElement,
  end: number,
  duration = 2.2,
  onUpdate: (v: number) => void
) {
  const obj = { value: 0 }
  return gsap.to(obj, {
    value:    end,
    duration,
    ease:     'power3.out',
    onUpdate: () => onUpdate(Math.round(obj.value)),
    scrollTrigger: {
      trigger: element,
      start:   'top 80%',
      once:    true,
    },
  })
}

/** Section divider line draw */
export function drawLine(selector: string, opts: AnimOptions = {}) {
  const { trigger, start = 'top 88%', duration = 1.0, delay = 0 } = opts
  return gsap.fromTo(
    selector,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1, duration, delay, ease: 'power4.inOut',
      scrollTrigger: { trigger: trigger ?? selector, start },
    }
  )
}

/** Pin a section and scrub content — cinematic horizontal wipe */
export function pinnedScrub(
  pinEl: string | Element,
  animateEl: string,
  opts: TriggerOptions = {}
) {
  const { start = 'top top', end = '+=100%', scrub = 1 } = opts
  return gsap.fromTo(
    animateEl,
    { xPercent: 0 },
    {
      xPercent:      -100,
      ease:          'none',
      scrollTrigger: { trigger: pinEl, pin: true, start, end, scrub },
    }
  )
}

/* ─── ScrollTrigger helpers ──────────────────────────────────────────── */

export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}

export function killAll() {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
