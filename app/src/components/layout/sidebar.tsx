'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  Target,
  BookOpen,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Dna,
  Briefcase,
  TrendingUp,
  UserCheck,
  Library,
  Search,
  DollarSign,
  FileEdit,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const fieldNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quick-faq', label: 'Quick-FAQ', icon: MessageSquare },
  { href: '/daily-insight', label: 'Daily-Insight', icon: BookOpen },
  { href: '/sales-analysis', label: 'Sales-Analysis', icon: BarChart3 },
  { href: '/closing-ai', label: 'Closing-AI', icon: Target },
  { href: '/roleplay', label: 'Roleplay', icon: Users },
  { href: '/daily-career', label: 'Daily-Career', icon: Briefcase },
  { href: '/sales-dna', label: 'Sales-DNA', icon: Dna },
]

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: TrendingUp },
  { href: '/admin/members', label: 'Member Insights', icon: UserCheck },
  { href: '/admin/knowledge', label: 'Knowledge Library', icon: Library },
  { href: '/admin/issues', label: 'AI Issue Detective', icon: Search },
  { href: '/admin/rewards', label: 'Reward Mgmt', icon: DollarSign },
  { href: '/admin/report-config', label: 'Report-Config', icon: FileEdit },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()

  const isAdmin = user?.role === 'admin'

  return (
    <aside
      className={`flex flex-col h-full bg-graphite-900 border-r border-border transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-widest text-gold-500">
              NANIMONO
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-graphite-400 hover:text-foreground hover:bg-graphite-800 transition-colors"
          aria-label={collapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {/* FIELD Section */}
        {!collapsed && (
          <p className="text-[10px] font-semibold text-graphite-500 uppercase tracking-wider px-3 mb-2">
            FIELD
          </p>
        )}
        {fieldNavItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-500/15 text-gold-500 border-l-2 border-gold-500'
                  : 'text-graphite-300 hover:text-foreground hover:bg-graphite-800'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        {/* ADMIN Section */}
        {isAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            {!collapsed && (
              <p className="text-[10px] font-semibold text-graphite-500 uppercase tracking-wider px-3 mb-2">
                ADMIN
              </p>
            )}
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-500 border-l-2 border-gold-500'
                      : 'text-graphite-300 hover:text-foreground hover:bg-graphite-800'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-graphite-500 text-center">
            AGI Sales Intelligence
          </p>
        </div>
      )}
    </aside>
  )
}
