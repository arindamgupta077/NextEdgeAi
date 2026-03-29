import PortfolioForm from '@/components/admin/PortfolioForm'

export default function NewPortfolioPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white">Add Project</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new portfolio entry</p>
      </div>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-7">
        <PortfolioForm />
      </div>
    </div>
  )
}
