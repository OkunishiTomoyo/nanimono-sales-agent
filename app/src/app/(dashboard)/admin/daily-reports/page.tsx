'use client'

import { useState } from 'react'
import {
  ClipboardList,
  CalendarDays,
  User,
  ChevronDown,
  Route,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  XCircle,
} from 'lucide-react'

interface MemberReport {
  id: string
  date: string
  channel: string
  summary: string
  kpiData: Record<string, string>
  result?: string
}

const MEMBERS = [
  { id: 'u1', name: '田中太郎' },
  { id: 'u2', name: '佐藤花子' },
  { id: 'u6', name: '山田健一' },
  { id: 'u7', name: '鈴木美咲' },
  { id: 'u8', name: '高橋翔太' },
]

const MOCK_REPORTS: Record<string, MemberReport[]> = {
  u1: [
    { id: 'r1', date: '2026-04-04', channel: 'テレアポ', summary: 'A社への初回提案プレゼンを実施。競合3社との比較資料を作成し、ROI試算を含む提案書を準備。先方の工場長から好反応。', kpiData: { コール数: '52', 通話時間: '180分', アポ取得: '3', 受注: '1' } },
    { id: 'r2', date: '2026-04-03', channel: 'テレアポ', summary: 'B社との定例ミーティング。導入後3ヶ月のKPI報告。月次コスト12%削減の実績を報告し、追加機能の導入提案へ。', kpiData: { コール数: '48', 通話時間: '160分', アポ取得: '2', 受注: '0' } },
    { id: 'r3', date: '2026-04-02', channel: '飛び込み', summary: 'エリアCの新規開拓。5社訪問し、2社で名刺交換。1社は来週アポ取得の見込み。', kpiData: { 訪問件数: '5', 名刺交換: '2', アポ取得: '0', 受注: '0' } },
  ],
  u2: [
    { id: 'r4', date: '2026-04-04', channel: 'Web反響', summary: '問い合わせ対応8件。うち3件が商談化。C社は即日でデモ設定。', kpiData: { リード対応: '8', 商談化: '3', 受注: '0' } },
    { id: 'r5', date: '2026-04-03', channel: 'Web反響', summary: 'ウェビナーフォロー6件。2件がトライアル申込。', kpiData: { リード対応: '6', 商談化: '2', 受注: '0' } },
  ],
  u6: [
    { id: 'r6', date: '2026-04-04', channel: '飛び込み', summary: '商業施設エリアを重点開拓。8社訪問、3社で面談実現。1社で見積依頼。', kpiData: { 訪問件数: '8', 名刺交換: '5', アポ取得: '1', 受注: '0' } },
  ],
  u7: [
    { id: 'r7', date: '2026-04-04', channel: '紹介', summary: 'D社からの紹介でE社と初回面談。ニーズマッチ。来週提案予定。', kpiData: { 紹介元: 'D社 田村様', 面談数: '1', 受注: '0' } },
  ],
  u8: [
    { id: 'r8', date: '2026-04-04', channel: 'テレアポ', summary: '新規リスト50件にコール。アポ4件取得。うち1件は即日商談化。', kpiData: { コール数: '50', 通話時間: '200分', アポ取得: '4', 受注: '0' } },
  ],
}

const RESULT_ICONS = {
  '成約': { icon: Trophy, color: 'text-emerald-400' },
  '検討中': { icon: CheckCircle2, color: 'text-gold-500' },
  '失注': { icon: XCircle, color: 'text-red-400' },
  '初回訪問': { icon: AlertTriangle, color: 'text-blue-400' },
}

export default function DailyReportsPage() {
  const [selectedMemberId, setSelectedMemberId] = useState(MEMBERS[0].id)

  const selectedMember = MEMBERS.find((m) => m.id === selectedMemberId)
  const reports = MOCK_REPORTS[selectedMemberId] ?? []

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <ClipboardList className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">メンバー日報</h1>
            <p className="text-sm text-muted">各メンバーの日報・活動KPIを閲覧</p>
          </div>
        </div>
      </div>

      {/* Member Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MEMBERS.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedMemberId(member.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
              selectedMemberId === member.id
                ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                : 'border-border bg-graphite-800 text-graphite-300 hover:border-gold-500/50'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              selectedMemberId === member.id ? 'bg-gold-500 text-graphite-950' : 'bg-graphite-700 text-graphite-300'
            }`}>
              {member.name[0]}
            </div>
            {member.name}
          </button>
        ))}
      </div>

      {/* Reports */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <ClipboardList className="w-12 h-12 text-graphite-600 mx-auto mb-3" />
            <p className="text-sm text-muted">このメンバーの日報はまだありません</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-semibold text-foreground">{report.date}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-graphite-800 border border-border">
                  <Route className="w-3 h-3 text-gold-500" />
                  <span className="text-xs font-medium text-graphite-200">{report.channel}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-graphite-800 border border-border">
                  <User className="w-3 h-3 text-gold-500" />
                  <span className="text-xs font-medium text-graphite-200">{selectedMember?.name}</span>
                </div>
              </div>

              {/* KPI Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {Object.entries(report.kpiData).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-graphite-800 p-3 border border-border">
                    <p className="text-[10px] text-graphite-400 mb-1">{key}</p>
                    <p className="text-lg font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                <p className="text-sm text-graphite-200 leading-relaxed">{report.summary}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
