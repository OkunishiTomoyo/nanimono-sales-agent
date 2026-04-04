'use client'

import { useState } from 'react'
import { Calculator, DollarSign, Award, BarChart3, Edit3, Plus, CheckCircle2 } from 'lucide-react'

interface RewardTier { id: string; name: string; threshold: string; multiplier: string; color: string }
interface SkillCriteria { id: string; name: string; weight: number; description: string }

const MOCK_TIERS: RewardTier[] = [
  { id: 't1', name: 'ブロンズ', threshold: '目標達成率 80%〜99%', multiplier: '×1.0', color: 'text-amber-600' },
  { id: 't2', name: 'シルバー', threshold: '目標達成率 100%〜119%', multiplier: '×1.2', color: 'text-graphite-300' },
  { id: 't3', name: 'ゴールド', threshold: '目標達成率 120%〜149%', multiplier: '×1.5', color: 'text-gold-500' },
  { id: 't4', name: 'プラチナ', threshold: '目標達成率 150%以上', multiplier: '×2.0', color: 'text-purple-400' },
]

const MOCK_SKILL_CRITERIA: SkillCriteria[] = [
  { id: 's1', name: 'ヒアリング力', weight: 25, description: '顧客課題の深掘り、潜在ニーズの引き出し' },
  { id: 's2', name: '提案力', weight: 25, description: 'ソリューション提案の質、ROI提示の具体性' },
  { id: 's3', name: 'クロージング力', weight: 20, description: '契約締結への導き、反論処理の適切さ' },
  { id: 's4', name: '活動量', weight: 15, description: 'コール数、訪問数、商談数の量' },
  { id: 's5', name: 'チーム貢献', weight: 15, description: 'ナレッジ共有、後輩指導、勉強会参加' },
]

const REWARD_FORMULA = '基本インセンティブ × ティア倍率 × (スキルスコア / 100)'

export default function InputEvaluationPage() {
  const [activeTab, setActiveTab] = useState<'reward' | 'skill'>('reward')

  return (
    <div className="min-h-0 h-[calc(100vh-64px)] overflow-y-auto bg-background p-4 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
            <Calculator className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">評価ロジック</h1>
            <p className="text-sm text-muted">報酬計算式・ティア制度・スキル評価基準をAIに学習させる</p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 rounded-xl bg-graphite-800 p-1 w-fit mb-6">
        <button onClick={() => setActiveTab('reward')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'reward' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'}`}>
          <DollarSign className="w-4 h-4" /> 報酬・ティア制度
        </button>
        <button onClick={() => setActiveTab('skill')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'skill' ? 'bg-gold-500 text-graphite-950' : 'text-graphite-300 hover:text-foreground'}`}>
          <Award className="w-4 h-4" /> スキル評価基準
        </button>
      </div>

      {activeTab === 'reward' ? (
        <div className="space-y-6">
          {/* Formula */}
          <div className="rounded-2xl border border-gold-500/30 bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-gold-500" /> 報酬計算式
            </h2>
            <div className="rounded-xl bg-graphite-800 p-4 border border-border">
              <code className="text-sm text-gold-400 font-mono">{REWARD_FORMULA}</code>
            </div>
            <button className="mt-3 flex items-center gap-2 text-xs text-gold-500 hover:text-gold-400 transition-colors">
              <Edit3 className="w-3 h-3" /> 計算式を編集
            </button>
          </div>

          {/* Tiers */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-500" /> ティア制度
              </h2>
              <button className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400"><Plus className="w-3 h-3" /> ティア追加</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_TIERS.map((tier) => (
                <div key={tier.id} className="rounded-xl bg-graphite-800 p-5 border border-border text-center hover:border-gold-500/30 transition-colors">
                  <p className={`text-lg font-bold ${tier.color} mb-1`}>{tier.name}</p>
                  <p className="text-xs text-graphite-400 mb-3">{tier.threshold}</p>
                  <p className="text-2xl font-bold text-foreground">{tier.multiplier}</p>
                  <p className="text-[10px] text-graphite-500 mt-1">インセンティブ倍率</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-graphite-950 hover:bg-gold-400 transition-colors">
              <Plus className="w-4 h-4" /> 評価基準を追加
            </button>
          </div>
          {MOCK_SKILL_CRITERIA.map((criteria, i) => (
            <div key={criteria.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500/10 shrink-0">
                    <BarChart3 className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{criteria.name}</h3>
                    <p className="text-sm text-graphite-300">{criteria.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gold-500">{criteria.weight}%</p>
                  <p className="text-[10px] text-graphite-400">配点</p>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-graphite-700 overflow-hidden">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${criteria.weight}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <p className="text-xs text-muted">評価ロジックを更新すると、AIの分析・レポートに自動反映されます。</p>
      </div>
    </div>
  )
}
