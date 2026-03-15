'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PortfolioForm from '@/components/admin/PortfolioForm'
import type { PortfolioProject } from '@/types/database'

export default function EditPortfolioPage() {
  const { id }      = useParams<{ id: string }>()
  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    supabase
      .from('portfolio_projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError('Project not found.')
        } else {
          setProject(data)
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error ?? 'Project not found.'}</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Project</h1>
        <p className="text-gray-500 text-sm mt-1">{project.title}</p>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
        <PortfolioForm initialData={project} />
      </div>
    </div>
  )
}
