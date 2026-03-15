'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ServiceForm from '@/components/admin/ServiceForm'
import type { Service } from '@/types/database'

export default function EditServicePage() {
  const { id }      = useParams<{ id: string }>()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError('Service not found.')
        } else {
          setService(data)
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

  if (error || !service) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error ?? 'Service not found.'}</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Service</h1>
        <p className="text-gray-500 text-sm mt-1">{service.title}</p>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
        <ServiceForm initialData={service} />
      </div>
    </div>
  )
}
