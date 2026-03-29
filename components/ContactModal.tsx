'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactForm from '@/components/ContactForm'

export default function ContactModal() {
  const [open, setOpen] = useState(false)
  const scrollYRef = useRef(0)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-contact-modal', handler)
    return () => window.removeEventListener('open-contact-modal', handler)
  }, [])

  // Lock background page scroll via position:fixed
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const savedY = scrollYRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      // Restore scroll AFTER styles are cleared so the page is scrollable again
      window.scrollTo({ top: savedY, behavior: 'instant' })
    }
  }, [open])

  // JS wheel handler on the overlay div.
  // CSS-based scroll routing is unreliable on Windows Chrome when transforms
  // or stacking contexts are involved. We handle wheel events manually:
  // stopPropagation prevents the event ever reaching the body,
  // preventDefault blocks any native scroll attempt,
  // then we directly drive scrollTop ourselves.
  useEffect(() => {
    if (!open) return
    const overlay = overlayRef.current
    if (!overlay) return

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation()
      e.preventDefault()
      overlay.scrollTop += e.deltaY
    }

    overlay.addEventListener('wheel', onWheel, { passive: false })
    return () => overlay.removeEventListener('wheel', onWheel)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="contact-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/*
            Overlay: fixed full-screen scroll container.
            overflow-y-auto + the JS wheel handler above together guarantee
            scrolling works on all browsers regardless of inner transforms.
          */}
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[91] overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Animated card — no overflow or height constraints, grows freely */}
              <motion.div
                key="contact-modal-panel"
                initial={{ opacity: 0, y: 48, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-2xl my-4 rounded-3xl"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a3e 0%, #06060c 70%)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-7 pb-4 border-b border-white/5 rounded-t-3xl"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a3e 0%, #06060c 70%)' }}
                >
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs uppercase tracking-[0.18em] text-cyan-400 mb-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                      New Projects Open
                    </div>
                    <h2 className="text-2xl font-black text-white">Start a Project</h2>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="cursor-none w-9 h-9 rounded-full glass-light border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors shrink-0"
                    aria-label="Close modal"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form body */}
                <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6">
                  <ContactForm />
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
