'use client'

import { useState } from 'react'
import {
  CalendarDays,
  Send,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Sparkles,
  BookOpen,
  ChevronRight,
} from 'lucide-react'

type ResultType = '成約' | '検討中' | '失注' | '初回訪問'

interface ReportForm {
  date: string
  client: string
  result: ResultType
  summary: string
}

interface CoachingMessage {
  role: 'ai' | 'user'
  content: string
}

interface Insight {
  text: string
  type: 'success' | 'improvement'
}

const MOCK_COACHING_FLOWS: Record<
  ResultType,
  { questions: string[]; insights: Insight[] }
> = {
  検討中: {
    questions: [
      'お客様が「検討します」と言った際、具体的にどのような表情でしたか？前向きな雰囲気でしたか、それとも断りの空気を感じましたか？',
      '競合他社の名前は出ましたか？出た場合、どの点を比較されていましたか？価格、品質、サポート体制など、具体的に教えてください。',
      '次回のアプローチとして、何を準備すべきだと思いますか？お客様の懸念点を解消するための資料や提案はありますか？',
    ],
    insights: [
      {
        text: '検討中の顧客には72時間以内のフォローアップが成約率を34%向上させる',
        type: 'success',
      },
      {
        text: '競合比較時は価格ではなくROIで訴求するアプローチを検討する',
        type: 'improvement',
      },
      {
        text: '「検討します」の真意を見極める質問力を磨く',
        type: 'improvement',
      },
    ],
  },
  成約: {
    questions: [
      'おめでとうございます！成約の決め手となったポイントは何だったと思いますか？お客様の言葉で印象的だったものがあれば教えてください。',
      '商談の中で、お客様が特に反応が良かった提案やトークはどの部分でしたか？',
      'この成功パターンを他の商談にも活かすとしたら、どのように展開しますか？',
    ],
    insights: [
      {
        text: '顧客の課題に寄り添った提案が成約の決定打になった',
        type: 'success',
      },
      {
        text: '成功パターンをテンプレート化し、チーム全体で共有する価値がある',
        type: 'success',
      },
      {
        text: 'クロージングまでの期間を記録し、リードタイム短縮の指標にする',
        type: 'improvement',
      },
    ],
  },
  失注: {
    questions: [
      '失注の主な理由として、お客様から直接言われたことは何でしたか？また、言葉の裏にある本当の理由は何だと思いますか？',
      '振り返って、商談のどの段階で流れが変わったと感じますか？もし戻れるとしたら、何を変えますか？',
      'この経験から得た最も大きな学びは何ですか？次の商談にどう活かしますか？',
    ],
    insights: [
      {
        text: '失注分析は最も価値のある学習機会 - 原因を3つの観点で整理する',
        type: 'improvement',
      },
      {
        text: '早期の課題ヒアリング不足が失注の根本原因になっている可能性',
        type: 'improvement',
      },
      {
        text: '失注顧客への再アプローチは3ヶ月後が最適なタイミング',
        type: 'success',
      },
    ],
  },
  初回訪問: {
    questions: [
      '初回訪問でのお客様の第一印象はいかがでしたか？関心度合いや温度感を教えてください。',
      'お客様の現在の課題やニーズとして、最も強く感じたものは何ですか？具体的なエピソードがあれば教えてください。',
      '次回の訪問に向けて、どのような提案資料を準備しますか？今回の訪問で得た情報をどう活かしますか？',
    ],
    insights: [
      {
        text: '初回訪問での傾聴姿勢が信頼構築の基盤になる',
        type: 'success',
      },
      {
        text: '訪問後24時間以内のお礼メールで印象を定着させる',
        type: 'success',
      },
      {
        text: '次回提案に向けた宿題を明確にして訪問を終えること',
        type: 'improvement',
      },
    ],
  },
}

const MOCK_USER_RESPONSES: Record<ResultType, string[]> = {
  検討中: [
    'やや前向きな感じでしたが、予算の承認が必要とのことでした。上長への説明資料が欲しいとも言われました。',
    'A社の名前が出ました。価格面で比較されているようです。ただ、サポート体制には満足いただけている印象でした。',
  ],
  成約: [
    '導入事例の具体的な数字が響いたようです。「うちでも同じ効果が期待できそう」と言っていただけました。',
    'ROIのシミュレーションを見せた時に一番反応が良かったです。具体的な数字で示すことが重要だと感じました。',
  ],
  失注: [
    '「今のタイミングではない」と言われましたが、実際は予算の問題だったと思います。もう少し早く予算感を確認すべきでした。',
    '2回目の提案の段階で、競合が大幅値引きをしてきたようです。価格だけの勝負になってしまいました。',
  ],
  初回訪問: [
    '業務効率化に強い関心を示されていました。特に月末の残業が課題とのことで、具体的な数字も教えていただけました。',
    '現在の運用フローのボトルネックが明確になりました。次回は具体的な改善提案を持っていこうと思います。',
  ],
}

export default function DailyInsightPage() {
  const [form, setForm] = useState<ReportForm>({
    date: new Date().toISOString().split('T')[0],
    client: '',
    result: '検討中',
    summary: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [messages, setMessages] = useState<CoachingMessage[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [userInput, setUserInput] = useState('')

  const currentFlow = MOCK_COACHING_FLOWS[form.result]
  const userResponses = MOCK_USER_RESPONSES[form.result]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.client || !form.summary) return

    setIsSubmitted(true)
    setMessages([])
    setCurrentQuestionIndex(0)
    setShowInsights(false)

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          {
            role: 'ai',
            content: `日報を受け取りました。${form.client}様との商談（${form.result}）について、いくつか深掘りさせてください。\n\n${currentFlow.questions[0]}`,
          },
        ])
        setCurrentQuestionIndex(1)
      }, 1200)
    }, 500)
  }

  const handleCoachingResponse = () => {
    if (!userInput.trim()) return

    const newMessages: CoachingMessage[] = [
      ...messages,
      { role: 'user', content: userInput },
    ]
    setMessages(newMessages)
    setUserInput('')

    if (currentQuestionIndex < currentFlow.questions.length) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const responsePrefix =
          currentQuestionIndex === 1
            ? 'なるほど、よく観察されていますね。続けて質問です。\n\n'
            : '素晴らしい振り返りです。最後の質問です。\n\n'
        setMessages([
          ...newMessages,
          {
            role: 'ai',
            content: `${responsePrefix}${currentFlow.questions[currentQuestionIndex]}`,
          },
        ])
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 1500)
    } else {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          ...newMessages,
          {
            role: 'ai',
            content:
              'ありがとうございます。本日の商談を踏まえた教訓をまとめました。右側の「今日の教訓」カードをご確認ください。明日の商談に活かしていきましょう！',
          },
        ])
        setShowInsights(true)
      }, 1500)
    }
  }

  const handleQuickResponse = () => {
    const responseIndex = Math.min(
      currentQuestionIndex - 1,
      userResponses.length - 1
    )
    const response = userResponses[responseIndex] || userResponses[0]
    setUserInput(response)
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <BookOpen className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Daily Insight
            </h1>
            <p className="text-sm text-muted">
              日報・深掘りコーチング
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column - Report Form & Coaching */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Daily Report Form */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gold-500" />
              日報入力
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    日付
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                    商談先
                  </label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) =>
                      setForm({ ...form, client: e.target.value })
                    }
                    placeholder="企業名を入力"
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                  結果
                </label>
                <select
                  value={form.result}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      result: e.target.value as ResultType,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                >
                  <option value="成約">成約</option>
                  <option value="検討中">検討中</option>
                  <option value="失注">失注</option>
                  <option value="初回訪問">初回訪問</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                  概要
                </label>
                <textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  placeholder="日報内容を入力してください..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                日報を送信
              </button>
            </form>
          </div>

          {/* AI Coaching Conversation */}
          {isSubmitted && (
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gold-500" />
                AIコーチング
              </h2>
              <div className="flex-1 space-y-4 mb-4 max-h-[500px] overflow-y-auto pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.role === 'ai'
                          ? 'bg-gold-500/15'
                          : 'bg-graphite-700'
                      }`}
                    >
                      {msg.role === 'ai' ? (
                        <Bot className="w-4 h-4 text-gold-500" />
                      ) : (
                        <User className="w-4 h-4 text-graphite-300" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'ai'
                          ? 'bg-graphite-800 text-foreground'
                          : 'bg-gold-500/10 text-foreground border border-gold-500/20'
                      }`}
                    >
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} className={j > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gold-500/15">
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

              {/* Response Input */}
              {isSubmitted &&
                !showInsights &&
                !isTyping &&
                messages.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={handleQuickResponse}
                        className="text-xs text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        回答例を表示
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleCoachingResponse()
                          }
                        }}
                        placeholder="回答を入力..."
                        rows={2}
                        className="flex-1 rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none"
                      />
                      <button
                        onClick={handleCoachingResponse}
                        className="self-end rounded-lg bg-gold-500 p-2.5 text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Right Column - Insights */}
        <div className="w-full xl:w-80 flex-shrink-0">
          {showInsights ? (
            <div className="rounded-2xl border border-gold-500/30 bg-card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-gold-500" />
                今日の教訓
              </h2>
              <div className="space-y-3">
                {currentFlow.insights.map((insight, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-graphite-800 p-4 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {insight.type === 'success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                            成功パターン
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400">
                            改善ポイント
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-graphite-200 leading-relaxed">
                      {insight.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted">
                  {form.date} - {form.client}様（{form.result}）
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-graphite-500" />
                今日の教訓
              </h2>
              <p className="text-sm text-muted">
                日報を送信し、AIコーチングを完了すると、今日の商談から得られた教訓がここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
