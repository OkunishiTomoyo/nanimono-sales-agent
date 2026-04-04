'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Target,
  Star,
  MessageSquare,
  ChevronDown,
  Trophy,
  ShieldCheck,
  Calendar,
  Route,
  Package,
  Flame,
  Dna,
  Mic,
  MicOff,
  Upload,
  FileAudio,
  Loader2,
  Clock,
} from 'lucide-react'
import ChatInterface, { type ChatMessage } from '@/components/chat/chat-interface'
import { useAuth } from '@/contexts/auth-context'

type TabMode = 'type-script' | 'latest-script'

const DISCLAIMER_SUFFIX = '\n\n※最新データは必ず担当者に最終確認すること'

const DNA_TYPES = [
  { id: 'logical', label: '論理型', description: 'データ・数値で説得するスタイル' },
  { id: 'empathy', label: '共感型', description: 'ストーリー・感情に寄り添うスタイル' },
  { id: 'action', label: '行動型', description: 'テンポよく結論から提示するスタイル' },
  { id: 'careful', label: '慎重型', description: '丁寧に信頼関係を築くスタイル' },
]

function generateTypeScript(channel: string, product: string, dnaType: string): string {
  const typeAdjust: Record<string, (base: string) => string> = {
    logical: (base) => `【論理型 - データ重視スタイル】\n${base}\n\n💡 論理型ポイント：\n・具体的な数値（ROI、導入期間、改善率）を冒頭に提示\n・比較表やグラフを活用した論理的構成\n・「なぜならば」の因果関係を明確に`,
    empathy: (base) => `【共感型 - ストーリー重視スタイル】\n${base}\n\n💡 共感型ポイント：\n・お客様の悩みに寄り添う言葉から入る\n・成功した企業の「物語」を交えて話す\n・「一緒に解決していきましょう」という姿勢`,
    action: (base) => `【行動型 - テンポ重視スタイル】\n${base}\n\n💡 行動型ポイント：\n・結論ファースト、要点を3つに絞る\n・「すぐに始められます」「最短○日」など即効性を強調\n・次のアクションを明確に提示`,
    careful: (base) => `【慎重型 - 信頼構築スタイル】\n${base}\n\n💡 慎重型ポイント：\n・まず傾聴し、お客様の状況を十分理解する\n・リスクの少なさ、サポート体制を強調\n・「無理にとは申しません」「ご安心ください」を適切に使用`,
  }

  const base = `【${channel}向け ${product} セールススクリプト】\n\nオープニング：\n「お忙しいところ恐れ入ります。${product}のご案内でお電話しました。」\n\n課題ヒアリング：\n「多くの企業様が○○の課題を抱えていらっしゃいます。御社でも同様のお悩みはございませんか？」\n\n提案：\n「${product}なら、導入初日から効果を実感いただけます。同業他社様では平均30%の改善を実現しています。」\n\nクロージング：\n「15分ほどのオンラインデモをご用意しております。ご都合はいかがでしょうか？」`

  const adjuster = typeAdjust[dnaType]
  return adjuster ? adjuster(base) + DISCLAIMER_SUFFIX : base + DISCLAIMER_SUFFIX
}

function generateLatestScript(channel: string, product: string): string {
  return `【${channel}向け ${product} 最新スクリプト】\n（録音データ分析に基づく最新版）\n\nオープニング：\n「お忙しいところ恐れ入ります。${product}のご案内でお電話しました。御社では業務効率化のツールをご検討中ではありませんか？」\n\n課題ヒアリング：\n「多くの企業様が、○○の課題を抱えていらっしゃいます。御社でも同様のお悩みはございませんか？」\n\n提案：\n「${product}なら、導入初日から効果を実感いただけます。同業他社様では平均30%の改善を実現しています。」\n\nクロージング：\n「15分ほどのオンラインデモをご用意しております。来週のご都合はいかがでしょうか？」${DISCLAIMER_SUFFIX}`
}

const OBJECTION_BY_CHANNEL: Record<string, { objection: string; response: string }[]> = {
  'テレアポ': [
    { objection: '電話での営業はお断りしています', response: '承知いたしました。メールで資料だけお送りさせていただいてもよろしいでしょうか？' },
    { objection: '今忙しいので手短にお願いします', response: '30秒だけお時間をいただけますか。御社と同業の企業様で○○%のコスト削減を実現した事例がございます。' },
    { objection: '既に他社と契約している', response: '比較検討の材料として資料だけでもお送りさせてください。切り替え時のコストメリットをお示しできます。' },
  ],
  '飛び込み': [
    { objection: '担当者は不在です', response: '名刺と資料を置かせていただいてもよろしいでしょうか？担当者様のお名前とお戻りの時間をお教えいただけると助かります。' },
    { objection: '飛び込みはお断りしています', response: 'この地域の企業様に実績のある○○のご案内で伺いました。パンフレットだけでもお受け取りいただけますか？' },
  ],
  'Web反響': [
    { objection: '資料を見ただけで検討段階ではない', response: '今後の検討時にお役立ていただける比較資料をお送りいたします。' },
    { objection: '価格が予算に合わない', response: 'スモールスタートプランもご用意しています。導入効果を考慮したROI試算もお出しできます。' },
  ],
  '紹介': [
    { objection: '紹介されたけど本当に必要か分からない', response: 'まずは現状をお聞かせいただき、本当に必要かどうか一緒に判断させてください。' },
  ],
}

const TRENDING_PHRASES: Record<string, { phrase: string; source: string; effectiveness: string }[]> = {
  'テレアポ': [
    { phrase: '「15秒だけお時間ください」', source: '録音分析 #482', effectiveness: 'アポ率 +12%' },
    { phrase: '「同業他社の○○様もご利用中です」', source: '録音分析 #510', effectiveness: '興味喚起率 +18%' },
    { phrase: '「資料だけでもお送りしてよろしいですか」', source: '録音分析 #498', effectiveness: '継続率 +25%' },
  ],
  '飛び込み': [
    { phrase: '「この地域で多くの企業様にご導入いただいています」', source: '訪問ログ #221', effectiveness: '面談率 +15%' },
    { phrase: '「お名刺だけでも交換させてください」', source: '訪問ログ #235', effectiveness: '接触率 +22%' },
  ],
  'Web反響': [
    { phrase: '「お問い合わせの○○について、さらに詳しくご説明できます」', source: 'メール分析 #167', effectiveness: '返信率 +30%' },
  ],
  '紹介': [
    { phrase: '「○○様と同じ成果を御社でも実現できます」', source: '商談録 #89', effectiveness: '成約率 +28%' },
  ],
}

const SUCCESS_STORIES: Record<string, { date: string; title: string; description: string }[]> = {
  'テレアポ': [
    { date: '2026-02', title: '株式会社テックフォース様', description: 'テレアポからの商談化率を15%→28%に改善。スクリプト最適化が鍵。' },
    { date: '2025-11', title: 'デジタルソリューションズ様', description: 'テレアポチームの生産性が2倍に。AIトーク分析でベストプラクティスを可視化。' },
  ],
  '飛び込み': [
    { date: '2026-01', title: '東洋精密工業様', description: '飛び込み営業のエリア最適化で訪問効率40%向上。名刺交換率も25%改善。' },
  ],
  'Web反響': [
    { date: '2026-02', title: 'ファッションモール渋谷様', description: 'Web反響の5分以内対応を実現し、商談化率が3倍に。' },
  ],
  '紹介': [
    { date: '2026-01', title: '城南メディカルクリニック様', description: '紹介制度を整備し、月間紹介数が5倍に。成約率は通常の2.3倍。' },
  ],
}

export default function SmartScriptPage() {
  const { tenant, user } = useAuth()
  const channels = tenant?.channels ?? ['テレアポ']
  const products = tenant?.products ?? ['UMIDAS']

  const [activeTab, setActiveTab] = useState<TabMode>('type-script')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedDnaType, setSelectedDnaType] = useState(user?.salesDnaType || 'logical')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showObjections, setShowObjections] = useState(false)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate script
  useEffect(() => {
    if (!selectedChannel || !selectedProduct) return

    let script: string
    if (activeTab === 'type-script') {
      script = generateTypeScript(selectedChannel, selectedProduct, selectedDnaType)
    } else {
      script = generateLatestScript(selectedChannel, selectedProduct)
    }

    setMessages([{ role: 'assistant', content: script }])
    setShowObjections(true)
  }, [selectedChannel, selectedProduct, selectedDnaType, activeTab])

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRecording])

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      setUploadedFile(`録音_${new Date().toLocaleTimeString('ja-JP')}.wav`)
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      setUploadedFile(null)
      setAnalysisComplete(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      setAnalysisComplete(false)
    }
  }

  const handleAnalyze = () => {
    if (!uploadedFile) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 2500)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const simulateResponse = useCallback(
    (question: string) => {
      setIsTyping(true)
      setTimeout(() => {
        const response = `ご質問ありがとうございます。\n\n${selectedChannel}での${selectedProduct}に関するお問い合わせですね。\n\n以下のポイントを押さえてご対応ください：\n\n1. まず相手の具体的な課題を深掘りしましょう\n2. 数値的な実績を提示してください\n3. 同業他社の成功事例を引用すると効果的です\n4. 小さなステップへの誘導を心がけましょう${DISCLAIMER_SUFFIX}`
        setMessages((prev) => [...prev, { role: 'assistant', content: response }])
        setIsTyping(false)
      }, 800 + Math.random() * 700)
    },
    [selectedChannel, selectedProduct]
  )

  const handleSend = useCallback(
    (message: string) => {
      setMessages((prev) => [...prev, { role: 'user', content: message }])
      simulateResponse(message)
    },
    [simulateResponse]
  )

  const currentObjections = useMemo(() => OBJECTION_BY_CHANNEL[selectedChannel] || [], [selectedChannel])
  const currentStories = useMemo(() => SUCCESS_STORIES[selectedChannel] || [], [selectedChannel])
  const currentPhrases = useMemo(() => TRENDING_PHRASES[selectedChannel] || [], [selectedChannel])

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-500/10">
              <Target className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Closing-AI</h1>
              <p className="text-xs text-muted">台本生成 - Sales-DNA連動 & 録音分析</p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-graphite-800 p-1 mb-4 w-fit">
            <button
              onClick={() => setActiveTab('type-script')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'type-script' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'
              }`}
            >
              <Dna className="w-4 h-4" />
              タイプ別台本
            </button>
            <button
              onClick={() => setActiveTab('latest-script')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === 'latest-script' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'
              }`}
            >
              <Flame className="w-4 h-4" />
              最新スクリプト
            </button>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Route className="w-3 h-3" /> 販路
              </label>
              <div className="relative">
                <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-graphite-800 px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <option value="">販路を選択...</option>
                  {channels.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Package className="w-3 h-3" /> 商材
              </label>
              <div className="relative">
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-graphite-800 px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                  <option value="">商材を選択...</option>
                  {products.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>

            {/* DNA Type selector (only for type-script tab) */}
            {activeTab === 'type-script' && (
              <div className="flex-1">
                <label className="block text-[10px] font-medium text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Dna className="w-3 h-3" /> 営業タイプ
                  {user?.salesDnaType && (
                    <span className="text-gold-500 normal-case tracking-normal">（Sales-DNAから自動反映）</span>
                  )}
                </label>
                <div className="relative">
                  <select value={selectedDnaType} onChange={(e) => setSelectedDnaType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-graphite-800 px-4 py-2.5 pr-10 text-sm text-foreground outline-none transition-colors focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                    {DNA_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label} - {t.description}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Recording Section (only for latest-script tab) */}
        {activeTab === 'latest-script' && (
          <div className="border-b border-border bg-graphite-900/50 px-6 py-4 shrink-0">
            <div className="flex items-center gap-4">
              {/* Record Button */}
              <button
                onClick={toggleRecording}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gold-500 text-graphite-950 hover:bg-gold-400'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? `録音中 ${formatTime(recordingTime)}` : '録音開始'}
              </button>

              {/* Upload Button */}
              <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm text-graphite-300 hover:text-foreground hover:bg-graphite-800 transition-colors"
              >
                <Upload className="w-4 h-4" />
                音声ファイルを読み込み
              </button>

              {/* File indicator */}
              {uploadedFile && (
                <div className="flex items-center gap-2 rounded-lg bg-graphite-800 px-3 py-2 border border-border">
                  <FileAudio className="w-4 h-4 text-gold-500" />
                  <span className="text-xs text-graphite-200">{uploadedFile}</span>
                </div>
              )}

              {/* Analyze Button */}
              {uploadedFile && !analysisComplete && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                  {isAnalyzing ? '分析中...' : 'フレーズ抽出'}
                </button>
              )}

              {analysisComplete && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <Star className="w-3.5 h-3.5" />
                  分析完了 - フレーズ反映済み
                </span>
              )}
            </div>
          </div>
        )}

        {/* Chat + Objections */}
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            {!selectedChannel || !selectedProduct ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Target className="w-12 h-12 text-graphite-600 mx-auto mb-3" />
                  <p className="text-sm text-muted">販路と商材を選択して、スクリプトを生成してください</p>
                </div>
              </div>
            ) : (
              <ChatInterface messages={messages} onSend={handleSend} placeholder="営業に関する質問を入力..." isTyping={isTyping} />
            )}
          </div>

          {/* Trending Phrases */}
          {activeTab === 'latest-script' && selectedChannel && currentPhrases.length > 0 && (
            <div className="border-t border-border bg-gold-500/5 px-6 py-3 shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-semibold text-foreground">今、最も刺さるフレーズ</span>
                <span className="text-[9px] text-muted">（録音データ分析より）</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {currentPhrases.map((item, i) => (
                  <div key={i} className="flex-shrink-0 rounded-lg border border-gold-500/20 bg-card px-3 py-2 max-w-[280px]">
                    <p className="text-xs font-medium text-foreground mb-1">{item.phrase}</p>
                    <div className="flex items-center gap-2 text-[9px] text-muted">
                      <span>{item.source}</span>
                      <span className="text-gold-500 font-semibold">{item.effectiveness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objections */}
          {showObjections && currentObjections.length > 0 && (
            <div className="border-t border-border bg-graphite-900/30 shrink-0">
              <button onClick={() => setShowObjections((p) => !p)} className="flex items-center gap-2 w-full px-6 py-3 text-left">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-semibold text-foreground">反論処理</span>
                <ChevronDown className={`w-4 h-4 text-muted ml-auto transition-transform ${showObjections ? 'rotate-180' : ''}`} />
              </button>
              <div className="px-6 pb-4 space-y-3 max-h-48 overflow-y-auto">
                {currentObjections.map((obj, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-gold-500 mb-1.5">反論：「{obj.objection}」</p>
                    <p className="text-sm text-graphite-200 leading-relaxed">{obj.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <aside className="w-72 border-l border-border bg-card flex flex-col shrink-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-semibold text-foreground">成功事例</h2>
          </div>
          <p className="mt-1 text-[10px] text-muted">
            {selectedChannel ? `${selectedChannel}の成功実績` : '販路を選択すると表示されます'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentStories.length > 0 ? (
            currentStories.map((story, i) => (
              <div key={i} className="rounded-xl border border-border bg-graphite-800 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                  <span className="text-xs font-semibold text-foreground">{story.title}</span>
                </div>
                <p className="text-xs text-graphite-300 leading-relaxed mb-2">{story.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted">
                  <Calendar className="w-3 h-3" /><span>{story.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-10 h-10 text-graphite-600 mb-2" />
              <p className="text-xs text-muted">販路を選択すると<br />成功事例が表示されます</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border shrink-0">
          <p className="text-[10px] text-muted leading-snug">※事例の内容はサンプルデータです。最新データは必ず担当者に最終確認すること。</p>
        </div>
      </aside>
    </div>
  )
}
