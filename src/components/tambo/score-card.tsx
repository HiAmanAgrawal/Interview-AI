"use client";

import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const scoreCardSchema = z.object({
  title: z.string().describe("Title for the score card"),
  totalScore: z.number().describe("Total score achieved"),
  maxScore: z.number().describe("Maximum possible score"),
  quizzesTaken: z.number().describe("Number of quizzes taken"),
  topicBreakdown: z.array(
    z.object({
      topic: z.string().describe("Topic name"),
      score: z.number().describe("Score for this topic"),
      maxScore: z.number().describe("Max score for this topic"),
    })
  ).optional().describe("Breakdown of scores by topic"),
  rank: z.string().optional().describe("User rank or level"),
  message: z.string().optional().describe("Motivational or feedback message"),
});

export type ScoreCardProps = z.infer<typeof scoreCardSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ScoreCard = ({ 
  title, 
  totalScore, 
  maxScore, 
  quizzesTaken, 
  topicBreakdown,
  rank = "Learner",
  message 
}: ScoreCardProps) => {
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  const getRankEmoji = (rank: string) => {
    const ranks: Record<string, string> = {
      "Beginner": "🌱",
      "Learner": "📚",
      "Intermediate": "🎯",
      "Advanced": "⭐",
      "Expert": "🏆",
      "Master": "👑",
    };
    return ranks[rank] || "🎓";
  };
  
  const getPerformanceColor = (pct: number) => {
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-yellow-400";
    if (pct >= 40) return "text-orange-400";
    return "text-red-400";
  };
  
  const getGradient = (pct: number) => {
    if (pct >= 80) return "from-green-500 to-emerald-500";
    if (pct >= 60) return "from-yellow-500 to-amber-500";
    if (pct >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-500";
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
        {/* Header with rank */}
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{getRankEmoji(rank)}</span>
                <span className="text-white/60">{rank}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">{quizzesTaken}</div>
              <div className="text-xs text-white/50">Quizzes Taken</div>
            </div>
          </div>
        </div>
        
        {/* Main Score Circle */}
        <div className="p-8 flex flex-col items-center">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getPerformanceColor(percentage)}`}>
                {percentage}%
              </span>
              <span className="text-white/50 text-sm">Overall</span>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-white/70">
              <span className="text-2xl font-bold text-white">{totalScore}</span>
              <span className="text-white/50"> / {maxScore} points</span>
            </div>
          </div>
        </div>
        
        {/* Topic Breakdown */}
        {topicBreakdown && topicBreakdown.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-white/50 mb-4">Topic Breakdown</h3>
            <div className="space-y-3">
              {topicBreakdown.map((topic, idx) => {
                const topicPct = Math.round((topic.score / topic.maxScore) * 100);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/80 text-sm">{topic.topic}</span>
                      <span className={`text-sm font-medium ${getPerformanceColor(topicPct)}`}>
                        {topicPct}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getGradient(topicPct)} transition-all duration-500`}
                        style={{ width: `${topicPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Message */}
        {message && (
          <div className="px-6 pb-6">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">💬</span>
                <p className="text-white/70 text-sm">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 border-t border-white/10">
          {[
            { label: "Accuracy", value: `${percentage}%`, icon: "🎯" },
            { label: "Correct", value: totalScore.toString(), icon: "✅" },
            { label: "Wrong", value: (maxScore - totalScore).toString(), icon: "❌" },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className={`p-4 text-center ${idx < 2 ? "border-r border-white/10" : ""}`}
            >
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
