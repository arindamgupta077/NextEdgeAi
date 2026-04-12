'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using NextEdgeAI's website, platform, or any of our services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.

These Terms constitute a legally binding agreement between you (or the company or legal entity you represent) and NextEdgeAI ("Company", "we", "us", or "our"). If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have authority to bind that entity.`,
  },
  {
    id: 'services',
    title: '2. Description of Services',
    content: `NextEdgeAI provides AI-powered film production, advertising campaign production, virtual production services, narrative strategy, and related creative and technology services (collectively, the "Services"). Specific services, deliverables, timelines, and fees for each project are set out in a separate Project Agreement or Statement of Work executed between NextEdgeAI and the client.

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time, with reasonable notice to active clients.`,
  },
  {
    id: 'accounts',
    title: '3. Accounts and Access',
    content: `To access certain features of our platform, you may need to create an account. You are responsible for:

- Providing accurate, current, and complete information when creating your account
- Maintaining the confidentiality of your account credentials
- All activities that occur under your account
- Notifying us immediately at security@nextedgeai.com of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or remain inactive for more than 24 months.`,
  },
  {
    id: 'intellectual-property',
    title: '4. Intellectual Property',
    content: `**NextEdgeAI Properties:** Our website, platform, proprietary AI technology, software, algorithms, model weights, interfaces, and original NextEdgeAI brand content are owned by NextEdgeAI and protected by applicable intellectual property laws. Nothing in these Terms grants you any rights to our underlying technology or brand assets.

**Client-Commissioned Work:** Intellectual property rights in final deliverables produced specifically for a client project are governed by the applicable Project Agreement. Unless explicitly stated otherwise in a signed Project Agreement, final deliverables are licensed (not sold) for the uses specified therein.

**Client-Provided Materials:** You retain ownership of all materials, assets, brand marks, and creative inputs you provide to us. By providing such materials, you grant NextEdgeAI a limited license to use them solely to deliver the agreed services.

**AI Training:** We do not use client-specific project materials or deliverables to train our AI models without explicit, separate written consent.`,
  },
  {
    id: 'payment',
    title: '5. Fees and Payment',
    content: `All fees for services are as set forth in the applicable Project Agreement. Unless otherwise specified:

- Project fees are invoiced according to the milestone schedule in the Project Agreement
- Invoices are due and payable within 30 days of issuance
- Late payments accrue interest at 1.5% per month (or the maximum allowed by applicable law, if lower)
- We reserve the right to suspend service delivery for accounts overdue by more than 30 days

All fees are exclusive of taxes. You are responsible for all applicable taxes, levies, and duties imposed by taxing authorities in connection with your use of our services.`,
  },
  {
    id: 'confidentiality',
    title: '6. Confidentiality',
    content: `Each party agrees to keep confidential all non-public information of the other party that is disclosed in connection with the services ("Confidential Information"). This obligation survives termination of these Terms for 5 years.

Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this agreement; (b) was rightfully known to the receiving party before disclosure; (c) is independently developed without use of Confidential Information; or (d) is required to be disclosed by law or court order, provided the disclosing party is given prompt prior notice where permitted.`,
  },
  {
    id: 'warranties',
    title: '7. Warranties and Disclaimers',
    content: `We warrant that we will deliver services in a professional manner consistent with industry standards. NextEdgeAI does not warrant that:

- Services will meet every specific creative expectation beyond what is agreed in the Project Agreement
- AI-generated outputs will be free from errors, artifacts, or unexpected variations
- The website or platform will be uninterrupted or error-free

THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" TO THE FULLEST EXTENT PERMITTED BY LAW. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, EXCEPT AS EXPRESSLY SET OUT HERE.`,
  },
  {
    id: 'limitation',
    title: '8. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXTEDGEAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING FROM YOUR USE OF THE SERVICES.

Our total aggregate liability to you for any claims arising under or related to these Terms shall not exceed the fees paid by you to NextEdgeAI in the 12-month period preceding the claim.

Nothing in these Terms excludes or limits our liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be limited by applicable law.`,
  },
  {
    id: 'indemnification',
    title: '9. Indemnification',
    content: `You agree to indemnify, defend, and hold harmless NextEdgeAI and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to:

- Your violation of these Terms
- Your use of the Services in breach of any applicable law
- Any materials or content you provide to us that infringe the rights of any third party
- Any misrepresentation you make in connection with the Services`,
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: `Either party may terminate a project or service engagement as specified in the applicable Project Agreement. We may terminate or suspend your access to our website or platform immediately if you materially breach these Terms and fail to cure such breach within 10 days of written notice.

Upon termination, provisions of these Terms that by their nature should survive will survive, including intellectual property rights, payment obligations, confidentiality, disclaimers, and limitations of liability.`,
  },
  {
    id: 'governing-law',
    title: '11. Governing Law and Disputes',
    content: `These Terms are governed by and construed in accordance with the laws of the applicable jurisdiction in which NextEdgeAI operates, without regard to its conflict-of-law provisions.

Any dispute arising out of these Terms that cannot be resolved amicably within 30 days of written notice shall be submitted to binding arbitration in accordance with the rules of a mutually agreed arbitration body. Judgment on any arbitration award may be entered in any court of competent jurisdiction.

Nothing prevents either party from seeking urgent injunctive or equitable relief in any court of competent jurisdiction.`,
  },
  {
    id: 'general',
    title: '12. General Provisions',
    content: `**Entire Agreement:** These Terms, together with the Privacy Policy and any applicable Project Agreement, constitute the entire agreement between you and NextEdgeAI regarding the Services.

**Severability:** If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect.

**Waiver:** Our failure to enforce any provision of these Terms does not constitute a waiver of our right to enforce it in the future.

**Assignment:** You may not assign these Terms or any rights under them without our prior written consent. We may assign our rights and obligations under these Terms in connection with a merger, acquisition, or sale of assets.

**Updates:** We may update these Terms from time to time. Material changes will be notified via email or prominent website notice at least 14 days before taking effect.

For questions about these Terms, contact: legal@nextedgeai.com`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Terms of Service</h1>
            <p className="text-gray-400 mb-2">Last Updated: April 1, 2026</p>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Please read these Terms of Service carefully before using NextEdgeAI's services. These terms
              govern your use of our website, platform, and all production services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            {/* TOC */}
            <aside className="md:col-span-1 hidden md:block">
              <div className="sticky top-24">
                <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Contents</p>
                <nav className="space-y-2">
                  {SECTIONS.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="cursor-none block text-xs text-gray-500 hover:text-cyan-400 transition-colors duration-200 leading-snug"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Body */}
            <div className="md:col-span-3 space-y-12">
              {SECTIONS.map((s, i) => (
                <motion.div
                  key={s.id}
                  id={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-white">{s.title}</h2>
                  <div className="text-sm text-gray-400 leading-relaxed">
                    {s.content.split('\n\n').map((para, pi) => (
                      <p key={pi} className="mb-3" dangerouslySetInnerHTML={{
                        __html: para
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
                          .replace(/^- /gm, '• ')
                      }} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
