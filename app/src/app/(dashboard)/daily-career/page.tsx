'use client'

import { useState, useMemo } from 'react'
import {
  Briefcase,
  CalendarDays,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Target,
  Users,
  BarChart3,
  FileText,
  Zap,
  BookOpen,
  Send,
  Route,
  MessageCircle,
  Bot,
  User,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface DynamicField {
  key: string
  label: string
  type: 'number' | 'text'
  placeholder: string
}

const CHANNEL_FIELDS: Record<string, DynamicField[]> = {
  'テレアポ': [
    { key: 'calls', label: 'コール数', type: 'number', placeholder: '0' },
    { key: 'talkTime', label: '通話時間（分）', type: 'number', placeholder: '0' },
    { key: 'appointments', label: 'アポ取得数', type: 'number', placeholder: '0' },
    { key: 'orders', label: '受注数', type: 'number', placeholder: '0' },
  ],
  '飛び込み': [
    { key: 'visits', label: '訪問件数', type: 'number', placeholder: '0' },
    { key: 'cards', label: '名刺交換数', type: 'number', placeholder: '0' },
    { key: 'appointments', label: 'アポ取得数', type: 'number', placeholder: '0' },
    { key: 'orders', label: '受注数', type: 'number', placeholder: '0' },
  ],
  'Web反響': [
    { key: 'leads', label: 'リード対応数', type: 'number', placeholder: '0' },
    { key: 'deals', label: '商談化数', type: 'number', placeholder: '0' },
    { key: 'orders', label: '受注数', type: 'number', placeholder: '0' },
  ],
  '紹介': [
    { key: 'referrer', label: '紹介元', type: 'text', placeholder: '紹介者名を入力' },
    { key: 'meetings', label: '面談数', type: 'number', placeholder: '0' },
    { key: 'orders', label: '受注数', type: 'number', placeholder: '0' },
  ],
  _default: [
    { key: 'activities', label: '活動件数', type: 'number', placeholder: '0' },
    { key: 'deals', label: '商談数', type: 'number', placeholder: '0' },
    { key: 'orders', label: '受注数', type: 'number', placeholder: '0' },
  ],
}

interface ReportForm {
  date: string
  summary: string
  channel: string
  channelFields: Record<string, string>
}

interface CoachingMessage {
  role: 'ai' | 'user'
  content: string
}

interface DailyReport {
  id: string
  date: string
  summary: string
  detail: string
  skills: SkillConversion[]
  portfolio: string
}

interface SkillConversion {
  name: string
  level: number
  description: string
}

const SKILL_CATEGORIES = [
  { name: '課題解決力', icon: Target, color: 'text-emerald-400', bgColor: 'bg-emerald-400' },
  { name: '分析力', icon: BarChart3, color: 'text-blue-400', bgColor: 'bg-blue-400' },
  { name: 'コミュニケーション力', icon: Users, color: 'text-gold-500', bgColor: 'bg-gold-500' },
  { name: 'リーダーシップ', icon: Star, color: 'text-amber-400', bgColor: 'bg-amber-400' },
  { name: '数値管理力', icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-400' },
  { name: '提案力', icon: Zap, color: 'text-rose-400', bgColor: 'bg-rose-400' },
]

const MOCK_DAILY_REPORTS: DailyReport[] = [
  {
    id: '1',
    date: '2026-03-19',
    summary: '新規顧客A社への初回提案プレゼンを実施。競合3社との比較資料を独自作成し、ROI試算を含む包括的な提案書を準備。',
    detail: '午前中にA社（製造業・従業員300名）への初回提案プレゼンを実施。事前に競合3社の製品を調査し、機能比較表とROI試算シートを独自に作成。プレゼンでは単なる機能説明ではなく、A社固有の課題（生産ラインの稼働率低下）に対するソリューション提案として構成。先方の工場長から「ここまで具体的な試算は初めて」とコメントをいただいた。',
    skills: [
      { name: '課題解決力', level: 85, description: '顧客固有の課題を特定し、カスタマイズされたソリューションを提案' },
      { name: '分析力', level: 78, description: '競合3社の比較分析およびROI試算の実施' },
      { name: 'コミュニケーション力', level: 82, description: '技術者にも分かりやすいプレゼンテーション' },
      { name: '提案力', level: 90, description: '包括的な提案書と具体的数値で説得力のある提案' },
    ],
    portfolio: '【課題解決型営業の実践】\n製造業クライアント（従業員300名規模）に対し、生産効率の課題に着目した提案営業を実施。競合3社の製品分析を行い、独自のROI試算モデルを構築。クライアント固有の経営課題に対するソリューション提案として構成することで、意思決定者層への提案機会を獲得。',
  },
  {
    id: '2',
    date: '2026-03-18',
    summary: 'チーム勉強会を企画・運営。失注事例3件の分析結果を共有し、改善施策をチームで議論。',
    detail: '週次のチーム勉強会を企画。過去1ヶ月の失注事例3件を分析し、共通パターンとして「初回ヒアリング時の予算確認漏れ」を特定。チーム8名で改善策をブレストし、ヒアリングシートの改訂案を作成。',
    skills: [
      { name: 'リーダーシップ', level: 88, description: 'チーム勉強会の企画・運営とファシリテーション' },
      { name: '分析力', level: 80, description: '失注事例の共通パターン分析と構造化' },
      { name: 'コミュニケーション力', level: 85, description: '8名のブレストのファシリテーション' },
    ],
    portfolio: '【組織力強化の取り組み】\nチームメンバー8名を対象とした勉強会を自発的に企画・運営。過去の商談データから失注事例を分析し、共通する課題パターンを特定。具体的なアクションプラン（ヒアリングシート改訂）を策定。',
  },
  {
    id: '3',
    date: '2026-03-17',
    summary: '大型案件C社の最終クロージング。価格交渉を経て年間契約を締結。売上目標達成率120%。',
    detail: 'C社との最終クロージング商談。先方からの値引き要請（15%）に対し、段階的な導入プランを代替案として提示。初年度はコアモジュールのみ、2年目以降オプション追加で長期パートナーシップを構築する提案に切り替え。結果として8%値引きで合意し、年間600万円の受注。',
    skills: [
      { name: '提案力', level: 92, description: '値引き要請に対する代替案の即座の提示' },
      { name: '数値管理力', level: 88, description: '売上目標と値引き幅の戦略的な管理' },
      { name: 'コミュニケーション力', level: 80, description: '価格交渉における論理的かつ柔軟な対応' },
    ],
    portfolio: '【戦略的クロージングの実践】\nIT企業との大型商談で、値引き要請に対し段階的導入プランの代替提案により年間600万円の受注を獲得。個人売上目標の120%を達成。',
  },
]

const ACCUMULATED_SKILLS = [
  { name: '課題解決力', score: 82, trend: '+5' },
  { name: '分析力', score: 78, trend: '+3' },
  { name: 'コミュニケーション力', score: 85, trend: '+2' },
  { name: 'リーダーシップ', score: 76, trend: '+8' },
  { name: '数値管理力', score: 80, trend: '+4' },
  { name: '提案力', score: 86, trend: '+6' },
]

const COACHING_QUESTIONS = [
  '今日の活動の中で、一番手応えを感じた瞬間はどこでしたか？',
  'もう一度やり直せるとしたら、どの部分を改善しますか？',
  'この経験から明日の営業にどう活かしますか？',
]

export default function DailyCareerPage() {
  const { tenant } = useAuth()
  const channels = tenant?.channels ?? ['テレアポ']

  // Daily report form state
  const [form, setForm] = useState<ReportForm>({
    date: new Date().toISOString().split('T')[0],
    summary: '',
    channel: channels[0],
    channelFields: {},
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [coachingMessages, setCoachingMessages] = useState<CoachingMessage[]>([])
  const [coachingIndex, setCoachingIndex] = useState(0)
  const [isCoachingTyping, setIsCoachingTyping] = useState(false)
  const [coachingInput, setCoachingInput] = useState('')
  const [coachingDone, setCoachingDone] = useState(false)

  // Portfolio state
  const [selectedReportId, setSelectedReportId] = useState<string>('1')
  const selectedReport = MOCK_DAILY_REPORTS.find((r) => r.id === selectedReportId) ?? MOCK_DAILY_REPORTS[0]
  const marketValueScore = 78

  const dynamicFields = useMemo(() => {
    return CHANNEL_FIELDS[form.channel] ?? CHANNEL_FIELDS._default
  }, [form.channel])

  const handleChannelChange = (channel: string) => {
    setForm({ ...form, channel, channelFields: {} })
  }

  const handleFieldChange = (key: string, value: string) => {
    setForm({ ...form, channelFields: { ...form.channelFields, [key]: value } })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.summary) return
    setIsSubmitted(true)
    setCoachingMessages([])
    setCoachingIndex(0)
    setCoachingDone(false)

    setTimeout(() => {
      setIsCoachingTyping(true)
      setTimeout(() => {
        setIsCoachingTyping(false)
        setCoachingMessages([{
          role: 'ai',
          content: `日報を受け取りました。今日の活動を振り返りましょう。\n\n${COACHING_QUESTIONS[0]}\n\n※最新データは必ず担当者に最終確認すること`,
        }])
        setCoachingIndex(1)
      }, 1200)
    }, 500)
  }

  const handleCoachingResponse = () => {
    if (!coachingInput.trim()) return
    const newMessages: CoachingMessage[] = [...coachingMessages, { role: 'user', content: coachingInput }]
    setCoachingMessages(newMessages)
    setCoachingInput('')

    if (coachingIndex < COACHING_QUESTIONS.length) {
      setIsCoachingTyping(true)
      setTimeout(() => {
        setIsCoachingTyping(false)
        setCoachingMessages([...newMessages, {
          role: 'ai',
          content: `なるほど、よく分析されていますね。\n\n${COACHING_QUESTIONS[coachingIndex]}\n\n※最新データは必ず担当者に最終確認すること`,
        }])
        setCoachingIndex(coachingIndex + 1)
      }, 1500)
    } else {
      setIsCoachingTyping(true)
      setTimeout(() => {
        setIsCoachingTyping(false)
        setCoachingMessages([...newMessages, {
          role: 'ai',
          content: 'ありがとうございます。本日の振り返りを踏まえた教訓をスキル変換しました。下の「成果ポートフォリオ」セクションをご確認ください！\n\n※最新データは必ず担当者に最終確認すること',
        }])
        setCoachingDone(true)
      }, 1500)
    }
  }

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Briefcase className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily-Career</h1>
            <p className="text-sm text-muted">日報入力 + AIコーチング + ガクチカ資産化</p>
          </div>
        </div>
      </div>

      {/* ===== 日報入力フォーム ===== */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-gold-500" />
          日報入力
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Selector */}
          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-1.5 flex items-center gap-1.5">
              <Route className="w-4 h-4 text-gold-500" />
              販路
            </label>
            <div className="flex flex-wrap gap-2">
              {channels.map((ch) => (
                <button key={ch} type="button" onClick={() => handleChannelChange(ch)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium border transition-all ${
                    form.channel === ch ? 'border-gold-500 bg-gold-500/10 text-gold-500' : 'border-border bg-graphite-800 text-graphite-300 hover:border-gold-500/50'
                  }`}>
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Channel Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dynamicFields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-graphite-400 mb-1">{field.label}</label>
                <input type={field.type} value={form.channelFields[field.key] ?? ''} onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">日付</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-300 mb-1.5">本日の活動概要</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="今日の営業活動の内容を記載してください..." rows={4}
              className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none" />
          </div>

          <button type="submit" disabled={isSubmitted}
            className="flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
            {isSubmitted ? '送信済み' : '日報を送信'}
          </button>
        </form>
      </div>

      {/* ===== AIコーチング ===== */}
      {isSubmitted && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gold-500" />
            AIコーチング
          </h2>
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
            {coachingMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'ai' ? 'bg-gold-500/15' : 'bg-graphite-700'}`}>
                  {msg.role === 'ai' ? <Bot className="w-4 h-4 text-gold-500" /> : <User className="w-4 h-4 text-graphite-300" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-graphite-800 text-foreground' : 'bg-gold-500/10 text-foreground border border-gold-500/20'}`}>
                  {msg.content.split('\n').map((line, j) => <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>)}
                </div>
              </div>
            ))}
            {isCoachingTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gold-500/15">
                  <Bot className="w-4 h-4 text-gold-500" />
                </div>
                <div className="bg-graphite-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSubmitted && !coachingDone && !isCoachingTyping && coachingMessages.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="flex gap-2">
                <textarea value={coachingInput} onChange={(e) => setCoachingInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCoachingResponse() } }}
                  placeholder="回答を入力..." rows={2}
                  className="flex-1 rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none" />
                <button onClick={handleCoachingResponse}
                  className="self-end rounded-lg bg-gold-500 p-2.5 text-graphite-950 hover:bg-gold-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 成果ポートフォリオ（3カラム） ===== */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: Report List */}
        <div className="w-full xl:w-64 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold-500" />
              過去の日報
            </h2>
            <div className="space-y-2">
              {MOCK_DAILY_REPORTS.map((report) => (
                <button key={report.id} onClick={() => setSelectedReportId(report.id)}
                  className={`w-full text-left rounded-lg p-3 border transition-colors ${
                    selectedReportId === report.id ? 'border-gold-500/50 bg-gold-500/5' : 'border-border bg-graphite-800 hover:border-graphite-600'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-graphite-400">{report.date}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${selectedReportId === report.id ? 'text-gold-500' : 'text-graphite-600'}`} />
                  </div>
                  <p className="text-xs text-graphite-200 leading-relaxed line-clamp-2">{report.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Skill Conversion + Portfolio */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold-500" />
              ビジネススキル変換
            </h2>
            <div className="space-y-4">
              {selectedReport.skills.map((skill) => {
                const cat = SKILL_CATEGORIES.find((c) => c.name === skill.name)
                const Icon = cat?.icon ?? Target
                return (
                  <div key={skill.name} className="rounded-xl bg-graphite-800 p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${cat?.color ?? 'text-gold-500'}`} />
                      <span className="text-sm font-semibold text-foreground">{skill.name}</span>
                      <span className="ml-auto text-sm font-bold text-gold-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-graphite-700 overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${cat?.bgColor ?? 'bg-gold-500'} transition-all duration-700`} style={{ width: `${skill.level}%` }} />
                    </div>
                    <p className="text-xs text-graphite-400">{skill.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-500" />
              就活用ポートフォリオ
            </h2>
            <div className="rounded-xl bg-graphite-800 p-5 border border-border">
              {selectedReport.portfolio.split('\n').map((line, i) => {
                if (line.startsWith('【') && line.endsWith('】')) {
                  return <h3 key={i} className="text-base font-semibold text-gold-400 mb-3">{line}</h3>
                }
                return <p key={i} className={`text-sm text-graphite-200 leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>{line}</p>
              })}
            </div>
          </div>
        </div>

        {/* Right: Skills Summary */}
        <div className="w-full xl:w-64 shrink-0 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold-500" />
              累積スキルスコア
            </h2>
            <div className="space-y-3">
              {ACCUMULATED_SKILLS.map((skill) => {
                const cat = SKILL_CATEGORIES.find((c) => c.name === skill.name)
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-graphite-300">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{skill.score}</span>
                        <span className="text-[10px] font-medium text-emerald-400">{skill.trend}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-graphite-700 overflow-hidden">
                      <div className={`h-full rounded-full ${cat?.bgColor ?? 'bg-gold-500'}`} style={{ width: `${skill.score}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-500" />
              市場価値スコア
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-graphite-700" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gold-500" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${marketValueScore * 2.64} 264`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{marketValueScore}</span>
                  <span className="text-[10px] text-graphite-400">/ 100</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-graphite-400">偏差値</span>
                <span className="font-semibold text-gold-500">62.5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-graphite-400">ランク</span>
                <span className="font-semibold text-foreground">上位 22%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500/10">
                <Award className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{MOCK_DAILY_REPORTS.length}</p>
                <p className="text-xs text-graphite-400">ポートフォリオ項目</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted">※最新データは必ず担当者に最終確認すること</p>
      </div>
    </div>
  )
}
