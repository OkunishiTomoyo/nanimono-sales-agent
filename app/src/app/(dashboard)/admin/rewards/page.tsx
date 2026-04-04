'use client'

import { useState } from 'react'
import {
  Gift,
  Trophy,
  TrendingUp,
  Calculator,
  Heart,
  Award,
  ArrowUpRight,
  Target,
  Sparkles,
  DollarSign,
  Users,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface MemberReward {
  id: string
  name: string
  team: string
  deals: number
  revenue: number
  basePay: number
  incentive: number
  totalPay: number
  goalProgress: number
  rank: number
  badge: 'gold' | 'silver' | 'bronze' | null
}

const memberRewards: MemberReward[] = [
  {
    id: '1',
    name: '田中太郎',
    team: '東京第一',
    deals: 14,
    revenue: 28500000,
    basePay: 350000,
    incentive: 285000,
    totalPay: 635000,
    goalProgress: 142,
    rank: 1,
    badge: 'gold',
  },
  {
    id: '2',
    name: '佐藤花子',
    team: '東京第一',
    deals: 11,
    revenue: 22000000,
    basePay: 320000,
    incentive: 198000,
    totalPay: 518000,
    goalProgress: 110,
    rank: 2,
    badge: 'silver',
  },
  {
    id: '3',
    name: '鈴木一郎',
    team: '大阪',
    deals: 8,
    revenue: 16800000,
    basePay: 300000,
    incentive: 134400,
    totalPay: 434400,
    goalProgress: 84,
    rank: 3,
    badge: 'bronze',
  },
  {
    id: '4',
    name: '高橋美咲',
    team: '名古屋',
    deals: 6,
    revenue: 12000000,
    basePay: 280000,
    incentive: 84000,
    totalPay: 364000,
    goalProgress: 60,
    rank: 4,
    badge: null,
  },
  {
    id: '5',
    name: '山田健太',
    team: '福岡',
    deals: 5,
    revenue: 9500000,
    basePay: 280000,
    incentive: 57000,
    totalPay: 337000,
    goalProgress: 47,
    rank: 5,
    badge: null,
  },
  {
    id: '6',
    name: '伊藤さくら',
    team: '札幌',
    deals: 4,
    revenue: 7200000,
    basePay: 270000,
    incentive: 36000,
    totalPay: 306000,
    goalProgress: 36,
    rank: 6,
    badge: null,
  },
]

const missionStatements = [
  {
    title: '顧客の成功を実現する',
    description: '製品を売るだけでなく、顧客のビジネス成長に貢献する。成約はゴールではなくスタート。',
    linkedMetric: '顧客満足度 NPS +45',
  },
  {
    title: 'チームで勝つ文化を作る',
    description: '個人の成果だけでなく、ナレッジ共有・後輩育成も評価に組み込む。',
    linkedMetric: 'ナレッジ共有率 67%',
  },
  {
    title: 'データドリブンな営業を推進する',
    description: 'AI分析を活用し、勘と経験だけに頼らない科学的な営業プロセスを確立する。',
    linkedMetric: 'AI活用率 82%',
  },
]

const formatCurrency = (n: number) => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}千万`
  if (n >= 10000) return `${Math.round(n / 10000)}万`
  return n.toLocaleString()
}

const badgeEmoji = {
  gold: { label: '1st', color: 'text-gold-400', bg: 'bg-gold-400/10' },
  silver: { label: '2nd', color: 'text-graphite-300', bg: 'bg-graphite-300/10' },
  bronze: { label: '3rd', color: 'text-amber-600', bg: 'bg-amber-600/10' },
}

export default function RewardManagementPage() {
  const { user } = useAuth()
  const [targetAmount, setTargetAmount] = useState('20000000')

  const targetNum = parseInt(targetAmount) || 0
  const avgDealSize =
    memberRewards.reduce((s, m) => s + (m.deals > 0 ? m.revenue / m.deals : 0), 0) /
    memberRewards.length
  const requiredDeals = avgDealSize > 0 ? Math.ceil(targetNum / avgDealSize) : 0
  const requiredActivitiesPerDay = Math.ceil((requiredDeals * 8) / 20)

  const totalRevenue = memberRewards.reduce((s, m) => s + m.revenue, 0)
  const totalIncentive = memberRewards.reduce((s, m) => s + m.incentive, 0)
  const avgGoalProgress = Math.round(
    memberRewards.reduce((s, m) => s + m.goalProgress, 0) / memberRewards.length
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <Gift className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reward Management</h1>
          <p className="text-sm text-muted">報酬・インセンティブ・動機付け管理</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">チーム総売上</span>
            <DollarSign size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +15.2% 前月比
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">総インセンティブ</span>
            <Trophy size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncentive)}</p>
          <p className="text-xs text-graphite-500 mt-1">支給対象: {memberRewards.length}名</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">平均目標達成率</span>
            <Target size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">{avgGoalProgress}%</p>
          <div className="w-full h-2 rounded-full bg-graphite-800 mt-2">
            <div
              className={`h-full rounded-full ${avgGoalProgress >= 100 ? 'bg-emerald-400' : 'bg-gold-500'}`}
              style={{ width: `${Math.min(avgGoalProgress, 100)}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">目標達成者数</span>
            <Users size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {memberRewards.filter((m) => m.goalProgress >= 100).length}/{memberRewards.length}
          </p>
          <p className="text-xs text-graphite-500 mt-1">名が100%以上達成</p>
        </div>
      </div>

      {/* Member Reward Table */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-gold-500" />
          メンバー別報酬一覧
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-graphite-400 font-medium">順位</th>
                <th className="text-left py-3 px-4 text-graphite-400 font-medium">メンバー</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">成約数</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">成約金額</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">基本報酬</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">インセンティブ</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">合計報酬</th>
                <th className="text-right py-3 px-4 text-graphite-400 font-medium">達成率</th>
              </tr>
            </thead>
            <tbody>
              {memberRewards.map((m) => (
                <tr key={m.id} className="border-b border-border/50 bg-graphite-800/50 hover:bg-graphite-800 transition-colors">
                  <td className="py-3 px-4">
                    {m.badge ? (
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${badgeEmoji[m.badge].bg} ${badgeEmoji[m.badge].color}`}>
                        {badgeEmoji[m.badge].label}
                      </span>
                    ) : (
                      <span className="text-graphite-500 pl-2">{m.rank}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-graphite-500">{m.team}</p>
                  </td>
                  <td className="py-3 px-4 text-right text-foreground font-medium">{m.deals}</td>
                  <td className="py-3 px-4 text-right text-foreground">{formatCurrency(m.revenue)}</td>
                  <td className="py-3 px-4 text-right text-graphite-300">{formatCurrency(m.basePay)}</td>
                  <td className="py-3 px-4 text-right text-gold-400 font-medium">{formatCurrency(m.incentive)}</td>
                  <td className="py-3 px-4 text-right text-foreground font-bold">{formatCurrency(m.totalPay)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${m.goalProgress >= 100 ? 'text-emerald-400' : m.goalProgress >= 70 ? 'text-gold-400' : 'text-red-400'}`}>
                      {m.goalProgress}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Achievement Simulation */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gold-500" />
            目標達成シミュレーション
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">目標金額</label>
              <input
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
              />
              <p className="text-xs text-graphite-500 mt-1">{formatCurrency(targetNum)}円</p>
            </div>

            <div className="rounded-xl bg-graphite-800/50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-graphite-400">平均案件単価</span>
                <span className="text-foreground font-medium">{formatCurrency(Math.round(avgDealSize))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-graphite-400">必要成約数</span>
                <span className="text-foreground font-bold">{requiredDeals}件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-graphite-400">必要商談数 (成約率33%想定)</span>
                <span className="text-foreground font-medium">{requiredDeals * 3}件</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-graphite-400">1日あたり必要活動量</span>
                <span className="text-gold-400 font-bold">{requiredActivitiesPerDay}件/日</span>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Progress Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-500" />
            目標達成状況
          </h2>
          <div className="space-y-4">
            {memberRewards.map((m) => (
              <div key={m.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{m.name}</span>
                  <span
                    className={`text-sm font-bold ${
                      m.goalProgress >= 100 ? 'text-emerald-400' : m.goalProgress >= 70 ? 'text-gold-400' : 'text-red-400'
                    }`}
                  >
                    {m.goalProgress}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-graphite-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.goalProgress >= 100
                        ? 'bg-emerald-400'
                        : m.goalProgress >= 70
                          ? 'bg-gold-500'
                          : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(m.goalProgress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Alignment */}
      <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Heart className="w-5 h-5 text-gold-500" />
          ミッション連携
        </h2>
        <p className="text-xs text-graphite-500 mb-4">
          金銭的報酬だけでなく、会社のミッションとの紐付けで内発的動機を高める
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missionStatements.map((mission, i) => (
            <div key={i} className="rounded-xl bg-graphite-800/50 border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">{mission.title}</h3>
              <p className="text-xs text-graphite-300 leading-relaxed mb-3">{mission.description}</p>
              <div className="pt-3 border-t border-border">
                <span className="text-xs text-gold-400 font-medium">{mission.linkedMetric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Ranking */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-500" />
          月間ランキング
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {memberRewards.slice(0, 3).map((m, i) => {
            const config = badgeEmoji[['gold', 'silver', 'bronze'][i] as keyof typeof badgeEmoji]
            return (
              <div
                key={m.id}
                className={`rounded-xl border p-5 text-center ${
                  i === 0 ? 'border-gold-500/40 bg-gold-500/5' : 'border-border bg-graphite-800/50'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${config.bg}`}>
                  <span className={`text-lg font-bold ${config.color}`}>{config.label}</span>
                </div>
                <p className="text-base font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-graphite-500 mb-2">{m.team}</p>
                <p className="text-lg font-bold text-gold-400">{formatCurrency(m.revenue)}</p>
                <p className="text-xs text-graphite-400">{m.deals}件成約</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
