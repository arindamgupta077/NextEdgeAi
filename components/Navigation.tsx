'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Services',     href: '#services',      isPage: false },
  { label: 'AI Suite',     href: '#suite',          isPage: false },
  { label: 'Portfolio',    href: '#portfolio',      isPage: false },
  { label: 'Case Studies', href: '/case-studies',   isPage: true  },
  { label: 'Careers',      href: '/careers',        isPage: true  },
  { label: 'Contact',      href: '#contact',        isPage: false },
]

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = useCallback((href: string, isPage: boolean) => {
    setMenuOpen(false)
    if (isPage) {
      router.push(href)
      return
    }
    // If not on the home page, navigate to home with the hash — the browser
    // will scroll to the section after the page loads.
    if (!isHome) {
      router.push(`/${href}`)
      return
    }
    setActiveLink(href)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [router, isHome])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#06060c]/90 backdrop-blur-3xl border-b border-white/6 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-2.5 group cursor-none"
          >
            <Image
              src="/logo.png"
              alt="NextEdgeAI Logo"
              width={180}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
            <span className="font-bold text-[1.45rem] tracking-tight leading-none">
              NextEdge<span className="text-gradient">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.isPage)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-300 cursor-pointer ${
                  activeLink === link.href
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {activeLink === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/6 rounded-lg"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
              className="cursor-pointer group relative px-5 py-2.5 text-sm font-medium rounded-full overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 border border-cyan-400/40 rounded-full group-hover:border-cyan-400/80 transition-colors duration-300" />
              <span className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/8 rounded-full transition-colors duration-300" />
              <span className="relative text-cyan-400 group-hover:text-cyan-300 transition-colors">
                Start a Project
              </span>
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden relative z-[60] flex flex-col gap-[5px] cursor-pointer p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-6 h-[1.5px] bg-white origin-center transition-transform duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white transition-opacity duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-white origin-center transition-transform duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] flex flex-col"
            style={{ background: 'rgba(6,6,12,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {/* Decorative orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
            </div>

            {/* Top bar with close button */}
            <div className="relative flex items-center justify-between px-6 pt-5 pb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Menu</span>
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10
                           bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gray-300">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            {/* Nav links */}
            <div className="relative flex flex-col justify-center flex-1 w-full px-6 sm:px-10 gap-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => handleNavClick(link.href, link.isPage)}
                  className="group flex items-center justify-between w-full text-left text-2xl sm:text-3xl font-light
                             text-gray-400 hover:text-white transition-colors duration-200 tracking-wide
                             py-4 border-b border-white/5 last:border-b-0"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-xs text-gray-600 font-mono w-5 text-right select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200 shrink-0">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* CTA at bottom */}
            <div className="relative px-6 sm:px-10 pb-10 pt-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + navLinks.length * 0.07 }}
                onClick={() => {
                  setMenuOpen(false)
                  window.dispatchEvent(new CustomEvent('open-contact-modal'))
                }}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white
                           rounded-2xl text-lg font-medium tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
              >
                Start a Project
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 + navLinks.length * 0.07 + 0.08 }}
                onClick={() => setMenuOpen(false)}
                className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Close Menu
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
