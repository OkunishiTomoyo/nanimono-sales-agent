'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Brain,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Gamepad2,
  Search,
  Flame,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const topStats = [
  {
    label: 'チーム全体の活動量',
    value: '142',
    change: '+18.3%',
    trend: 'up' as const,
    unit: '件/日',
    icon: Activity,
  },
  {
    label: '成約率',
    value: '34.2%',
    change: '+3.1%',
    trend: 'up' as const,
    unit: '',
    icon: TrendingUp,
  },
  {
    label: 'AI分析件数',
    value: '856',
    change: '+28.4%',
    trend: 'up' as const,
    unit: '件',
    icon: Brain,
  },
  {
    label: 'アクティブメンバー数',
    value: '24',
    change: '-2',
    trend: 'down' as const,
    unit: '名',
    icon: Users,
  },
]

const weeklyActivity = [
  { day: '月', value: 28, label: '3/14' },
  { day: '火', value: 35, label: '3/15' },
  { day: '水', value: 22, label: '3/16' },
  { day: '木', value: 41, label: '3/17' },
  { day: '金', value: 38, label: '3/18' },
  { day: '土', value: 12, label: '3/19' },
  { day: '日', value: 5, label: '3/20' },
]

const teamHeat = [
  { name: '東京第一営業部', members: 8, level: 'active' as const, score: 92 },
  { name: '大阪支店', members: 6, level: 'active' as const, score: 85 },
  { name: '名古屋チーム', members: 5, level: 'declining' as const, score: 58 },
  { name: '福岡営業所', members: 3, level: 'inactive' as const, score: 23 },
  { name: '札幌チーム', members: 4, level: 'declining' as const, score: 45 },
]

const recentActivities = [
  { user: '田中太郎', action: '日報提出', detail: '株式会社ABC - 成約', time: '2分前', icon: FileText },
  { user: '佐藤花子', action: 'ロープレ完了', detail: 'クロージング練習 - スコア92', time: '8分前', icon: Gamepad2 },
  { user: '鈴木一郎', action: '分析実行', detail: '失注分析 - 3件の改善点検出', time: '15分前', icon: Search },
  { user: '高橋美咲', action: '日報提出', detail: '株式会社DEF - 検討中', time: '22分前', icon: FileText },
  { user: '山田健太', action: 'ロープレ完了', detail: 'ヒアリング練習 - スコア78', time: '35分前', icon: Gamepad2 },
  { user: '伊藤さくら', action: '分析実行', detail: 'クロージング分析 - 成約パターン抽出', time: '42分前', icon: Search },
  { user: '中村誠', action: '日報提出', detail: '株式会社GHI - 初回訪問', time: '1時間前', icon: FileText },
]

const heatColor = {
  active: 'text-emerald-400',
  declining: 'text-amber-400',
  inactive: 'text-red-400',
}

const heatBg = {
  active: 'bg-emerald-400/10',
  declining: 'bg-amber-400/10',
  inactive: 'bg-red-400/10',
}

const heatLabel = {
  active: '活発',
  declining: '低下傾向',
  inactive: '非アクティブ',
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value))

  const decliningTeams = teamHeat.filter((t) => t.level === 'declining' || t.level === 'inactive')

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <LayoutDashboard className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted">チーム全体の活動をリアルタイムで可視化</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-6 hover:border-graphite-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-graphite-400">{stat.label}</span>
                <Icon size={18} className="text-accent" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={14} className="text-emerald-400" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                {stat.unit && (
                  <span className="text-xs text-graphite-500 ml-1">{stat.unit}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">週間活動推移</h2>
          <div className="flex items-end gap-3 h-48">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-graphite-400">{day.value}</span>
                <div className="w-full relative">
                  <div
                    className="w-full rounded-t-lg bg-gold-500/80 hover:bg-gold-400 transition-colors"
                    style={{
                      height: `${(day.value / maxActivity) * 160}px`,
                    }}
                  />
                </div>
                <span className="text-xs text-graphite-400">{day.day}</span>
                <span className="text-[10px] text-graphite-600">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Heat Indicator */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-gold-500" />
              チーム熱量
            </h2>
          </div>

          {decliningTeams.length > 0 && (
            <div className="rounded-xl bg-amber-400/5 border border-amber-400/20 p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  熱量が落ちているチーム
                </span>
              </div>
              <p className="text-xs text-graphite-300">
                {decliningTeams.map((t) => t.name).join('、')}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {teamHeat.map((team) => (
              <div key={team.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground truncate">{team.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${heatBg[team.level]} ${heatColor[team.level]}`}>
                      {heatLabel[team.level]}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-graphite-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        team.level === 'active'
                          ? 'bg-emerald-400'
                          : team.level === 'declining'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                      }`}
                      style={{ width: `${team.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-graphite-500">{team.members}名</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">リアルタイム活動フィード</h2>
        <div className="space-y-1">
          {recentActivities.map((activity, i) => {
            const Icon = activity.icon
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl px-4 py-3 bg-graphite-800/50 hover:bg-graphite-800 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500/10">
                  <Icon className="w-4 h-4 text-gold-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{activity.user}</span>
                    <span className="text-xs text-graphite-500">|</span>
                    <span className="text-sm text-gold-500">{activity.action}</span>
                  </div>
                  <p className="text-xs text-graphite-400 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-graphite-500 whitespace-nowrap">{activity.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
