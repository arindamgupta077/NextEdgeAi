'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, submit a project inquiry, subscribe to our newsletter, or contact us for support.

**Information you provide:**
- Contact information (name, email address, phone number, company name)
- Project details and creative briefs submitted through our intake forms
- Communications you send us, including emails and messages through our platform
- Payment information (processed securely through third-party payment processors; we do not store card numbers)

**Information collected automatically:**
- Log data (IP address, browser type, operating system, referring URLs, pages visited, time stamps)
- Device information (device type, unique device identifiers)
- Cookies and similar tracking technologies (see our Cookie Settings for details)
- Usage data about how you interact with our website and services`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- Provide, operate, and improve our services and website
- Process project inquiries and manage client relationships
- Send transactional emails (confirmations, project updates, invoices)
- Send marketing communications where you have consented to receive them
- Analyze usage patterns to improve user experience
- Comply with legal obligations
- Protect the security and integrity of our services
- Respond to legal process or requests from law enforcement

We do not sell, rent, or trade your personal information to third parties for their marketing purposes.`,
  },
  {
    id: 'sharing',
    title: '3. How We Share Your Information',
    content: `We may share your information with:

**Service Providers:** Third-party vendors who assist us in operating our website and providing services (e.g., cloud hosting, email delivery, analytics, payment processing). These providers are contractually bound to use your data only as directed by us.

**Business Partners:** Where you have engaged in a joint project or co-production, relevant project information may be shared with agreed partner studios or agencies.

**Legal Compliance:** We may disclose information if required by law, court order, or governmental authority, or where we believe disclosure is necessary to protect the rights, property, or safety of NextEdgeAI, our users, or the public.

**Business Transfers:** In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership.`,
  },
  {
    id: 'data-retention',
    title: '4. Data Retention',
    content: `We retain your personal information for as long as necessary to provide our services and fulfil the purposes described in this policy, unless a longer retention period is required or permitted by law.

- **Client project data** is retained for the duration of the project plus 7 years for legal and audit purposes.
- **Marketing contact records** are retained until you opt out or request deletion.
- **Website analytics data** is retained for 26 months in aggregate, anonymised form.
- **Inquiry and support records** are retained for 3 years.

You may request deletion of your personal data at any time (subject to legal retention obligations) by contacting privacy@nextedgeai.com.`,
  },
  {
    id: 'your-rights',
    title: '5. Your Rights',
    content: `Depending on your jurisdiction, you may have the following rights:

- **Access:** Request a copy of the personal information we hold about you
- **Correction:** Request correction of inaccurate or incomplete data
- **Deletion:** Request deletion of your personal data (subject to legal obligations)
- **Portability:** Receive your data in a structured, machine-readable format
- **Objection:** Object to processing of your data for direct marketing purposes
- **Restriction:** Request that we restrict processing of your data in certain circumstances
- **Withdrawal of Consent:** Where processing is based on consent, withdraw that consent at any time

To exercise any of these rights, contact us at privacy@nextedgeai.com. We will respond within 30 days. We may need to verify your identity before processing your request.`,
  },
  {
    id: 'international-transfers',
    title: '6. International Data Transfers',
    content: `NextEdgeAI operates globally. Your information may be transferred to and processed in countries other than your own. Where we transfer data from the European Economic Area to countries that may not provide an equivalent level of data protection, we use appropriate safeguards such as Standard Contractual Clauses approved by the European Commission.`,
  },
  {
    id: 'security',
    title: '7. Data Security',
    content: `We implement industry-standard technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:

- TLS encryption for data in transit
- AES-256 encryption for sensitive data at rest
- Role-based access controls limiting data access to authorized personnel
- Regular security audits and penetration testing
- Incident response procedures aligned with GDPR notification requirements

No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data using commercially reasonable practices.`,
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    content: `We use cookies and similar tracking technologies to operate our website and understand how visitors interact with our content. For full details on the types of cookies we use and your choices, please see our Cookie Settings page.`,
  },
  {
    id: 'children',
    title: '9. Children\'s Privacy',
    content: `Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child under 16 without verifiable parental consent, we will delete that information promptly.`,
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email (where we hold your email address) and update the "Last Updated" date at the top of this page. Continued use of our services after the changes become effective constitutes acceptance of the revised policy.`,
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: `If you have questions, concerns, or requests related to this Privacy Policy, please contact our Data Protection Officer:

**Email:** privacy@nextedgeai.com
**Postal Address:** NextEdgeAI Privacy Team, c/o Legal Department

We are committed to resolving any privacy concerns promptly and transparently.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <CustomCursor />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">Legal</p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Privacy Policy</h1>
            <p className="text-gray-400 mb-2">Last Updated: April 1, 2026</p>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              At NextEdgeAI, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, share, and protect your personal information when you use our website and services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Table of Contents */}
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
                  transition={{ delay: i * 0.04 }}
                >
                  <h2 className="text-xl font-bold mb-4 text-white">{s.title}</h2>
                  <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line space-y-3">
                    {s.content.split('\n\n').map((para, pi) => (
                      <p key={pi} dangerouslySetInnerHTML={{
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
