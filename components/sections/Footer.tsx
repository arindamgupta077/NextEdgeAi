'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const FOOTER_LINKS = {
  Services: [
    'AI Film Production',
    'Advertising Campaigns',
    'Digital Commercials',
    'Virtual Production',
    'Micro-Dramas',
    'Visual World-Building',
    'IP Development',
    'Storytelling Universes',
  ],
  Work: [
    'Portfolio',
    'Case Studies',
    'Featured Projects',
    'Behind the Scenes',
  ],
  Studio: [
    'About NextEdgeAI',
    'Our Technology',
    'Creative Team',
    'Careers',
    'Press & Media',
  ],
  Legal: [
    'Privacy Policy',
    'Terms of Service',
    'IP Charter',
    'Cookie Settings',
  ],
}

const SOCIALS = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Vimeo',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881L5.3439 12.5C4.6249 9.911 3.8619 8.619 3.0069 8.619c-.1958 0-.8808.4122-2.0558 1.2302L0 8.3699c1.2948-1.1362 2.5706-2.2724 3.8184-3.4088 1.7196-1.484 3.0064-2.2624 3.8524-2.332 2.0248-.1958 3.2718 1.1932 3.7498 4.1632.5098 3.1958 1.0528 4.9 1.6148 5.112.5 2.21 1.0118 3.312 1.5428 3.312.44 0 1.0878-.694 1.9468-2.083.856-1.388 1.3158-2.445 1.3778-3.168.122-1.199-.346-1.798-1.4068-1.798-.502 0-1.016.116-1.546.346 1.028-3.36 2.99-4.99 5.892-4.892 2.148.063 3.161 1.459 3.047 4.182z"/>
      </svg>
    ),
  },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="relative overflow-hidden border-t border-white/6">
      <div className="absolute inset-0 bg-[#040408]" />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)' }} />

      <div className="relative z-10">
        {/* CTA Banner */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-gray-600 mb-3">Ready to create?</p>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-6 sm:mb-8 leading-tight">
                Your Story Is Waiting<br/>
                <span className="text-gradient">To Be Told.</span>
              </h2>
              <button
                onClick={() => scrollTo('contact')}
                className="cursor-none group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full
                           bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold text-base
                           hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-shadow duration-500"
              >
                Start Your Project
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-10 mb-16">
            {/* Brand column */}
            <div className="col-span-2">
              {/* Logo */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="cursor-none flex items-center gap-2.5 mb-5 group"
              >
                <Image
                  src="/logo.png"
                  alt="NextEdgeAI Logo"
                  width={140}
                  height={44}
                  className="h-11 w-auto object-contain"
                />
                <span className="font-bold text-[1.45rem] tracking-tight leading-none">
                  NextEdge<span className="text-gradient">AI</span>
                </span>
              </button>

              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
                Where artificial intelligence meets cinematic artistry. Redefining the future of film and brand storytelling.
              </p>

              {/* Socials */}
              <div className="flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="cursor-none w-9 h-9 rounded-lg glass-light border border-white/6 flex items-center justify-center
                               text-gray-500 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => scrollTo('services')}
                        className="cursor-none text-sm text-gray-500 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {currentYear} NextEdgeAI. All rights reserved. Crafted with AI & Human Creativity.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-700">
              <button className="cursor-none hover:text-gray-400 transition-colors">Privacy</button>
              <button className="cursor-none hover:text-gray-400 transition-colors">Terms</button>
              <button className="cursor-none hover:text-gray-400 transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
