'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
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
} from 'lucide-react'
import ChatInterface, { type ChatMessage } from '@/components/chat/chat-interface'
import { useAuth } from '@/contexts/auth-context'

const DISCLAIMER_SUFFIX = '\n\n※最新データは必ず担当者に最終確認すること'

function generateScript(channel: string, product: string): string {
  const channelScripts: Record<string, (product: string) => string> = {
    'テレアポ': (p) =>
      `【テレアポ向け ${p} セールススクリプト】\n\nオープニング：\n「お忙しいところ恐れ入ります。${p}のご案内でお電話しました。御社では業務効率化のツールをご検討中ではありませんか？」\n\n課題ヒアリング：\n「多くの企業様が、○○の課題を抱えていらっしゃいます。御社でも同様のお悩みはございませんか？」\n\n提案：\n「${p}なら、導入初日から効果を実感いただけます。同業他社様では平均30%の改善を実現しています。」\n\nクロージング：\n「15分ほどのオンラインデモをご用意しております。来週のご都合はいかがでしょうか？」${DISCLAIMER_SUFFIX}`,
    '飛び込み': (p) =>
      `【飛び込み営業向け ${p} セールススクリプト】\n\nオープニング：\n「はじめまして。本日は${p}のご紹介で伺いました。この地域の企業様に業務改善のご提案をしております。」\n\n課題ヒアリング：\n「御社の現在の業務フローで、特にお時間がかかっている工程はございますか？」\n\n提案：\n「${p}は直感的なUIで、導入研修なしでもすぐにお使いいただけます。最短3日で運用開始可能です。」\n\nクロージング：\n「パンフレットをお渡しいたします。改めてデモのお時間をいただけないでしょうか？」${DISCLAIMER_SUFFIX}`,
    'Web反響': (p) =>
      `【Web反響対応向け ${p} セールススクリプト】\n\nオープニング：\n「この度は${p}にお問い合わせいただきありがとうございます。ご検討いただいている背景をお聞かせいただけますか？」\n\n課題ヒアリング：\n「Webからのお問い合わせということは、現在お使いのツールに何かご不満がございましたか？」\n\n提案：\n「${p}は、お問い合わせいただいた課題を解決できるだけでなく、ROIの面でも優位性があります。導入企業の平均で年間25%のコスト削減を実現しています。」\n\nクロージング：\n「無料トライアル環境をご用意できます。今週中にアカウントをお送りしてもよろしいでしょうか？」${DISCLAIMER_SUFFIX}`,
    '紹介': (p) =>
      `【紹介営業向け ${p} セールススクリプト】\n\nオープニング：\n「○○様からのご紹介で、${p}についてご説明の機会をいただきました。ありがとうございます。」\n\n課題ヒアリング：\n「○○様からは、御社が□□の面でお困りだと伺っております。具体的にどのような状況でしょうか？」\n\n提案：\n「ご紹介元の○○様にも導入いただいており、△△の改善に成功されています。同じ効果が御社でも期待できます。」\n\nクロージング：\n「○○様の事例も含めた詳細な提案書を来週お持ちいたします。お時間をいただけますでしょうか？」${DISCLAIMER_SUFFIX}`,
    'セミナー': (p) =>
      `【セミナー営業向け ${p} セールススクリプト】\n\nオープニング：\n「先日のセミナーにご参加いただきありがとうございました。${p}について、より詳しいご説明をさせていただければと存じます。」\n\n課題ヒアリング：\n「セミナーの中で、特にご関心の高かったポイントはどちらでしたか？」\n\n提案：\n「セミナーでご紹介した${p}の機能を、御社の環境でカスタマイズしてデモをお見せできます。」\n\nクロージング：\n「セミナー参加者限定の特別プランをご用意しております。詳しくご説明させていただけますか？」${DISCLAIMER_SUFFIX}`,
    '展示会': (p) =>
      `【展示会フォロー向け ${p} セールススクリプト】\n\nオープニング：\n「先日の展示会では${p}ブースにお立ち寄りいただきありがとうございました。」\n\n課題ヒアリング：\n「展示会では多くの製品をご覧になったかと思います。御社の優先課題はどのような点でしょうか？」\n\n提案：\n「${p}は展示会でお見せした機能に加え、御社向けのカスタマイズも可能です。」\n\nクロージング：\n「展示会特別割引を今月末まで適用できます。まずはオンラインデモをご覧になりませんか？」${DISCLAIMER_SUFFIX}`,
  }

  const generator = channelScripts[channel]
  if (generator) return generator(product)

  return `【${channel}向け ${product} セールススクリプト】\n\nオープニング：\n「${product}のご紹介で伺いました。御社の業務効率化に貢献できるソリューションです。」\n\n課題ヒアリング：\n「現在の業務で最も課題に感じていらっしゃる点は何でしょうか？」\n\n提案：\n「${product}なら、御社の課題を解決し、導入企業の平均で20%以上の改善効果を実現しています。」\n\nクロージング：\n「まずは2週間の無料トライアルからお試しください。」${DISCLAIMER_SUFFIX}`
}

const OBJECTION_BY_CHANNEL: Record<string, { objection: string; response: string }[]> = {
  'テレアポ': [
    {
      objection: '電話での営業はお断りしています',
      response:
        '承知いたしました。メールで資料だけお送りさせていただいてもよろしいでしょうか？お目通しいただいた上で、ご関心があればお声がけください。',
    },
    {
      objection: '今忙しいので手短にお願いします',
      response:
        'ありがとうございます。30秒だけお時間をいただけますか。御社と同業の企業様で○○%のコスト削減を実現した事例がございます。詳しい資料をメールでお送りしてもよろしいでしょうか？',
    },
    {
      objection: '既に他社と契約している',
      response:
        '現在のツールに100%ご満足いただけていれば問題ございません。ただ、比較検討の材料として資料だけでもお送りさせてください。切り替え時のコストメリットをお示しできます。',
    },
  ],
  '飛び込み': [
    {
      objection: '担当者は不在です',
      response:
        'かしこまりました。名刺と資料を置かせていただいてもよろしいでしょうか？担当者様のお名前とお戻りの時間をお教えいただけると助かります。',
    },
    {
      objection: '飛び込みはお断りしています',
      response:
        '大変失礼いたしました。この地域の企業様に実績のある○○のご案内で伺いました。パンフレットだけでもお受け取りいただけますか？',
    },
    {
      objection: 'アポを取ってから来てください',
      response:
        'おっしゃる通りです。失礼いたしました。いつ頃のお時間が比較的余裕がございますか？改めてご連絡させていただきます。',
    },
  ],
  'Web反響': [
    {
      objection: '資料を見ただけで、まだ検討段階ではない',
      response:
        '承知いたしました。情報収集の段階ですね。今後の検討時にお役立ていただける比較資料をお送りいたします。ご検討が進んだ際にはお気軽にお声がけください。',
    },
    {
      objection: '競合製品も検討している',
      response:
        'ぜひ比較検討いただければと存じます。客観的な比較表と、弊社ならではの差別化ポイントをまとめた資料をお送りいたします。',
    },
    {
      objection: '価格が予算に合わない',
      response:
        'ご予算の範囲を教えていただけますか？スモールスタートプランやカスタムプランもご用意しています。導入効果を考慮したROI試算もお出しできます。',
    },
  ],
  '紹介': [
    {
      objection: '紹介されたけど本当に必要か分からない',
      response:
        'ご紹介元の○○様と同じ課題をお持ちと伺いました。まずは現状をお聞かせいただき、本当に必要かどうか一緒に判断させてください。不要であれば率直にお伝えいたします。',
    },
    {
      objection: '紹介だからといって特別扱いはしない',
      response:
        'もちろんです。正当な評価をいただければ幸いです。実際の機能と効果でご判断いただくため、無料トライアルをご用意しております。',
    },
    {
      objection: '今すぐの導入は考えていない',
      response:
        'かしこまりました。導入時期は御社のタイミングで構いません。事前に情報だけお持ちいただき、ご検討時にスムーズに進められるよう準備しておきます。',
    },
  ],
}

const SUCCESS_STORIES: Record<
  string,
  { date: string; title: string; description: string }[]
> = {
  'テレアポ': [
    {
      date: '2026-02',
      title: '株式会社テックフォース様',
      description:
        'テレアポからの商談化率を15%→28%に改善。スクリプト最適化とフォロー体制の構築が鍵。',
    },
    {
      date: '2025-11',
      title: 'デジタルソリューションズ株式会社様',
      description:
        'テレアポチームの生産性が2倍に。AIによるトーク分析でベストプラクティスを可視化。',
    },
  ],
  '飛び込み': [
    {
      date: '2026-01',
      title: '東洋精密工業株式会社様',
      description:
        '飛び込み営業のエリア最適化で訪問効率40%向上。名刺交換率も25%改善。',
    },
    {
      date: '2025-10',
      title: '日本金属加工株式会社様',
      description:
        '製造業エリアへの集中訪問で月間アポ数が3倍に。業界特化トークが奏功。',
    },
  ],
  'Web反響': [
    {
      date: '2026-02',
      title: 'ファッションモール渋谷様',
      description:
        'Web反響の5分以内対応を実現し、商談化率が3倍に。リード管理システムの導入が決め手。',
    },
    {
      date: '2025-12',
      title: 'ナチュラルマート株式会社様',
      description:
        'Webリードの優先度スコアリングで営業効率が60%向上。成約率も22%改善。',
    },
  ],
  '紹介': [
    {
      date: '2026-01',
      title: '城南メディカルクリニック様',
      description:
        '既存顧客からの紹介制度を整備し、月間紹介数が5倍に。成約率は通常の2.3倍。',
    },
    {
      date: '2025-11',
      title: '焼肉ダイニング牛匠様',
      description:
        '紹介キャンペーンで新規顧客獲得コストを70%削減。LTVも通常顧客の1.5倍。',
    },
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
    { phrase: '「5分だけお時間いただけませんか」', source: '訪問ログ #248', effectiveness: '商談化率 +10%' },
  ],
  'Web反響': [
    { phrase: '「お問い合わせいただいた○○について、さらに詳しくご説明できます」', source: 'メール分析 #167', effectiveness: '返信率 +30%' },
    { phrase: '「無料で御社専用のシミュレーションをお作りします」', source: 'メール分析 #185', effectiveness: '商談化率 +20%' },
  ],
  '紹介': [
    { phrase: '「○○様と同じ成果を御社でも実現できます」', source: '商談録 #89', effectiveness: '成約率 +28%' },
    { phrase: '「ご紹介元の○○様にもご報告させていただきます」', source: '商談録 #95', effectiveness: '信頼度 +35%' },
  ],
}

export default function SmartScriptPage() {
  const { tenant } = useAuth()
  const channels = tenant?.channels ?? ['テレアポ']
  const products = tenant?.products ?? ['UMIDAS']

  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showObjections, setShowObjections] = useState(false)

  // Auto-generate sales script when both selectors change
  useEffect(() => {
    if (!selectedChannel || !selectedProduct) return

    const script = generateScript(selectedChannel, selectedProduct)

    setMessages([
      {
        role: 'assistant',
        content: script,
      },
    ])
    setShowObjections(true)
  }, [selectedChannel, selectedProduct])

  const simulateResponse = useCallback(
    (question: string) => {
      setIsTyping(true)
      const delay = 800 + Math.random() * 700
      setTimeout(() => {
        const response = `ご質問ありがとうございます。\n\n${selectedChannel}での${selectedProduct}に関するお問い合わせですね。\n\n${question}については、以下のポイントを押さえてご対応ください：\n\n1. まず相手の具体的な課題を深掘りしましょう\n2. 数値的な実績（ROI、導入期間、改善率）を提示してください\n3. 同業他社の成功事例を引用すると効果的です\n4. 最終的には小さなステップ（無料トライアル、デモ）への誘導を心がけましょう\n\n具体的な切り返しトークについては、「反論処理」セクションもご参照ください。${DISCLAIMER_SUFFIX}`
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response },
        ])
        setIsTyping(false)
      }, delay)
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

  const currentObjections = useMemo(
    () => OBJECTION_BY_CHANNEL[selectedChannel] || [],
    [selectedChannel]
  )
  const currentStories = useMemo(
    () => SUCCESS_STORIES[selectedChannel] || [],
    [selectedChannel]
  )
  const currentPhrases = useMemo(
    () => TRENDING_PHRASES[selectedChannel] || [],
    [selectedChannel]
  )

  return (
    <div className="flex h-dvh bg-white">
      {/* Main area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-[#e0e0e0] bg-white px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#c8a96e]/10">
              <Target className="w-5 h-5 text-[#c8a96e]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#1a1a1a]">
                Smart Script
              </h1>
              <p className="text-xs text-[#7a7a7a]">
                録音分析に基づき「今、最も刺さる」最新スクリプトを自動生成
              </p>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[#7a7a7a] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Route className="w-3 h-3" />
                販路
              </label>
              <div className="relative">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e0e0e0] bg-[#f2f2f2] px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
                >
                  <option value="">販路を選択...</option>
                  {channels.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a] pointer-events-none" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[#7a7a7a] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Package className="w-3 h-3" />
                商材
              </label>
              <div className="relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e0e0e0] bg-[#f2f2f2] px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
                >
                  <option value="">商材を選択...</option>
                  {products.map((prod) => (
                    <option key={prod} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a] pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Chat + Objections */}
        <div className="flex flex-1 min-h-0 flex-col">
          {/* Chat area */}
          <div className="flex-1 min-h-0">
            {!selectedChannel || !selectedProduct ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Target className="w-12 h-12 text-[#e0e0e0] mx-auto mb-3" />
                  <p className="text-sm text-[#7a7a7a]">
                    販路と商材を選択して、セールススクリプトを生成してください
                  </p>
                </div>
              </div>
            ) : (
              <ChatInterface
                messages={messages}
                onSend={handleSend}
                placeholder="営業に関する質問を入力..."
                isTyping={isTyping}
              />
            )}
          </div>

          {/* Trending Phrases section */}
          {selectedChannel && currentPhrases.length > 0 && (
            <div className="border-t border-[#e0e0e0] bg-[#fffdf5] px-6 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#c8a96e]" />
                <span className="text-xs font-semibold text-[#1a1a1a]">
                  今、最も刺さるフレーズ
                </span>
                <span className="text-[9px] text-[#9a9a9a]">
                  （録音データ分析より）
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {currentPhrases.map((item, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 rounded-lg border border-[#c8a96e]/20 bg-white px-3 py-2 max-w-[280px]"
                  >
                    <p className="text-xs font-medium text-[#1a1a1a] mb-1">
                      {item.phrase}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-[#9a9a9a]">
                      <span>{item.source}</span>
                      <span className="text-[#c8a96e] font-semibold">{item.effectiveness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objections section */}
          {showObjections && currentObjections.length > 0 && (
            <div className="border-t border-[#e0e0e0] bg-[#fafafa]">
              <button
                onClick={() => setShowObjections((prev) => !prev)}
                className="flex items-center gap-2 w-full px-6 py-3 text-left"
              >
                <ShieldCheck className="w-4 h-4 text-[#c8a96e]" />
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  反論処理
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7a7a7a] ml-auto transition-transform ${
                    showObjections ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div className="px-6 pb-4 space-y-3">
                {currentObjections.map((obj, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#e0e0e0] bg-white p-4"
                  >
                    <p className="text-xs font-semibold text-[#c8a96e] mb-1.5">
                      反論：「{obj.objection}」
                    </p>
                    <p className="text-sm text-[#2d2d2d] leading-relaxed">
                      {obj.response}
                    </p>
                    <p className="text-[9px] text-[#9a9a9a] mt-2">
                      ※最新データは必ず担当者に最終確認すること
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar - Success stories */}
      <aside className="w-72 border-l border-[#e0e0e0] bg-[#fafafa] flex flex-col">
        <div className="px-5 py-4 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#c8a96e]" />
            <h2 className="text-sm font-semibold text-[#1a1a1a]">成功事例</h2>
          </div>
          <p className="mt-1 text-[10px] text-[#9a9a9a]">
            {selectedChannel
              ? `${selectedChannel}の成功実績`
              : '販路を選択すると表示されます'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentStories.length > 0 ? (
            currentStories.map((story, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#e0e0e0] bg-white p-4"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 text-[#c8a96e] fill-[#c8a96e]" />
                  <span className="text-xs font-semibold text-[#1a1a1a]">
                    {story.title}
                  </span>
                </div>
                <p className="text-xs text-[#4a4a4a] leading-relaxed mb-2">
                  {story.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-[#9a9a9a]">
                  <Calendar className="w-3 h-3" />
                  <span>{story.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-10 h-10 text-[#e0e0e0] mb-2" />
              <p className="text-xs text-[#9a9a9a]">
                販路を選択すると
                <br />
                成功事例が表示されます
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#e0e0e0]">
          <p className="text-[10px] text-[#9a9a9a] leading-snug">
            ※事例の内容はサンプルデータです。最新データは必ず担当者に最終確認すること。
          </p>
        </div>
      </aside>
    </div>
  )
}
