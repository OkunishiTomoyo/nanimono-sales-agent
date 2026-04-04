'use client'

import { useState } from 'react'
import {
  SearchX,
  AlertCircle,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Sparkles,
  GraduationCap,
  BarChart3,
  ChevronRight,
  Calendar,
  Target,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface CommonIssue {
  id: string
  title: string
  description: string
  frequency: number
  severity: 'high' | 'medium' | 'low'
  affectedMembers: number
}

interface RejectionReason {
  reason: string
  count: number
  changeFromLastWeek: number
}

interface TrainingTopic {
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium'
  relatedIssueCount: number
}

const commonIssues: CommonIssue[] = [
  {
    id: '1',
    title: '価格訴求力の不足',
    description: 'ROIベースの価格説明ができず、単純な価格比較に持ち込まれるケースが増加。TCO観点での提案力が不足している。',
    frequency: 18,
    severity: 'high',
    affectedMembers: 12,
  },
  {
    id: '2',
    title: '初回ヒアリングの深さ不足',
    description: '顧客の本質的な課題を掘り下げられず、表面的なニーズだけで提案に入ってしまう傾向。SPIN話法の実践が不十分。',
    frequency: 15,
    severity: 'high',
    affectedMembers: 9,
  },
  {
    id: '3',
    title: 'クロージングタイミングの見極め',
    description: '購買シグナルを見逃し、適切なタイミングでクロージングに入れていない。また、クロージングに入るのが早すぎるケースも散見。',
    frequency: 11,
    severity: 'medium',
    affectedMembers: 7,
  },
  {
    id: '4',
    title: 'フォローアップの遅延',
    description: '商談後のフォローアップが72時間を超えるケースが多く、顧客の関心が低下している。特に「検討中」案件での遅延が顕著。',
    frequency: 8,
    severity: 'medium',
    affectedMembers: 6,
  },
]

const rejectionReasons: RejectionReason[] = [
  { reason: '予算不足・コスト懸念', count: 24, changeFromLastWeek: 3 },
  { reason: '競合製品を選択', count: 18, changeFromLastWeek: -2 },
  { reason: 'タイミングが合わない', count: 15, changeFromLastWeek: 5 },
  { reason: '意思決定者の承認が得られない', count: 12, changeFromLastWeek: 1 },
  { reason: '現状維持を選択', count: 9, changeFromLastWeek: -3 },
  { reason: 'ニーズの不一致', count: 7, changeFromLastWeek: 0 },
]

const weeklyComparison = {
  thisWeek: { deals: 42, wins: 14, losses: 12, pending: 16 },
  lastWeek: { deals: 38, wins: 12, losses: 14, pending: 12 },
}

const trainingTopics: TrainingTopic[] = [
  {
    title: 'ROI提案力強化ワークショップ',
    description: '価格訴求からROI訴求への転換。TCOベースの提案資料作成と実践ロールプレイ。',
    priority: 'urgent',
    relatedIssueCount: 18,
  },
  {
    title: 'SPIN話法マスター講座',
    description: '状況質問→問題質問→示唆質問→解決質問の実践トレーニング。初回ヒアリングの質を向上。',
    priority: 'high',
    relatedIssueCount: 15,
  },
  {
    title: '購買シグナル読み取り訓練',
    description: '顧客の言語的・非言語的シグナルの読み取りと、最適なクロージングタイミングの判断力を養成。',
    priority: 'high',
    relatedIssueCount: 11,
  },
  {
    title: 'フォローアップ効率化',
    description: 'テンプレート活用とリマインダー設定による、72時間以内フォローアップの習慣化。',
    priority: 'medium',
    relatedIssueCount: 8,
  },
]

const severityConfig = {
  high: { label: '高', color: 'text-red-400', bg: 'bg-red-400/10' },
  medium: { label: '中', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  low: { label: '低', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
}

const priorityConfig = {
  urgent: { label: '緊急', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
  high: { label: '高', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  medium: { label: '中', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30' },
}

export default function AIIssueDetectivePage() {
  const { user } = useAuth()
  const [showReport, setShowReport] = useState(false)

  const maxRejection = Math.max(...rejectionReasons.map((r) => r.count))

  const wc = weeklyComparison
  const dealChange = wc.thisWeek.deals - wc.lastWeek.deals
  const winChange = wc.thisWeek.wins - wc.lastWeek.wins
  const lossChange = wc.thisWeek.losses - wc.lastWeek.losses

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <SearchX className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Issue Detective</h1>
          <p className="text-sm text-muted">AIが営業データから共通課題を自動抽出</p>
        </div>
      </div>

      <p className="text-xs text-graphite-500 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        ※ 本ページの分析結果はすべてAIが営業データから自動生成しています。実際の状況と異なる場合があります。
      </p>

      {/* Common Issues This Week */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gold-500" />
          今週の共通課題
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonIssues.map((issue) => {
            const sev = severityConfig[issue.severity]
            return (
              <div
                key={issue.id}
                className="rounded-2xl border border-border bg-card p-6 hover:border-graphite-600 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color}`}>
                    重要度: {sev.label}
                  </span>
                  <span className="text-xs text-graphite-500">検出回数: {issue.frequency}件</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{issue.title}</h3>
                <p className="text-sm text-graphite-300 leading-relaxed mb-3">{issue.description}</p>
                <div className="flex items-center gap-1 text-xs text-graphite-500">
                  <Target className="w-3 h-3" />
                  影響メンバー: {issue.affectedMembers}名
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rejection Reasons Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-gold-500" />
            断られた共通原因
          </h2>
          <div className="space-y-4">
            {rejectionReasons.map((item) => (
              <div key={item.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{item.reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{item.count}</span>
                    {item.changeFromLastWeek !== 0 && (
                      <span
                        className={`flex items-center text-xs ${
                          item.changeFromLastWeek > 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.changeFromLastWeek > 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(item.changeFromLastWeek)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-graphite-800">
                  <div
                    className="h-full rounded-full bg-gold-500/70"
                    style={{ width: `${(item.count / maxRejection) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            週次比較
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-graphite-800/50 p-4 text-center">
              <p className="text-xs text-graphite-500 mb-1">今週の商談数</p>
              <p className="text-2xl font-bold text-foreground">{wc.thisWeek.deals}</p>
              <p className={`text-xs mt-1 ${dealChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {dealChange >= 0 ? '+' : ''}{dealChange} 先週比
              </p>
            </div>
            <div className="rounded-xl bg-graphite-800/50 p-4 text-center">
              <p className="text-xs text-graphite-500 mb-1">今週の成約</p>
              <p className="text-2xl font-bold text-emerald-400">{wc.thisWeek.wins}</p>
              <p className={`text-xs mt-1 ${winChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {winChange >= 0 ? '+' : ''}{winChange} 先週比
              </p>
            </div>
            <div className="rounded-xl bg-graphite-800/50 p-4 text-center">
              <p className="text-xs text-graphite-500 mb-1">今週の失注</p>
              <p className="text-2xl font-bold text-red-400">{wc.thisWeek.losses}</p>
              <p className={`text-xs mt-1 ${lossChange <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {lossChange >= 0 ? '+' : ''}{lossChange} 先週比
              </p>
            </div>
            <div className="rounded-xl bg-graphite-800/50 p-4 text-center">
              <p className="text-xs text-graphite-500 mb-1">検討中</p>
              <p className="text-2xl font-bold text-gold-400">{wc.thisWeek.pending}</p>
              <p className="text-xs text-graphite-500 mt-1">
                先週: {wc.lastWeek.pending}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-graphite-400">成約率</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {((wc.thisWeek.wins / wc.thisWeek.deals) * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-graphite-500">
                  (先週: {((wc.lastWeek.wins / wc.lastWeek.deals) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Topics */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gold-500" />
          翌週の教育課題
        </h2>
        <p className="text-xs text-graphite-500 mb-4 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AIが共通課題から自動推薦したトレーニングテーマです
        </p>
        <div className="space-y-3">
          {trainingTopics.map((topic, i) => {
            const pri = priorityConfig[topic.priority]
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl px-5 py-4 bg-graphite-800/50 hover:bg-graphite-800 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500/10 text-gold-500 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pri.bg} ${pri.color}`}>
                      {pri.label}
                    </span>
                  </div>
                  <p className="text-xs text-graphite-400">{topic.description}</p>
                </div>
                <span className="text-xs text-graphite-500 whitespace-nowrap">
                  関連 {topic.relatedIssueCount}件
                </span>
                <ChevronRight className="w-4 h-4 text-graphite-500" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Report Generation */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-500" />
            週次レポート
          </h2>
          <button
            onClick={() => setShowReport(!showReport)}
            className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            週次レポートを生成
          </button>
        </div>

        {showReport && (
          <div className="rounded-xl bg-graphite-800/50 border border-border p-6 space-y-4">
            <p className="text-xs text-graphite-500 flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3" />
              ※ 以下のレポートはAIが自動生成しています
            </p>
            <div>
              <h3 className="text-sm font-semibold text-gold-400 mb-2">週次営業分析レポート (3/14 - 3/20)</h3>
              <div className="space-y-3 text-sm text-graphite-200 leading-relaxed">
                <p>
                  <span className="font-semibold text-foreground">1. 概況:</span>{' '}
                  今週の総商談数は42件で前週比+10.5%。成約率は33.3%で前週比+1.7ポイント改善。
                  特に東京第一営業部の成約率が42.3%と高水準を維持。
                </p>
                <p>
                  <span className="font-semibold text-foreground">2. 主要課題:</span>{' '}
                  価格訴求力の不足（18件検出）と初回ヒアリングの深さ不足（15件検出）が主要な改善ポイント。
                  特に価格面での競合対策が急務。
                </p>
                <p>
                  <span className="font-semibold text-foreground">3. 改善提案:</span>{' '}
                  来週はROI提案力強化ワークショップの実施を推奨。また、SPIN話法の実践トレーニングを
                  名古屋チーム向けに優先的に実施することで、ヒアリング品質の底上げが期待できる。
                </p>
                <p>
                  <span className="font-semibold text-foreground">4. 注目メンバー:</span>{' '}
                  田中太郎（成約率42.3%、リーダースコア94）が引き続きチームを牽引。
                  佐藤花子のプレゼン力向上が著しく、次世代リーダー候補として注目。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
