'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const TECH_PILLARS = [
  {
    number: '01',
    title: 'Generative Visual Intelligence',
    desc: 'Our proprietary GVI engine synthesizes photorealistic environments, characters, and cinematography from text and reference inputs. Built on diffusion-based architectures fine-tuned on thousands of hours of cinematic footage.',
    tags: ['Diffusion Models', 'NeRF', 'Gaussian Splatting', '4K Output'],
    accent: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-400/20',
    text: 'text-cyan-400',
  },
  {
    number: '02',
    title: 'AI Narrative Engine',
    desc: 'A large-language-model-powered story system that understands genre, pacing, character arc, and audience psychology. It generates, iterates, and stress-tests scripts against proven cinematic frameworks.',
    tags: ['LLM Fine-tuning', 'Story Graphs', 'Sentiment Analysis', 'Script Analysis'],
    accent: 'from-indigo-500/20 to-indigo-500/5',
    border: 'border-indigo-400/20',
    text: 'text-indigo-400',
  },
  {
    number: '03',
    title: 'Virtual Production Suite',
    desc: 'Real-time AI environment generation integrated with LED volume stages and Unreal Engine. Directors can explore and modify generated worlds live on set, collapsing weeks of pre-production into hours.',
    tags: ['Unreal Engine 5', 'LED Volume', 'Real-Time AI', 'Motion Capture'],
    accent: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-400/20',
    text: 'text-violet-400',
  },
  {
    number: '04',
    title: 'AI Performance Direction',
    desc: 'Our APD system analyzes actor performances in real time, providing directors with instant feedback on emotional authenticity, continuity, and audience resonance scores — measured against our proprietary cinematic data model.',
    tags: ['Computer Vision', 'Emotion AI', 'Facial Tracking', 'Performance Scoring'],
    accent: 'from-pink-500/20 to-pink-500/5',
    border: 'border-pink-400/20',
    text: 'text-pink-400',
  },
  {
    number: '05',
    title: 'Intelligent Post-Production',
    desc: 'Automated color grading, sound design, VFX compositing, and editorial assembly — all guided by AI systems trained on award-winning films. What once took months now takes days.',
    tags: ['AI Color Grading', 'Audio AI', 'VFX Automation', 'Smart Editing'],
    accent: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-400/20',
    text: 'text-amber-400',
  },
  {
    number: '06',
    title: 'Audience Intelligence Platform',
    desc: 'Before a project ships, our AIP simulates audience responses across demographics, optimizing cuts, pacing, and messaging for maximum impact. We measure emotion, not just clicks.',
    tags: ['Predictive Analytics', 'A/B Testing', 'Emotion Modeling', 'Market Simulation'],
    accent: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-400/20',
    text: 'text-emerald-400',
  },
]

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Our Technology</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              The Engine Behind<br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Every Story
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NextEdgeAI's proprietary technology stack is purpose-built for cinematic production —
              merging state-of-the-art AI with battle-tested filmmaking craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro banner */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
            {['Generative AI', 'Real-Time Rendering', 'NLP Story Systems', 'Computer Vision', 'Predictive Analytics', 'Cloud Pipeline'].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-xs text-gray-400 font-medium tracking-wide"
              >
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Pillars */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Core Systems</p>
            <h2 className="text-3xl md:text-4xl font-black">Six Technology Pillars</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Each pillar is a standalone system — together, they form a seamless end-to-end AI production pipeline.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {TECH_PILLARS.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`rounded-2xl border ${p.border} bg-gradient-to-br ${p.accent} p-7 backdrop-blur-sm hover:scale-[1.01] transition-transform duration-300`}
              >
                <span className={`text-4xl font-black ${p.text} opacity-40 block mb-3`}>{p.number}</span>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border ${p.border} ${p.text} bg-white/3`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-black">From Brief to Broadcast</h2>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: '1', title: 'Brief', desc: 'Your story goals, brand identity, and audience profile feed directly into our AI intake system.' },
                { step: '2', title: 'Concept', desc: 'Narrative AI generates multiple story concepts and visual treatments in hours.' },
                { step: '3', title: 'Production', desc: 'Virtual sets, AI directors and real talent come together in our production suite.' },
                { step: '4', title: 'Post', desc: 'Intelligent editing, color, sound design and VFX — automated and refined.' },
                { step: '5', title: 'Deliver', desc: 'Optimized content packages for every platform, format, and audience segment.' },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full border border-cyan-400/30 bg-[#06060c] flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-black text-cyan-400">{s.step}</span>
                  </div>
                  <h3 className="font-bold mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Curious How It Powers Your Story?</h2>
            <p className="text-gray-400 mb-8">Talk to our team about how our technology can serve your creative vision.</p>
            <Link
              href="/"
              className="cursor-none inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow duration-500"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
