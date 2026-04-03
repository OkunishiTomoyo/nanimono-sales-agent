'use client'

import {
  Heart,
  AlertTriangle,
  TrendingDown,
  Calendar,
  MessageCircle,
  Activity,
  Users,
  ArrowDown,
  ArrowUp,
  Clock,
  Phone,
} from 'lucide-react'

interface MemberAlert {
  id: string
  name: string
  severity: 'critical' | 'warning' | 'watch'
  indicators: string[]
  lastActive: string
  activityTrend: number // negative = declining
  suggestion: string
  daysSinceLastWin: number
}

const MOCK_ALERTS: MemberAlert[] = [
  {
    id: '1',
    name: '山田太郎',
    severity: 'critical',
    indicators: ['日報未提出 3日連続', '商談数が先週比-60%', 'ログイン頻度が大幅低下'],
    lastActive: '3日前',
    activityTrend: -60,
    suggestion: '至急1on1面談を設定してください。連続した活動量低下は「心の折れ」の兆候です。',
    daysSinceLastWin: 18,
  },
  {
    id: '2',
    name: '鈴木花子',
    severity: 'warning',
    indicators: ['成約率が先月比-15%', '日報の記述量が減少傾向'],
    lastActive: '今日',
    activityTrend: -25,
    suggestion: '週次の振り返りで「困っていることはないか」を確認しましょう。技術的な課題ではなくモチベーションの問題の可能性があります。',
    daysSinceLastWin: 12,
  },
  {
    id: '3',
    name: '佐藤健一',
    severity: 'warning',
    indicators: ['テレアポのコール数が先週比-40%', 'Roleplay利用が0回（先週5回）'],
    lastActive: '昨日',
    activityTrend: -40,
    suggestion: 'テレアポへの苦手意識が出ている可能性。成功体験を振り返る面談を推奨します。',
    daysSinceLastWin: 8,
  },
  {
    id: '4',
    name: '田中美咲',
    severity: 'watch',
    indicators: ['活動量は維持だが失注が3件連続'],
    lastActive: '今日',
    activityTrend: -10,
    suggestion: '技術的なフォローで解決できる可能性も。まずはAI Issue Detectiveのレポートを確認してください。',
    daysSinceLastWin: 14,
  },
]

const TEAM_METRICS = {
  totalMembers: 24,
  needsAttention: 4,
  avgActivityChange: -8,
  avgMorale: 72,
}

const SEVERITY_STYLES = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/15 text-red-400',
    icon: 'text-red-400',
    pulse: 'animate-pulse',
    label: '要即対応',
  },
  warning: {
    bg: 'bg-amber-400/5',
    border: 'border-amber-400/30',
    badge: 'bg-amber-400/15 text-amber-400',
    icon: 'text-amber-400',
    pulse: '',
    label: '注意',
  },
  watch: {
    bg: 'bg-graphite-800',
    border: 'border-border',
    badge: 'bg-graphite-600/30 text-graphite-300',
    icon: 'text-graphite-400',
    pulse: '',
    label: '経過観察',
  },
}

export default function HumanTouchPage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10">
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Human Touch Focus</h1>
            <p className="text-sm text-muted">
              AIが検知した「心のケアが必要なメンバー」- マネージャーが面談すべき人を可視化
            </p>
          </div>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">チーム人数</span>
            <Users size={18} className="text-gold-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{TEAM_METRICS.totalMembers}名</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-red-500/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">要注意メンバー</span>
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-400">{TEAM_METRICS.needsAttention}名</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">全体活動量変化</span>
            <Activity size={18} className="text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{TEAM_METRICS.avgActivityChange}%</p>
          <p className="text-xs text-graphite-400">先週比</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">推定チーム士気</span>
            <Heart size={18} className="text-gold-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{TEAM_METRICS.avgMorale}/100</p>
          <div className="mt-1 h-1.5 bg-graphite-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 rounded-full"
              style={{ width: `${TEAM_METRICS.avgMorale}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-gold-500" />
          面談推奨メンバー
        </h2>

        {MOCK_ALERTS.map((alert) => {
          const style = SEVERITY_STYLES[alert.severity]
          return (
            <div
              key={alert.id}
              className={`rounded-2xl border ${style.border} ${style.bg} p-6 ${style.pulse}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Member Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-graphite-700 text-graphite-300 font-bold text-sm">
                      {alert.name[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{alert.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {style.label}
                        </span>
                        <span className="text-xs text-graphite-400">
                          最終アクティブ: {alert.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="space-y-1.5 mb-4">
                    {alert.indicators.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-graphite-200">
                        <TrendingDown className={`w-3.5 h-3.5 ${style.icon} shrink-0`} />
                        {ind}
                      </div>
                    ))}
                  </div>

                  {/* Suggestion */}
                  <div className="rounded-xl bg-graphite-900/50 p-4 border border-border">
                    <p className="text-xs font-semibold text-gold-500 mb-1.5 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      マネージャーへの提案
                    </p>
                    <p className="text-sm text-graphite-200 leading-relaxed">
                      {alert.suggestion}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex lg:flex-col gap-3 lg:w-40">
                  <div className="flex-1 rounded-xl bg-graphite-800 p-3 border border-border text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {alert.activityTrend < 0 ? (
                        <ArrowDown className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className={`text-lg font-bold ${alert.activityTrend < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {alert.activityTrend}%
                      </span>
                    </div>
                    <p className="text-[10px] text-graphite-400">活動量変化</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-graphite-800 p-3 border border-border text-center">
                    <p className="text-lg font-bold text-foreground">{alert.daysSinceLastWin}日</p>
                    <p className="text-[10px] text-graphite-400">最終成約から</p>
                  </div>
                  <div className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-3 py-3 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
                      <Phone className="w-4 h-4" />
                      面談設定
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-graphite-500" />
        <p className="text-xs text-muted">
          最終更新: {new Date().toLocaleString('ja-JP')} | 活動データは日次で自動分析されます
        </p>
      </div>
      <div className="mt-2">
        <p className="text-xs text-muted">
          ※本分析はAIによる推定です。最終的な判断はマネージャーが行ってください。
        </p>
      </div>
    </div>
  )
}
