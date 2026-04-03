'use client'

import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Copy,
  Users,
  CheckCircle2,
  Settings,
  Activity,
  FileWarning,
} from 'lucide-react'

interface AuditLog {
  id: string
  user: string
  action: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: '1', user: '田中太郎', action: 'ナレッジライブラリ閲覧（12件）', timestamp: '2026-03-19 17:45', severity: 'info' },
  { id: '2', user: '佐藤健一', action: 'スクリプト一括ダウンロード（5件）', timestamp: '2026-03-19 16:30', severity: 'warning' },
  { id: '3', user: '鈴木花子', action: '提案資料PDFエクスポート', timestamp: '2026-03-19 15:20', severity: 'info' },
  { id: '4', user: '山田太郎', action: '大量コピー検知 - テキスト選択範囲超過', timestamp: '2026-03-19 14:10', severity: 'critical' },
  { id: '5', user: '田中太郎', action: 'ログイン（正常）', timestamp: '2026-03-19 09:00', severity: 'info' },
]

const SEVERITY_STYLES = {
  info: { bg: 'bg-graphite-800', text: 'text-graphite-300', icon: Activity },
  warning: { bg: 'bg-amber-400/5', text: 'text-amber-400', icon: AlertTriangle },
  critical: { bg: 'bg-red-500/5', text: 'text-red-400', icon: FileWarning },
}

const SECURITY_SETTINGS = [
  {
    title: 'テナント間データ分離',
    description: '異なる代理店のデータを完全に分離。クロステナントアクセスを禁止。',
    icon: Users,
    enabled: true,
  },
  {
    title: 'ID透かし（ウォーターマーク）',
    description: 'エクスポートされるPDF・ドキュメントにユーザーIDの電子透かしを埋め込み。',
    icon: Eye,
    enabled: true,
  },
  {
    title: '大量コピー検知',
    description: '一定量以上のテキスト選択・コピー操作を検知しアラート。閾値: 500文字/回。',
    icon: Copy,
    enabled: true,
  },
  {
    title: 'セッションタイムアウト',
    description: '無操作30分でセッションを自動終了。再ログインが必要。',
    icon: Lock,
    enabled: true,
  },
  {
    title: 'ダウンロード制限',
    description: '1日あたりのダウンロード件数を制限。デフォルト: 50件/日。',
    icon: AlertTriangle,
    enabled: false,
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Shield className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Security & Proxy</h1>
            <p className="text-sm text-muted">権限設定・ID透かし・大量コピー検知・監査ログ</p>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 border border-emerald-400/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">セキュリティ状態</span>
            <Shield size={18} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-lg font-bold text-emerald-400">正常</p>
          <p className="text-xs text-graphite-400">全ポリシー適用中</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">今月の警告</span>
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">3件</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">有効ポリシー</span>
            <Settings size={18} className="text-gold-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">4/5</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite-400">監査ログ件数</span>
            <Activity size={18} className="text-gold-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">1,284</p>
          <p className="text-xs text-graphite-400">今月</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Security Settings */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gold-500" />
              セキュリティポリシー
            </h2>
            <div className="space-y-4">
              {SECURITY_SETTINGS.map((setting, i) => {
                const Icon = setting.icon
                return (
                  <div key={i} className="rounded-xl bg-graphite-800 p-4 border border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-graphite-700 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-gold-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{setting.title}</h3>
                          <p className="text-xs text-graphite-400 mt-1 leading-relaxed">{setting.description}</p>
                        </div>
                      </div>
                      <button
                        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                          setting.enabled ? 'bg-gold-500' : 'bg-graphite-600'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            setting.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Audit Log */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold-500" />
              監査ログ（直近）
            </h2>
            <div className="space-y-2">
              {MOCK_AUDIT_LOGS.map((log) => {
                const style = SEVERITY_STYLES[log.severity]
                const LogIcon = style.icon
                return (
                  <div key={log.id} className={`rounded-lg ${style.bg} p-3 border border-border`}>
                    <div className="flex items-center gap-3">
                      <LogIcon className={`w-4 h-4 ${style.text} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{log.user}</span>
                          <span className="text-xs text-graphite-500">{log.timestamp}</span>
                        </div>
                        <p className={`text-xs ${style.text} mt-0.5`}>{log.action}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar - Tenant Permissions */}
        <div className="w-full xl:w-72 flex-shrink-0">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-8">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-500" />
              テナント権限
            </h2>
            <div className="space-y-3">
              {['ABC代理店', 'XYZ販売', 'DEF営業所'].map((tenant) => (
                <div key={tenant} className="rounded-lg bg-graphite-800 p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{tenant}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-graphite-400">ID透かし</span>
                      <span className="text-emerald-400">有効</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-graphite-400">コピー検知</span>
                      <span className="text-emerald-400">有効</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-graphite-400">DL制限</span>
                      <span className="text-graphite-500">無効</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted">
          ※セキュリティポリシーの変更は即座に全テナントに適用されます。変更は監査ログに記録されます。
        </p>
      </div>
    </div>
  )
}
