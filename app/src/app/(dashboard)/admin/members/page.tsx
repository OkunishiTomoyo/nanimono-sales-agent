'use client'

import { useState } from 'react'
import {
  Users,
  Trophy,
  TrendingUp,
  Target,
  Award,
  ChevronDown,
  Star,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface MemberData {
  id: string
  name: string
  team: string
  roleplayPassed: number
  totalDeals: number
  conversionRate: number
  leaderScore: number
  badge: 'platinum' | 'gold' | 'silver' | 'bronze'
  skills: { name: string; scores: number[] }[]
}

const members: MemberData[] = [
  {
    id: '1',
    name: '田中太郎',
    team: '東京第一営業部',
    roleplayPassed: 48,
    totalDeals: 156,
    conversionRate: 42.3,
    leaderScore: 94,
    badge: 'platinum',
    skills: [
      { name: 'ヒアリング力', scores: [62, 68, 74, 78, 85, 91] },
      { name: 'プレゼン力', scores: [55, 60, 67, 72, 78, 84] },
      { name: 'クロージング力', scores: [70, 73, 75, 80, 86, 92] },
      { name: '商品知識', scores: [80, 82, 85, 88, 90, 95] },
      { name: '関係構築力', scores: [65, 70, 76, 82, 87, 90] },
    ],
  },
  {
    id: '2',
    name: '佐藤花子',
    team: '東京第一営業部',
    roleplayPassed: 35,
    totalDeals: 128,
    conversionRate: 38.7,
    leaderScore: 87,
    badge: 'gold',
    skills: [
      { name: 'ヒアリング力', scores: [58, 63, 70, 75, 82, 88] },
      { name: 'プレゼン力', scores: [72, 75, 78, 82, 85, 89] },
      { name: 'クロージング力', scores: [50, 55, 62, 68, 74, 80] },
      { name: '商品知識', scores: [68, 72, 76, 80, 84, 87] },
      { name: '関係構築力', scores: [75, 78, 80, 83, 86, 90] },
    ],
  },
  {
    id: '3',
    name: '鈴木一郎',
    team: '大阪支店',
    roleplayPassed: 22,
    totalDeals: 98,
    conversionRate: 31.2,
    leaderScore: 72,
    badge: 'silver',
    skills: [
      { name: 'ヒアリング力', scores: [45, 50, 56, 62, 68, 75] },
      { name: 'プレゼン力', scores: [52, 58, 63, 68, 72, 76] },
      { name: 'クロージング力', scores: [40, 48, 55, 60, 65, 70] },
      { name: '商品知識', scores: [60, 65, 70, 74, 78, 82] },
      { name: '関係構築力', scores: [55, 60, 64, 70, 75, 80] },
    ],
  },
  {
    id: '4',
    name: '高橋美咲',
    team: '名古屋チーム',
    roleplayPassed: 15,
    totalDeals: 64,
    conversionRate: 25.8,
    leaderScore: 58,
    badge: 'bronze',
    skills: [
      { name: 'ヒアリング力', scores: [35, 42, 48, 55, 60, 66] },
      { name: 'プレゼン力', scores: [40, 45, 52, 58, 63, 68] },
      { name: 'クロージング力', scores: [30, 38, 44, 50, 56, 62] },
      { name: '商品知識', scores: [50, 55, 60, 65, 70, 75] },
      { name: '関係構築力', scores: [42, 48, 55, 60, 66, 72] },
    ],
  },
]

const months = ['10月', '11月', '12月', '1月', '2月', '3月']

const badgeConfig = {
  platinum: { label: 'Platinum', color: 'text-cyan-300', bg: 'bg-cyan-300/10 border-cyan-300/30' },
  gold: { label: 'Gold', color: 'text-gold-400', bg: 'bg-gold-400/10 border-gold-400/30' },
  silver: { label: 'Silver', color: 'text-graphite-300', bg: 'bg-graphite-300/10 border-graphite-300/30' },
  bronze: { label: 'Bronze', color: 'text-amber-600', bg: 'bg-amber-600/10 border-amber-600/30' },
}

export default function MemberInsightsPage() {
  const { user } = useAuth()
  const [selectedMemberId, setSelectedMemberId] = useState(members[0].id)
  const selectedMember = members.find((m) => m.id === selectedMemberId)!

  const topPerformers = [...members]
    .sort((a, b) => b.leaderScore - a.leaderScore)
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <Users className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Member Insights</h1>
          <p className="text-sm text-muted">個別の成長曲線とリーダー候補分析</p>
        </div>
      </div>

      {/* Member Selector */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm font-medium text-graphite-300 mb-2">メンバー選択</label>
        <div className="relative">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full sm:w-80 appearance-none rounded-lg border border-border bg-graphite-800 px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.team}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400 pointer-events-none" />
        </div>
      </div>

      {/* Member Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">ロープレ合格数</span>
            <Trophy size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{selectedMember.roleplayPassed}</p>
          <p className="text-xs text-graphite-500 mt-1">累計合格回数</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">総商談数</span>
            <Target size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{selectedMember.totalDeals}</p>
          <p className="text-xs text-graphite-500 mt-1">過去6ヶ月</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">成約率</span>
            <TrendingUp size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{selectedMember.conversionRate}%</p>
          <p className="text-xs text-emerald-400 mt-1">チーム平均: 32.5%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-graphite-400">リーダースコア</span>
            <Award size={18} className="text-accent" />
          </div>
          <p className="text-3xl font-bold text-foreground">{selectedMember.leaderScore}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeConfig[selectedMember.badge].bg} ${badgeConfig[selectedMember.badge].color}`}>
              {badgeConfig[selectedMember.badge].label}
            </span>
          </div>
        </div>
      </div>

      {/* Skill Growth Curve */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold-500" />
          スキル成長曲線（過去6ヶ月）
        </h2>
        <p className="text-xs text-graphite-500 mb-4 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI分析によるスキル評価 - 本データはAIが商談データ・ロープレ結果から自動算出しています
        </p>

        <div className="space-y-6">
          {selectedMember.skills.map((skill) => {
            const latest = skill.scores[skill.scores.length - 1]
            const first = skill.scores[0]
            const growth = latest - first
            return (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground font-bold">{latest}</span>
                    <span className={`text-xs ${growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      (+{growth})
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {skill.scores.map((score, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-sm bg-gold-500/70 hover:bg-gold-400 transition-colors"
                        style={{ height: `${(score / 100) * 40}px` }}
                        title={`${months[i]}: ${score}`}
                      />
                      <span className="text-[9px] text-graphite-600">{months[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Next-Gen Leader Candidates */}
      <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-gold-500" />
          次世代リーダー候補
        </h2>
        <p className="text-xs text-graphite-500 mb-4 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI分析によるリーダー候補評価 - 複合指標に基づく自動判定です
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformers.map((member, i) => {
            const config = badgeConfig[member.badge]
            const avgSkill = Math.round(
              member.skills.reduce((sum, s) => sum + s.scores[s.scores.length - 1], 0) /
                member.skills.length
            )
            return (
              <div
                key={member.id}
                className="rounded-xl bg-graphite-800/50 border border-border p-5 hover:border-gold-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-500/10 text-gold-500 font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-graphite-400">{member.team}</p>
                  </div>
                  <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-graphite-900 p-2">
                    <p className="text-graphite-500">リーダースコア</p>
                    <p className="text-foreground font-bold">{member.leaderScore}/100</p>
                  </div>
                  <div className="rounded-lg bg-graphite-900 p-2">
                    <p className="text-graphite-500">平均スキル</p>
                    <p className="text-foreground font-bold">{avgSkill}/100</p>
                  </div>
                  <div className="rounded-lg bg-graphite-900 p-2">
                    <p className="text-graphite-500">成約率</p>
                    <p className="text-foreground font-bold">{member.conversionRate}%</p>
                  </div>
                  <div className="rounded-lg bg-graphite-900 p-2">
                    <p className="text-graphite-500">ロープレ合格</p>
                    <p className="text-foreground font-bold">{member.roleplayPassed}回</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-graphite-300 leading-relaxed">
                  {i === 0
                    ? '全スキルカテゴリで高い成長率を維持。特にクロージング力の伸びが顕著で、チーム牽引力あり。'
                    : i === 1
                      ? '関係構築力とプレゼン力に優れ、安定した成績。チームメンバーへの指導実績も豊富。'
                      : '着実な成長カーブを描いており、ポテンシャルが高い。商品知識の強化で更なる飛躍が期待できる。'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
