'use client'

import { useState } from 'react'
import {
  Swords,
  Play,
  Send,
  Star,
  Bot,
  User,
  ThumbsUp,
  AlertCircle,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Scale,
  Timer,
  Search,
} from 'lucide-react'

type CustomerType =
  | '価格重視型'
  | '品質重視型'
  | '比較検討型'
  | '即決型'
  | '慎重型'

type Difficulty = '初級' | '中級' | '上級'

interface ChatMessage {
  role: 'customer' | 'user'
  content: string
}

interface Feedback {
  score: number
  good: string
  improve: string
}

interface ScenarioCard {
  type: CustomerType
  icon: React.ReactNode
  description: string
  color: string
}

const SCENARIO_CARDS: ScenarioCard[] = [
  {
    type: '価格重視型',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'コストを最重視する顧客。値引き交渉や競合比較を積極的に行う。',
    color: 'text-blue-400',
  },
  {
    type: '品質重視型',
    icon: <Shield className="w-6 h-6" />,
    description: '品質・信頼性を重視。実績やエビデンスを求める傾向。',
    color: 'text-emerald-400',
  },
  {
    type: '比較検討型',
    icon: <Scale className="w-6 h-6" />,
    description: '複数社を比較検討中。論理的に判断する分析タイプ。',
    color: 'text-purple-400',
  },
  {
    type: '即決型',
    icon: <Zap className="w-6 h-6" />,
    description: '決断が早い。メリットが明確なら即決するが、興味がなければ即終了。',
    color: 'text-amber-400',
  },
  {
    type: '慎重型',
    icon: <Search className="w-6 h-6" />,
    description: 'リスクを嫌い、慎重に検討。安心材料を多く求める。',
    color: 'text-rose-400',
  },
]

const CUSTOMER_OPENING: Record<CustomerType, Record<Difficulty, string>> = {
  価格重視型: {
    初級: 'こんにちは。御社の製品に興味はあるのですが、正直なところ予算が限られていまして...他社さんだともう少し安くなるって聞いたんですが、お値引きは可能ですか？',
    中級: '率直に言いますと、A社さんから御社の半額近い見積もりをもらっています。同じ機能があるなら安い方を選びたいのですが、御社を選ぶメリットは何ですか？',
    上級: '前任者から引き継いだのですが、正直この予算では御社は厳しいと思っています。年間コストを30%削減しろと上から言われていまして。他社に切り替えも検討しています。',
  },
  品質重視型: {
    初級: '品質面が気になっています。御社の製品は他社と比べてどのような品質管理体制をとっていますか？',
    中級: '過去に安い製品を導入して痛い目にあったことがあります。御社の製品で不具合が発生した場合のサポート体制を詳しく教えてください。SLAはありますか？',
    上級: '弊社はISO認証取得企業です。御社の製品が弊社の品質基準を満たすかどうか、第三者認証や監査レポートはありますか？導入実績だけでは判断できません。',
  },
  比較検討型: {
    初級: '現在3社から提案を受けています。御社の強みを簡潔に教えていただけますか？比較表を作成したいと思っています。',
    中級: 'B社とC社の提案書はすでに受け取っています。機能比較は大体把握しているので、それ以外の差別化ポイントを教えてください。正直、機能面では大差ないように見えます。',
    上級: '技術部門の評価ではC社が最有力候補です。経営層を説得するために御社を選ぶ理由を定量的に示してください。感覚的な話ではなく、数字で見せてほしい。',
  },
  即決型: {
    初級: '時間がないので手短にお願いします。うちの課題を解決できますか？できるなら具体的にどうやって？',
    中級: '来月までに導入完了したいんです。御社で対応できますか？できないなら他を当たります。スケジュール感を教えてください。',
    上級: '今日中に決めたいのですが、正直まだ御社に決めきれていません。あと10分で判断します。最後のひと押しをお願いします。',
  },
  慎重型: {
    初級: 'うちにはまだ早いかなと思っていて...導入のリスクが心配なんです。失敗した場合はどうなりますか？',
    中級: '前回の会議で上長から「本当に大丈夫なのか」と聞かれまして...社内を説得するための材料が足りないんです。導入に失敗した事例はありますか？正直に教えてください。',
    上級: '検討を始めて半年になりますが、まだ踏み切れていません。毎回新しい懸念事項が出てくるんです。今回は情報セキュリティの観点で、御社のデータ管理体制について詳しく聞きたい。',
  },
}

const CUSTOMER_RESPONSES: Record<CustomerType, string[]> = {
  価格重視型: [
    'なるほど...でも結局のところ、年間でいくらかかるんですか？ランニングコストも含めて、トータルで考えたいんです。',
    'ROIの話はわかりますが、初期投資が大きいと稟議が通りにくいんですよ。分割払いや、まずは小規模で試すことはできますか？',
    'うーん、少し考えさせてください。他社の最終見積もりが来週届く予定なので、それと比較してから判断します。',
  ],
  品質重視型: [
    'サポート体制は理解しました。では実際に導入している企業で、御社のサポートに不満を感じたケースはありますか？',
    'なるほど。では、御社の製品が原因で重大なインシデントが発生した場合の賠償範囲はどうなっていますか？',
    '品質面では安心できそうです。あとは社内のセキュリティ審査を通す必要があるので、技術仕様書をいただけますか？',
  ],
  比較検討型: [
    'ふむ、その点は確かに御社の方が優位ですね。では、逆に御社が他社に劣る点を正直に教えていただけますか？',
    'データは参考になりました。ただ、導入後の運用コストまで含めた5年間のTCO比較が欲しいのですが、出せますか？',
    'なるほど。最終的には来月の経営会議で決定します。プレゼン資料のサポートをしていただけると助かります。',
  ],
  即決型: [
    'わかった。で、最短でいつから使えるんですか？導入にどれくらいかかる？',
    'OK、方向性は見えた。あとは契約条件次第です。柔軟に対応できますか？',
    'いいでしょう。上に報告するので、簡潔な提案サマリーを今日中にメールしてもらえますか？',
  ],
  慎重型: [
    'そうですか...でも、うちのような規模の会社でうまくいった事例はありますか？大企業の事例では参考にならないかもしれません。',
    'わかりました。ただ、導入後に「やっぱり合わなかった」となった場合の解約条件も確認しておきたいのですが...',
    'ありがとうございます。持ち帰って社内で検討します。追加の質問が出てくると思うので、その際はまた相談させてください。',
  ],
}

const FEEDBACK_TEMPLATES: Record<Difficulty, Feedback[]> = {
  初級: [
    {
      score: 4,
      good: '丁寧な言葉遣いで、顧客の懸念に寄り添った対応ができています。',
      improve: 'もう少し具体的な数字やデータを交えると説得力が増します。',
    },
    {
      score: 3,
      good: '顧客の質問に正面から答えている点が良いです。',
      improve: '一方的な説明にならないよう、質問を交えて会話を双方向にしましょう。',
    },
    {
      score: 4,
      good: '顧客のニーズを的確に把握し、それに応じた提案ができています。',
      improve: 'クロージングに向けた次のステップを明確に提示するとさらに良くなります。',
    },
  ],
  中級: [
    {
      score: 3,
      good: '競合との差別化ポイントを意識した回答ができています。',
      improve: '顧客の裏にある本当の懸念（真のニーズ）を引き出す質問が不足しています。',
    },
    {
      score: 4,
      good: '具体的な事例を用いた説明が効果的です。信頼感の構築につながっています。',
      improve: '顧客の意思決定プロセスを確認し、キーマンが誰かを把握しましょう。',
    },
    {
      score: 3,
      good: 'ロジカルな説明で顧客の分析的な思考に合わせています。',
      improve: '感情面へのアプローチも重要です。数字だけでなくビジョンも伝えましょう。',
    },
  ],
  上級: [
    {
      score: 3,
      good: 'プレッシャーのある状況でも冷静に対応できています。',
      improve: '顧客の立場を理解した上で、Win-Winの提案を構築する力を磨きましょう。',
    },
    {
      score: 2,
      good: '基本的な対応は問題ありませんが、上級レベルではより戦略的なアプローチが求められます。',
      improve: '経営層の視点で語る練習をしましょう。現場の課題ではなく、経営課題として再定義することが重要です。',
    },
    {
      score: 4,
      good: '素晴らしい対応です。顧客の本音を引き出し、戦略的な提案ができています。',
      improve: '最後のクロージングで、相手に決断を促す一言があるとさらに完璧です。',
    },
  ],
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < score
              ? 'text-gold-500 fill-gold-500'
              : 'text-graphite-600'
          }`}
        />
      ))}
    </div>
  )
}

export default function RoleplayPage() {
  const [customerType, setCustomerType] = useState<CustomerType>('価格重視型')
  const [difficulty, setDifficulty] = useState<Difficulty>('初級')
  const [isStarted, setIsStarted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [responseCount, setResponseCount] = useState(0)
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null)

  const avgScore =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length
      : 0

  const weakArea = feedbacks.length > 0
    ? feedbacks.reduce((worst, f) => (f.score < worst.score ? f : worst)).improve
    : ''

  const handleStart = () => {
    setIsStarted(true)
    setMessages([])
    setFeedbacks([])
    setResponseCount(0)
    setCurrentFeedback(null)

    const opening = CUSTOMER_OPENING[customerType][difficulty]
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages([{ role: 'customer', content: opening }])
    }, 1000)
  }

  const handleReset = () => {
    setIsStarted(false)
    setMessages([])
    setFeedbacks([])
    setResponseCount(0)
    setCurrentFeedback(null)
    setUserInput('')
  }

  const handleSend = () => {
    if (!userInput.trim() || isTyping) return

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userInput },
    ]
    setMessages(newMessages)
    setUserInput('')
    const newCount = responseCount + 1
    setResponseCount(newCount)

    // Show feedback
    const feedbackList = FEEDBACK_TEMPLATES[difficulty]
    const feedbackIndex = Math.min(newCount - 1, feedbackList.length - 1)
    const fb = feedbackList[feedbackIndex]
    setCurrentFeedback(fb)
    setFeedbacks([...feedbacks, fb])

    // Customer response
    const responses = CUSTOMER_RESPONSES[customerType]
    if (newCount <= responses.length) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages([
          ...newMessages,
          { role: 'customer', content: responses[newCount - 1] },
        ])
        setTimeout(() => setCurrentFeedback(null), 5000)
      }, 1800)
    } else {
      // Session ends
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            role: 'customer',
            content:
              'ここまでにしましょう。本日はありがとうございました。',
          },
        ])
        setCurrentFeedback(null)
      }, 1000)
    }
  }

  // Intro screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
              <Swords className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Roleplay Studio
              </h1>
              <p className="text-sm text-muted">
                AIロールプレイング特訓モード
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              顧客タイプを選択
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCENARIO_CARDS.map((card) => (
                <button
                  key={card.type}
                  onClick={() => setCustomerType(card.type)}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    customerType === card.type
                      ? 'border-gold-500 bg-gold-500/5 ring-1 ring-gold-500/30'
                      : 'border-border bg-card hover:bg-card-hover hover:border-graphite-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={card.color}>{card.icon}</div>
                    <span className="font-semibold text-foreground">
                      {card.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {card.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              難易度を選択
            </h2>
            <div className="flex gap-3">
              {(['初級', '中級', '上級'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 max-w-[160px] rounded-xl border px-4 py-3 text-center font-medium text-sm transition-all ${
                    difficulty === d
                      ? 'border-gold-500 bg-gold-500/5 text-gold-500 ring-1 ring-gold-500/30'
                      : 'border-border bg-card text-muted hover:bg-card-hover hover:border-graphite-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="flex items-center gap-2 rounded-xl bg-gold-500 px-8 py-3 text-sm font-bold text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors"
          >
            <Play className="w-5 h-5" />
            特訓開始
          </button>
        </div>
      </div>
    )
  }

  // Active session
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Swords className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Roleplay Studio
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="px-2 py-0.5 rounded-full bg-graphite-800 border border-border">
                {customerType}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-graphite-800 border border-border">
                {difficulty}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-muted hover:text-foreground transition-colors px-4 py-2 rounded-lg border border-border hover:border-graphite-600"
        >
          シナリオ選択に戻る
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Chat area */}
        <div className="flex-1 flex flex-col rounded-2xl border border-border bg-card overflow-hidden min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    msg.role === 'customer'
                      ? 'bg-graphite-700'
                      : 'bg-gold-500/15'
                  }`}
                >
                  {msg.role === 'customer' ? (
                    <Bot className="w-4 h-4 text-graphite-300" />
                  ) : (
                    <User className="w-4 h-4 text-gold-500" />
                  )}
                </div>
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <span className="text-[10px] text-graphite-500 px-1">
                    {msg.role === 'customer' ? `顧客（${customerType}）` : 'あなた'}
                  </span>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'customer'
                        ? 'bg-graphite-800 text-foreground'
                        : 'bg-gold-500/10 text-foreground border border-gold-500/20'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-graphite-700">
                  <Bot className="w-4 h-4 text-graphite-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-graphite-500 px-1">
                    顧客（{customerType}）
                  </span>
                  <div className="bg-graphite-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-graphite-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coaching Feedback */}
          {currentFeedback && (
            <div className="mx-4 mb-3 rounded-xl border border-gold-500/20 bg-gold-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gold-500">
                  コーチングフィードバック
                </span>
                <StarRating score={currentFeedback.score} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-graphite-200">
                    <span className="font-medium text-emerald-400">
                      良い点:
                    </span>{' '}
                    {currentFeedback.good}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-graphite-200">
                    <span className="font-medium text-amber-400">
                      改善点:
                    </span>{' '}
                    {currentFeedback.improve}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
                placeholder="営業トークを入力..."
                disabled={isTyping}
                className="flex-1 rounded-lg border border-border bg-graphite-800 px-4 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !userInput.trim()}
                className="rounded-lg bg-gold-500 px-4 py-2.5 text-graphite-950 hover:bg-gold-400 active:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Stats */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {/* Session Stats */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-gold-500" />
              セッション統計
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Clock className="w-4 h-4" />
                  応答回数
                </div>
                <span className="text-lg font-bold text-foreground">
                  {responseCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <TrendingUp className="w-4 h-4" />
                  平均スコア
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {avgScore > 0 ? avgScore.toFixed(1) : '-'}
                  </span>
                  {avgScore > 0 && <StarRating score={Math.round(avgScore)} />}
                </div>
              </div>
              {feedbacks.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted mb-2">
                    <Timer className="w-4 h-4" />
                    スコア推移
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {feedbacks.map((f, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gold-500/30"
                        style={{
                          height: `${(f.score / 5) * 100}%`,
                        }}
                        title={`${i + 1}回目: ${f.score}/5`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weak Area */}
          {weakArea && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                弱点エリア
              </h3>
              <p className="text-xs text-graphite-200 leading-relaxed">
                {weakArea}
              </p>
            </div>
          )}

          {/* Score History */}
          {feedbacks.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                フィードバック履歴
              </h3>
              <div className="space-y-3">
                {feedbacks.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-graphite-800 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-muted">
                        {i + 1}回目の応答
                      </span>
                      <StarRating score={f.score} />
                    </div>
                    <p className="text-graphite-200 leading-relaxed">
                      {f.good}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
