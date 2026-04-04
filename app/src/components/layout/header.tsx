'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, User, LogOut, ChevronDown, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/quick-faq': 'Quick FAQ',
  '/smart-script': 'Closing-AI',
  '/roleplay': 'Roleplay',
  '/lost-analysis': 'Lost-Analysis',
  '/daily-career': 'Daily-Career',
  '/sales-dna': 'Sales-DNA',
  '/admin': 'Global Stats',
  '/admin/members': 'Member Insights',
  '/admin/issues': 'AI Issue Detective',
  '/admin/knowledge': 'Knowledge Library',
  '/admin/rewards': 'Reward & Mission',
  '/admin/human-touch': 'Human Touch Focus',
  '/admin/report-config': 'Report-Config',
  '/admin/security': 'Security & Proxy',
}

export function Header() {
  const pathname = usePathname()
  const { user, tenant, tenants, logout, switchTenant } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showTenantMenu, setShowTenantMenu] = useState(false)

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    )?.[1] ?? 'NANIMONO'

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-graphite-900 border-b border-border shrink-0">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Tenant selector (admin only) */}
        {user?.role === 'admin' && tenant && (
          <div className="relative">
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm text-graphite-300 hover:text-foreground hover:bg-graphite-800 transition-colors"
            >
              <Building2 size={14} />
              <span className="max-w-[120px] truncate">{tenant.name}</span>
              <ChevronDown size={14} />
            </button>
            {showTenantMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-graphite-800 shadow-xl z-50">
                <div className="p-1">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id)
                        setShowTenantMenu(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        t.id === tenant.id
                          ? 'bg-gold-500/15 text-gold-500'
                          : 'text-graphite-200 hover:bg-graphite-700'
                      }`}
                    >
                      <span className="font-medium">{t.name}</span>
                      <span className="block text-[10px] text-graphite-400 mt-0.5">
                        {t.products.length}商材 / {t.channels.length}販路
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current tenant badge (field user) */}
        {user?.role === 'field' && tenant && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-graphite-800 text-xs text-graphite-300">
            <Building2 size={12} />
            {tenant.name}
          </div>
        )}

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-graphite-400 hover:text-foreground hover:bg-graphite-800 transition-colors"
          aria-label="通知"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-graphite-800 transition-colors"
            aria-label="ユーザーメニュー"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-graphite-700 text-graphite-300">
              <User size={16} />
            </div>
            {user && (
              <span className="text-sm text-graphite-300 hidden sm:block">
                {user.name}
              </span>
            )}
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-graphite-800 shadow-xl z-50">
              <div className="p-2">
                {user && (
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-graphite-400 mt-0.5">
                      {user.role === 'admin' ? '管理者' : '営業担当'}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    logout()
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-graphite-700 transition-colors"
                >
                  <LogOut size={14} />
                  ログアウト
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
