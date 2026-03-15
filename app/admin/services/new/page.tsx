import ServiceForm from '@/components/admin/ServiceForm'

export default function NewServicePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add Service</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new entry for the Services section</p>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
        <ServiceForm />
      </div>
    </div>
  )
}
