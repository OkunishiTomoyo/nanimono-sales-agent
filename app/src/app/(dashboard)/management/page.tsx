"use client";

import {
  Users,
  FileText,
  TrendingUp,
  Brain,
  LayoutGrid,
  Lightbulb,
  BarChart3,
  ChevronUp,
  ArrowUpRight,
  UserCheck,
  BookOpen,
  Award,
} from "lucide-react";

const topStats = [
  {
    label: "総営業メンバー",
    value: "24",
    unit: "名",
    icon: Users,
    change: "+2",
  },
  {
    label: "今月の商談数",
    value: "156",
    unit: "件",
    icon: FileText,
    change: "+23",
  },
  {
    label: "全体成約率",
    value: "34.2",
    unit: "%",
    icon: TrendingUp,
    change: "+3.1%",
  },
  {
    label: "AI分析完了",
    value: "89",
    unit: "件",
    icon: Brain,
    change: "+15",
  },
];

const skillColumns = [
  "商品知識",
  "トーク力",
  "切り返し",
  "クロージング",
  "フォローアップ",
];

const members = [
  { name: "田中", scores: [4, 3, 3, 2, 4] },
  { name: "佐藤", scores: [5, 4, 4, 4, 3] },
  { name: "鈴木", scores: [2, 3, 2, 3, 4] },
  { name: "高橋", scores: [4, 5, 3, 4, 3] },
  { name: "渡辺", scores: [3, 4, 5, 5, 4] },
  { name: "伊藤", scores: [3, 2, 4, 3, 5] },
];

const recommendations = [
  {
    text: "田中さんには「価格交渉」の特訓ロープレを週2回実施を推奨",
    priority: "高",
    icon: UserCheck,
  },
  {
    text: "佐藤さんの成約率が先月比+15%。成功パターンを全体共有すべき",
    priority: "中",
    icon: ArrowUpRight,
  },
  {
    text: "鈴木さんは商品知識テストのスコアが低下傾向。再研修を検討",
    priority: "高",
    icon: BookOpen,
  },
  {
    text: "渡辺さんのクロージング力が組織トップ。メンター役に適任",
    priority: "低",
    icon: Award,
  },
];

const monthlyTrend = [
  { month: "10月", rate: 28.5 },
  { month: "11月", rate: 30.1 },
  { month: "12月", rate: 27.8 },
  { month: "1月", rate: 31.4 },
  { month: "2月", rate: 32.9 },
  { month: "3月", rate: 34.2 },
];

function getHeatmapStyle(score: number) {
  // Higher score = more gold, lower = more graphite
  if (score >= 5) return "bg-gold-500/80 text-graphite-950";
  if (score >= 4) return "bg-gold-500/50 text-foreground";
  if (score >= 3) return "bg-gold-500/20 text-graphite-200";
  if (score >= 2) return "bg-graphite-700 text-graphite-300";
  return "bg-graphite-800 text-graphite-500";
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "高":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "中":
      return "bg-gold-500/15 text-gold-500 border-gold-500/30";
    case "低":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    default:
      return "bg-graphite-700 text-graphite-400 border-graphite-600";
  }
}

export default function ManagementPage() {
  const maxRate = Math.max(...monthlyTrend.map((m) => m.rate));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <LayoutGrid size={28} className="text-accent" />
          Management
        </h2>
        <p className="mt-1 text-graphite-400">
          経営・マネジメント層向けの組織パフォーマンスダッシュボード
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat) => {
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
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-graphite-400">{stat.unit}</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <ChevronUp size={14} className="text-green-400" />
                <span className="text-sm text-green-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <LayoutGrid size={20} className="text-accent" />
          組織ヒートマップ
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-graphite-400 pb-3 pr-4 w-24">
                  メンバー
                </th>
                {skillColumns.map((col) => (
                  <th
                    key={col}
                    className="text-center text-sm font-medium text-graphite-400 pb-3 px-2"
                  >
                    {col}
                  </th>
                ))}
                <th className="text-center text-sm font-medium text-graphite-400 pb-3 pl-4 w-20">
                  平均
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const avg =
                  member.scores.reduce((a, b) => a + b, 0) /
                  member.scores.length;
                return (
                  <tr key={member.name} className="group">
                    <td className="py-1.5 pr-4">
                      <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {member.name}
                      </span>
                    </td>
                    {member.scores.map((score, idx) => (
                      <td key={idx} className="p-1.5">
                        <div
                          className={`text-center py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 ${getHeatmapStyle(score)}`}
                        >
                          {score}
                        </div>
                      </td>
                    ))}
                    <td className="py-1.5 pl-4">
                      <span className="text-sm font-semibold text-gold-500">
                        {avg.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-graphite-800 flex items-center gap-4 text-xs text-graphite-500">
          <span>スコア:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-graphite-800" />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-graphite-700" />
            <span>2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gold-500/20" />
            <span>3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gold-500/50" />
            <span>4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gold-500/80" />
            <span>5</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <Lightbulb size={20} className="text-accent" />
          AI推奨アクション
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div
                key={idx}
                className="bg-graphite-800/50 rounded-lg p-4 border border-graphite-700 hover:border-graphite-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded border ${getPriorityStyle(rec.priority)}`}
                      >
                        優先度: {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-graphite-200 leading-relaxed">
                      {rec.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
          <BarChart3 size={20} className="text-accent" />
          成約率推移（過去6ヶ月）
        </h3>
        <div className="flex items-end gap-3 h-52">
          {monthlyTrend.map((month, idx) => {
            const heightPercent = (month.rate / (maxRate + 5)) * 100;
            const isLatest = idx === monthlyTrend.length - 1;
            return (
              <div
                key={month.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <span
                  className={`text-xs font-semibold ${isLatest ? "text-gold-500" : "text-graphite-400"}`}
                >
                  {month.rate}%
                </span>
                <div className="w-full flex justify-center">
                  <div
                    className={`w-full max-w-12 rounded-t-md transition-all ${
                      isLatest
                        ? "bg-gold-500"
                        : "bg-graphite-600 hover:bg-graphite-500"
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      minHeight: "20px",
                    }}
                  />
                </div>
                <span
                  className={`text-xs ${isLatest ? "text-gold-500 font-medium" : "text-graphite-500"}`}
                >
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-graphite-800 flex items-center justify-between">
          <span className="text-sm text-graphite-500">
            6ヶ月間の成約率トレンド
          </span>
          <div className="flex items-center gap-1.5 text-green-400">
            <TrendingUp size={14} />
            <span className="text-sm font-medium">+5.7% 成長</span>
          </div>
        </div>
      </div>
    </div>
  );
}
