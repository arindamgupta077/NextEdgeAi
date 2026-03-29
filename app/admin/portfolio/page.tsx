'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getYouTubeThumbnail } from '@/lib/youtube'
import type { PortfolioProject } from '@/types/database'

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirm,  setConfirm]  = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true })
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (project: PortfolioProject) => {
    setDeleting(project.id)
    const supabase = createClient()

    // Delete thumbnail from storage
    if (project.thumbnail_url) {
      const path = project.thumbnail_url.split('/portfolio-thumbnails/').pop()
      if (path) await supabase.storage.from('portfolio-thumbnails').remove([path])
    }

    await supabase.from('portfolio_projects').delete().eq('id', project.id)
    setConfirm(null)
    setDeleting(null)
    load()
  }

  const thumbSrc = (p: PortfolioProject) =>
    p.thumbnail_url ?? (p.youtube_id ? getYouTubeThumbnail(p.youtube_id) : null)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/portfolio/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white
                     bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/25
                     hover:border-cyan-400/50 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-16 text-center">
          <p className="text-gray-600 text-sm mb-4">No portfolio projects yet.</p>
          <Link href="/admin/portfolio/new"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Add your first project →
          </Link>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium w-14">Thumb</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium">Title</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden md:table-cell">Category</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Year</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden lg:table-cell">Order</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-widest text-gray-600 font-medium hidden sm:table-cell">Video</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === projects.length - 1 ? 'border-b-0' : ''}`}>
                  {/* Thumbnail */}
                  <td className="px-5 py-3">
                    <div className={`w-12 h-8 rounded-lg overflow-hidden bg-gradient-to-br ${p.gradient}`}>
                      {thumbSrc(p) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbSrc(p)!} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  {/* Title */}
                  <td className="px-5 py-3 text-white font-medium">
                    <div className="flex items-center gap-2">
                      {p.title}
                      {p.is_featured && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{p.category}</td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{p.year}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{p.display_order}</td>
                  {/* Video indicator */}
                  <td className="px-5 py-3 hidden sm:table-cell">
                    {p.youtube_id ? (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2H9.18v13.17a2.91 2.91 0 01-2.96 2.55 2.91 2.91 0 01-2.91-2.91 2.91 2.91 0 012.91-2.91c.28 0 .54.04.79.1V9.01a6.83 6.83 0 00-.79-.05 6.83 6.83 0 00-6.83 6.83 6.83 6.83 0 006.83 6.83 6.83 6.83 0 006.83-6.83V9.46a8.69 8.69 0 005.08 1.54V8.08a4.86 4.86 0 01-3.35-1.39z"/>
                        </svg>
                        YouTube
                      </span>
                    ) : (
                      <span className="text-gray-700 text-xs">—</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-3 text-right">
                    {confirm === p.id ? (
                      <span className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deleting === p.id}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors">
                          {deleting === p.id ? '…' : 'Confirm'}
                        </button>
                        <button onClick={() => setConfirm(null)}
                          className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-3">
                        <Link href={`/admin/portfolio/${p.id}/edit`}
                          className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => setConfirm(p.id)}
                          className="text-xs text-red-400/50 hover:text-red-400 transition-colors">
                          Delete
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
