'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Services',     href: '#services' },
  { label: 'AI Suite',     href: '#suite' },
  { label: 'Portfolio',    href: '#portfolio' },
  { label: 'Case Studies', href: '#cases' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navigation() {
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

  const scrollToSection = useCallback((href: string) => {
    setMenuOpen(false)
    setActiveLink(href)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-[#06060c]/85 backdrop-blur-2xl border-b border-white/5 shadow-2xl'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group cursor-none"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative flex items-center justify-center h-full">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10L10 3L17 10L10 17L3 10Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="10" cy="10" r="2.5" fill="white"/>
                </svg>
              </div>
            </div>
            <span className="font-bold text-[1.15rem] tracking-tight leading-none">
              NextEdge<span className="text-gradient">AI</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className={`relative px-4 py-2 text-sm rounded-lg transition-all duration-300 cursor-none ${
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
              onClick={() => scrollToSection('#contact')}
              className="cursor-none group relative px-5 py-2.5 text-sm font-medium rounded-full overflow-hidden transition-all duration-300"
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
            className="md:hidden relative z-[60] flex flex-col gap-[5px] cursor-none p-2"
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
            className="fixed inset-0 z-[55] flex flex-col items-center justify-center"
            style={{ background: 'rgba(6,6,12,0.97)', backdropFilter: 'blur(24px)' }}
          >
            {/* Decorative orbs for mobile menu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
            </div>

            <div className="relative flex flex-col items-center gap-6 w-full px-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => scrollToSection(link.href)}
                  className="w-full text-center text-4xl font-light text-gray-300 hover:text-white
                             transition-colors tracking-wide py-2 border-b border-white/5"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.07 }}
                onClick={() => scrollToSection('#contact')}
                className="mt-6 px-10 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white
                           rounded-full text-xl font-medium"
              >
                Start a Project
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
