'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContactForm from '@/components/ContactForm'

export default function ContactModal() {
  const [open, setOpen] = useState(false)

  // Listen for the global event fired by the "Start a Project" button
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-contact-modal', handler)
    return () => window.removeEventListener('open-contact-modal', handler)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
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

          {/* Panel */}
          <motion.div
            key="contact-modal-panel"
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl pointer-events-auto"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, #0d1a3e 0%, #06060c 70%)' }}
            >
              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-8 pt-7 pb-4 border-b border-white/5"
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

              {/* Form */}
              <div className="px-8 pb-8 pt-6">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
