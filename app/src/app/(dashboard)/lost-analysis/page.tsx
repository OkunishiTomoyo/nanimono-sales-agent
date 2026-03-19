"use client";

import { useState } from "react";
import {
  Upload,
  Play,
  BarChart3,
  AlertTriangle,
  Clock,
  Target,
  MessageSquare,
  TrendingDown,
  Lightbulb,
  PieChart,
  AlertCircle,
} from "lucide-react";

const analysisMetrics = [
  { label: "自信度", value: 78, tier: "high" },
  { label: "説明充足度", value: 56, tier: "mid" },
  { label: "切り返し力", value: 87, tier: "high" },
  { label: "間の取り方", value: 62, tier: "mid" },
  { label: "クロージング力", value: 45, tier: "low" },
] as const;

const timelineEvents = [
  { time: "0:30", label: "製品説明開始", icon: MessageSquare },
  { time: "2:15", label: "顧客の質問 (価格について)", icon: AlertTriangle },
  { time: "3:40", label: "反論発生", icon: TrendingDown },
  { time: "5:20", label: "クロージング試行", icon: Target },
  { time: "6:00", label: "失注", icon: AlertCircle },
];

const lostReasons = [
  { label: "価格", value: 35, color: "bg-gold-500" },
  { label: "競合", value: 25, color: "bg-gold-400" },
  { label: "タイミング", value: 20, color: "bg-graphite-400" },
  { label: "ニーズ不一致", value: 15, color: "bg-graphite-500" },
  { label: "その他", value: 5, color: "bg-graphite-600" },
];

function getBarColor(tier: string) {
  switch (tier) {
    case "high":
      return "bg-gold-500";
    case "mid":
      return "bg-graphite-400";
    case "low":
      return "bg-red-500/80";
    default:
      return "bg-graphite-500";
  }
}

function getBarTrack(tier: string) {
  switch (tier) {
    case "high":
      return "bg-gold-500/15";
    case "mid":
      return "bg-graphite-400/15";
    case "low":
      return "bg-red-500/10";
    default:
      return "bg-graphite-700";
  }
}

export default function LostAnalysisPage() {
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTestAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 size={28} className="text-accent" />
          Lost-Analysis
        </h2>
        <p className="mt-1 text-graphite-400">
          録音データをAIが分析し、失注原因と改善ポイントを特定します。
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Upload Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              録音ファイルのアップロード
            </h3>
            <div className="border-2 border-dashed border-graphite-600 rounded-xl p-10 text-center hover:border-accent/40 transition-colors cursor-pointer group">
              <Upload
                size={40}
                className="mx-auto text-graphite-500 group-hover:text-accent transition-colors"
              />
              <p className="mt-4 text-graphite-300 text-sm">
                ドラッグ&ドロップで録音ファイルをアップロード
              </p>
              <p className="mt-1 text-graphite-500 text-xs">
                対応形式: MP3, WAV, M4A (最大100MB)
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-graphite-950 font-medium rounded-lg transition-colors text-sm">
                <Upload size={16} />
                録音をアップロード
              </button>
              <button
                onClick={handleTestAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-5 py-2.5 bg-graphite-700 hover:bg-graphite-600 text-foreground font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <Play size={16} />
                {isAnalyzing ? "分析中..." : "テスト分析を実行"}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <div className="inline-block w-10 h-10 border-3 border-graphite-600 border-t-accent rounded-full animate-spin" />
              <p className="mt-4 text-graphite-300">
                AIが録音データを分析しています...
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {showResults && (
            <>
              {/* Voice Analysis Bars */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <BarChart3 size={20} className="text-accent" />
                  音声分析結果
                </h3>
                <div className="space-y-4">
                  {analysisMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-graphite-300">
                          {metric.label}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            metric.tier === "low"
                              ? "text-red-400"
                              : metric.tier === "high"
                                ? "text-gold-500"
                                : "text-graphite-300"
                          }`}
                        >
                          {metric.value}%
                        </span>
                      </div>
                      <div
                        className={`h-3 rounded-full ${getBarTrack(metric.tier)} overflow-hidden`}
                      >
                        <div
                          className={`h-full rounded-full ${getBarColor(metric.tier)} transition-all duration-1000 ease-out`}
                          style={{
                            width: `${metric.value}%`,
                            animation: "barGrow 1s ease-out forwards",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Clock size={20} className="text-accent" />
                  会話タイムライン
                </h3>
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-graphite-700" />
                  <div className="flex justify-between relative">
                    {timelineEvents.map((event, idx) => {
                      const Icon = event.icon;
                      const isLast = idx === timelineEvents.length - 1;
                      return (
                        <div
                          key={event.time}
                          className="flex flex-col items-center text-center group"
                          style={{ flex: 1 }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                              isLast
                                ? "bg-red-500/20 border-red-500/50 text-red-400"
                                : idx === 0
                                  ? "bg-gold-500/20 border-gold-500/50 text-gold-500"
                                  : "bg-graphite-700 border-graphite-600 text-graphite-300 group-hover:border-accent/50"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="mt-2 text-xs font-mono text-accent">
                            {event.time}
                          </span>
                          <span className="mt-1 text-xs text-graphite-400 max-w-[100px] leading-tight">
                            {event.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Loss Cause Analysis */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <TrendingDown size={20} className="text-accent" />
                  失注原因分析
                </h3>
                <div className="space-y-4">
                  <div className="bg-graphite-800/50 rounded-lg p-4 border border-graphite-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                        主要因
                      </span>
                    </div>
                    <p className="text-foreground font-medium">
                      価格に対する価値提示が不十分
                    </p>
                  </div>
                  <div className="bg-graphite-800/50 rounded-lg p-4 border border-graphite-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-gold-500/20 text-gold-500">
                        副要因
                      </span>
                    </div>
                    <p className="text-foreground font-medium">
                      競合比較への準備不足
                    </p>
                  </div>
                  <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className="text-gold-500" />
                      <span className="text-sm font-semibold text-gold-500">
                        AI推奨アクション
                      </span>
                    </div>
                    <p className="text-graphite-200 text-sm leading-relaxed">
                      具体的なROI計算を事前に準備し、導入後3ヶ月の効果予測を提示してください。
                      価格に対する懸念が出た際には、コスト削減の実績データを即座に提示できるよう準備しましょう。
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Organization Stats */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <PieChart size={18} className="text-accent" />
              組織全体の失注統計
            </h3>

            {/* CSS Pie Chart */}
            <div className="flex justify-center mb-6">
              <div
                className="w-44 h-44 rounded-full relative"
                style={{
                  background: `conic-gradient(
                    #c8a96e 0% 35%,
                    #d4ba85 35% 60%,
                    #787878 60% 80%,
                    #5c5c5c 80% 95%,
                    #4a4a4a 95% 100%
                  )`,
                }}
              >
                <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">247</p>
                    <p className="text-xs text-graphite-400">総失注数</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5">
              {lostReasons.map((reason) => (
                <div
                  key={reason.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-sm ${reason.color}`}
                    />
                    <span className="text-sm text-graphite-300">
                      {reason.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {reason.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Box */}
          <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-400 mt-0.5 shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">
                  組織課題
                </p>
                <p className="text-sm text-graphite-300 leading-relaxed">
                  価格訴求力の強化が必要です。過去3ヶ月で価格が主要因の失注が全体の35%を占めています。
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h4 className="text-sm font-semibold text-graphite-400">
              今月の分析サマリー
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-graphite-400">分析済み商談</span>
              <span className="text-sm font-medium text-foreground">89件</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-graphite-400">平均スコア</span>
              <span className="text-sm font-medium text-gold-500">68.4点</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-graphite-400">改善率</span>
              <span className="text-sm font-medium text-green-400">+12.3%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes barGrow {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
