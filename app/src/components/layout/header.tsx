"use client";

import { usePathname } from "next/navigation";
import { Bell, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/quick-faq": "Quick-FAQ",
  "/closing-ai": "Closing-AI",
  "/daily-insight": "Daily-Insight",
  "/roleplay": "Roleplay",
  "/lost-analysis": "Lost-Analysis",
  "/management": "Management",
};

export function Header() {
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path)
    )?.[1] ?? "NANIMONO";

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-graphite-900 border-b border-border shrink-0">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg text-graphite-400 hover:text-foreground hover:bg-graphite-800 transition-colors"
          aria-label="通知"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-graphite-800 transition-colors"
          aria-label="ユーザーメニュー"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-graphite-700 text-graphite-300">
            <User size={16} />
          </div>
        </button>
      </div>
    </header>
  );
}
