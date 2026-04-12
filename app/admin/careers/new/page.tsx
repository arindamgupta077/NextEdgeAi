'use client'

import CareerRoleForm from '@/components/admin/CareerRoleForm'

export default function NewCareerRolePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add Career Role</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new job opening</p>
      </div>
      <CareerRoleForm />
    </div>
  )
}
