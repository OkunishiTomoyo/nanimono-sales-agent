'use client'

import { useState } from 'react'
import { Scale, Trophy, XCircle, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react'

interface Factor { id: string; label: string; description: string; weight: number }

const MOCK_KSF: Factor[] = [
  { id: 'k1', label: '初回ヒアリングの質', description: '顧客の潜在課題を引き出すヒアリング力', weight: 30 },
  { id: 'k2', label: 'ROI提示の具体性', description: '数値ベースの投資対効果シミュレーション', weight: 25 },
  { id: 'k3', label: '競合差別化', description: '他社製品との明確な差別化ポイント提示', weight: 20 },
  { id: 'k4', label: '導入事例の活用', description: '同業種の成功事例による信頼構築', weight: 15 },
  { id: 'k5', label: 'フォロー速度', description: '商談後72時間以内のフォローアップ', weight: 10 },
]

const MOCK_KFF: Factor[] = [
  { id: 'f1', label: '予算確認漏れ', description: '初期段階での予算感ヒアリング不足', weight: 35 },
  { id: 'f2', label: '決裁者未特定', description: 'キーマンへのアプローチが遅れる', weight: 25 },
  { id: 'f3', label: '提案カスタマイズ不足', description: '汎用的な提案書で差別化できない', weight: 20 },
  { id: 'f4', label: '競合対策の遅れ', description: '競合情報の収集・対策が後手に回る', weight: 15 },
  { id: 'f5', label: 'フォロー不足', description: '検討中顧客への継続フォロー漏れ', weight: 5 },
]

export default function InputWinLossPage() {
  const [activeTab, setActiveTab] = useState<'ksf' | 'kff'>('ksf')

  const factors = activeTab === 'ksf' ? MOCK_KSF : MOCK_KFF

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Scale className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">勝敗ロジック</h1>
            <p className="text-sm text-muted">受注要因（KSF）・失注要因（KFF）の定義をAIに学習させる</p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 rounded-xl bg-graphite-800 p-1 w-fit mb-6">
        <button onClick={() => setActiveTab('ksf')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'ksf' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'}`}>
          <Trophy className="w-4 h-4" /> KSF（受注要因）
        </button>
        <button onClick={() => setActiveTab('kff')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'kff' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'}`}>
          <XCircle className="w-4 h-4" /> KFF（失注要因）
        </button>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
          <Plus className="w-4 h-4" /> 要因を追加
        </button>
      </div>

      {/* Factor Cards */}
      <div className="space-y-4">
        {factors.map((factor, i) => (
          <div key={factor.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${activeTab === 'ksf' ? 'bg-emerald-400/10' : 'bg-red-500/10'}`}>
                  <span className={`text-sm font-bold ${activeTab === 'ksf' ? 'text-emerald-400' : 'text-red-400'}`}>#{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">{factor.label}</h3>
                  <p className="text-sm text-graphite-300">{factor.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-xl font-bold text-gold-500">{factor.weight}%</p>
                  <p className="text-[10px] text-graphite-400">重み付け</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button className="p-1.5 rounded-md text-graphite-400 hover:text-gold-500 hover:bg-graphite-800 transition-colors"><Edit3 size={14} /></button>
                  <button className="p-1.5 rounded-md text-graphite-400 hover:text-red-400 hover:bg-graphite-800 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
            {/* Weight Bar */}
            <div className="mt-3 h-2 rounded-full bg-graphite-700 overflow-hidden">
              <div className={`h-full rounded-full ${activeTab === 'ksf' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${factor.weight}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <p className="text-xs text-muted">定義を更新すると、AIの分析ロジックに自動反映されます。</p>
      </div>
    </div>
  )
}
