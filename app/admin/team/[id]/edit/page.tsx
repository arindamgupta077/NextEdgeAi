'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TeamMemberForm from '@/components/admin/TeamMemberForm'
import type { TeamMember } from '@/types/database'

export default function EditTeamMemberPage() {
  const { id } = useParams<{ id: string }>()
  const [member,  setMember]  = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('team_members').select('*').eq('id', id).single()
      if (!data) { setMissing(true) } else { setMember(data) }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (missing) {
    return (
      <div className="p-8 text-center text-gray-500">
        Team member not found.
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Team Member</h1>
        <p className="text-gray-500 text-sm mt-1">{member?.name}</p>
      </div>
      {member && <TeamMemberForm initialData={member} />}
    </div>
  )
}
