"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Target,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quick-faq", label: "Quick-FAQ", icon: MessageSquare },
  { href: "/closing-ai", label: "Closing-AI", icon: Target },
  { href: "/daily-insight", label: "Daily-Insight", icon: BookOpen },
  { href: "/roleplay", label: "Roleplay", icon: Users },
  { href: "/lost-analysis", label: "Lost-Analysis", icon: BarChart3 },
  { href: "/management", label: "Management", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full bg-graphite-900 border-r border-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-widest text-accent">
              NANIMONO
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md text-graphite-400 hover:text-foreground hover:bg-graphite-800 transition-colors"
          aria-label={collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/15 text-accent border-l-2 border-accent"
                  : "text-graphite-300 hover:text-foreground hover:bg-graphite-800"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
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
  );
}
