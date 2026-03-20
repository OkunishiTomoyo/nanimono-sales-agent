'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/contexts/auth-context'

const STORAGE_KEY = 'nanimono_auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Check localStorage directly to avoid race condition with AuthProvider
    const hasAuth = !!localStorage.getItem(STORAGE_KEY)
    if (!hasAuth) {
      window.location.assign('/nanimono-sales-agent/app/login')
    } else {
      setChecked(true)
    }
  }, [])

  // Also handle logout: if auth was cleared after initial check
  useEffect(() => {
    if (!isLoading && !user && checked) {
      window.location.assign('/nanimono-sales-agent/app/login')
    }
  }, [user, isLoading, checked])

  if (!checked || isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-dvh bg-background">
        <div className="w-8 h-8 border-2 border-graphite-600 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
