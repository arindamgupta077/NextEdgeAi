'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import CustomCursor from '@/components/CustomCursor'
import Footer from '@/components/sections/Footer'
import { createClient } from '@/lib/supabase/client'
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube'

/* ─── Types ─────────────────────────────────────────────────────────── */
type Project = {
  id:            string | number
  title:         string
  category:      string
  year:          string
  desc:          string
  tags:          string[]
  gradient:      string
  accent:        string
  youtube_id?:   string | null
  thumbnail_url?: string | null
}

const CARDS_PER_PAGE = 9

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  const searchParams   = useSearchParams()
  const [projects,     setProjects]     = useState<Project[]>([])
  const [categories,   setCategories]   = useState<string[]>(['All'])
  const [filter,       setFilter]       = useState(() => searchParams.get('category') ?? 'All')
  const [page,         setPage]         = useState(1)
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState<Project | null>(null)
  const [youtubeModal, setYoutubeModal] = useState<string | null>(null)

  /* Fetch all projects */
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped: Project[] = data.map(p => ({
            id:            p.id,
            title:         p.title,
            category:      p.category,
            year:          p.year,
            desc:          p.description ?? '',
            tags:          p.tags ?? [],
            gradient:      p.gradient,
            accent:        p.accent,
            youtube_id:    p.youtube_id,
            thumbnail_url: p.thumbnail_url,
          }))
          setProjects(mapped)
          const cats = ['All', ...Array.from(new Set(mapped.map(p => p.category)))]
          setCategories(cats)
        }
        setLoading(false)
      })
  }, [])

  /* Reset to page 1 when filter changes */
  useEffect(() => { setPage(1) }, [filter])

  const filtered    = filter === 'All' ? projects : projects.filter(p => p.category === filter)
  const totalPages  = Math.ceil(filtered.length / CARDS_PER_PAGE)
  const paginated   = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE)

  const handleCardClick = useCallback((project: Project) => {
    if (project.youtube_id) {
      setYoutubeModal(project.youtube_id)
    } else {
      setSelected(project)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navigation />

      <main className="min-h-screen bg-[#06060c] pt-28 pb-24">

        {/* ── Hero header ── */}
        <div className="container-narrow mb-14">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-light inline-flex mb-5 text-xs uppercase tracking-[0.18em] text-emerald-400 w-fit">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            Our Work
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
                Full <span className="text-gradient">Portfolio</span>
              </h1>
              <p className="mt-4 text-gray-400 max-w-lg leading-relaxed">
                Every project we have shipped — browse by service category or scroll through the complete archive.
              </p>
            </div>
            <Link
              href="/#portfolio"
              className="cursor-none inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm shrink-0"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
              Back to home
            </Link>
          </div>
        </div>

        {/* ── Category filter ── */}
        <div className="container-narrow mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                  filter === cat
                    ? 'bg-white text-black border-white'
                    : 'text-gray-500 border-white/10 hover:text-white hover:border-white/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-600">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp; page {page} of {totalPages || 1}
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="container-narrow">
          {loading ? (
            /* Skeleton placeholders */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[260px] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center text-gray-600 text-sm">
              No projects found for this category yet.
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[260px] gap-5"
            >
              <AnimatePresence mode="popLayout">
                {paginated.map(project => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-white/6 bg-gradient-to-br ${project.gradient}`}
                    data-cursor="hover"
                    onClick={() => handleCardClick(project)}
                  >
                    {/* Thumbnail */}
                    {(project.thumbnail_url || project.youtube_id) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.thumbnail_url ?? getYouTubeThumbnail(project.youtube_id!)}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
                    )}

                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid-bg opacity-20" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 glass-light rounded-full text-[10px] uppercase tracking-wider text-gray-300">
                        {project.category}
                      </span>
                    </div>
                    <span className="absolute top-4 right-4 text-[11px] text-gray-500">{project.year}</span>

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-6"
                      style={{ background: `linear-gradient(to top, ${project.accent}22 0%, rgba(0,0,0,0.85) 100%)` }}
                    >
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs text-gray-400 mb-2 line-clamp-3">{project.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full text-[10px] border border-white/15 text-gray-300">
                              {t}
                            </span>
                          ))}
                        </div>
                        <button className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-white border border-white/30 hover:bg-white/10 transition-colors">
                          {project.youtube_id ? 'Watch Project' : 'View Project'}
                          {project.youtube_id ? (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Title (always visible, hides on hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-xl font-bold text-white leading-tight group-hover:opacity-0 transition-opacity duration-300">
                        {project.title}
                      </h3>
                    </div>

                    {/* Glow border */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ boxShadow: `inset 0 0 0 1px ${project.accent}44` }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer px-4 py-2 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-default transition-all text-sm"
              >
                ← Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`cursor-pointer w-9 h-9 rounded-full text-sm font-medium border transition-all duration-200 ${
                    n === page
                      ? 'bg-white text-black border-white'
                      : 'text-gray-500 border-white/10 hover:text-white hover:border-white/25'
                  }`}
                >
                  {n}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer px-4 py-2 rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-default transition-all text-sm"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── Project detail modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`relative w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden p-8 bg-gradient-to-br ${selected.gradient}`}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="cursor-none absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full glass-light text-gray-400 hover:text-white"
                onClick={() => setSelected(null)}
              >✕</button>
              <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: selected.accent }}>
                {selected.category} · {selected.year}
              </div>
              <h3 className="text-4xl font-black text-white mb-4">{selected.title}</h3>
              <p className="text-gray-300 text-base leading-relaxed mb-6">{selected.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {selected.tags.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs border border-white/15 text-gray-300">{t}</span>
                ))}
              </div>
              {selected.youtube_id && (
                <button
                  onClick={() => { setSelected(null); setYoutubeModal(selected.youtube_id!) }}
                  className="cursor-none w-full py-3.5 rounded-full font-medium text-white transition-all"
                  style={{ background: `linear-gradient(135deg, ${selected.accent}cc, ${selected.accent}66)` }}
                >
                  Watch Project
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── YouTube player modal ── */}
      <AnimatePresence>
        {youtubeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setYoutubeModal(null)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={getYouTubeEmbedUrl(youtubeModal, true)}
                className="w-full h-full rounded-2xl"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title="Project video"
              />
              <button
                className="cursor-none absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors text-sm"
                onClick={() => setYoutubeModal(null)}
              >
                ✕ Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
