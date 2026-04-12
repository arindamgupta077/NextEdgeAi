'use client'

import TeamMemberForm from '@/components/admin/TeamMemberForm'

export default function NewTeamMemberPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add Team Member</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new team member profile</p>
      </div>
      <TeamMemberForm />
    </div>
  )
}
