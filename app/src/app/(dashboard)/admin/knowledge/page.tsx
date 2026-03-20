'use client'

import { useState } from 'react'
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Plus,
  X,
  Sparkles,
  Users,
  BarChart3,
  MessageSquare,
  Shield,
  Package,
  ThumbsUp,
  Eye,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

type Category = 'all' | 'killer-phrase' | 'closing-pattern' | 'objection' | 'product'

interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: Category
  author: string
  date: string
  usageCount: number
  effectiveness: number
  isAiGenerated: boolean
}

const categoryConfig: Record<
  Exclude<Category, 'all'>,
  { label: string; icon: typeof MessageSquare; color: string; bg: string }
> = {
  'killer-phrase': { label: 'キラーフレーズ', icon: MessageSquare, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  'closing-pattern': { label: '成約パターン', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  objection: { label: '反論処理', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  product: { label: '商品知識', icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
}

const knowledgeItems: KnowledgeItem[] = [
  {
    id: '1',
    title: '「今すぐ決める必要はありません」の逆転話法',
    content: '顧客が迷っている際に「今すぐ決める必要はありません。ただ、このタイミングだからこそお伝えしたいことがあります」と切り出すことで、プレッシャーを軽減しながら提案を続行できる。',
    category: 'killer-phrase',
    author: '田中太郎',
    date: '2026-03-18',
    usageCount: 47,
    effectiveness: 4.8,
    isAiGenerated: false,
  },
  {
    id: '2',
    title: 'ROI訴求型クロージング',
    content: '導入後3ヶ月のROIシミュレーションを提示し、「投資回収までの期間」を明確化。具体的な数字で意思決定を促進する。成約率が通常より23%向上するパターン。',
    category: 'closing-pattern',
    author: '佐藤花子',
    date: '2026-03-15',
    usageCount: 32,
    effectiveness: 4.5,
    isAiGenerated: false,
  },
  {
    id: '3',
    title: '「予算がない」への切り返し',
    content: '「予算面でのご懸念、よく理解できます。実は多くのお客様が同じ状況から始められています。まずは小規模な導入から始めて、効果を実感していただくプランもご用意しています。」',
    category: 'objection',
    author: 'AI生成',
    date: '2026-03-19',
    usageCount: 28,
    effectiveness: 4.2,
    isAiGenerated: true,
  },
  {
    id: '4',
    title: 'エンタープライズプラン差別化ポイント',
    content: 'カスタムAPI連携、専任CSM、SLA 99.9%保証。競合他社との最大の差別化は「導入後の伴走支援」。24時間体制のテクニカルサポートが決め手になるケースが多い。',
    category: 'product',
    author: '鈴木一郎',
    date: '2026-03-14',
    usageCount: 56,
    effectiveness: 4.6,
    isAiGenerated: false,
  },
  {
    id: '5',
    title: '「成功事例の具体的な数字を教えて」への回答テンプレ',
    content: '「同業種のA社様では導入後6ヶ月で営業効率が35%改善、成約率が12ポイント向上されました。特に初回ヒアリングの質が大幅に向上したとご評価いただいています。」',
    category: 'killer-phrase',
    author: 'AI生成',
    date: '2026-03-20',
    usageCount: 15,
    effectiveness: 4.3,
    isAiGenerated: true,
  },
  {
    id: '6',
    title: '段階的導入のクロージング',
    content: 'いきなりフル導入ではなく、3ステップの段階導入を提案。Step1: 1チーム/1ヶ月のトライアル、Step2: 部門展開、Step3: 全社導入。リスクを最小化し、意思決定のハードルを下げる。',
    category: 'closing-pattern',
    author: '高橋美咲',
    date: '2026-03-16',
    usageCount: 22,
    effectiveness: 4.1,
    isAiGenerated: false,
  },
  {
    id: '7',
    title: '「競合の方が安い」への対応',
    content: '価格だけの比較に持ち込まれた場合、「TCO（Total Cost of Ownership）」の観点に切り替える。導入・運用・教育コストを含めた3年間のトータルコストで比較提案を行う。',
    category: 'objection',
    author: 'AI生成',
    date: '2026-03-17',
    usageCount: 41,
    effectiveness: 4.4,
    isAiGenerated: true,
  },
]

export default function KnowledgeLibraryPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', content: '', category: 'killer-phrase' as Category })

  const filtered = knowledgeItems.filter((item) => {
    const matchSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchSearch && matchCategory
  })

  const aiGenerated = knowledgeItems.filter((i) => i.isAiGenerated)
  const totalUsage = knowledgeItems.reduce((s, i) => s + i.usageCount, 0)
  const uniqueAuthors = new Set(knowledgeItems.filter((i) => !i.isAiGenerated).map((i) => i.author)).size
  const distributionScore = Math.min(100, Math.round((uniqueAuthors / 6) * 100))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <BookOpen className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Library</h1>
          <p className="text-sm text-muted">チーム共有ナレッジベース</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full rounded-lg border border-border bg-graphite-800 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-graphite-400" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gold-500 text-graphite-950'
                  : 'bg-graphite-800 text-graphite-300 hover:bg-graphite-700'
              }`}
            >
              すべて
            </button>
            {(Object.keys(categoryConfig) as Exclude<Category, 'all'>[]).map((cat) => {
              const cfg = categoryConfig[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-gold-500 text-graphite-950'
                      : 'bg-graphite-800 text-graphite-300 hover:bg-graphite-700'
                  }`}
                >
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            ナレッジを追加
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">新規ナレッジ追加</h2>
            <button onClick={() => setShowAddForm(false)} className="text-graphite-400 hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">タイトル</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">カテゴリ</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as Category })}
                className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
              >
                {(Object.keys(categoryConfig) as Exclude<Category, 'all'>[]).map((cat) => (
                  <option key={cat} value={cat}>{categoryConfig[cat].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-300 mb-1.5">内容</label>
              <textarea
                value={newItem.content}
                onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors resize-none"
              />
            </div>
            <button className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
              保存
            </button>
          </div>
        </div>
      )}

      {/* AI Generated Killer Phrases */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-500" />
          AI生成キラーフレーズ
        </h2>
        <p className="text-xs text-graphite-500 mb-4">
          ※ 以下のフレーズはAIが成約データから自動生成しています。実際の効果は商談状況により異なります。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiGenerated.map((item) => {
            const catCfg = categoryConfig[item.category as Exclude<Category, 'all'>]
            return (
              <div key={item.id} className="rounded-xl bg-graphite-800/50 border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
                    {catCfg.label}
                  </span>
                  <Sparkles className="w-3 h-3 text-gold-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-graphite-300 leading-relaxed line-clamp-3">{item.content}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(item.effectiveness)
                            ? 'text-gold-400 fill-gold-400'
                            : 'text-graphite-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-graphite-500">{item.effectiveness}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Attribute Distribution Meter */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-gold-500" />
          属人性排除度
        </h2>
        <p className="text-xs text-graphite-500 mb-4 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI分析 - ナレッジがチーム全体にどの程度共有されているかの指標です
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-4 rounded-full bg-graphite-800">
              <div
                className="h-full rounded-full bg-gold-500 transition-all"
                style={{ width: `${distributionScore}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">{distributionScore}%</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{knowledgeItems.length}</p>
            <p className="text-xs text-graphite-500">総ナレッジ数</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{uniqueAuthors}</p>
            <p className="text-xs text-graphite-500">投稿者数</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{totalUsage}</p>
            <p className="text-xs text-graphite-500">総利用回数</p>
          </div>
        </div>
      </div>

      {/* Knowledge Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          ナレッジ一覧 ({filtered.length}件)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const catCfg = categoryConfig[item.category as Exclude<Category, 'all'>]
            const CatIcon = catCfg.icon
            return (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-6 hover:border-graphite-600 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${catCfg.bg}`}>
                    <CatIcon className={`w-3.5 h-3.5 ${catCfg.color}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catCfg.bg} ${catCfg.color}`}>
                    {catCfg.label}
                  </span>
                  {item.isAiGenerated && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI生成
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-graphite-300 leading-relaxed line-clamp-3 mb-4">{item.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-graphite-500">
                    <span>{item.author}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-graphite-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {item.usageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {item.effectiveness}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
