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
} from "lucide-react";

const featureCards = [
  {
    href: "/quick-faq",
    icon: MessageSquare,
    title: "Quick-FAQ",
    description:
      "顧客からのよくある質問にAIが即座に最適な回答を生成。商談中のレスポンスを劇的に向上させます。",
  },
  {
    href: "/closing-ai",
    icon: Target,
    title: "Closing-AI",
    description:
      "商談データを分析し、最適なクロージング戦略を提案。成約率向上をAIがサポートします。",
  },
  {
    href: "/daily-insight",
    icon: BookOpen,
    title: "Daily-Insight",
    description:
      "市場動向・競合情報・業界ニュースをAIが毎日分析。営業活動に必要なインサイトを提供します。",
  },
  {
    href: "/roleplay",
    icon: Users,
    title: "Roleplay",
    description:
      "AIが顧客役となり商談シミュレーションを実施。実践的なトレーニングでスキルを磨きます。",
  },
  {
    href: "/lost-analysis",
    icon: BarChart3,
    title: "Lost-Analysis",
    description:
      "失注案件をAIが徹底分析。パターンを特定し、次の商談での改善ポイントを明確にします。",
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
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          おかえりなさい
        </h2>
        <p className="mt-1 text-graphite-400">
          今日もAIとともに、最高の営業成果を目指しましょう。
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
