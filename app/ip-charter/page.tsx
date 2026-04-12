'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const PRINCIPLES = [
  {
    number: '01',
    title: 'Human Authorship & Creative Stewardship',
    content: `All NextEdgeAI productions are the product of intentional human creative direction. Our AI systems are tools — they operate under the guidance, curation, and final judgment of human artists and directors.

We assert that creative ownership in AI-assisted production resides with the human creators who direct, select, refine, and assemble the final work. AI outputs without human authorial input do not qualify as NextEdgeAI productions.`,
    accent: 'text-cyan-400',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-400/5',
  },
  {
    number: '02',
    title: 'Ownership of AI-Generated Deliverables',
    content: `Subject to the terms of any applicable client Project Agreement and these IP Charter principles:

- **Client-commissioned deliverables:** Final video, audio, and visual deliverables produced for a client project are licensed to the commissioning client for the uses specified in the Project Agreement.
- **Original NextEdgeAI content:** Independently developed films, campaigns, story universes, and creative assets created without client commission remain the exclusive intellectual property of NextEdgeAI.
- **AI model outputs:** Raw AI-generated outputs (images, video clips, audio stems, text) produced using NextEdgeAI systems are not themselves owned by any single party until assembled and directed into a final work under human creative supervision.`,
    accent: 'text-indigo-400',
    border: 'border-indigo-400/20',
    bg: 'bg-indigo-400/5',
  },
  {
    number: '03',
    title: 'Third-Party Training Data & Model Ethics',
    content: `NextEdgeAI is committed to ethical AI model development:

- We do not use identifiable personal likenesses, private images, or copyrighted works in AI training without appropriate licenses or consent.
- Our proprietary models are trained on licensed datasets, synthetically generated data, and content for which we hold appropriate rights.
- We actively monitor developments in AI copyright law and adjust our practices to comply with evolving legal standards across all jurisdictions in which we operate.
- We support the development of industry-wide standards for training data attribution and artist compensation.`,
    accent: 'text-violet-400',
    border: 'border-violet-400/20',
    bg: 'bg-violet-400/5',
  },
  {
    number: '04',
    title: 'Client Material & Brand Asset Protection',
    content: `When clients provide brand assets, footage, scripts, or other proprietary materials:

- Such materials are used solely to deliver the agreed project scope.
- We do not incorporate client-provided materials into AI training datasets without explicit, separate written consent.
- Client materials are stored with enterprise-grade security and deleted from active systems within 90 days of project completion unless longer retention is contractually agreed.
- We maintain strict access controls ensuring that client materials are accessible only to the team members directly assigned to that project.`,
    accent: 'text-pink-400',
    border: 'border-pink-400/20',
    bg: 'bg-pink-400/5',
  },
  {
    number: '05',
    title: 'AI-Assisted vs. AI-Generated Disclosure',
    content: `We believe in transparency about AI's role in our productions. NextEdgeAI applies the following disclosure standards:

- Productions where AI plays a significant generative role in final visuals, audio, or script will be disclosed as "AI-assisted" or "AI-generated" in credits and materials as appropriate.
- We will not represent AI-produced content as entirely human-made where AI contribution is material.
- We support emerging industry standards and regulations requiring disclosure of AI-generated media, including synthetic media watermarking and provenance metadata.`,
    accent: 'text-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/5',
  },
  {
    number: '06',
    title: 'NextEdgeAI Technology IP',
    content: `Our proprietary systems — including but not limited to the Generative Visual Intelligence (GVI) engine, AI Narrative Engine, Audience Intelligence Platform, and Virtual Production Suite — are the exclusive intellectual property of NextEdgeAI.

Clients and partners receive no rights to our underlying technology through a project engagement. Reverse engineering, copying, or attempting to replicate our systems is strictly prohibited.

We actively file for patent protection on novel methods developed by our AI Research team and welcome collaborations with academic and industry partners under appropriate IP agreements.`,
    accent: 'text-emerald-400',
    border: 'border-emerald-400/20',
    bg: 'bg-emerald-400/5',
  },
  {
    number: '07',
    title: 'Storytelling Universe & World-Building IP',
    content: `Where NextEdgeAI originates or co-develops story universes, characters, and narrative worlds:

- Independently originated universes are the exclusive IP of NextEdgeAI and protected as literary and audiovisual works.
- Co-developed IP is governed by a co-development agreement specifying ownership splits, exploitation rights, and revenue sharing.
- Clients commissioning within-universe content for brand integration receive a limited, non-exclusive license to use such content for agreed marketing purposes only.
- No client campaign engagement grants rights to exploit, extend, or adapt NextEdgeAI story universes or characters beyond the specific approved use.`,
    accent: 'text-cyan-400',
    border: 'border-cyan-400/20',
    bg: 'bg-cyan-400/5',
  },
  {
    number: '08',
    title: 'Enforcement & Reporting',
    content: `NextEdgeAI actively monitors for unauthorized use of our IP and AI-generated content and will pursue enforcement where violations occur.

If you believe your intellectual property has been used without authorization in connection with NextEdgeAI services, please contact us immediately at ip@nextedgeai.com with a detailed description of the claimed infringement.

We are committed to resolving good-faith IP concerns promptly and fairly.`,
    accent: 'text-indigo-400',
    border: 'border-indigo-400/20',
    bg: 'bg-indigo-400/5',
  },
]

export default function IPCharterPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Legal</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              IP Charter
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              NextEdgeAI's Intellectual Property Charter outlines how we create, own, protect, and license
              content in the age of AI — clearly, ethically, and transparently.
            </p>
            <p className="text-sm text-gray-600 mt-4">Effective: April 1, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Preamble */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-cyan-400/15 bg-cyan-400/4 p-8"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Preamble</p>
            <p className="text-gray-300 leading-relaxed">
              The emergence of generative AI in creative industries raises complex, evolving questions about
              authorship, ownership, and attribution. NextEdgeAI is committed to navigating these questions with
              clarity and integrity. This IP Charter reflects our current principles and practices, and will be
              updated as legal standards, technology, and industry norms evolve. It is a living document.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3">Our Framework</p>
            <h2 className="text-3xl md:text-4xl font-black">Eight Core Principles</h2>
          </motion.div>
          <div className="space-y-6">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border ${p.border} ${p.bg} p-8`}
              >
                <div className="flex items-start gap-5">
                  <span className={`text-3xl font-black ${p.accent} opacity-40 flex-shrink-0 leading-none mt-1`}>{p.number}</span>
                  <div>
                    <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                    <div className="text-sm text-gray-400 leading-relaxed space-y-3">
                      {p.content.split('\n\n').map((para, pi) => (
                        <p key={pi} dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
                            .replace(/^- /gm, '• ')
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">IP Questions & Concerns</h2>
            <p className="text-gray-400 mb-2">Our IP & Legal team is here to help.</p>
            <p className="text-lg font-semibold text-cyan-400 mb-4">ip@nextedgeai.com</p>
            <p className="text-sm text-gray-500">
              This charter is reviewed and updated quarterly. Last reviewed: April 1, 2026.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
