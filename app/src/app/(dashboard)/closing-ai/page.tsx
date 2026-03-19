'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Target,
  Star,
  MessageSquare,
  ChevronDown,
  Trophy,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import ChatInterface, { type ChatMessage } from '@/components/chat/chat-interface'

const INDUSTRIES = [
  { value: 'it', label: 'IT企業' },
  { value: 'manufacturing', label: '製造業' },
  { value: 'retail', label: '小売業' },
  { value: 'medical', label: '医療機関' },
  { value: 'food', label: '飲食業' },
]

const PRODUCTS = [
  { value: 'umidas', label: 'UMIDAS' },
  { value: 'product-a', label: 'Other Product A' },
  { value: 'product-b', label: 'Other Product B' },
]

const MOCK_SCRIPTS: Record<string, Record<string, string>> = {
  it: {
    umidas:
      '【IT企業向け UMIDASセールススクリプト】\n\nオープニング：\n「現在、御社ではデータ分析や業務効率化にどのようなツールをお使いでしょうか？多くのIT企業様が、散在するデータの統合管理に課題を感じていらっしゃいます。」\n\n課題ヒアリング：\n「特にエンジニアリソースの最適配分や、プロジェクト収益の可視化でお困りではありませんか？」\n\n提案：\n「UMIDASなら、APIベースの柔軟な連携で既存システムとシームレスに統合。リアルタイムダッシュボードでプロジェクト全体の健全性を一目で把握できます。」\n\nクロージング：\n「まずは2週間の無料トライアルで、御社の環境での効果を実感していただけませんか？導入支援も無料でご提供いたします。」',
    'product-a':
      '【IT企業向け Product Aセールススクリプト】\n\nオープニング：\n「御社の開発プロセスで、コードレビューやCI/CDパイプラインの効率化にご関心はございますか？」\n\n提案：\n「Product Aは、AIを活用したコード品質分析と自動テスト生成機能を搭載。開発速度を30%向上させた実績がございます。」\n\nクロージング：\n「デモ環境をご用意しております。来週、30分ほどお時間をいただけますでしょうか？」',
    'product-b':
      '【IT企業向け Product Bセールススクリプト】\n\nオープニング：\n「クラウドインフラのコスト最適化について、現状どのような取り組みをされていますか？」\n\n提案：\n「Product Bは、マルチクラウド環境のコストを自動分析し、最適なリソース配分を提案。平均25%のコスト削減を実現しています。」\n\nクロージング：\n「現在のクラウド費用をお教えいただければ、無料で削減シミュレーションをお出しいたします。」',
  },
  manufacturing: {
    umidas:
      '【製造業向け UMIDASセールススクリプト】\n\nオープニング：\n「製造現場のデジタル化、いわゆるスマートファクトリー化について、御社ではどの段階まで進んでいらっしゃいますか？」\n\n課題ヒアリング：\n「生産ラインの稼働率管理や品質管理のデータ化にお困りの企業様が多くいらっしゃいます。」\n\n提案：\n「UMIDASは、IoTセンサーデータと連携し、生産効率をリアルタイムで可視化。不良品発生の予兆検知で歩留まり率を平均15%改善しています。」\n\nクロージング：\n「御社の工場を一度見学させていただき、具体的な改善提案をお出しすることは可能でしょうか？」',
    'product-a':
      '【製造業向け Product Aセールススクリプト】\n\nオープニング：\n「生産管理システムの老朽化でお困りではありませんか？」\n\n提案：\n「Product Aは、既存のERPと連携しながら、AIによる需要予測と生産計画の自動最適化を実現。在庫回転率の20%改善実績がございます。」\n\nクロージング：\n「まずは一つのラインでパイロット導入してみませんか？初期費用なしでお試しいただけます。」',
    'product-b':
      '【製造業向け Product Bセールススクリプト】\n\nオープニング：\n「品質管理の工数削減に課題をお感じではありませんか？」\n\n提案：\n「Product Bの画像認識AIは、検品工程を自動化し、人的コストを60%削減。24時間安定した品質チェックを実現します。」\n\nクロージング：\n「サンプル製品をお送りいただければ、無料でAI検品のデモを作成いたします。」',
  },
  retail: {
    umidas:
      '【小売業向け UMIDASセールススクリプト】\n\nオープニング：\n「お客様の購買データの活用について、現状どのような取り組みをされていますか？」\n\n課題ヒアリング：\n「POSデータはあるが、そこからの顧客インサイト抽出がうまくいかない、というお声をよく伺います。」\n\n提案：\n「UMIDASは、POSデータ・EC・SNSのデータを統合分析し、顧客セグメント別の最適なプロモーション施策を自動提案。導入企業の平均で客単価12%向上を実現しています。」\n\nクロージング：\n「御社の直近3ヶ月のPOSデータで分析デモを無料でお作りいたします。いかがでしょうか？」',
    'product-a': '【小売業向け Product Aセールススクリプト】\n\nオープニング：\n「在庫管理の精度向上にご関心はございますか？」\n\n提案：\n「Product AのAI需要予測機能で、適正在庫を自動計算。機会損失と廃棄ロスを同時に削減できます。」\n\nクロージング：\n「1店舗からのスモールスタートが可能です。まずはお試しいただけませんか？」',
    'product-b': '【小売業向け Product Bセールススクリプト】\n\nオープニング：\n「店舗スタッフの接客品質にバラつきを感じていませんか？」\n\n提案：\n「Product Bは、AIを活用した接客トレーニングシステム。ロールプレイング形式で、いつでもどこでもスキルアップが可能です。」\n\nクロージング：\n「10名分の無料アカウントをお出しいたします。2週間お試しいただけませんか？」',
  },
  medical: {
    umidas:
      '【医療機関向け UMIDASセールススクリプト】\n\nオープニング：\n「患者様の診療データや経営データの活用について、どのようなお取り組みをされていますか？」\n\n課題ヒアリング：\n「電子カルテはあるが、経営判断に活用できるデータ分析基盤がない、というお声が多くございます。」\n\n提案：\n「UMIDASは、HIPAA準拠のセキュリティ基盤の上で、患者動向分析・経営指標の可視化を実現。病床稼働率の最適化で収益改善に貢献いたします。」\n\nクロージング：\n「まずは管理部門の方を含めた説明会を開催させていただけないでしょうか？」',
    'product-a': '【医療機関向け Product Aセールススクリプト】\n\nオープニング：\n「予約管理や患者様のフォローアップに課題はございませんか？」\n\n提案：\n「Product Aは、AI予約最適化とリマインド自動送信で、ノーショー率を40%削減。スタッフの業務負荷も大幅に軽減します。」\n\nクロージング：\n「導入事例の詳しいご説明をさせていただきたいのですが、いかがでしょうか？」',
    'product-b': '【医療機関向け Product Bセールススクリプト】\n\nオープニング：\n「医療スタッフの勤務シフト管理でお困りではありませんか？」\n\n提案：\n「Product Bは、AIによる最適シフト自動生成。労働基準法準拠チェック機能付きで、管理者の工数を80%削減します。」\n\nクロージング：\n「1ヶ月間の無料トライアルをご利用いただけます。まずはお試しください。」',
  },
  food: {
    umidas:
      '【飲食業向け UMIDASセールススクリプト】\n\nオープニング：\n「食材の仕入れ管理や原価率の管理について、現状どのようにされていますか？」\n\n課題ヒアリング：\n「食材ロスの削減と、メニュー別の原価管理が同時にできないか、というご相談をよくいただきます。」\n\n提案：\n「UMIDASは、POSデータと仕入れデータを連動させ、メニュー別原価率をリアルタイムで可視化。AI需要予測で食材発注量を最適化し、食品ロスを平均30%削減しています。」\n\nクロージング：\n「1店舗からのパイロット導入が可能です。まずは1ヶ月、効果を実感してみませんか？」',
    'product-a': '【飲食業向け Product Aセールススクリプト】\n\nオープニング：\n「モバイルオーダーやテイクアウトの注文管理に課題はございませんか？」\n\n提案：\n「Product Aは、店内注文・テイクアウト・デリバリーを一元管理。キッチンの混雑状況に応じた注文受付で、顧客満足度を向上させます。」\n\nクロージング：\n「初期費用無料キャンペーン中です。デモを見ていただけませんか？」',
    'product-b': '【飲食業向け Product Bセールススクリプト】\n\nオープニング：\n「アルバイトスタッフの教育にお時間を取られていませんか？」\n\n提案：\n「Product Bは、動画マニュアルとAIクイズで新人教育を標準化。平均教育期間を50%短縮し、サービス品質を均一化します。」\n\nクロージング：\n「5名分の無料アカウントで、まずはお試しください。」',
  },
}

const OBJECTIONS: Record<string, { objection: string; response: string }[]> = {
  it: [
    {
      objection: '既に他社ツールを使っている',
      response:
        '他社ツールとの併用や段階的な移行も可能です。API連携で既存ワークフローを壊さずに導入できる点が、IT企業様に特にご評価いただいています。まずは補完ツールとしてお試しください。',
    },
    {
      objection: '自社で開発した方が良いのでは？',
      response:
        'もちろん自社開発も選択肢ですが、開発・保守コストと時間を考慮すると、UMIDASの導入で開発リソースをコア事業に集中できます。実際にCTO様からも「買うか作るかの判断で、UMIDASは買って正解だった」とのお声をいただいています。',
    },
    {
      objection: 'セキュリティが心配',
      response:
        'SOC2 Type II認証取得済み、データの暗号化（転送時・保存時）、SSO対応など、エンタープライズグレードのセキュリティを標準装備しています。セキュリティホワイトペーパーもご用意しております。',
    },
  ],
  manufacturing: [
    {
      objection: '現場のITリテラシーが低い',
      response:
        'タブレット対応の直感的なUIで、ITに不慣れな現場スタッフでも簡単に操作できます。導入時には現場向け研修も無料で実施いたします。実際に平均年齢55歳の工場でも問題なくご利用いただいています。',
    },
    {
      objection: '既存の設備と連携できるか不安',
      response:
        '主要PLCメーカー（三菱電機、オムロン、キーエンス等）との連携実績がございます。事前に御社の設備構成を確認し、連携可否レポートを無料でお出しいたします。',
    },
    {
      objection: '投資対効果が見えにくい',
      response:
        '導入企業の平均ROIは18ヶ月で200%です。御社の現状データをもとに、具体的なROIシミュレーションを作成いたします。目に見える数字でご判断いただけます。',
    },
  ],
  retail: [
    {
      objection: '店舗スタッフの負担が増えるのでは',
      response:
        '逆に、手作業で行っていた集計・分析作業が自動化されるため、スタッフの負担は大幅に軽減されます。空いた時間を接客に充てることで、売上向上にも貢献します。',
    },
    {
      objection: '小規模店舗には大げさでは',
      response:
        'スタータープランは月額29,800円から。1店舗からでもしっかり効果を発揮します。むしろ小規模だからこそ、限られたリソースの最適化が重要です。',
    },
    {
      objection: '導入に時間がかかりそう',
      response:
        'POSデータの連携だけなら最短3日で稼働開始可能です。段階的な機能拡張もサポートいたしますので、業務を止めずに導入いただけます。',
    },
  ],
  medical: [
    {
      objection: '個人情報の取り扱いが心配',
      response:
        'HIPAA準拠、ISO27001認証取得済みです。医療データは国内DCで厳格に管理し、アクセスログも完全記録。個人情報保護委員会のガイドラインに準拠しています。',
    },
    {
      objection: '電子カルテとの連携は？',
      response:
        '主要電子カルテシステム（富士通、NEC、PHCなど）との連携実績がございます。HL7 FHIR規格にも対応しており、スムーズなデータ連携が可能です。',
    },
    {
      objection: '医療現場は忙しく導入の余裕がない',
      response:
        '導入作業はすべて弊社エンジニアが代行いたします。現場の方にお願いするのは最終確認のみ。休診日や閑散時間帯を活用した段階導入もご提案いたします。',
    },
  ],
  food: [
    {
      objection: '個人経営なのでそこまで必要ない',
      response:
        '個人経営だからこそ、オーナー様の感覚頼りの経営から、データに基づく意思決定へ。月額29,800円で食材ロスを30%削減できれば、確実に元が取れます。',
    },
    {
      objection: 'ITが苦手で使いこなせるか不安',
      response:
        'スマートフォンが使えれば問題ありません。画面を見ながらの電話サポートや、訪問サポートもご利用いただけます。平均3日で基本操作をマスターされています。',
    },
    {
      objection: '繁忙期には対応できない',
      response:
        'むしろ繁忙期こそUMIDASの真価を発揮します。AI需要予測で仕入れ量を最適化し、食材切れも廃棄も最小限に。繁忙期の利益率が平均8%改善しています。',
    },
  ],
}

const SUCCESS_STORIES: Record<
  string,
  { date: string; title: string; description: string }[]
> = {
  it: [
    {
      date: '2026-01',
      title: '株式会社テックフォース様',
      description:
        'エンジニア50名規模。プロジェクト収益可視化により、赤字案件を早期発見。年間利益率が8%改善。',
    },
    {
      date: '2025-11',
      title: 'デジタルソリューションズ株式会社様',
      description:
        'SaaS企業。チャーン率の予測分析で解約防止施策を実施。月次解約率を4.2%→1.8%に改善。',
    },
    {
      date: '2025-09',
      title: 'AI Labs株式会社様',
      description:
        'スタートアップ。営業データの可視化でリード管理を効率化。商談成約率が35%から52%に向上。',
    },
  ],
  manufacturing: [
    {
      date: '2026-02',
      title: '東洋精密工業株式会社様',
      description:
        '自動車部品製造。IoTセンサー連携で設備稼働率を92%→97%に改善。年間5,000万円の生産性向上。',
    },
    {
      date: '2025-12',
      title: '日本金属加工株式会社様',
      description:
        '金属加工業。品質管理データの統合で不良率を3.2%→0.8%に削減。取引先からの信頼度が向上。',
    },
    {
      date: '2025-08',
      title: 'グリーンテック株式会社様',
      description:
        '環境機器製造。生産計画のAI最適化で納期遵守率を98%に。受注増加にも対応可能に。',
    },
  ],
  retail: [
    {
      date: '2026-01',
      title: 'ファッションモール渋谷様',
      description:
        'アパレル10店舗。顧客セグメント分析で販促効率2倍。年間広告費30%削減しながら売上12%増。',
    },
    {
      date: '2025-10',
      title: 'ナチュラルマート株式会社様',
      description:
        'オーガニック食品チェーン。需要予測で食品ロス45%削減。サステナビリティ経営としてもPR効果。',
    },
    {
      date: '2025-07',
      title: 'ホームプラス株式会社様',
      description:
        'ホームセンター。在庫最適化でキャッシュフロー改善。在庫回転率が4.2回→6.1回に向上。',
    },
  ],
  medical: [
    {
      date: '2026-02',
      title: '城南メディカルクリニック様',
      description:
        '内科・小児科。患者動向分析で待ち時間を平均40%短縮。患者満足度スコアが大幅に向上。',
    },
    {
      date: '2025-11',
      title: '総合健診センター東京様',
      description:
        '健診センター。予約最適化で1日の受入可能人数を20%増加。稼働率向上で収益15%改善。',
    },
    {
      date: '2025-09',
      title: '西新宿歯科クリニック様',
      description:
        '歯科医院。リコール管理の自動化で定期検診の来院率が60%→85%に。安定した収益基盤を構築。',
    },
  ],
  food: [
    {
      date: '2026-01',
      title: '焼肉ダイニング牛匠様',
      description:
        '焼肉チェーン5店舗。食材発注のAI最適化で食品ロス35%削減。原価率を32%→28%に改善。',
    },
    {
      date: '2025-12',
      title: 'カフェ・ド・フルール様',
      description:
        'カフェ3店舗。売上データ分析でメニュー改定を実施。客単価が850円→1,120円に向上。',
    },
    {
      date: '2025-08',
      title: 'ラーメン道 一番様',
      description:
        'ラーメン店。来客予測で仕込み量を最適化。スープ廃棄ゼロを達成しながら品切れも解消。',
    },
  ],
}

export default function ClosingAiPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showObjections, setShowObjections] = useState(false)

  // Auto-generate sales script when both selectors change
  useEffect(() => {
    if (!selectedIndustry || !selectedProduct) return

    const script =
      MOCK_SCRIPTS[selectedIndustry]?.[selectedProduct] ||
      '選択された組み合わせのスクリプトは準備中です。'

    setMessages([
      {
        role: 'assistant',
        content: script,
      },
    ])
    setShowObjections(true)
  }, [selectedIndustry, selectedProduct])

  const simulateResponse = useCallback(
    (question: string) => {
      setIsTyping(true)
      const delay = 800 + Math.random() * 700
      setTimeout(() => {
        const industryLabel =
          INDUSTRIES.find((i) => i.value === selectedIndustry)?.label || ''
        const productLabel =
          PRODUCTS.find((p) => p.value === selectedProduct)?.label || ''

        const response = `ご質問ありがとうございます。\n\n${industryLabel}の${productLabel}に関するお問い合わせですね。\n\n${question}については、以下のポイントを押さえてご対応ください：\n\n1. まず相手の具体的な課題を深掘りしましょう\n2. 数値的な実績（ROI、導入期間、改善率）を提示してください\n3. 同業他社の成功事例を引用すると効果的です\n4. 最終的には小さなステップ（無料トライアル、デモ）への誘導を心がけましょう\n\n具体的な切り返しトークについては、「反論処理」セクションもご参照ください。`
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response },
        ])
        setIsTyping(false)
      }, delay)
    },
    [selectedIndustry, selectedProduct]
  )

  const handleSend = useCallback(
    (message: string) => {
      setMessages((prev) => [...prev, { role: 'user', content: message }])
      simulateResponse(message)
    },
    [simulateResponse]
  )

  const currentObjections = OBJECTIONS[selectedIndustry] || []
  const currentStories = SUCCESS_STORIES[selectedIndustry] || []

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
                Closing-AI
              </h1>
              <p className="text-xs text-[#7a7a7a]">
                営業ノウハウチャットbot - ターゲットに合わせたセールススクリプトを生成
              </p>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[#7a7a7a] uppercase tracking-wider mb-1.5">
                業種
              </label>
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e0e0e0] bg-[#f2f2f2] px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
                >
                  <option value="">業種を選択...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7a7a] pointer-events-none" />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[#7a7a7a] uppercase tracking-wider mb-1.5">
                製品
              </label>
              <div className="relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#e0e0e0] bg-[#f2f2f2] px-4 py-2.5 pr-10 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e]"
                >
                  <option value="">製品を選択...</option>
                  {PRODUCTS.map((prod) => (
                    <option key={prod.value} value={prod.value}>
                      {prod.label}
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
            {!selectedIndustry || !selectedProduct ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Target className="w-12 h-12 text-[#e0e0e0] mx-auto mb-3" />
                  <p className="text-sm text-[#7a7a7a]">
                    業種と製品を選択して、セールススクリプトを生成してください
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
            {selectedIndustry
              ? `${INDUSTRIES.find((i) => i.value === selectedIndustry)?.label || ''}の導入実績`
              : '業種を選択すると表示されます'}
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
                業種を選択すると
                <br />
                成功事例が表示されます
              </p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#e0e0e0]">
          <p className="text-[10px] text-[#9a9a9a] leading-snug">
            ※事例の内容はサンプルデータです。実際の導入事例は営業部にお問い合わせください。
          </p>
        </div>
      </aside>
    </div>
  )
}
