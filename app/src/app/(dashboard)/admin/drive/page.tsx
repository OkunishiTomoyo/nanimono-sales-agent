'use client'

import { useState } from 'react'
import {
  HardDrive,
  FolderOpen,
  FileText,
  Mic,
  BookOpen,
  BarChart3,
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Link2,
  Settings,
  Cloud,
  ArrowUpRight,
} from 'lucide-react'

interface SyncItem {
  id: string
  type: 'daily-report' | 'transcript' | 'analysis' | 'script' | 'proposal'
  title: string
  date: string
  author: string
  status: 'synced' | 'pending' | 'error'
  drivePath: string
}

const SYNC_TYPE_META: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  'daily-report': { icon: BookOpen, label: '日報', color: 'text-blue-400' },
  'transcript': { icon: Mic, label: '文字起こし', color: 'text-purple-400' },
  'analysis': { icon: BarChart3, label: '分析レポート', color: 'text-emerald-400' },
  'script': { icon: Target, label: 'スクリプト', color: 'text-gold-500' },
  'proposal': { icon: FileText, label: '提案資料', color: 'text-amber-400' },
}

const MOCK_SYNC_ITEMS: SyncItem[] = [
  { id: '1', type: 'daily-report', title: '田中太郎 - 日報 2026/03/19', date: '2026-03-19 18:30', author: '田中太郎', status: 'synced', drivePath: '/AGI-Sales Driver/ABC代理店/日報/' },
  { id: '2', type: 'transcript', title: '東洋精密工業 商談録音 文字起こし', date: '2026-03-19 16:45', author: '佐藤健一', status: 'synced', drivePath: '/AGI-Sales Driver/ABC代理店/テレアポ/UMIDAS/' },
  { id: '3', type: 'analysis', title: 'KSF分析 - AI Labs様 受注要因', date: '2026-03-19 15:20', author: '田中太郎', status: 'synced', drivePath: '/AGI-Sales Driver/ABC代理店/Web反響/UMIDAS/' },
  { id: '4', type: 'script', title: 'テレアポ向け UMIDAS スクリプト v3.2', date: '2026-03-19 14:00', author: 'AI生成', status: 'synced', drivePath: '/AGI-Sales Driver/ABC代理店/テレアポ/UMIDAS/' },
  { id: '5', type: 'proposal', title: 'グリーンテック様 提案資料', date: '2026-03-18 17:30', author: '鈴木花子', status: 'pending', drivePath: '/AGI-Sales Driver/ABC代理店/飛び込み/CloudSync/' },
  { id: '6', type: 'daily-report', title: '佐藤健一 - 日報 2026/03/18', date: '2026-03-18 19:00', author: '佐藤健一', status: 'error', drivePath: '/AGI-Sales Driver/ABC代理店/日報/' },
]

const FOLDER_STRUCTURE = [
  { name: 'AGI-Sales Driver/', level: 0, count: null },
  { name: 'ABC代理店/', level: 1, count: null },
  { name: '日報/', level: 2, count: 142 },
  { name: 'テレアポ/', level: 2, count: null },
  { name: 'UMIDAS/', level: 3, count: 28 },
  { name: 'CloudSync/', level: 3, count: 15 },
  { name: '飛び込み/', level: 2, count: null },
  { name: 'UMIDAS/', level: 3, count: 12 },
  { name: 'Web反響/', level: 2, count: null },
  { name: 'UMIDAS/', level: 3, count: 34 },
  { name: '紹介/', level: 2, count: null },
  { name: 'UMIDAS/', level: 3, count: 8 },
  { name: '分析レポート/', level: 2, count: 56 },
  { name: 'スクリプト/', level: 2, count: 23 },
]

const STATUS_STYLES = {
  synced: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', label: '同期済み', Icon: CheckCircle2 },
  pending: { bg: 'bg-amber-400/10', text: 'text-amber-400', label: '同期待ち', Icon: Clock },
  error: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'エラー', Icon: AlertCircle },
}

export default function DrivePage() {
  const [isConnected] = useState(true)

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <HardDrive className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Google Drive 連携</h1>
            <p className="text-sm text-muted">日報・録音文字起こし・分析レポート・スクリプトをGoogle Driveに自動同期</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${isConnected ? 'bg-emerald-400/10' : 'bg-graphite-800'}`}>
              <Cloud className={`w-6 h-6 ${isConnected ? 'text-emerald-400' : 'text-graphite-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">Google Drive</h2>
                {isConnected ? (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    接続中
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-graphite-600/30 text-graphite-400">
                    未接続
                  </span>
                )}
              </div>
              <p className="text-xs text-graphite-400 mt-0.5">
                admin@abc-agency.co.jp のGoogle Driveと同期中
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-graphite-300 hover:text-foreground hover:bg-graphite-800 transition-colors">
              <Settings className="w-4 h-4" />
              設定
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
              <RefreshCw className="w-4 h-4" />
              手動同期
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-graphite-400">同期済みファイル</p>
            <p className="text-xl font-bold text-foreground mt-1">318</p>
          </div>
          <div>
            <p className="text-xs text-graphite-400">同期待ち</p>
            <p className="text-xl font-bold text-amber-400 mt-1">3</p>
          </div>
          <div>
            <p className="text-xs text-graphite-400">使用容量</p>
            <p className="text-xl font-bold text-foreground mt-1">2.4 GB</p>
          </div>
          <div>
            <p className="text-xs text-graphite-400">最終同期</p>
            <p className="text-xl font-bold text-foreground mt-1">5分前</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Sync History */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gold-500" />
              同期履歴
            </h2>
            <div className="space-y-3">
              {MOCK_SYNC_ITEMS.map((item) => {
                const typeMeta = SYNC_TYPE_META[item.type]
                const statusStyle = STATUS_STYLES[item.status]
                const TypeIcon = typeMeta.icon
                const StatusIcon = statusStyle.Icon
                return (
                  <div
                    key={item.id}
                    className="rounded-xl bg-graphite-800 p-4 border border-border hover:border-gold-500/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-graphite-700 shrink-0`}>
                          <TypeIcon className={`w-4 h-4 ${typeMeta.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                              {statusStyle.label}
                            </span>
                            <span className="text-xs text-graphite-400">{item.date}</span>
                            <span className="text-xs text-graphite-500">{item.author}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-graphite-500">
                            <FolderOpen className="w-3 h-3" />
                            <span className="truncate">{item.drivePath}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <StatusIcon className={`w-4 h-4 ${statusStyle.text}`} />
                        <button className="p-1.5 rounded-md text-graphite-400 hover:text-gold-500 hover:bg-graphite-700 transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-8">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gold-500" />
              Drive フォルダ構造
            </h2>
            <div className="space-y-0.5 font-mono text-xs">
              {FOLDER_STRUCTURE.map((folder, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 px-2 rounded hover:bg-graphite-800 transition-colors"
                  style={{ paddingLeft: `${folder.level * 16 + 8}px` }}
                >
                  <div className="flex items-center gap-1.5 text-graphite-200">
                    <FolderOpen className="w-3 h-3 text-gold-500/60" />
                    {folder.name}
                  </div>
                  {folder.count !== null && (
                    <span className="text-graphite-500">{folder.count}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-graphite-400 mb-3">同期対象データ</h3>
              <div className="space-y-2">
                {Object.entries(SYNC_TYPE_META).map(([key, meta]) => {
                  const Icon = meta.icon
                  return (
                    <div key={key} className="flex items-center gap-2 text-xs text-graphite-300">
                      <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                      {meta.label}
                      <Link2 className="w-3 h-3 text-emerald-400 ml-auto" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted">
          ※Google Drive連携にはGoogle OAuth 2.0認証が必要です。管理者のみ連携設定が可能です。
        </p>
      </div>
    </div>
  )
}
