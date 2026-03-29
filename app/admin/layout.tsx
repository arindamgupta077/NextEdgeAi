'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  const [userEmail,    setUserEmail]    = useState<string | undefined>()
  const [checked,      setChecked]      = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)

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
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 h-14 bg-[#06060c] border-b border-white/5">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <Image
          src="/logo.png"
          alt="NextEdgeAI Logo"
          width={90}
          height={28}
          className="h-7 w-auto object-contain"
          priority
        />
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">Admin</span>
      </header>

      <AdminSidebar
        userEmail={userEmail}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-auto min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
