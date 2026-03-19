'use client'

import { useState, useCallback } from 'react'
import { MessageSquare, HelpCircle } from 'lucide-react'
import ChatInterface, { type ChatMessage } from '@/components/chat/chat-interface'

const PRESET_QUESTIONS = [
  'UMIDASの料金プランは？',
  '解約条件を教えて',
  'キャンペーン内容は？',
  '導入までの流れは？',
  'サポート体制について',
  '他社との違いは？',
]

const MOCK_RESPONSES: Record<string, string> = {
  'UMIDASの料金プランは？':
    'UMIDASの料金プランは以下の3つをご用意しております。\n\n■ スタータープラン：月額29,800円（税別）\n  - 基本機能すべて利用可能\n  - ユーザー数：5名まで\n\n■ ビジネスプラン：月額49,800円（税別）\n  - 全機能利用可能\n  - ユーザー数：20名まで\n  - 優先サポート付き\n\n■ エンタープライズプラン：個別見積もり\n  - カスタマイズ対応\n  - ユーザー数：無制限\n  - 専任担当者付き',
  '解約条件を教えて':
    '解約条件は以下の通りです。\n\n■ 最低利用期間：12ヶ月\n■ 解約通知：解約希望月の1ヶ月前までにご連絡ください\n■ 途中解約：最低利用期間内の解約は、残月数分の50%が違約金として発生します\n■ データ保持：解約後30日間はデータをダウンロード可能です\n\n※ 年間契約の場合、契約更新月の2ヶ月前までにお申し出がない場合は自動更新となります。',
  'キャンペーン内容は？':
    '現在実施中のキャンペーンをご案内いたします。\n\n■ 春の導入キャンペーン（〜2026年4月末）\n  - 初期費用50%OFF（通常100,000円→50,000円）\n  - 最初の3ヶ月間、月額料金20%OFF\n\n■ 紹介キャンペーン（常時）\n  - 既存ユーザーからのご紹介で、双方に1ヶ月分無料\n\n■ 年間契約割引\n  - 年間一括払いで月額料金10%OFF',
  '導入までの流れは？':
    '導入までの流れは以下のステップとなります。\n\n① お問い合わせ・ヒアリング（1〜2営業日）\n  - 御社の課題やご要望をお伺いします\n\n② ご提案・デモ（3〜5営業日）\n  - 最適なプランとカスタマイズ提案\n  - 実際の操作画面をデモでご確認\n\n③ ご契約・初期設定（1〜3営業日）\n  - 契約手続き\n  - アカウント発行・初期データ投入\n\n④ トレーニング・運用開始\n  - オンラインまたは訪問研修\n  - 運用サポート開始\n\n最短2週間で運用開始可能です。',
  'サポート体制について':
    'サポート体制は以下の通りです。\n\n■ オンラインサポート\n  - チャットサポート：平日9:00〜18:00\n  - メールサポート：24時間受付（営業日内回答）\n  - FAQ・ヘルプセンター：24時間利用可能\n\n■ 電話サポート（ビジネスプラン以上）\n  - 平日9:00〜18:00\n  - 緊急時ホットライン：24時間対応\n\n■ 専任サポート（エンタープライズプラン）\n  - 専任カスタマーサクセス担当者\n  - 月次レビューミーティング\n  - オンサイトサポート可能',
  '他社との違いは？':
    'UMIDASが選ばれる3つの理由をご説明します。\n\n■ 1. 業界特化のAI分析機能\n  - 業種別に最適化されたAIモデル\n  - 導入初日から精度の高い分析が可能\n\n■ 2. 圧倒的な使いやすさ\n  - 直感的なUI設計で研修コスト最小化\n  - モバイル完全対応\n  - 顧客満足度 95.2%\n\n■ 3. 手厚いサポート体制\n  - 導入から運用まで一貫サポート\n  - 平均応答時間：チャット30秒、メール2時間\n  - 解約率 2.1%（業界平均8%）',
}

const DEFAULT_RESPONSE =
  'お問い合わせありがとうございます。ご質問の内容について確認いたします。\n\n該当する情報が見つかりませんでしたが、担当者がより詳しくご案内いたします。お気軽にお問い合わせください。\n\nお急ぎの場合は、以下までご連絡ください：\n- 電話：03-XXXX-XXXX（平日9:00〜18:00）\n- メール：support@example.com'

const DISCLAIMER =
  '※サービスやキャンペーンの内容は随時変更される可能性があります。最新データは必ず弊社担当者に最終確認してください。'

export default function QuickFaqPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const simulateResponse = useCallback((question: string) => {
    setIsTyping(true)
    const delay = 800 + Math.random() * 700
    setTimeout(() => {
      const response = MOCK_RESPONSES[question] || DEFAULT_RESPONSE
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ])
      setIsTyping(false)
    }, delay)
  }, [])

  const handleSend = useCallback(
    (message: string) => {
      setMessages((prev) => [...prev, { role: 'user', content: message }])
      simulateResponse(message)
    },
    [simulateResponse]
  )

  const handlePresetClick = useCallback(
    (question: string) => {
      handleSend(question)
    },
    [handleSend]
  )

  return (
    <div className="flex h-dvh bg-white">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-[#e0e0e0] bg-white px-6 py-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#c8a96e]/10">
            <MessageSquare className="w-5 h-5 text-[#c8a96e]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#1a1a1a]">Quick-FAQ</h1>
            <p className="text-xs text-[#7a7a7a]">
              基本知識チャットbot - 製品・サービスについて何でもお聞きください
            </p>
          </div>
        </header>

        {/* Chat interface */}
        <div className="flex-1 min-h-0">
          <ChatInterface
            messages={messages}
            onSend={handleSend}
            placeholder="質問を入力してください..."
            disclaimer={DISCLAIMER}
            isTyping={isTyping}
          />
        </div>
      </div>

      {/* Right sidebar - preset questions */}
      <aside className="w-72 border-l border-[#e0e0e0] bg-[#fafafa] flex flex-col">
        <div className="px-5 py-4 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#c8a96e]" />
            <h2 className="text-sm font-semibold text-[#1a1a1a]">
              よくある質問
            </h2>
          </div>
          <p className="mt-1 text-[10px] text-[#9a9a9a]">
            クリックして質問を送信
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {PRESET_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handlePresetClick(q)}
              disabled={isTyping}
              className="w-full text-left rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#2d2d2d] transition-all hover:border-[#c8a96e] hover:bg-[#c8a96e]/5 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[#e0e0e0]">
          <p className="text-[10px] text-[#9a9a9a] leading-snug">
            AIによる自動応答です。回答内容は参考情報としてご利用ください。
          </p>
        </div>
      </aside>
    </div>
  )
}
