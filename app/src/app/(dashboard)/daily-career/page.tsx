'use client'

import { useState } from 'react'
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
} from 'lucide-react'

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
    detail: '午前中にA社（製造業・従業員300名）への初回提案プレゼンを実施。事前に競合3社（B社、C社、D社）の製品を調査し、機能比較表とROI試算シートを独自に作成。プレゼンでは単なる機能説明ではなく、A社固有の課題（生産ラインの稼働率低下）に対するソリューション提案として構成。先方の工場長から「ここまで具体的な試算は初めて」とコメントをいただき、次回は経営層も含めた会議を設定。午後はB社との定例ミーティングで、導入後3ヶ月のKPI報告を実施。月次コスト12%削減の実績を報告し、追加機能の導入提案につなげた。',
    skills: [
      { name: '課題解決力', level: 85, description: '顧客固有の課題を特定し、カスタマイズされたソリューションを提案' },
      { name: '分析力', level: 78, description: '競合3社の比較分析およびROI試算の実施' },
      { name: 'コミュニケーション力', level: 82, description: '技術者（工場長）にも分かりやすいプレゼンテーション' },
      { name: '提案力', level: 90, description: '包括的な提案書と具体的数値で説得力のある提案を構築' },
      { name: '数値管理力', level: 75, description: 'KPIの定量的な報告と実績データの活用' },
    ],
    portfolio: '【課題解決型営業の実践】\n製造業クライアント（従業員300名規模）に対し、生産効率の課題に着目した提案営業を実施。事前調査として競合3社の製品分析を行い、独自のROI試算モデルを構築。単なるプロダクト紹介ではなく、クライアント固有の経営課題に対するソリューション提案として構成することで、意思決定者層への提案機会を獲得。また、既存クライアントに対しては導入効果の定量的なKPIレポートを作成し、月次コスト12%削減の実績をもとに追加提案へと発展させた。',
  },
  {
    id: '2',
    date: '2026-03-18',
    summary: 'チーム勉強会を企画・運営。失注事例3件の分析結果を共有し、改善施策をチームで議論。',
    detail: '週次のチーム勉強会を企画。過去1ヶ月の失注事例3件を分析し、共通パターンとして「初回ヒアリング時の予算確認漏れ」を特定。チーム8名で改善策をブレインストーミングし、ヒアリングシートの改訂案を作成。また、成功事例2件の分析も行い、成功パターンのフレームワーク化を提案。午後は個人面談2件を実施し、後輩メンバーの商談同行スケジュールを調整。',
    skills: [
      { name: 'リーダーシップ', level: 88, description: 'チーム勉強会の企画・運営とファシリテーション' },
      { name: '分析力', level: 80, description: '失注事例の共通パターン分析と構造化' },
      { name: 'コミュニケーション力', level: 85, description: '8名のブレインストーミングのファシリテーション' },
      { name: '課題解決力', level: 72, description: '失注の根本原因特定と改善施策の立案' },
    ],
    portfolio: '【組織力強化の取り組み】\nチームメンバー8名を対象とした勉強会を自発的に企画・運営。過去の商談データから失注事例を分析し、共通する課題パターンを特定。ブレインストーミング手法を活用してチーム全体で改善施策を議論し、具体的なアクションプラン（ヒアリングシート改訂）を策定。分析思考とリーダーシップを組み合わせ、個人の学びを組織の仕組みへと昇華させる取り組みを推進。',
  },
  {
    id: '3',
    date: '2026-03-17',
    summary: '大型案件C社の最終クロージング。価格交渉を経て年間契約を締結。売上目標達成率120%。',
    detail: 'C社（IT企業・従業員500名）との最終クロージング商談に臨む。先方からの値引き要請（15%）に対し、段階的な導入プランを代替案として提示。初年度はコアモジュールのみの導入とし、2年目以降のオプション追加で長期的なパートナーシップを構築する提案に切り替え。結果として初年度は8%の値引きで合意し、2年契約を締結。年間売上600万円の受注となり、個人目標達成率120%を記録。',
    skills: [
      { name: '提案力', level: 92, description: '値引き要請に対する代替案の即座の提示' },
      { name: '数値管理力', level: 88, description: '売上目標と値引き幅の戦略的な管理' },
      { name: 'コミュニケーション力', level: 80, description: '価格交渉における論理的かつ柔軟な対応' },
      { name: '課題解決力', level: 78, description: '段階的導入による双方にとってのWin-Win構築' },
    ],
    portfolio: '【戦略的クロージングの実践】\nIT企業（従業員500名）との大型商談において、先方の値引き要請に対して価格競争に陥らない交渉戦略を展開。段階的導入プランの代替提案により、クライアントの初期投資リスクを軽減しつつ、長期的なパートナーシップを実現。結果として年間600万円の受注を獲得し、個人売上目標の120%を達成。価格以外の価値で顧客を納得させる営業スキルと、数値に基づいた戦略的な判断力を発揮。',
  },
  {
    id: '4',
    date: '2026-03-14',
    summary: 'マーケティング部門とのクロスファンクショナル会議。リード獲得施策の改善提案を実施。',
    detail: 'マーケティング部門との月次連携会議に参加。営業現場からのフィードバックとして、リードの質に関するデータを定量的に報告。過去3ヶ月のリード転換率を分析し、セミナー経由のリードが最も成約率が高いことを数値で示した。改善提案として、セミナーコンテンツの拡充と、Web反響リードの初期スクリーニング基準の見直しを提案。',
    skills: [
      { name: '分析力', level: 82, description: 'リード転換率のデータ分析と可視化' },
      { name: 'コミュニケーション力', level: 76, description: '他部門との建設的な連携と提案' },
      { name: '数値管理力', level: 85, description: '3ヶ月分のリードデータの定量分析' },
    ],
    portfolio: '【クロスファンクショナルな組織貢献】\nマーケティング部門との連携会議において、営業現場のデータに基づいた改善提案を実施。3ヶ月分のリードデータを定量的に分析し、チャネル別の成約率を可視化。分析結果に基づく具体的な改善施策を提案し、部門横断的な業務改善に貢献。数値分析力とコミュニケーション力を活用し、組織全体の営業効率向上に寄与。',
  },
  {
    id: '5',
    date: '2026-03-12',
    summary: '新人研修のメンター対応。商談同行とフィードバックセッションを実施。',
    detail: '新人メンバー2名の商談同行。D社への訪問では新人に主導権を持たせつつ、要所でフォローを入れる形で対応。商談後に1時間のフィードバックセッションを実施し、良かった点3つと改善点2つを具体的にフィードバック。',
    skills: [
      { name: 'リーダーシップ', level: 80, description: '新人の主体性を引き出すメンタリング' },
      { name: 'コミュニケーション力', level: 88, description: '具体的かつ建設的なフィードバック' },
    ],
    portfolio: '【人材育成への貢献】\n新人メンバーの商談同行およびメンタリングを担当。現場での実践機会を提供しつつ、商談後の振り返りセッションで具体的なフィードバックを実施。相手の主体性を尊重しながら成長を促すコーチングスキルと、チームの底上げに対する当事者意識を発揮。',
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

export default function DailyCareerPage() {
  const [selectedReportId, setSelectedReportId] = useState<string>('1')

  const selectedReport = MOCK_DAILY_REPORTS.find((r) => r.id === selectedReportId) ?? MOCK_DAILY_REPORTS[0]

  const marketValueScore = 78
  const totalPortfolioItems = MOCK_DAILY_REPORTS.length

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Briefcase className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily-Career</h1>
            <p className="text-sm text-muted">ガクチカ資産化 - 日々の業務をキャリア資産に変換</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Report List */}
        <div className="w-full xl:w-72 flex-shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 sticky top-8">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold-500" />
              日報一覧
            </h2>
            <div className="space-y-2">
              {MOCK_DAILY_REPORTS.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReportId(report.id)}
                  className={`w-full text-left rounded-lg p-3 border transition-colors ${
                    selectedReportId === report.id
                      ? 'border-gold-500/50 bg-gold-500/5'
                      : 'border-border bg-graphite-800 hover:border-graphite-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-graphite-400">{report.date}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-colors ${
                        selectedReportId === report.id ? 'text-gold-500' : 'text-graphite-600'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-graphite-200 leading-relaxed line-clamp-2">
                    {report.summary}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {report.skills.slice(0, 3).map((s) => {
                      const cat = SKILL_CATEGORIES.find((c) => c.name === s.name)
                      return (
                        <span
                          key={s.name}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            cat ? `${cat.bgColor}/10 ${cat.color}` : 'bg-graphite-700 text-graphite-300'
                          }`}
                        >
                          {s.name.replace('力', '')}
                        </span>
                      )
                    })}
                    {report.skills.length > 3 && (
                      <span className="text-[10px] text-graphite-500">
                        +{report.skills.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Detail */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Original Activity */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold-500" />
              業務内容
            </h2>
            <p className="text-xs text-graphite-400 mb-2">{selectedReport.date}</p>
            <p className="text-sm text-graphite-200 leading-relaxed">
              {selectedReport.detail}
            </p>
          </div>

          {/* Skill Conversion */}
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
                      <div
                        className={`h-full rounded-full ${cat?.bgColor ?? 'bg-gold-500'} transition-all duration-700 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-xs text-graphite-400">{skill.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Portfolio Output */}
          <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-500" />
              就活用ポートフォリオ
            </h2>
            <div className="rounded-xl bg-graphite-800 p-5 border border-border">
              {selectedReport.portfolio.split('\n').map((line, i) => {
                if (line.startsWith('【') && line.endsWith('】')) {
                  return (
                    <h3 key={i} className="text-base font-semibold text-gold-400 mb-3">
                      {line}
                    </h3>
                  )
                }
                return (
                  <p key={i} className={`text-sm text-graphite-200 leading-relaxed ${i > 0 ? 'mt-2' : ''}`}>
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-72 flex-shrink-0 space-y-6">
          {/* Accumulated Skills */}
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-8">
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
                      <div
                        className={`h-full rounded-full ${cat?.bgColor ?? 'bg-gold-500'}`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Market Value */}
          <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-500" />
              市場価値スコア
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-graphite-700"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-gold-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${marketValueScore * 2.64} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{marketValueScore}</span>
                  <span className="text-[10px] text-graphite-400">/ 100</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-graphite-400">営業スキル偏差値</span>
                <span className="font-semibold text-gold-500">62.5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-graphite-400">同職種内ランク</span>
                <span className="font-semibold text-foreground">上位 22%</span>
              </div>
            </div>
          </div>

          {/* Portfolio Count */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500/10">
                <Award className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalPortfolioItems}</p>
                <p className="text-xs text-graphite-400">ポートフォリオ項目</p>
              </div>
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
