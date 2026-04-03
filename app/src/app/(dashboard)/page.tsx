'use client'

import Link from "next/link";
import {
  MessageSquare,
  Target,
  Mic,
  BarChart3,
  BookOpen,
  TrendingUp,
  Brain,
  Database,
  Handshake,
  Dna,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const featureCards = [
  {
    href: "/quick-faq",
    icon: MessageSquare,
    title: "Quick FAQ",
    description:
      "資料を読み解く手間を省き、販路・商材別にAIが即座に「正しい答え」を提示。",
  },
  {
    href: "/smart-script",
    icon: Target,
    title: "Smart Script",
    description:
      "録音分析から「今、最も刺さるフレーズ」を自動反映。Sales-DNAで自分仕様に自動書き換え。",
  },
  {
    href: "/roleplay",
    icon: Mic,
    title: "Roleplay",
    description:
      "失注パターンを学習したAI顧客との擬似商談。苦手な顧客タイプを重点的に攻略。",
  },
  {
    href: "/lost-analysis",
    icon: BarChart3,
    title: "Lost-Analysis",
    description:
      "商談後の振り返り。受注要因（KSF）の共有ナレッジ化、失注要因（KFF）の上司質問化。",
  },
  {
    href: "/daily-career",
    icon: BookOpen,
    title: "Daily-Career",
    description:
      "日報入力 + AIコーチング。蓄積されたビジネススキルを就活ポートフォリオとして可視化。",
  },
  {
    href: "/sales-dna",
    icon: Dna,
    title: "Sales-DNA",
    description:
      "16タイプ診断で営業スタイルを分析。顧客タイプ別の攻略法と相性を可視化。",
  },
];

const stats = [
  {
    label: "総商談数",
    value: "1,284",
    change: "+12.5%",
    icon: Handshake,
  },
  {
    label: "成約率",
    value: "34.2%",
    change: "+3.1%",
    icon: TrendingUp,
  },
  {
    label: "AI分析件数",
    value: "856",
    change: "+28.4%",
    icon: Brain,
  },
  {
    label: "ナレッジ件数",
    value: "2,431",
    change: "+156",
    icon: Database,
  },
];

export default function DashboardPage() {
  const { user, tenant } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          おかえりなさい、{user?.name ?? ''}さん
        </h2>
        <p className="mt-1 text-graphite-400">
          {tenant?.name} - 今日もAIとともに、最高の営業成果を目指しましょう。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-5 border border-border hover:border-graphite-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-graphite-400">{stat.label}</span>
                <Icon size={18} className="text-accent" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gold-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Feature cards */}
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
