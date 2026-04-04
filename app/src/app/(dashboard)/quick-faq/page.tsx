'use client'

import { useState, useCallback, useMemo } from 'react'
import { MessageSquare, HelpCircle, Package, Route } from 'lucide-react'
import ChatInterface, { type ChatMessage } from '@/components/chat/chat-interface'
import { useAuth } from '@/contexts/auth-context'

type FilterMode = 'product' | 'channel'

const PRESET_QUESTIONS_BY_PRODUCT: Record<string, string[]> = {
  UMIDAS: [
    'UMIDASの料金プランは？',
    'UMIDASの解約条件を教えて',
    'UMIDASのキャンペーン内容は？',
    'UMIDASの導入までの流れは？',
    'UMIDASのサポート体制について',
    'UMIDASと他社との違いは？',
  ],
  CloudSync: [
    'CloudSyncの料金プランは？',
    'CloudSyncのデータ同期の仕組みは？',
    'CloudSyncのセキュリティ対策は？',
    'CloudSyncの対応クラウドサービスは？',
    'CloudSyncの導入事例を教えて',
    'CloudSyncの無料トライアルはある？',
  ],
  DataBridge: [
    'DataBridgeの料金プランは？',
    'DataBridgeの連携可能なデータソースは？',
    'DataBridgeのETL処理速度は？',
    'DataBridgeのサポート体制について',
    'DataBridgeの導入までの期間は？',
    'DataBridgeのセキュリティ認証は？',
  ],
  SmartCRM: [
    'SmartCRMの料金プランは？',
    'SmartCRMの顧客管理機能について',
    'SmartCRMのレポート機能は？',
    'SmartCRMと他CRMとの違いは？',
    'SmartCRMの導入サポートについて',
    'SmartCRMのAPI連携は可能？',
  ],
  _default: [
    '料金プランを教えて',
    '解約条件を教えて',
    'キャンペーン内容は？',
    '導入までの流れは？',
    'サポート体制について',
    '他社との違いは？',
  ],
}

const PRESET_QUESTIONS_BY_CHANNEL: Record<string, string[]> = {
  'テレアポ': [
    'テレアポのトークスクリプトは？',
    '初回架電のコツを教えて',
    '受付ブロック突破の方法は？',
    'アポ取得率を上げるには？',
    'テレアポに最適な時間帯は？',
    'フォローコールのタイミングは？',
  ],
  '飛び込み': [
    '飛び込み営業の基本マナーは？',
    '初回訪問時の自己紹介トークは？',
    '不在時の名刺の置き方は？',
    '飛び込み訪問の効率的なルートは？',
    '担当者面会のコツは？',
    '再訪問のタイミングは？',
  ],
  'Web反響': [
    'Web反響リードの対応スピード基準は？',
    '問い合わせ対応のテンプレートは？',
    'Web反響からの商談化率の目安は？',
    'メール返信のベストプラクティスは？',
    'Web反響の優先度判定基準は？',
    'フォローメールのタイミングは？',
  ],
  '紹介': [
    '紹介依頼の切り出し方は？',
    '紹介元へのお礼のマナーは？',
    '紹介営業の成約率は？',
    '紹介元との関係維持のコツは？',
    '紹介いただいた方への初回アプローチは？',
    '紹介キャンペーンの内容は？',
  ],
  _default: [
    '営業の基本マナーは？',
    '初回アプローチのコツは？',
    'フォローアップのタイミングは？',
    '成約率を上げるポイントは？',
    'クロージングのコツは？',
    '顧客管理のベストプラクティスは？',
  ],
}

const MOCK_RESPONSES_BY_PRODUCT: Record<string, Record<string, string>> = {
  UMIDAS: {
    'UMIDASの料金プランは？':
      'UMIDASの料金プランは以下の3つをご用意しております。\n\n■ スタータープラン：月額29,800円（税別）\n  - 基本機能すべて利用可能\n  - ユーザー数：5名まで\n\n■ ビジネスプラン：月額49,800円（税別）\n  - 全機能利用可能\n  - ユーザー数：20名まで\n  - 優先サポート付き\n\n■ エンタープライズプラン：個別見積もり\n  - カスタマイズ対応\n  - ユーザー数：無制限\n  - 専任担当者付き\n\n※最新データは必ず担当者に最終確認すること',
    'UMIDASの解約条件を教えて':
      '解約条件は以下の通りです。\n\n■ 最低利用期間：12ヶ月\n■ 解約通知：解約希望月の1ヶ月前までにご連絡ください\n■ 途中解約：最低利用期間内の解約は、残月数分の50%が違約金として発生します\n■ データ保持：解約後30日間はデータをダウンロード可能です\n\n※最新データは必ず担当者に最終確認すること',
    'UMIDASのキャンペーン内容は？':
      '現在実施中のキャンペーンをご案内いたします。\n\n■ 春の導入キャンペーン（〜2026年4月末）\n  - 初期費用50%OFF（通常100,000円→50,000円）\n  - 最初の3ヶ月間、月額料金20%OFF\n\n■ 紹介キャンペーン（常時）\n  - 既存ユーザーからのご紹介で、双方に1ヶ月分無料\n\n※最新データは必ず担当者に最終確認すること',
    'UMIDASの導入までの流れは？':
      '導入までの流れは以下のステップとなります。\n\n① お問い合わせ・ヒアリング（1〜2営業日）\n② ご提案・デモ（3〜5営業日）\n③ ご契約・初期設定（1〜3営業日）\n④ トレーニング・運用開始\n\n最短2週間で運用開始可能です。\n\n※最新データは必ず担当者に最終確認すること',
    'UMIDASのサポート体制について':
      'サポート体制は以下の通りです。\n\n■ オンラインサポート\n  - チャットサポート：平日9:00〜18:00\n  - メールサポート：24時間受付（営業日内回答）\n\n■ 電話サポート（ビジネスプラン以上）\n  - 平日9:00〜18:00\n\n■ 専任サポート（エンタープライズプラン）\n  - 専任カスタマーサクセス担当者\n\n※最新データは必ず担当者に最終確認すること',
    'UMIDASと他社との違いは？':
      'UMIDASが選ばれる3つの理由をご説明します。\n\n■ 1. 業界特化のAI分析機能\n■ 2. 圧倒的な使いやすさ（顧客満足度 95.2%）\n■ 3. 手厚いサポート体制（解約率 2.1%）\n\n※最新データは必ず担当者に最終確認すること',
  },
  CloudSync: {
    'CloudSyncの料金プランは？':
      'CloudSyncの料金プランは以下の通りです。\n\n■ ベーシック：月額19,800円（税別）\n  - 同期データ量：100GBまで\n  - 同期頻度：1時間ごと\n\n■ プロフェッショナル：月額39,800円（税別）\n  - 同期データ量：1TBまで\n  - リアルタイム同期\n  - 優先サポート\n\n■ エンタープライズ：個別見積もり\n  - 無制限データ同期\n  - カスタムSLA対応\n\n※最新データは必ず担当者に最終確認すること',
    'CloudSyncのデータ同期の仕組みは？':
      'CloudSyncのデータ同期は差分同期方式を採用しています。\n\n■ 初回：フルスキャンで完全同期\n■ 以降：変更部分のみを検知して高速同期\n■ 暗号化：転送時・保存時ともにAES-256で暗号化\n■ 競合解決：タイムスタンプベースの自動解決機能\n\n※最新データは必ず担当者に最終確認すること',
  },
  DataBridge: {
    'DataBridgeの料金プランは？':
      'DataBridgeの料金プランは以下の通りです。\n\n■ スタンダード：月額24,800円（税別）\n  - 接続データソース：5つまで\n  - 日次バッチ処理\n\n■ アドバンス：月額54,800円（税別）\n  - 接続データソース：無制限\n  - リアルタイムストリーミング対応\n\n※最新データは必ず担当者に最終確認すること',
    'DataBridgeの連携可能なデータソースは？':
      '主要なデータソースに幅広く対応しています。\n\n■ データベース：MySQL, PostgreSQL, Oracle, SQL Server\n■ クラウド：AWS S3, Google BigQuery, Azure Blob\n■ SaaS：Salesforce, HubSpot, kintone\n■ ファイル：CSV, JSON, Excel, XML\n\n※最新データは必ず担当者に最終確認すること',
  },
  SmartCRM: {
    'SmartCRMの料金プランは？':
      'SmartCRMの料金プランは以下の通りです。\n\n■ ライト：月額9,800円（税別）/ユーザー\n  - 顧客管理基本機能\n  - 商談管理\n\n■ スタンダード：月額14,800円（税別）/ユーザー\n  - 全機能利用可能\n  - レポート・ダッシュボード\n  - API連携\n\n※最新データは必ず担当者に最終確認すること',
    'SmartCRMの顧客管理機能について':
      'SmartCRMの顧客管理機能は以下の通りです。\n\n■ 顧客情報の一元管理\n■ 商談ステージ管理\n■ 活動履歴の自動記録\n■ AI による次アクション提案\n■ メール・電話の自動連携\n\n※最新データは必ず担当者に最終確認すること',
  },
}

const MOCK_RESPONSES_BY_CHANNEL: Record<string, Record<string, string>> = {
  'テレアポ': {
    'テレアポのトークスクリプトは？':
      '基本トークスクリプトは以下の構成です。\n\n■ 挨拶・自己紹介（10秒）\n  「お忙しいところ恐れ入ります。○○の△△と申します。」\n\n■ 用件（15秒）\n  「御社の□□について、コスト削減のご提案でお電話しました。」\n\n■ 関心付け（20秒）\n  「同業他社様では平均30%のコスト削減を実現しています。」\n\n■ アポ打診\n  「15分ほどお時間をいただけないでしょうか？」\n\n※最新データは必ず担当者に最終確認すること',
    '初回架電のコツを教えて':
      '初回架電で意識すべきポイントです。\n\n■ 時間帯：10:00〜11:30、14:00〜16:00が接続率が高い\n■ 声のトーン：明るく、ゆっくり、はっきりと\n■ 用件は30秒以内に伝える\n■ 断られても「ありがとうございます」で終える\n■ 不在の場合は在席時間を確認する\n\n※最新データは必ず担当者に最終確認すること',
  },
  '飛び込み': {
    '飛び込み営業の基本マナーは？':
      '飛び込み営業の基本マナーです。\n\n■ 身だしなみ：清潔感のあるビジネスカジュアル\n■ 訪問時間：10:00〜11:30、14:00〜16:30\n■ 名刺は必ず両手で渡す\n■ 長居しない（初回は5分以内）\n■ 近隣への配慮（大きな声を出さない）\n\n※最新データは必ず担当者に最終確認すること',
    '初回訪問時の自己紹介トークは？':
      '初回訪問の自己紹介トーク例です。\n\n「はじめまして。○○株式会社の△△と申します。この地域の企業様に□□のご提案で伺っております。ご担当者様はいらっしゃいますでしょうか？」\n\n■ ポイント：地域性・業界性を活かした切り口\n■ 不在時：名刺＋パンフレットを封筒に入れて預ける\n\n※最新データは必ず担当者に最終確認すること',
  },
  'Web反響': {
    'Web反響リードの対応スピード基準は？':
      'Web反響リードの対応スピード基準です。\n\n■ 最速対応が鍵：問い合わせから5分以内の初回コンタクトで商談化率が8倍\n■ 目標レスポンス：1時間以内（最低でも当日中）\n■ 時間外の問い合わせ：翌営業日の9:00に即対応\n■ 自動返信メール：受付完了の即時送信を設定\n\n※最新データは必ず担当者に最終確認すること',
    '問い合わせ対応のテンプレートは？':
      '問い合わせ対応メールのテンプレートです。\n\n■ 件名：「お問い合わせありがとうございます【○○株式会社】」\n\n■ 本文構成：\n  1. お礼\n  2. 問い合わせ内容の確認\n  3. 回答 or 次ステップの提示\n  4. 面談のご提案\n\n■ ポイント：相手の課題に寄り添った文面にする\n\n※最新データは必ず担当者に最終確認すること',
  },
  '紹介': {
    '紹介依頼の切り出し方は？':
      '紹介依頼の効果的な切り出し方です。\n\n■ タイミング：成約直後、または顧客満足度が高い時\n■ 切り出し例：\n  「○○様のお知り合いで、同じような課題をお持ちの方はいらっしゃいませんか？」\n\n■ ポイント：\n  - 具体的な紹介対象をイメージさせる\n  - 紹介のメリットを伝える（紹介キャンペーン等）\n  - 無理強いはしない\n\n※最新データは必ず担当者に最終確認すること',
    '紹介元へのお礼のマナーは？':
      '紹介元へのお礼のマナーです。\n\n■ 即日お礼：紹介をいただいたらその日のうちに電話 or メール\n■ 進捗報告：紹介先との面談後に結果を報告\n■ 成約時：改めてお礼（手書きの手紙 + 紹介特典）\n■ 注意：紹介先の情報を紹介元に過度に共有しない\n\n※最新データは必ず担当者に最終確認すること',
  },
}

const DEFAULT_RESPONSE =
  'お問い合わせありがとうございます。ご質問の内容について確認いたします。\n\n該当する情報が見つかりませんでしたが、担当者がより詳しくご案内いたします。お気軽にお問い合わせください。\n\nお急ぎの場合は、以下までご連絡ください：\n- 電話：03-XXXX-XXXX（平日9:00〜18:00）\n- メール：support@example.com\n\n※最新データは必ず担当者に最終確認すること'

const DISCLAIMER =
  '※サービスやキャンペーンの内容は随時変更される可能性があります。最新データは必ず担当者に最終確認すること。'

export default function QuickFaqPage() {
  const { tenant } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [filterMode, setFilterMode] = useState<FilterMode>('product')
  const [selectedValue, setSelectedValue] = useState('')

  const products = tenant?.products ?? ['UMIDAS']
  const channels = tenant?.channels ?? ['テレアポ']

  const currentOptions = filterMode === 'product' ? products : channels

  const presetQuestions = useMemo(() => {
    if (!selectedValue) return []
    if (filterMode === 'product') {
      return PRESET_QUESTIONS_BY_PRODUCT[selectedValue] ?? PRESET_QUESTIONS_BY_PRODUCT._default
    }
    return PRESET_QUESTIONS_BY_CHANNEL[selectedValue] ?? PRESET_QUESTIONS_BY_CHANNEL._default
  }, [filterMode, selectedValue])

  const getResponse = useCallback(
    (question: string): string => {
      if (!selectedValue) return DEFAULT_RESPONSE
      if (filterMode === 'product') {
        return MOCK_RESPONSES_BY_PRODUCT[selectedValue]?.[question] ?? DEFAULT_RESPONSE
      }
      return MOCK_RESPONSES_BY_CHANNEL[selectedValue]?.[question] ?? DEFAULT_RESPONSE
    },
    [filterMode, selectedValue]
  )

  const simulateResponse = useCallback(
    (question: string) => {
      setIsTyping(true)
      const delay = 800 + Math.random() * 700
      setTimeout(() => {
        const response = getResponse(question)
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response },
        ])
        setIsTyping(false)
      }, delay)
    },
    [getResponse]
  )

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

  const handleFilterModeChange = (mode: FilterMode) => {
    setFilterMode(mode)
    setSelectedValue('')
    setMessages([])
  }

  const handleSelectionChange = (value: string) => {
    setSelectedValue(value)
    setMessages([])
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-[#e0e0e0] bg-white px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#c8a96e]/10">
              <MessageSquare className="w-5 h-5 text-[#c8a96e]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-[#1a1a1a]">Quick-FAQ</h1>
                {selectedValue && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20">
                    {filterMode === 'product' ? <Package className="w-3 h-3" /> : <Route className="w-3 h-3" />}
                    {selectedValue}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7a7a7a]">
                基本知識チャットbot - 製品・サービスについて何でもお聞きください
              </p>
            </div>
          </div>

          {/* Selector bar */}
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-[#e0e0e0] overflow-hidden">
              <button
                onClick={() => handleFilterModeChange('product')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterMode === 'product'
                    ? 'bg-[#c8a96e] text-white'
                    : 'bg-white text-[#7a7a7a] hover:bg-[#f5f5f5]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                商材
              </button>
              <button
                onClick={() => handleFilterModeChange('channel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterMode === 'channel'
                    ? 'bg-[#c8a96e] text-white'
                    : 'bg-white text-[#7a7a7a] hover:bg-[#f5f5f5]'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                販路
              </button>
            </div>
            <div className="flex gap-2 flex-1 overflow-x-auto">
              {currentOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectionChange(opt)}
                  className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all ${
                    selectedValue === opt
                      ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#c8a96e]'
                      : 'border-[#e0e0e0] bg-[#f2f2f2] text-[#4a4a4a] hover:border-[#c8a96e]/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Chat interface */}
        <div className="flex-1 min-h-0">
          {!selectedValue ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-[#e0e0e0] mx-auto mb-3" />
                <p className="text-sm text-[#7a7a7a]">
                  {filterMode === 'product' ? '商材' : '販路'}を選択して、FAQを表示してください
                </p>
              </div>
            </div>
          ) : (
            <ChatInterface
              messages={messages}
              onSend={handleSend}
              placeholder="質問を入力してください..."
              disclaimer={DISCLAIMER}
              isTyping={isTyping}
            />
          )}
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
            {selectedValue
              ? `${selectedValue}に関する質問`
              : 'クリックして質問を送信'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {presetQuestions.length > 0 ? (
            presetQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handlePresetClick(q)}
                disabled={isTyping}
                className="w-full text-left rounded-xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#2d2d2d] transition-all hover:border-[#c8a96e] hover:bg-[#c8a96e]/5 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <HelpCircle className="w-10 h-10 text-[#e0e0e0] mb-2" />
              <p className="text-xs text-[#9a9a9a]">
                {filterMode === 'product' ? '商材' : '販路'}を選択すると
                <br />
                質問が表示されます
              </p>
            </div>
          )}
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
