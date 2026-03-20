'use client'

import { useState } from 'react'
import {
  Dna,
  ChevronRight,
  Shield,
  AlertTriangle,
  Target,
  Users,
  Sparkles,
  Heart,
  XCircle,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
} from 'lucide-react'

type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

interface Question {
  id: number
  text: string
  dimension: [Dimension, Dimension]
  choices: { label: string; value: Dimension }[]
}

interface SalesType {
  code: string
  name: string
  tagline: string
  strengths: string[]
  weaknesses: string[]
  approach: string
  compatibleCustomers: string[]
  incompatibleCustomers: string[]
}

interface CustomerPersona {
  id: string
  name: string
  description: string
  types: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '新規顧客へのアプローチ方法として、どちらが自然ですか？',
    dimension: ['E', 'I'],
    choices: [
      { label: '飛び込みやテレアポで積極的に接触する', value: 'E' },
      { label: 'メールやSNSで事前にリサーチしてから接触する', value: 'I' },
      { label: '紹介者を通じてまず関係性を築く', value: 'I' },
      { label: 'イベントや展示会で自然に声をかける', value: 'E' },
    ],
  },
  {
    id: 2,
    text: '商談の準備で最も重視するのは？',
    dimension: ['S', 'N'],
    choices: [
      { label: '過去の取引データや業界の具体的な数字', value: 'S' },
      { label: '顧客の将来ビジョンや業界トレンドの仮説', value: 'N' },
      { label: '競合製品の詳細なスペック比較', value: 'S' },
      { label: '顧客が気づいていない潜在的な課題の発見', value: 'N' },
    ],
  },
  {
    id: 3,
    text: '顧客が迷っている時、あなたはどう対応しますか？',
    dimension: ['T', 'F'],
    choices: [
      { label: 'ROIや費用対効果の数字を示して論理的に説得する', value: 'T' },
      { label: '顧客の不安に共感し、安心感を与える対話をする', value: 'F' },
      { label: '他社の成功事例のデータを具体的に提示する', value: 'T' },
      { label: '「一緒に最適な解を見つけましょう」と寄り添う', value: 'F' },
    ],
  },
  {
    id: 4,
    text: '営業活動の進め方として、どちらが自分に近いですか？',
    dimension: ['J', 'P'],
    choices: [
      { label: '週次で計画を立て、スケジュール通りに進める', value: 'J' },
      { label: '状況に応じて柔軟に動き、チャンスを逃さない', value: 'P' },
      { label: 'KPIを設定し、数値目標で管理する', value: 'J' },
      { label: '直感を信じて、熱い案件に集中投資する', value: 'P' },
    ],
  },
  {
    id: 5,
    text: 'チームでの営業活動について、どう考えますか？',
    dimension: ['E', 'I'],
    choices: [
      { label: 'チームメンバーと頻繁に情報共有し、一緒に戦略を練る', value: 'E' },
      { label: '自分でじっくり分析してから、まとまった提案をチームに出す', value: 'I' },
      { label: 'ミーティングで活発に議論してアイデアを出す', value: 'E' },
      { label: '一人で集中して顧客分析やプランニングに時間を使う', value: 'I' },
    ],
  },
  {
    id: 6,
    text: 'プレゼン資料の作り方で重視するのは？',
    dimension: ['S', 'N'],
    choices: [
      { label: '具体的な数値・グラフ・比較表で説得力を出す', value: 'S' },
      { label: 'ストーリー性を持たせ、未来のビジョンを描く', value: 'N' },
      { label: '実績データと事例を豊富に盛り込む', value: 'S' },
      { label: 'コンセプチュアルな提案で顧客の想像力を刺激する', value: 'N' },
    ],
  },
  {
    id: 7,
    text: 'クロージングの場面で、あなたはどちらに近いですか？',
    dimension: ['T', 'F'],
    choices: [
      { label: '合理的なメリットを整理して、決断を促す', value: 'T' },
      { label: '顧客との信頼関係を最終的な決め手にする', value: 'F' },
      { label: '期限や条件を明確に提示して判断を仰ぐ', value: 'T' },
      { label: '「私が責任を持ってサポートします」と人間関係で押す', value: 'F' },
    ],
  },
  {
    id: 8,
    text: '予想外の反論が来た時、どう対応しますか？',
    dimension: ['J', 'P'],
    choices: [
      { label: '事前に用意した反論対策シートに沿って対応する', value: 'J' },
      { label: 'その場の空気を読んで、臨機応変に対応する', value: 'P' },
      { label: 'データに基づいて冷静に論点を整理する', value: 'J' },
      { label: '話題を柔軟に変えて、別の切り口から攻める', value: 'P' },
    ],
  },
  {
    id: 9,
    text: '失注した時の振り返り方として近いのは？',
    dimension: ['S', 'N'],
    choices: [
      { label: '商談の各ステップを時系列で振り返り、具体的な改善点を洗い出す', value: 'S' },
      { label: '全体の流れから本質的な敗因パターンを抽出し、次の戦略に活かす', value: 'N' },
      { label: '競合の提案内容を詳細に調べて差分を分析する', value: 'S' },
      { label: '顧客の本当の課題を再定義し、アプローチ全体を見直す', value: 'N' },
    ],
  },
  {
    id: 10,
    text: '理想の営業スタイルに最も近いのは？',
    dimension: ['E', 'I'],
    choices: [
      { label: '多くの人と会い、広いネットワークから案件を生む', value: 'E' },
      { label: '少数の顧客と深い関係を築き、大型案件に集中する', value: 'I' },
      { label: 'エネルギッシュに行動量で勝負する', value: 'E' },
      { label: '緻密な戦略と準備で確度の高い商談に絞る', value: 'I' },
    ],
  },
]

const SALES_TYPES: Record<string, SalesType> = {
  ENTJ: {
    code: 'ENTJ',
    name: '戦略的開拓者',
    tagline: '大胆な戦略で市場を切り拓くリーダー型',
    strengths: [
      '大型案件のクロージング力が抜群',
      '論理的な提案構築で経営層を動かせる',
      '目標達成への強いコミットメント',
      'チームを巻き込んだ組織営業が得意',
    ],
    weaknesses: [
      '顧客の感情面への配慮が薄くなりがち',
      '小型案件へのモチベーション維持が課題',
      '自信が強すぎると押しつけがましく映る',
    ],
    approach: '経営課題の解決パートナーとしてポジショニング。数値根拠のある提案で意思決定者に直接アプローチし、組織全体を動かすトップダウン型の営業が最も力を発揮します。',
    compatibleCustomers: ['合理的な経営者', '成果重視のマネージャー'],
    incompatibleCustomers: ['関係性重視の担当者', '慎重すぎる決裁者'],
  },
  ENFJ: {
    code: 'ENFJ',
    name: '共感型リレーションビルダー',
    tagline: '人の心を動かし、信頼で成約に導く',
    strengths: [
      '顧客との深い信頼関係構築が得意',
      'チーム全体のモチベーション向上に貢献',
      '長期的なパートナーシップを築ける',
      '人の潜在ニーズを直感的に把握できる',
    ],
    weaknesses: [
      '論理的な説得が必要な場面で弱い',
      '断ることが苦手で案件を抱えすぎる',
      '感情移入しすぎて客観的判断が鈍る',
    ],
    approach: '顧客の課題に深く共感し「あなたのために」という姿勢で信頼を構築。人と人との関係性を軸にした営業スタイルで、紹介営業でも高い成果を発揮します。',
    compatibleCustomers: ['人間関係を重視する担当者', '初めての導入で不安な顧客'],
    incompatibleCustomers: ['データのみで判断する合理主義者', 'スピード重視の経営者'],
  },
  ENTP: {
    code: 'ENTP',
    name: 'イノベーション型セールス',
    tagline: '常識を覆す提案で新市場を創造する',
    strengths: [
      '既存の枠にとらわれない斬新な提案力',
      '顧客が気づいていない課題を発見できる',
      '逆境でも柔軟に対応できる適応力',
      '会話力が高く、初対面でもすぐに打ち解ける',
    ],
    weaknesses: [
      'フォローアップの継続性に課題',
      'ルーティンワークへのモチベーションが低い',
      '提案が抽象的になりすぎることがある',
    ],
    approach: '顧客の「当たり前」に疑問を投げかけ、新しい視点を提供する提案型営業。相手の思考を刺激し、一緒に最適解を探るコンサルティングスタイルが効果的です。',
    compatibleCustomers: ['革新的な経営者', '新しいことに挑戦したい担当者'],
    incompatibleCustomers: ['前例踏襲を好む保守層', '細かい実績データを要求する顧客'],
  },
  ENFP: {
    code: 'ENFP',
    name: '情熱型ビジョナリー',
    tagline: '熱意とビジョンで相手の心に火をつける',
    strengths: [
      '圧倒的な行動力と人を巻き込む力',
      '顧客のモチベーションを高められる',
      '新規開拓での第一印象が抜群',
      '逆境でもポジティブに乗り越えられる',
    ],
    weaknesses: [
      '管理業務や報告書作成が苦手',
      '熱意が先走り、深い分析が不足しがち',
      '複数案件の優先順位づけが課題',
    ],
    approach: '自分の情熱と商品への確信を武器に、相手のワクワクを引き出す営業スタイル。ストーリーテリングで未来のビジョンを共有し、共に成長するパートナーとして伴走します。',
    compatibleCustomers: ['ビジョン重視の経営者', '変革を求める若手担当者'],
    incompatibleCustomers: ['冷静・論理的な財務担当者', '慎重に比較検討する顧客'],
  },
  ISTJ: {
    code: 'ISTJ',
    name: '精密分析型セールス',
    tagline: '緻密なデータと信頼性で確実に仕留める',
    strengths: [
      'データに基づく説得力のある提案',
      '約束を必ず守る信頼性の高さ',
      '進捗管理と報告の正確さ',
      '長期案件の粘り強いフォローアップ',
    ],
    weaknesses: [
      '初対面での打ち解けに時間がかかる',
      '予定外の変更への対応が遅い',
      '感情的なアプローチが不得意',
    ],
    approach: '徹底した事前準備とデータ分析で、顧客に安心感と信頼感を与える堅実型営業。具体的な数字と実績で着実にステップを進め、確実なクロージングにつなげます。',
    compatibleCustomers: ['データ重視の技術者', '慎重な品質管理担当者'],
    incompatibleCustomers: ['感覚で決める経営者', 'スピード優先の営業担当'],
  },
  ISFJ: {
    code: 'ISFJ',
    name: 'サポート特化型',
    tagline: '手厚いフォローで顧客満足度No.1',
    strengths: [
      '既存顧客の維持・深耕が圧倒的に得意',
      '細やかな気配りで顧客満足度が高い',
      'クレーム対応の丁寧さが信頼につながる',
      '顧客の細かいニーズを見逃さない',
    ],
    weaknesses: [
      '新規開拓への積極性が不足しがち',
      '自己主張が弱く、交渉で押されやすい',
      '変化の激しい環境にストレスを感じる',
    ],
    approach: '顧客一人ひとりに寄り添い、きめ細かいサポートで圧倒的な顧客満足度を実現。リピート受注と紹介案件を主軸とした安定した営業スタイルです。',
    compatibleCustomers: ['長期取引を求める顧客', '丁寧な対応を重視する担当者'],
    incompatibleCustomers: ['即断即決の経営者', '攻めの営業を求めるマネージャー'],
  },
  INTJ: {
    code: 'INTJ',
    name: '戦略家型プランナー',
    tagline: '緻密な戦略設計で高確度商談を創出',
    strengths: [
      '長期的な営業戦略の設計力が卓越',
      '競合分析と差別化戦略に長けている',
      '複雑な提案を論理的に構築できる',
      '目標に対する高い達成意欲',
    ],
    weaknesses: [
      '人間関係構築に時間がかかる',
      '完璧主義が行動の遅れにつながる',
      '小回りの効く対応が苦手',
    ],
    approach: '徹底的な市場分析と顧客研究に基づき、精度の高い提案を設計。量より質を重視し、確度の高い案件に集中投資する戦略型営業です。',
    compatibleCustomers: ['論理的な経営幹部', '戦略的パートナーを求める企業'],
    incompatibleCustomers: ['雑談ベースで関係を築く顧客', '直感で決める意思決定者'],
  },
  INFJ: {
    code: 'INFJ',
    name: '洞察型アドバイザー',
    tagline: '本質を見抜く目で最適解に導く',
    strengths: [
      '顧客の言葉の裏にある本音を見抜ける',
      '深い洞察に基づくコンサルティング力',
      '一対一の関係構築で強い信頼を得る',
      '長期的な顧客の成功にコミットできる',
    ],
    weaknesses: [
      '大勢の前でのプレゼンが苦手',
      '多数の浅い関係より少数の深い関係を好む',
      'ストレス環境で消耗しやすい',
    ],
    approach: '顧客の本質的な課題を深く理解し、真に必要なソリューションを提案するアドバイザー型営業。少数精鋭の顧客との深い関係性から大きな成果を生みます。',
    compatibleCustomers: ['課題解決を求める真剣な顧客', '信頼できるアドバイザーを求める経営者'],
    incompatibleCustomers: ['表面的なスペック比較をする顧客', '大量の見積もり依頼をする担当者'],
  },
  ESTP: {
    code: 'ESTP',
    name: 'アクション型クローザー',
    tagline: '圧倒的な行動力で即座に結果を出す',
    strengths: [
      '行動力とスピードが群を抜いている',
      '現場対応力と交渉力が高い',
      'プレッシャーに強く、ここぞの勝負に強い',
      '人脈を素早く広げるネットワーク力',
    ],
    weaknesses: [
      '長期的な計画策定が苦手',
      '書類作成やレポート業務に飽きやすい',
      '衝動的な値引き判断をしてしまうことがある',
    ],
    approach: '圧倒的な行動量と現場力で、短期間で成果を出すスピード型営業。商談の場で臨機応変に対応し、その場でクロージングまで持ち込む実行力が武器です。',
    compatibleCustomers: ['スピード感を求める経営者', '即断即決タイプの顧客'],
    incompatibleCustomers: ['慎重に検討する大企業', '書面ベースの稟議文化の企業'],
  },
  ESFP: {
    code: 'ESFP',
    name: 'エンターテイナー型セールス',
    tagline: '場の空気を支配し、楽しく売る天才',
    strengths: [
      'プレゼンテーション力が圧倒的',
      '初対面でも一瞬で場を温められる',
      '商品デモやイベント営業で真価を発揮',
      '顧客を楽しませながら商談を進められる',
    ],
    weaknesses: [
      'データ分析や数値管理が弱い',
      '地道なフォローアップが続かない',
      '感情に流されて不利な条件を飲みやすい',
    ],
    approach: '人を楽しませる力を武器に、商談自体をポジティブな体験に変える営業スタイル。デモンストレーションやプレゼンの場で真価を発揮し、感動で購買意欲を引き出します。',
    compatibleCustomers: ['人柄で選ぶ担当者', 'ワクワクする提案を求める顧客'],
    incompatibleCustomers: ['数字だけで判断する財務部門', '形式的なRFPプロセスの大企業'],
  },
  ISTP: {
    code: 'ISTP',
    name: 'テクニカル型ソリューションセールス',
    tagline: '技術力と冷静な分析で確実に解決する',
    strengths: [
      '製品知識が深く技術的な質問に即答できる',
      '冷静な判断力で的確な提案ができる',
      '問題解決型のアプローチが得意',
      '効率的な営業プロセスを構築できる',
    ],
    weaknesses: [
      '感情表現が乏しく、冷たい印象を与えがち',
      '雑談やアイスブレイクが苦手',
      'チームワークよりも単独行動を好む',
    ],
    approach: '深い製品知識と技術力を武器にした問題解決型営業。顧客の技術的な課題を的確に理解し、最適なソリューションを提案するエンジニアセールスです。',
    compatibleCustomers: ['技術者・エンジニア', '合理的に製品を評価する顧客'],
    incompatibleCustomers: ['人間関係で選ぶ担当者', '雑談から入りたい顧客'],
  },
  ISFP: {
    code: 'ISFP',
    name: '誠実型パートナー',
    tagline: '誠実さと共感で静かに信頼を勝ち取る',
    strengths: [
      '誠実で裏表のない営業スタイルが信頼を生む',
      '顧客の声に真摯に耳を傾けられる',
      '無理な売り込みをしないため嫌われない',
      '一度信頼されると強固な関係が続く',
    ],
    weaknesses: [
      '積極的なクロージングが苦手',
      '自分からの提案やリードが弱い',
      '目標数字へのプレッシャーに弱い',
    ],
    approach: '誠実さを武器に、顧客に寄り添い本当に必要なものだけを提案するスタイル。無理に売らない姿勢がかえって信頼を生み、長期的な関係と紹介案件につながります。',
    compatibleCustomers: ['誠実さを重視する顧客', '押し売りを嫌う慎重な担当者'],
    incompatibleCustomers: ['攻めの営業を求める上司', 'スピードと押しの強さを求める顧客'],
  },
  INTP: {
    code: 'INTP',
    name: 'ロジカル分析型',
    tagline: '圧倒的な論理力で顧客を知的に納得させる',
    strengths: [
      '複雑な課題を論理的に整理して提案できる',
      '業界分析やマーケット調査が得意',
      '独自の視点で差別化された提案を作れる',
      '知的好奇心が高く、常に学び続けられる',
    ],
    weaknesses: [
      '人間関係の構築に時間がかかる',
      '完璧を求めすぎて提案のタイミングを逃す',
      '感情に訴えかける営業が不得意',
    ],
    approach: '論理的な分析と独自の洞察を武器にした知的セールス。データと根拠で顧客を納得させ、他の営業では提供できない深い分析価値を提供します。',
    compatibleCustomers: ['論理的思考の経営者', 'データドリブンな意思決定者'],
    incompatibleCustomers: ['感情で決める顧客', '素早い決断を求める案件'],
  },
  INFP: {
    code: 'INFP',
    name: '理念共感型セールス',
    tagline: '価値観と理念で深い共鳴を生む',
    strengths: [
      '顧客の理念やビジョンに深く共感できる',
      '商品の「意味」や「価値」を伝える力が高い',
      '長期的な信頼関係を自然に構築できる',
      'クリエイティブな提案ができる',
    ],
    weaknesses: [
      '目標数字に追われるとパフォーマンスが落ちる',
      '断られることへの耐性が低い',
      'ルーティン営業のモチベーション維持が課題',
    ],
    approach: '商品の価値や意味を深く理解し、顧客の理念やビジョンとつなげる営業スタイル。「なぜこの商品なのか」のストーリーで顧客の心を動かします。',
    compatibleCustomers: ['理念経営の企業', '社会貢献意識の高い担当者'],
    incompatibleCustomers: ['コスト最優先の顧客', '感情を排した合理主義者'],
  },
  ESTJ: {
    code: 'ESTJ',
    name: '組織統率型マネージャー',
    tagline: '仕組みで勝つ営業の司令塔',
    strengths: [
      '営業プロセスの仕組み化・標準化が得意',
      'チーム全体の生産性を引き上げられる',
      '目標管理と進捗管理の精度が高い',
      '大型案件の組織営業をリードできる',
    ],
    weaknesses: [
      '柔軟性に欠け、イレギュラーに弱い',
      '部下への要求が厳しすぎることがある',
      '顧客の感情よりもプロセスを優先しがち',
    ],
    approach: '体系的な営業プロセスと明確なKPI管理で、再現性のある成果を出す管理型営業。チーム全体を統率し、組織的な営業で大型案件を攻略します。',
    compatibleCustomers: ['組織的な購買プロセスの企業', '明確な基準で判断する顧客'],
    incompatibleCustomers: ['柔軟なアプローチを求める顧客', '個人的な関係を重視する担当者'],
  },
  ESFJ: {
    code: 'ESFJ',
    name: 'ホスピタリティ型営業',
    tagline: 'おもてなしの心で圧倒的な顧客満足を',
    strengths: [
      '顧客ケアの質が群を抜いて高い',
      '社内外の人間関係を円滑にまとめる力',
      'イベントや接待での場づくりが得意',
      'リピートと紹介の率が高い',
    ],
    weaknesses: [
      '厳しい交渉や値引き拒否が苦手',
      '顧客に合わせすぎて自社の利益を損なうことがある',
      'ネガティブなフィードバックを受けると落ち込みやすい',
    ],
    approach: 'おもてなしの心を武器に、顧客に最高の体験を提供する営業スタイル。細やかな気配りと温かいコミュニケーションで、自然とファンが増え、紹介の連鎖が生まれます。',
    compatibleCustomers: ['おもてなしを重視する日本企業', '長期的なパートナーを求める顧客'],
    incompatibleCustomers: ['ドライな外資系企業', '価格のみで判断する担当者'],
  },
}

const CUSTOMER_PERSONAS: CustomerPersona[] = [
  {
    id: 'rational-exec',
    name: '合理的経営者タイプ',
    description: 'データと数字で判断。ROIと実績を重視する意思決定者',
    types: ['ENTJ', 'ESTJ', 'INTJ', 'ISTJ'],
  },
  {
    id: 'relationship-buyer',
    name: '関係性重視タイプ',
    description: '信頼関係と人柄を重視。長期的なパートナーシップを求める',
    types: ['ESFJ', 'ISFJ', 'ENFJ', 'INFJ'],
  },
  {
    id: 'innovation-seeker',
    name: '革新志向タイプ',
    description: '新しいことに積極的。ビジョンと可能性にワクワクする',
    types: ['ENTP', 'ENFP', 'INTP', 'INFP'],
  },
  {
    id: 'speed-action',
    name: 'スピード重視タイプ',
    description: '即断即決。結果を素早く求め、行動力を評価する',
    types: ['ESTP', 'ESFP', 'ISTP', 'ISFP'],
  },
  {
    id: 'cautious-analyst',
    name: '慎重分析タイプ',
    description: '詳細な比較検討を行い、リスクを最小化して意思決定する',
    types: ['ISTJ', 'INTJ', 'ISFJ', 'INFJ'],
  },
]

function getCompatibilityScore(salesType: string, customerPersona: CustomerPersona): number {
  const type = SALES_TYPES[salesType]
  if (!type) return 50
  const compatible = type.compatibleCustomers.length
  const incompatible = type.incompatibleCustomers.length
  // Simple mock scoring
  const personaIndex = CUSTOMER_PERSONAS.indexOf(customerPersona)
  const scores = [85, 72, 68, 78, 60]
  return scores[personaIndex] ?? 70
}

function getCompatibilityAdvice(salesType: string, personaId: string): {
  score: number
  approach: string
  phrases: string[]
  avoid: string[]
} {
  const adviceMap: Record<string, Record<string, { score: number; approach: string; phrases: string[]; avoid: string[] }>> = {
    default: {
      'rational-exec': {
        score: 75,
        approach: '数値根拠を重視し、ROIを中心に論理的に提案する。結論を先に述べ、詳細は補足資料に委ねる。',
        phrases: ['「投資対効果は具体的に...」', '「同業他社の実績では...」', '「コスト削減額は年間で...」'],
        avoid: ['感情的な訴えかけ', '「とりあえず使ってみてください」', '曖昧な表現や「だいたい」'],
      },
      'relationship-buyer': {
        score: 80,
        approach: '信頼関係の構築を最優先に。焦らず顧客のペースに合わせ、継続的なフォローで安心感を醸成する。',
        phrases: ['「御社の成功が私たちの成功です」', '「何かあればいつでもご連絡ください」', '「一緒に最適な形を考えましょう」'],
        avoid: ['急かすクロージング', '他社の悪口', '一方的な説明'],
      },
      'innovation-seeker': {
        score: 70,
        approach: '未来のビジョンや可能性を語り、相手のワクワクを引き出す。既存の枠にとらわれない新しい活用法を提案する。',
        phrases: ['「これで実現できる未来は...」', '「他社がまだやっていない活用法として...」', '「一緒に新しい価値を作りましょう」'],
        avoid: ['保守的な説明に終始', '「みんなやっています」', '過去の実績だけの訴求'],
      },
      'speed-action': {
        score: 72,
        approach: '結論を素早く提示し、すぐに始められるプランを用意する。判断材料をコンパクトにまとめ、行動を促す。',
        phrases: ['「最短で○日後から開始できます」', '「まず小さく始めて効果を実感しましょう」', '「本日ご決断いただければ...」'],
        avoid: ['長い説明資料', '何度もの会議設定', '慎重すぎる進め方'],
      },
      'cautious-analyst': {
        score: 65,
        approach: '詳細な比較資料とリスク分析を事前に準備。段階的な導入プランでリスクを最小化する提案を行う。',
        phrases: ['「リスクを最小化するプランをご用意しました」', '「段階的に導入していただけます」', '「他社との詳細比較をまとめました」'],
        avoid: ['「今すぐ決めてください」', '大風呂敷を広げた約束', '詳細を省いた説明'],
      },
    },
  }

  return adviceMap.default[personaId] ?? adviceMap.default['rational-exec']
}

export default function SalesDnaPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Dimension>>({})
  const [diagnosed, setDiagnosed] = useState(false)
  const [salesType, setSalesType] = useState<SalesType | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<string>('')

  const handleAnswer = (questionId: number, value: Dimension) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      // Calculate type
      const scores: Record<Dimension, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
      Object.values(newAnswers).forEach((dim) => {
        scores[dim]++
      })
      const code =
        (scores.E >= scores.I ? 'E' : 'I') +
        (scores.S >= scores.N ? 'S' : 'N') +
        (scores.T >= scores.F ? 'T' : 'F') +
        (scores.J >= scores.P ? 'J' : 'P')

      const type = SALES_TYPES[code] ?? SALES_TYPES.ENTJ
      setSalesType(type)
      setTimeout(() => setDiagnosed(true), 500)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setDiagnosed(false)
    setSalesType(null)
    setSelectedPersona('')
  }

  const progress = ((Object.keys(answers).length) / QUESTIONS.length) * 100
  const selectedPersonaData = CUSTOMER_PERSONAS.find((p) => p.id === selectedPersona)
  const compatibility = selectedPersona && salesType
    ? getCompatibilityAdvice(salesType.code, selectedPersona)
    : null

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Dna className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales-DNA</h1>
            <p className="text-sm text-muted">営業タイプ診断 - 16タイプ MBTI ベース</p>
          </div>
        </div>
      </div>

      {!diagnosed ? (
        /* Questionnaire */
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-graphite-400">
                質問 {currentQuestion + 1} / {QUESTIONS.length}
              </span>
              <span className="text-sm font-semibold text-gold-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-graphite-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gold-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Q{QUESTIONS[currentQuestion].id}. {QUESTIONS[currentQuestion].text}
            </h2>
            <div className="space-y-3">
              {QUESTIONS[currentQuestion].choices.map((choice, i) => {
                const isSelected = answers[QUESTIONS[currentQuestion].id] === choice.value && i === QUESTIONS[currentQuestion].choices.findIndex((c) => c.value === choice.value)
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(QUESTIONS[currentQuestion].id, choice.value)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-gold-500/50 bg-gold-500/10'
                        : 'border-border bg-graphite-800 hover:border-graphite-600 hover:bg-graphite-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                          isSelected
                            ? 'bg-gold-500 text-graphite-950'
                            : 'bg-graphite-700 text-graphite-300'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm text-foreground">{choice.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="text-sm text-graphite-400 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                前の質問
              </button>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentQuestion
                        ? 'bg-gold-500'
                        : answers[QUESTIONS[i].id]
                          ? 'bg-gold-500/40'
                          : 'bg-graphite-700'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentQuestion(Math.min(QUESTIONS.length - 1, currentQuestion + 1))}
                disabled={currentQuestion === QUESTIONS.length - 1}
                className="flex items-center gap-1 text-sm text-gold-500 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                次の質問
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : salesType ? (
        /* Diagnosis Result */
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6 min-w-0">
            {/* Type Card */}
            <div className="rounded-2xl border border-gold-500/30 bg-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500">
                      {salesType.code}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{salesType.name}</h2>
                  <p className="text-sm text-gold-400 mt-1">{salesType.tagline}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-graphite-400 hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  再診断
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-400/5 border border-emerald-400/20 p-4">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    強み
                  </h3>
                  <ul className="space-y-2">
                    {salesType.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-graphite-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-amber-400/5 border border-amber-400/20 p-4">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    弱み
                  </h3>
                  <ul className="space-y-2">
                    {salesType.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-graphite-200">
                        <XCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sales Approach */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-gold-500" />
                最適な営業スタイル
              </h2>
              <p className="text-sm text-graphite-200 leading-relaxed">
                {salesType.approach}
              </p>
            </div>

            {/* Customer Compatibility */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-500" />
                顧客タイプ相性
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                  <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    相性が良い顧客
                  </p>
                  <ul className="space-y-1.5">
                    {salesType.compatibleCustomers.map((c, i) => (
                      <li key={i} className="text-sm text-graphite-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                  <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    苦手な顧客
                  </p>
                  <ul className="space-y-1.5">
                    {salesType.incompatibleCustomers.map((c, i) => (
                      <li key={i} className="text-sm text-graphite-200 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Compatibility Analysis */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                相性分析シミュレーション
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-graphite-300 mb-1.5">
                  顧客タイプを選択
                </label>
                <select
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value)}
                  className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                >
                  <option value="">顧客タイプを選択...</option>
                  {CUSTOMER_PERSONAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.description}
                    </option>
                  ))}
                </select>
              </div>

              {compatibility && selectedPersonaData && (
                <div className="space-y-4">
                  {/* Compatibility Score */}
                  <div className="rounded-xl bg-graphite-800 p-5 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-foreground">
                        相性スコア: {selectedPersonaData.name}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          compatibility.score >= 80
                            ? 'text-emerald-400'
                            : compatibility.score >= 65
                              ? 'text-gold-500'
                              : 'text-amber-400'
                        }`}
                      >
                        {compatibility.score}点
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-graphite-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          compatibility.score >= 80
                            ? 'bg-emerald-400'
                            : compatibility.score >= 65
                              ? 'bg-gold-500'
                              : 'bg-amber-400'
                        }`}
                        style={{ width: `${compatibility.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommended Approach */}
                  <div className="rounded-xl bg-gold-500/5 border border-gold-500/15 p-4">
                    <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-2">
                      推奨アプローチ
                    </p>
                    <p className="text-sm text-graphite-200 leading-relaxed">
                      {compatibility.approach}
                    </p>
                  </div>

                  {/* Phrases to Use */}
                  <div className="rounded-xl bg-graphite-800 p-4 border border-border">
                    <p className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      効果的なフレーズ
                    </p>
                    <ul className="space-y-2">
                      {compatibility.phrases.map((p, i) => (
                        <li key={i} className="text-sm text-gold-300 italic">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Things to Avoid */}
                  <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4">
                    <p className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      避けるべきこと
                    </p>
                    <ul className="space-y-1.5">
                      {compatibility.avoid.map((a, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-graphite-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Quick Summary */}
          <div className="w-full xl:w-72 flex-shrink-0">
            <div className="rounded-2xl border border-gold-500/30 bg-card p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 mb-3">
                  <Dna className="w-8 h-8 text-gold-500" />
                </div>
                <p className="text-xs font-semibold text-gold-500">{salesType.code}</p>
                <h3 className="text-lg font-bold text-foreground mt-1">{salesType.name}</h3>
                <p className="text-xs text-graphite-400 mt-1">{salesType.tagline}</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg bg-graphite-800 p-3 border border-border">
                  <p className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider mb-1">
                    タイプ構成
                  </p>
                  <div className="flex gap-1.5">
                    {salesType.code.split('').map((letter, i) => {
                      const labels: Record<string, string> = {
                        E: '外向', I: '内向', S: '感覚', N: '直感',
                        T: '思考', F: '感情', J: '判断', P: '知覚',
                      }
                      return (
                        <span
                          key={i}
                          className="text-xs font-semibold px-2 py-1 rounded bg-gold-500/10 text-gold-500"
                        >
                          {letter}: {labels[letter]}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-lg bg-graphite-800 p-3 border border-border">
                  <p className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider mb-1.5">
                    強み TOP3
                  </p>
                  <ul className="space-y-1">
                    {salesType.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-xs text-graphite-200 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-graphite-800 p-3 border border-border">
                  <p className="text-[10px] font-semibold text-graphite-400 uppercase tracking-wider mb-1.5">
                    注意点 TOP2
                  </p>
                  <ul className="space-y-1">
                    {salesType.weaknesses.slice(0, 2).map((w, i) => (
                      <li key={i} className="text-xs text-graphite-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-graphite-400 hover:text-foreground hover:border-graphite-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                再診断する
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Disclaimer Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-xs text-muted">
          ※最新データは必ず担当者に最終確認すること
        </p>
      </div>
    </div>
  )
}
