'use client'

import Link from "next/link";
import {
  MessageSquare,
  Target,
  BookOpen,
  Users,
  BarChart3,
  TrendingUp,
  Brain,
  Database,
  Handshake,
  Dna,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const featureCards = [
  {
    href: "/quick-faq",
    icon: MessageSquare,
    title: "Quick-FAQ",
    description:
      "商材・販路別にデータを完全分離。顧客からの質問にAIが即座に最適な回答を生成します。",
  },
  {
    href: "/daily-insight",
    icon: BookOpen,
    title: "Daily-Insight",
    description:
      "販路ごとに異なる入力項目で日報を作成。AIが「なぜ成功/失敗した？」と能動的に深掘りします。",
  },
  {
    href: "/sales-analysis",
    icon: BarChart3,
    title: "Sales-Analysis",
    description:
      "受注時はKSF分析で成功要因を共有ナレッジに変換。失注時はKFF分析で上司への質問データを整形。",
  },
  {
    href: "/closing-ai",
    icon: Target,
    title: "Closing-AI",
    description:
      "販路・商材別に特化したスクリプトを生成。録音から抽出した最新フレーズを自動反映します。",
  },
  {
    href: "/roleplay",
    icon: Users,
    title: "Roleplay",
    description:
      "AIと音声対話型のロープレ。Sales-DNAに基づき苦手な顧客タイプを重点的に練習できます。",
  },
  {
    href: "/daily-career",
    icon: Briefcase,
    title: "Daily-Career",
    description:
      "日報の業務を「課題解決力」「分析力」等のビジネススキルに変換。就活用ポートフォリオとして蓄積。",
  },
  {
    href: "/sales-dna",
    icon: Dna,
    title: "Sales-DNA",
    description:
      "16タイプ（MBTIベース）の営業タイプ診断。顧客タイプとの相性分析で個別攻略法を提示します。",
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
