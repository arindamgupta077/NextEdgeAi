'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [checked,   setChecked]   = useState(false)

  useEffect(() => {
    if (isLogin) { setChecked(true); return }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/admin/login')
      } else {
        setUserEmail(user.email ?? undefined)
        setChecked(true)
      }
    })
  }, [isLogin, router])

  if (!isLogin && !checked) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center cursor-auto">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#050508] cursor-auto" style={{ cursor: 'auto' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#050508] cursor-auto" style={{ cursor: 'auto' }}>
      <AdminSidebar userEmail={userEmail} />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
