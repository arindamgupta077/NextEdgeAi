'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FAQS = [
  {
    q: 'What exactly does "AI film production" mean in practice?',
    a: 'It means we use generative AI at every stage — from parsing your brief with NLP to creating concept art, generating synthetic environments, casting AI-assisted performance, running automated editing passes, and delivering colour-graded masters. Human creative directors oversee all outputs to ensure the final result is indistinguishable from (and often superior to) traditional production.',
  },
  {
    q: 'How quickly can you deliver a finished project?',
    a: 'Our benchmark is 3–6 weeks for a full commercial or short film, and 6–12 weeks for a feature or multi-episode series. Traditional equivalents take 6–18 months. Speed depends on revision cycles and complexity — we\'ll give you an exact timeline in our initial scoping call.',
  },
  {
    q: 'What is your minimum budget for a project?',
    a: 'We work with projects starting from $15,000 for a digital commercial or social content package. Brand campaigns and feature films typically start from $80,000. Our AI-driven workflow means you are getting feature-grade quality at a fraction of legacy costs — typically 50–70% less.',
  },
  {
    q: 'Do you work with scripts/ideas from scratch, or do we need to come prepared?',
    a: 'Both. If you have a finished script or creative brief, we execute it. If you have just a vague idea or a single sentence — "a film about hope in a post-AI world" — our Script Intelligence engine and creative strategists will develop it into a full production-ready package before we begin.',
  },
  {
    q: 'What rights do I retain over the final deliverables?',
    a: 'You own 100% of the final deliverables upon full payment. We retain no usage rights to your film, campaign, or content. All synthetic assets created for your project are exclusively yours. We have a strict IP charter and will sign an NDA before any creative work begins.',
  },
  {
    q: 'Is AI-generated content ethically sourced and legally compliant?',
    a: 'Absolutely. We only use models trained on ethically licensed datasets. All synthetic actors have explicit consent frameworks. Our content passes legal review against GDPR, CCPA, SAG-AFTRA guidance, and relevant local content regulations before delivery.',
  },
  {
    q: 'Can you handle visual effects and post-production for existing footage?',
    a: 'Yes — VFX enhancement, AI super-resolution, de-aging, sky replacement, crowd simulation, and full colour pipeline are offered as standalone post-production services. We accept raw footage in any format.',
  },
  {
    q: 'What industries do you typically serve?',
    a: 'Entertainment, luxury retail, automotive, technology, healthcare, fintech, and FMCG are our primary verticals. If your brand has a story to tell, we have the tools to tell it cinematically.',
  },
  {
    q: 'Do you offer ongoing retainer arrangements?',
    a: 'Yes. Many clients retain us on a monthly basis for continuous content output — covering social reels, platform-specific cuts, seasonal campaigns, and IP development. Retainer clients receive priority scheduling and a dedicated creative team.',
  },
]

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-heading',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.faq-heading', start: 'top 85%' } }
      )
      gsap.fromTo('.faq-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.faq-list', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" ref={sectionRef} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#06060c]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-narrow relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Sticky heading */}
          <div className="faq-heading lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light mb-5 text-xs uppercase tracking-[0.18em] text-cyan-400">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Questions<br/>
              <span className="text-gradient">Answered.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Everything you need to know before starting your first AI production project with us.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-xs">?</div>
                Still have questions?
              </div>
              <button
                className="cursor-none w-fit px-5 py-2.5 rounded-full border border-white/15 text-sm text-gray-300 hover:text-white hover:border-white/30 transition-all"
                onClick={() => { const el = document.getElementById('contact'); el?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                Contact our team →
              </button>
            </div>
          </div>

          {/* FAQ list */}
          <div className="faq-list space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item rounded-2xl border transition-all duration-300 overflow-hidden ${
                  open === i
                    ? 'border-cyan-400/25 bg-cyan-400/4'
                    : 'border-white/6 glass-light hover:border-white/12'
                }`}
              >
                <button
                  className="cursor-none w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className={`text-sm md:text-base font-medium leading-snug transition-colors ${
                    open === i ? 'text-white' : 'text-gray-300'
                  }`}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-lg leading-none transition-colors ${
                      open === i ? 'bg-cyan-400/20 text-cyan-400' : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
