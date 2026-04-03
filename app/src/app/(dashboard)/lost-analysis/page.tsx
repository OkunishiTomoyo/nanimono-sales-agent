'use client'

import { useState } from 'react'
import {
  Trophy,
  AlertTriangle,
  Send,
  Share2,
  Sparkles,
  CalendarDays,
  Building2,
  Package,
  Radio,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

type AnalysisMode = 'ksf' | 'kff'

interface DealForm {
  date: string
  client: string
  product: string
  channel: string
  amount: string
  description: string
}

interface KSFResult {
  successFactors: { factor: string; impact: string }[]
  keyPhrases: string[]
  knowledgeCard: {
    title: string
    summary: string
    takeaways: string[]
  }
}

interface KFFResult {
  failureFactors: { factor: string; severity: string }[]
  timeline: { phase: string; issue: string }[]
  supervisorReport: {
    summary: string
    questions: string[]
    nextActions: string[]
  }
}

interface RecentAnalysis {
  id: string
  date: string
  client: string
  mode: AnalysisMode
  product: string
}

const MOCK_KSF_RESULT: KSFResult = {
  successFactors: [
    { factor: '初回ヒアリングで顧客の潜在課題を的確に把握', impact: '決定打' },
    { factor: 'ROIシミュレーションの具体性が経営層を動かした', impact: '高' },
    { factor: '競合との差別化ポイントを3つに絞って訴求', impact: '高' },
    { factor: '導入企業の担当者からの推薦コメントを活用', impact: '中' },
  ],
  keyPhrases: [
    '「御社の課題は○○ではなく、本質的には△△ですよね」',
    '「導入3ヶ月で投資回収できた企業が82%です」',
    '「他社製品では実現できない点が3つあります」',
    '「実際に使っている方の声をお聞きください」',
  ],
  knowledgeCard: {
    title: '潜在課題の発掘 + 具体的ROI提示パターン',
    summary:
      '初回ヒアリングで表面的な課題の裏にある本質的な問題を掘り下げ、具体的なROIシミュレーションと導入事例で説得力を持たせるアプローチ。',
    takeaways: [
      '表面課題の「なぜ？」を3回深掘りする',
      'ROIは必ず月次・年次の両方で提示する',
      '同業種の導入事例を最低2社用意しておく',
      '決裁者と現場担当者で訴求ポイントを変える',
    ],
  },
}

const MOCK_KFF_RESULT: KFFResult = {
  failureFactors: [
    { factor: '顧客の予算感を初期段階で確認できていなかった', severity: '致命的' },
    { factor: '競合製品との比較資料が不十分だった', severity: '重大' },
    { factor: 'キーマンへのアプローチが遅れた', severity: '重大' },
    { factor: '提案書のカスタマイズが不足していた', severity: '中程度' },
  ],
  timeline: [
    { phase: '初回接触', issue: 'ニーズの深掘りが不十分だった' },
    { phase: '提案段階', issue: '汎用的な提案書で差別化できなかった' },
    { phase: '比較検討', issue: '競合情報の収集・対策が後手に回った' },
    { phase: '最終判断', issue: '決裁者との直接面談が実現できなかった' },
  ],
  supervisorReport: {
    summary:
      '初期段階での予算確認漏れと、競合対策の遅れが主要因。提案のカスタマイズ度が低く、顧客固有の課題への対応が不十分だった。',
    questions: [
      '初回ヒアリング時に予算感を確認するプロセスは標準化されているか？',
      '競合情報のデータベースは最新化されているか？',
      '提案書のテンプレートに顧客カスタマイズセクションは含まれているか？',
      '案件の進捗に応じたキーマンアプローチの基準は明確か？',
    ],
    nextActions: [
      '初回ヒアリングシートに予算確認項目を追加する',
      '競合比較資料を月次で更新する運用フローを構築する',
      '提案書テンプレートの改訂（顧客別カスタマイズセクション追加）',
    ],
  },
}

const MOCK_RECENT_ANALYSES: RecentAnalysis[] = [
  { id: '1', date: '2026-03-19', client: '東洋精密工業', mode: 'ksf', product: 'UMIDAS' },
  { id: '2', date: '2026-03-18', client: 'グリーンテック', mode: 'kff', product: 'CloudSync' },
  { id: '3', date: '2026-03-17', client: 'AI Labs', mode: 'ksf', product: 'UMIDAS' },
  { id: '4', date: '2026-03-15', client: 'ホームプラス', mode: 'kff', product: 'DataBridge' },
  { id: '5', date: '2026-03-14', client: 'カフェ・ド・フルール', mode: 'ksf', product: 'UMIDAS' },
  { id: '6', date: '2026-03-12', client: 'デジタルソリューションズ', mode: 'kff', product: 'CloudSync' },
]

export default function LostAnalysisPage() {
  const { tenant } = useAuth()
  const [mode, setMode] = useState<AnalysisMode>('ksf')
  const [form, setForm] = useState<DealForm>({
    date: new Date().toISOString().split('T')[0],
    client: '',
    product: '',
    channel: '',
    amount: '',
    description: '',
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [shared, setShared] = useState(false)

  const products = tenant?.products ?? ['UMIDAS', 'CloudSync', 'DataBridge']
  const channels = tenant?.channels ?? ['テレアポ', '飛び込み', 'Web反響', '紹介']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.client || !form.description) return

    setIsAnalyzing(true)
    setShowResult(false)
    setShared(false)

    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResult(true)
    }, 1800)
  }

  const handleShare = () => {
    setShared(true)
    setTimeout(() => setShared(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Sparkles className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lost-Analysis</h1>
            <p className="text-sm text-muted">勝敗分析 - KSF共有 / KFF上司質問化</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-6 flex items-center gap-1 rounded-xl bg-graphite-800 p-1 w-fit">
        <button
          onClick={() => { setMode('ksf'); setShowResult(false) }}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            mode === 'ksf'
              ? 'bg-gold-500 text-graphite-950'
              : 'text-graphite-300 hover:text-foreground'
          }`}
        >
          <Trophy className="w-4 h-4" />
          KSF分析（受注時）
        </button>
        <button
          onClick={() => { setMode('kff'); setShowResult(false) }}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            mode === 'kff'
              ? 'bg-gold-500 text-graphite-950'
              : 'text-graphite-300 hover:text-foreground'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          KFF分析（失注時）
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Input Form */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-500" />
              {mode === 'ksf' ? '受注案件の詳細' : '失注案件の詳細'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5 inline mr-1.5" />
                    日付
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 inline mr-1.5" />
                    顧客名
                  </label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="企業名を入力"
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    <Package className="w-3.5 h-3.5 inline mr-1.5" />
                    製品
                  </label>
                  <select
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  >
                    <option value="">選択...</option>
                    {products.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    <Radio className="w-3.5 h-3.5 inline mr-1.5" />
                    チャネル
                  </label>
                  <select
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  >
                    <option value="">選択...</option>
                    {channels.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    <DollarSign className="w-3.5 h-3.5 inline mr-1.5" />
                    金額
                  </label>
                  <input
                    type="text"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="例: 500万円"
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                  案件の詳細
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={
                    mode === 'ksf'
                      ? '受注に至った経緯、決め手となったポイント、商談の流れなどを詳しく記載してください...'
                      : '失注に至った経緯、断られた理由、商談で感じた課題などを詳しく記載してください...'
                  }
                  rows={5}
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isAnalyzing ? '分析中...' : 'AI分析を実行'}
              </button>
            </form>
          </div>

          {/* Loading */}
          {isAnalyzing && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <div className="inline-block w-10 h-10 border-3 border-graphite-600 border-t-gold-500 rounded-full animate-spin" />
              <p className="mt-4 text-graphite-300">
                AIが{mode === 'ksf' ? '成功要因' : '失敗要因'}を分析しています...
              </p>
            </div>
          )}

          {/* KSF Result */}
          {showResult && mode === 'ksf' && (
            <>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  成功要因（Key Success Factors）
                </h2>
                <div className="space-y-3">
                  {MOCK_KSF_RESULT.successFactors.map((sf, i) => (
                    <div key={i} className="rounded-xl bg-graphite-800 p-4 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{sf.factor}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            sf.impact === '決定打'
                              ? 'bg-emerald-400/10 text-emerald-400'
                              : sf.impact === '高'
                                ? 'bg-gold-500/10 text-gold-500'
                                : 'bg-graphite-600/30 text-graphite-300'
                          }`}
                        >
                          影響度: {sf.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  効果的だったキーフレーズ
                </h2>
                <div className="space-y-2">
                  {MOCK_KSF_RESULT.keyPhrases.map((phrase, i) => (
                    <div key={i} className="rounded-lg bg-gold-500/5 border border-gold-500/15 px-4 py-3">
                      <p className="text-sm text-gold-300 italic">{phrase}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold-500" />
                    ナレッジカード
                  </h2>
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      shared
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gold-500 text-graphite-950 hover:bg-gold-400'
                    }`}
                  >
                    {shared ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        共有済み
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        ライブラリに共有
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl bg-graphite-800 p-5 border border-border">
                  <h3 className="text-base font-semibold text-gold-400 mb-2">
                    {MOCK_KSF_RESULT.knowledgeCard.title}
                  </h3>
                  <p className="text-sm text-graphite-200 leading-relaxed mb-4">
                    {MOCK_KSF_RESULT.knowledgeCard.summary}
                  </p>
                  <div>
                    <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wider mb-2">
                      チームへの共有ポイント
                    </p>
                    <ul className="space-y-1.5">
                      {MOCK_KSF_RESULT.knowledgeCard.takeaways.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-graphite-200">
                          <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* KFF Result */}
          {showResult && mode === 'kff' && (
            <>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  失敗要因（Key Failure Factors）
                </h2>
                <div className="space-y-3">
                  {MOCK_KFF_RESULT.failureFactors.map((ff, i) => (
                    <div key={i} className="rounded-xl bg-graphite-800 p-4 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{ff.factor}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            ff.severity === '致命的'
                              ? 'bg-red-500/10 text-red-400'
                              : ff.severity === '重大'
                                ? 'bg-amber-400/10 text-amber-400'
                                : 'bg-graphite-600/30 text-graphite-300'
                          }`}
                        >
                          {ff.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold-500" />
                  どこで流れが変わったか
                </h2>
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-graphite-700" />
                  <div className="space-y-4">
                    {MOCK_KFF_RESULT.timeline.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 border-2 ${
                            i === MOCK_KFF_RESULT.timeline.length - 1
                              ? 'bg-red-500/20 border-red-500/50'
                              : 'bg-graphite-800 border-graphite-600'
                          }`}
                        >
                          <span className="text-xs font-bold text-graphite-300">{i + 1}</span>
                        </div>
                        <div className="rounded-lg bg-graphite-800 p-3 border border-border flex-1">
                          <p className="text-xs font-semibold text-gold-500 mb-1">{item.phase}</p>
                          <p className="text-sm text-graphite-200">{item.issue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-400" />
                  上長報告用レポート
                </h2>
                <div className="space-y-4">
                  <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                    <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wider mb-2">
                      サマリー
                    </p>
                    <p className="text-sm text-graphite-200 leading-relaxed">
                      {MOCK_KFF_RESULT.supervisorReport.summary}
                    </p>
                  </div>

                  <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                    <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wider mb-3">
                      上長への確認事項
                    </p>
                    <ul className="space-y-2">
                      {MOCK_KFF_RESULT.supervisorReport.questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-graphite-200">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-gold-500/5 p-4 border border-gold-500/15">
                    <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3">
                      推奨ネクストアクション
                    </p>
                    <ul className="space-y-2">
                      {MOCK_KFF_RESULT.supervisorReport.nextActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-graphite-200">
                          <CheckCircle2 className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-72 flex-shrink-0">
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-8">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-500" />
              最近の分析
            </h2>
            <div className="space-y-2.5">
              {MOCK_RECENT_ANALYSES.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg bg-graphite-800 p-3 border border-border hover:border-gold-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-graphite-400">{a.date}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        a.mode === 'ksf'
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {a.mode === 'ksf' ? 'KSF' : 'KFF'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{a.client}</p>
                  <p className="text-xs text-graphite-400 mt-0.5">{a.product}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted">
          ※最新データは必ず担当者に最終確認すること
        </p>
      </div>
    </div>
  )
}
