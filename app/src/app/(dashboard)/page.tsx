'use client'

import Link from "next/link";
import {
  MessageSquare,
  Target,
  Mic,
  BarChart3,
  BookOpen,
  Dna,
  CheckCircle2,
  Flame,
  Phone,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const featureCards = [
  {
    href: "/quick-faq",
    icon: MessageSquare,
    title: "Quick FAQ",
    description:
      "販路・商材を選択し、最新資料からAIが即座に回答。",
  },
  {
    href: "/smart-script",
    icon: Target,
    title: "Closing-AI",
    description:
      "録音分析から抽出された「今、刺さるフレーズ」を自動反映。Sales-DNAに基づき、自分の性格に合った言い回しに自動書き換え。",
  },
  {
    href: "/roleplay",
    icon: Mic,
    title: "Roleplay",
    description:
      "AI顧客との擬似商談。苦手な失注パターンを重点的に攻略。",
  },
  {
    href: "/lost-analysis",
    icon: BarChart3,
    title: "Lost-Analysis",
    description:
      "商談後の振り返り。受注要因（KSF）の共有、または失注要因（KFF）の上司への質問化。",
  },
  {
    href: "/daily-career",
    icon: BookOpen,
    title: "Daily-Career",
    description:
      "日報入力 ＋ AIによる深掘り対話。蓄積されたビジネススキルの可視化。",
  },
  {
    href: "/sales-dna",
    icon: Dna,
    title: "Sales-DNA",
    description:
      "16タイプ診断の実施と、顧客タイプ別の攻略ヒント閲覧。",
  },
];

const todayGoals = [
  { label: '成約目標', current: 2, target: 3, unit: '件' },
  { label: 'コール数', current: 45, target: 80, unit: '件' },
  { label: 'アポ取得', current: 3, target: 5, unit: '件' },
  { label: '訪問数', current: 4, target: 6, unit: '件' },
];

export default function DashboardPage() {
  const { user, tenant } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          おかえりなさい、{user?.name ?? ''}さん
        </h2>
        <p className="mt-1 text-graphite-400">
          {tenant?.name} - 今日もAIとともに、最高の営業成果を目指しましょう。
        </p>
      </div>

      {/* ===== 上半分：本日の目標と達成率 ===== */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Flame className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-foreground">本日の目標</h3>
          <span className="ml-auto text-xs text-graphite-400">
            {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {todayGoals.map((goal) => {
            const rate = Math.round((goal.current / goal.target) * 100);
            const achieved = goal.current >= goal.target;
            return (
              <div key={goal.label} className="rounded-xl bg-graphite-800 p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-graphite-400">{goal.label}</span>
                  {achieved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-2xl font-bold ${achieved ? 'text-emerald-400' : 'text-foreground'}`}>
                    {goal.current}
                  </span>
                  <span className="text-sm text-graphite-500">/ {goal.target}{goal.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-graphite-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      achieved ? 'bg-emerald-400' : rate >= 50 ? 'bg-gold-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(rate, 100)}%` }}
                  />
                </div>
                <p className={`mt-1.5 text-xs font-semibold ${
                  achieved ? 'text-emerald-400' : 'text-gold-500'
                }`}>
                  {rate}% 達成
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-gold-500" />
            <div>
              <p className="text-sm font-bold text-foreground">34.2%</p>
              <p className="text-[10px] text-graphite-400">今月成約率</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gold-500" />
            <div>
              <p className="text-sm font-bold text-foreground">1,284</p>
              <p className="text-[10px] text-graphite-400">今月総商談数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-gold-500" />
            <div>
              <p className="text-sm font-bold text-foreground">856</p>
              <p className="text-[10px] text-graphite-400">AI分析件数</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 下半分：機能一覧 ===== */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          機能一覧
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group bg-card rounded-xl p-6 border border-border hover:border-accent/40 hover:bg-card-hover transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    {card.title}
                  </h4>
                </div>
                <p className="text-sm text-graphite-400 leading-relaxed">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
