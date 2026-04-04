'use client'

import { useState } from 'react'
import {
  Settings,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
  Check,
  X,
  GripVertical,
  Tag,
  FileText,
  Hash,
  List,
  Star,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

type QuestionType = 'text' | 'number' | 'select' | 'rating'
type QuestionTag = 'mental' | 'skill' | 'activity' | 'result'

interface ReportQuestion {
  id: string
  text: string
  type: QuestionType
  required: boolean
  tags: QuestionTag[]
  options?: string[]
}

interface Channel {
  id: string
  name: string
  questions: ReportQuestion[]
}

const tagConfig: Record<QuestionTag, { label: string; color: string; bg: string }> = {
  mental: { label: 'メンタル', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  skill: { label: 'スキル', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  activity: { label: '活動量', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  result: { label: '成果', color: 'text-gold-400', bg: 'bg-gold-400/10' },
}

const typeConfig: Record<QuestionType, { label: string; icon: typeof FileText }> = {
  text: { label: 'テキスト', icon: FileText },
  number: { label: '数値', icon: Hash },
  select: { label: '選択', icon: List },
  rating: { label: '評価', icon: Star },
}

const initialQuestions: ReportQuestion[] = [
  {
    id: '1',
    text: '今日の商談数を入力してください',
    type: 'number',
    required: true,
    tags: ['activity', 'result'],
  },
  {
    id: '2',
    text: '商談の結果を選択してください',
    type: 'select',
    required: true,
    tags: ['result'],
    options: ['成約', '検討中', '失注', '初回訪問'],
  },
  {
    id: '3',
    text: '今日の商談で最も印象に残ったことは何ですか？',
    type: 'text',
    required: true,
    tags: ['skill'],
  },
  {
    id: '4',
    text: '今日の自分のパフォーマンスを評価してください',
    type: 'rating',
    required: false,
    tags: ['mental', 'skill'],
  },
  {
    id: '5',
    text: '明日に向けて改善したいポイントは？',
    type: 'text',
    required: false,
    tags: ['skill', 'mental'],
  },
  {
    id: '6',
    text: '今日のモチベーションレベルを教えてください',
    type: 'rating',
    required: true,
    tags: ['mental'],
  },
  {
    id: '7',
    text: '商談先企業名を入力してください',
    type: 'text',
    required: true,
    tags: ['activity'],
  },
]

const initialChannels: Channel[] = [
  { id: 'default', name: '標準フォーマット', questions: initialQuestions },
  {
    id: 'new-hire',
    name: '新人用フォーマット',
    questions: [
      ...initialQuestions,
      {
        id: '8',
        text: 'メンターからのフィードバックを記入してください',
        type: 'text',
        required: true,
        tags: ['skill', 'mental'],
      },
      {
        id: '9',
        text: '今日学んだ商品知識をまとめてください',
        type: 'text',
        required: false,
        tags: ['skill'],
      },
    ],
  },
  {
    id: 'manager',
    name: 'マネージャー用フォーマット',
    questions: [
      {
        id: '10',
        text: 'チームの今日の活動件数',
        type: 'number',
        required: true,
        tags: ['activity'],
      },
      {
        id: '11',
        text: '注目すべきメンバーとその理由',
        type: 'text',
        required: false,
        tags: ['skill', 'result'],
      },
      {
        id: '12',
        text: 'チーム全体の雰囲気',
        type: 'rating',
        required: true,
        tags: ['mental'],
      },
    ],
  },
]

export default function ReportConfigPage() {
  const { user } = useAuth()
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [selectedChannelId, setSelectedChannelId] = useState('default')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Omit<ReportQuestion, 'id'>>({
    text: '',
    type: 'text',
    required: false,
    tags: [],
  })

  const selectedChannel = channels.find((c) => c.id === selectedChannelId)!
  const questions = selectedChannel.questions

  const updateQuestions = (newQuestions: ReportQuestion[]) => {
    setChannels(
      channels.map((c) =>
        c.id === selectedChannelId ? { ...c, questions: newQuestions } : c
      )
    )
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= questions.length) return
    const newQuestions = [...questions]
    ;[newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]]
    updateQuestions(newQuestions)
  }

  const deleteQuestion = (id: string) => {
    updateQuestions(questions.filter((q) => q.id !== id))
  }

  const startEdit = (q: ReportQuestion) => {
    setEditingId(q.id)
    setEditText(q.text)
  }

  const saveEdit = (id: string) => {
    updateQuestions(questions.map((q) => (q.id === id ? { ...q, text: editText } : q)))
    setEditingId(null)
  }

  const toggleRequired = (id: string) => {
    updateQuestions(questions.map((q) => (q.id === id ? { ...q, required: !q.required } : q)))
  }

  const toggleTag = (tag: QuestionTag) => {
    setNewQuestion((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const addQuestion = () => {
    if (!newQuestion.text.trim()) return
    const id = String(Date.now())
    updateQuestions([...questions, { ...newQuestion, id }])
    setNewQuestion({ text: '', type: 'text', required: false, tags: [] })
    setShowAddForm(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
          <Settings className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Report Config</h1>
          <p className="text-sm text-muted">日報フォーマット編集・チャネル管理</p>
        </div>
      </div>

      {/* Channel Selector */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">チャネル選択</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 rounded-lg bg-graphite-800 px-4 py-2 text-sm text-foreground hover:bg-graphite-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'プレビューを閉じる' : 'プレビュー'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannelId(ch.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedChannelId === ch.id
                  ? 'bg-gold-500 text-graphite-950'
                  : 'bg-graphite-800 text-graphite-300 hover:bg-graphite-700'
              }`}
            >
              {ch.name} ({ch.questions.length})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Question Editor */}
        <div className="flex-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                質問一覧 ({questions.length})
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                質問を追加
              </button>
            </div>

            {/* Tag Legend */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border">
              <span className="text-xs text-graphite-500 mr-1">タグ:</span>
              {(Object.keys(tagConfig) as QuestionTag[]).map((tag) => {
                const cfg = tagConfig[tag]
                return (
                  <span
                    key={tag}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                )
              })}
              <span className="text-[10px] text-graphite-600 ml-2">
                - Dashboard分析カテゴリに連動
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-2">
              {questions.map((q, i) => {
                const TypeIcon = typeConfig[q.type].icon
                return (
                  <div
                    key={q.id}
                    className="flex items-start gap-3 rounded-xl px-4 py-3 bg-graphite-800/50 hover:bg-graphite-800 transition-colors group"
                  >
                    {/* Drag Handle / Order Controls */}
                    <div className="flex flex-col items-center gap-0.5 pt-1">
                      <GripVertical className="w-4 h-4 text-graphite-600" />
                      <button
                        onClick={() => moveQuestion(i, 'up')}
                        disabled={i === 0}
                        className="text-graphite-500 hover:text-foreground disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveQuestion(i, 'down')}
                        disabled={i === questions.length - 1}
                        className="text-graphite-500 hover:text-foreground disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === q.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 rounded-lg border border-gold-500/50 bg-graphite-900 px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                            autoFocus
                          />
                          <button onClick={() => saveEdit(q.id)} className="text-emerald-400 hover:text-emerald-300">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-graphite-400 hover:text-foreground">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground">{q.text}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-graphite-700 text-graphite-300`}>
                          <TypeIcon className="w-2.5 h-2.5" />
                          {typeConfig[q.type].label}
                        </span>
                        {q.required && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-400/10 text-red-400">
                            必須
                          </span>
                        )}
                        {q.tags.map((tag) => {
                          const cfg = tagConfig[tag]
                          return (
                            <span
                              key={tag}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleRequired(q.id)}
                        className="p-1.5 rounded-lg text-graphite-400 hover:text-foreground hover:bg-graphite-700 transition-colors"
                        title={q.required ? '任意にする' : '必須にする'}
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => startEdit(q)}
                        className="p-1.5 rounded-lg text-graphite-400 hover:text-foreground hover:bg-graphite-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-graphite-400 hover:text-red-400 hover:bg-graphite-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add Form */}
            {showAddForm && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <h3 className="text-sm font-semibold text-foreground">新規質問追加</h3>
                <div>
                  <label className="block text-xs font-medium text-graphite-300 mb-1">質問テキスト</label>
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    placeholder="質問文を入力..."
                    className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground placeholder:text-graphite-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-graphite-300 mb-1">回答タイプ</label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                      className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-colors"
                    >
                      {(Object.keys(typeConfig) as QuestionType[]).map((t) => (
                        <option key={t} value={t}>{typeConfig[t].label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newQuestion.required}
                        onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                        className="w-4 h-4 rounded border-border bg-graphite-800 accent-gold-500"
                      />
                      <span className="text-sm text-graphite-300">必須項目</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-graphite-300 mb-2">タグ</label>
                  <div className="flex gap-2">
                    {(Object.keys(tagConfig) as QuestionTag[]).map((tag) => {
                      const cfg = tagConfig[tag]
                      const isSelected = newQuestion.tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                            isSelected
                              ? `${cfg.bg} ${cfg.color} border-current`
                              : 'bg-graphite-800 text-graphite-400 border-border hover:border-graphite-600'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addQuestion}
                    className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg bg-graphite-800 px-4 py-2 text-sm text-graphite-300 hover:bg-graphite-700 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="rounded-2xl border border-gold-500/30 bg-card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold-500" />
                プレビュー
              </h2>
              <p className="text-xs text-graphite-500 mb-4">
                {selectedChannel.name}
              </p>

              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-graphite-200 mb-1.5">
                      {q.text}
                      {q.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {q.type === 'text' && (
                      <div className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-graphite-600">
                        テキスト入力...
                      </div>
                    )}
                    {q.type === 'number' && (
                      <div className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-graphite-600">
                        0
                      </div>
                    )}
                    {q.type === 'select' && (
                      <div className="w-full rounded-lg border border-border bg-graphite-800 px-3 py-2.5 text-sm text-graphite-600">
                        {q.options ? q.options[0] : '選択してください'}
                      </div>
                    )}
                    {q.type === 'rating' && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-5 h-5 ${
                              n <= 3
                                ? 'text-gold-400 fill-gold-400'
                                : 'text-graphite-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <button className="w-full rounded-lg bg-gold-500 py-2.5 text-sm font-semibold text-graphite-950">
                  日報を送信
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
