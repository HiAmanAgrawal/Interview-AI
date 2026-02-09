"use client";

import { InterviewThread, type InterviewConfig } from "@/components/tambo/interview-thread";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { InterviewProvider, useInterviewContext, AVAILABLE_TOPICS, type InterviewMode } from "@/contexts/interview-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl animate-blob" />
    <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-transparent blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
    <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
    
    <div 
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MODE CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const MODE_CONFIG: Record<InterviewMode, {
  title: string;
  description: string;
  color: string;
  icon: string;
  systemPrompt: string;
}> = {
  practice: {
    title: "Practice Mode",
    description: "Learn at your own pace with hints and explanations",
    color: "from-green-500 to-emerald-500",
    icon: "📚",
    systemPrompt: `You are a friendly AI tutor in PRACTICE MODE. 
Your goal is to help the user learn and improve.
- Start by greeting: "Hey! I'm your AI tutor. I'll help you practice [topics]. Let me know when you're ready to start!"
- Provide detailed explanations for wrong answers
- Give hints when the user struggles
- Offer encouragement and celebrate correct answers
- Focus more on weak topics to help improvement
- Provide insights about performance periodically`,
  },
  test: {
    title: "Test Mode",
    description: "Timed assessment without hints",
    color: "from-orange-500 to-red-500",
    icon: "📝",
    systemPrompt: `You are a strict examiner in TEST MODE.
- Start by greeting: "Welcome to your test. I'll assess your knowledge on [topics]. This is a timed test with no hints. Let me know when you're ready to begin!"
- Do NOT provide hints or explanations during the test
- Only acknowledge answers briefly
- Track and display remaining questions
- Mix difficulty levels
- At the end, provide a comprehensive score report`,
  },
  interview: {
    title: "Interview Mode",
    description: "Realistic technical interview simulation",
    color: "from-purple-500 to-pink-500",
    icon: "🎯",
    systemPrompt: `You are a professional technical interviewer in INTERVIEW MODE.
- Start by greeting: "Hello! I'm your AI interviewer today. I'll be conducting your technical interview covering [topics]. Before we begin, could you briefly introduce yourself and tell me about your experience?"
- Be professional but friendly
- Ask follow-up questions based on responses
- Challenge the candidate appropriately
- Cover all rounds systematically
- At the end, provide constructive feedback and overall assessment`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════

interface HeaderProps {
  mode: InterviewMode;
}

const Header = ({ mode }: HeaderProps) => {
  const { session, endSession } = useInterviewContext();
  const config = MODE_CONFIG[mode];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
              <span className="text-xl">{config.icon}</span>
            </div>
            <span className="text-xl font-bold text-white">{config.title}</span>
          </Link>
          
          {session && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
              <span className="text-white/40 text-sm">Topics:</span>
              <span className="text-white/80 text-sm">{session.selectedTopics.join(", ")}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {(["practice", "test", "interview"] as InterviewMode[]).map((m) => (
              <Link
                key={m}
                href={`/${m}`}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  m === mode
                    ? `bg-gradient-to-r ${MODE_CONFIG[m].color} text-white`
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {MODE_CONFIG[m].icon} {MODE_CONFIG[m].title.replace(" Mode", "")}
              </Link>
            ))}
          </nav>
          
          {/* Session Info */}
          {session && (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-4 px-3 py-1.5 bg-white/5 rounded-lg text-sm">
                <span className="text-white/60">
                  Score: <span className="text-white font-medium">{session.totalScore}</span>
                </span>
                <span className="text-white/60">
                  Q: <span className="text-white font-medium">{session.questionsAttempted}</span>
                </span>
              </div>
              <button
                onClick={endSession}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all"
              >
                End Session
              </button>
            </div>
          )}
          
          <Link 
            href="/"
            className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 hover:text-white transition-all"
          >
            ← Home
          </Link>
        </div>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW COMPLETION MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface CompletionModalProps {
  mode: InterviewMode;
  isOpen: boolean;
  onClose: () => void;
}

const CompletionModal = ({ mode, isOpen, onClose }: CompletionModalProps) => {
  const { session, endSession } = useInterviewContext();
  const router = useRouter();
  const config = MODE_CONFIG[mode];

  if (!isOpen || !session) return null;

  const scorePercent = session.maxPossibleScore > 0
    ? Math.round((session.totalScore / session.maxPossibleScore) * 100)
    : 0;

  const handleEndAndRedirect = (path: string) => {
    endSession();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header with gradient */}
        <div className={`p-6 bg-gradient-to-r ${config.color} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center">
            <div className="text-6xl mb-3">
              {scorePercent >= 80 ? "🏆" : scorePercent >= 60 ? "🎯" : scorePercent >= 40 ? "📚" : "💪"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === "interview" ? "Interview Complete!" : 
               mode === "test" ? "Test Complete!" : 
               "Practice Session Complete!"}
            </h2>
            <p className="text-white/80">Great job, {session.userName}!</p>
          </div>
        </div>
        
        {/* Score Section */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-purple-500/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{scorePercent}%</div>
                <div className="text-sm text-white/50">Score</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{session.questionsAttempted}</div>
              <div className="text-xs text-white/50">Questions</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-green-400">{session.questionsCorrect}</div>
              <div className="text-xs text-white/50">Correct</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{session.averageTimePerQuestion}s</div>
              <div className="text-xs text-white/50">Avg Time</div>
            </div>
          </div>
          
          {/* Topic Performance */}
          {Object.keys(session.topicScores).length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Topic Performance</h4>
              <div className="space-y-2">
                {Object.entries(session.topicScores).map(([topic, score]) => (
                  <div key={topic} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-sm text-white/80">{topic}</span>
                    <span className={`text-sm font-medium ${score.percentage >= 70 ? "text-green-400" : score.percentage >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                      {score.correct}/{score.total} ({score.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleEndAndRedirect("/")}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${config.color} text-white font-medium hover:opacity-90 transition-all`}
            >
              🏠 Back to Home
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleEndAndRedirect("/practice")}
                className="py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                📚 Practice More
              </button>
              <button
                onClick={() => handleEndAndRedirect("/test")}
                className="py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                📝 Take Test
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-2 text-sm text-white/50 hover:text-white/80 transition-all"
            >
              Continue Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SESSION SETUP
// ═══════════════════════════════════════════════════════════════════════════

interface SessionSetupProps {
  mode: InterviewMode;
}

const SessionSetup = ({ mode }: SessionSetupProps) => {
  const { startSession } = useInterviewContext();
  const [userName, setUserName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const config = MODE_CONFIG[mode];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleStart = () => {
    if (userName.trim() && selectedTopics.length > 0) {
      startSession({
        mode,
        userName: userName.trim(),
        topics: selectedTopics,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${config.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
            {config.icon}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-white/60">{config.description}</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-white/60 text-sm mb-2">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Topic Selection */}
          <div className="mb-8">
            <label className="block text-white/60 text-sm mb-3">Select Topics</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTopics.includes(topic)
                      ? `bg-gradient-to-r ${config.color} border-transparent text-white`
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm font-medium">{topic}</span>
                </button>
              ))}
            </div>
            {selectedTopics.length > 0 && (
              <p className="text-white/40 text-sm mt-3">
                Selected: {selectedTopics.join(", ")}
              </p>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!userName.trim() || selectedTopics.length === 0}
            className={`w-full py-4 rounded-xl bg-gradient-to-r ${config.color} text-white font-medium text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            Start {config.title.replace(" Mode", "")}
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Mode Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-start gap-3">
            <span className="text-xl">{config.icon}</span>
            <div>
              <h3 className="text-white font-medium mb-1">What to expect</h3>
              <ul className="text-sm text-white/50 space-y-1">
                {mode === "practice" && (
                  <>
                    <li>• AI tutor helps you learn with hints and explanations</li>
                    <li>• Focus on your weak areas for improvement</li>
                    <li>• No time pressure - learn at your own pace</li>
                  </>
                )}
                {mode === "test" && (
                  <>
                    <li>• Timed assessment without hints</li>
                    <li>• Covers all selected topics evenly</li>
                    <li>• Detailed score report at the end</li>
                  </>
                )}
                {mode === "interview" && (
                  <>
                    <li>• Realistic interview simulation</li>
                    <li>• Follow-up questions based on your answers</li>
                    <li>• Comprehensive feedback at the end</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg);
          }
          50% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(180deg);
          }
        }
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

interface SidebarProps {
  mode: InterviewMode;
}

const Sidebar = ({ mode }: SidebarProps) => {
  const { session, getTopicAnalysis } = useInterviewContext();
  const [, forceUpdate] = useState(0);
  const analysis = getTopicAnalysis();
  const config = MODE_CONFIG[mode];

  // Force update when quiz completes or scores change
  useEffect(() => {
    const handleScoreUpdate = () => {
      console.log("[Sidebar] Score update detected, forcing re-render");
      forceUpdate(n => n + 1);
    };
    
    window.addEventListener("quiz-complete", handleScoreUpdate);
    window.addEventListener("theory-score-recorded", handleScoreUpdate);
    
    return () => {
      window.removeEventListener("quiz-complete", handleScoreUpdate);
      window.removeEventListener("theory-score-recorded", handleScoreUpdate);
    };
  }, []);

  if (!session) return null;

  const scorePercent = session.maxPossibleScore > 0
    ? Math.round((session.totalScore / session.maxPossibleScore) * 100)
    : 0;

  // Key based on session data for forced re-render
  const sidebarKey = `${session.totalScore}-${session.questionsAttempted}-${session.averageTimePerQuestion}`;

  return (
    <div key={sidebarKey} className="hidden lg:block w-80 shrink-0 p-4 border-r border-white/10 overflow-y-auto">
      <div className="space-y-6">
        {/* Session Info */}
        <div className={`p-4 rounded-xl bg-gradient-to-r ${config.color.replace("from-", "from-").replace(" to-", "/20 to-")}/20 border border-white/10`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl`}>
              {session.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-medium">{session.userName}</div>
              <div className="text-xs text-white/50">{config.title}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg text-center transition-all duration-300">
              <div className="text-xl font-bold text-white">{session.totalScore}</div>
              <div className="text-xs text-white/50">Score</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center transition-all duration-300">
              <div className="text-xl font-bold text-white">{scorePercent}%</div>
              <div className="text-xs text-white/50">Accuracy</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center transition-all duration-300">
              <div className="text-xl font-bold text-white">{session.questionsAttempted}</div>
              <div className="text-xs text-white/50">Questions</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center transition-all duration-300">
              <div className="text-xl font-bold text-white">{session.averageTimePerQuestion}s</div>
              <div className="text-xs text-white/50">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Topics</h4>
          <div className="space-y-2">
            {session.selectedTopics.map((topic) => {
              const topicScore = session.topicScores[topic];
              const percent = topicScore ? topicScore.percentage : 0;
              const isStrong = analysis.strong.includes(topic);
              const isWeak = analysis.weak.includes(topic);
              
              return (
                <div key={topic} className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">{topic}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isStrong ? "bg-green-500/20 text-green-400" :
                      isWeak ? "bg-red-500/20 text-red-400" :
                      "bg-white/10 text-white/50"
                    }`}>
                      {topicScore ? `${topicScore.correct}/${topicScore.total}` : "0/0"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isStrong ? "bg-green-500" :
                        isWeak ? "bg-red-500" :
                        "bg-purple-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        {(analysis.strong.length > 0 || analysis.weak.length > 0) && (
          <div>
            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Insights</h4>
            <div className="space-y-2">
              {analysis.strong.length > 0 && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                    <span>💪</span>
                    <span className="font-medium">Strong Areas</span>
                  </div>
                  <p className="text-white/60 text-xs">{analysis.strong.join(", ")}</p>
                </div>
              )}
              {analysis.weak.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
                    <span>📈</span>
                    <span className="font-medium">Needs Improvement</span>
                  </div>
                  <p className="text-white/60 text-xs">{analysis.weak.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interview Rounds */}
        {mode === "interview" && session.rounds.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Interview Rounds</h4>
            <div className="space-y-2">
              {session.rounds.map((round, idx) => (
                <div 
                  key={round.id}
                  className={`p-3 rounded-xl border ${
                    round.status === "completed" 
                      ? "bg-green-500/10 border-green-500/30"
                      : round.status === "in_progress"
                      ? "bg-purple-500/10 border-purple-500/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">
                      Round {idx + 1}: {round.topic}
                    </span>
                    <span className={`text-xs ${
                      round.status === "completed" ? "text-green-400" :
                      round.status === "in_progress" ? "text-purple-400" :
                      "text-white/40"
                    }`}>
                      {round.status === "completed" && "✓"}
                      {round.status === "in_progress" && "●"}
                      {round.status === "pending" && "○"}
                    </span>
                  </div>
                  {round.status === "completed" && round.score !== undefined && (
                    <div className="text-xs text-white/50 mt-1">
                      Score: {round.score}/{round.maxScore}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {session.attempts.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {session.attempts.slice(-5).reverse().map((attempt) => (
                <div key={attempt.id} className="p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={attempt.isCorrect ? "text-green-400" : "text-red-400"}>
                      {attempt.isCorrect ? "✓" : "✗"}
                    </span>
                    <span className="text-xs text-white/60 truncate">{attempt.topic}</span>
                    <span className="text-xs text-white/40 ml-auto">{attempt.score}/{attempt.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT CONTENT
// ═══════════════════════════════════════════════════════════════════════════

interface LayoutContentProps {
  mode: InterviewMode;
}

const LayoutContent = ({ mode }: LayoutContentProps) => {
  const mcpServers = useMcpServers();
  const { session, getPracticeContext, getTestContext, getInterviewContext, recordQuizResults } = useInterviewContext();
  const config = MODE_CONFIG[mode];
  const [showCompletion, setShowCompletion] = useState(false);
  
  // Listen for interview-complete event
  useEffect(() => {
    const handleInterviewComplete = (event: CustomEvent) => {
      console.log("[LayoutContent] Interview complete event:", event.detail);
      setShowCompletion(true);
    };
    
    window.addEventListener("interview-complete", handleInterviewComplete as EventListener);
    return () => window.removeEventListener("interview-complete", handleInterviewComplete as EventListener);
  }, []);
  
  // Listen for quiz-complete events from MCQQuiz component
  useEffect(() => {
    const handleQuizComplete = (event: CustomEvent<{
      topic: string;
      totalQuestions: number;
      correctAnswers: number;
      wrongAnswers: number;
      percentage: number;
      difficulty: string;
      timeSpent?: number;
    }>) => {
      console.log("[InterviewLayout] Received quiz-complete event:", event.detail);
      recordQuizResults(event.detail);
    };
    
    // Listen for theory question scores
    const handleTheoryScore = (event: CustomEvent<{
      topic: string;
      score: number;
      maxScore: number;
      isCorrect: boolean;
      timeSpent?: number;
    }>) => {
      console.log("[InterviewLayout] Received theory-score-recorded event:", event.detail);
      recordQuizResults({
        topic: event.detail.topic,
        totalQuestions: 1,
        correctAnswers: event.detail.isCorrect ? 1 : 0,
        wrongAnswers: event.detail.isCorrect ? 0 : 1,
        percentage: (event.detail.score / event.detail.maxScore) * 100,
        difficulty: "medium",
        timeSpent: event.detail.timeSpent || 30, // Default 30s for theory questions
      });
    };
    
    // Handle match question completion for score tracking
    const handleMatchComplete = (event: CustomEvent<{
      topic: string;
      score: number;
      totalQuestions: number;
      percentage: number;
      isCorrect: boolean;
    }>) => {
      console.log("[InterviewLayout] Received match-complete event:", event.detail);
      recordQuizResults({
        topic: event.detail.topic,
        totalQuestions: event.detail.totalQuestions,
        correctAnswers: event.detail.score,
        wrongAnswers: event.detail.totalQuestions - event.detail.score,
        percentage: event.detail.percentage,
        difficulty: "medium",
        timeSpent: 60, // Default 60s for match questions
      });
    };
    
    // Handle code submission for score tracking (basic tracking)
    const handleCodeComplete = (event: CustomEvent<{
      title: string;
      language: string;
    }>) => {
      console.log("[InterviewLayout] Received code-submitted event:", event.detail);
      // For code submissions, we'll track as attempted (AI will provide actual score)
      recordQuizResults({
        topic: "Coding",
        totalQuestions: 1,
        correctAnswers: 0, // Will be updated when AI provides feedback
        wrongAnswers: 0,
        percentage: 0,
        difficulty: "medium",
        timeSpent: 120, // Default 2 min for coding
      });
    };
    
    window.addEventListener("quiz-complete", handleQuizComplete as EventListener);
    window.addEventListener("theory-score-recorded", handleTheoryScore as EventListener);
    window.addEventListener("match-complete", handleMatchComplete as EventListener);
    window.addEventListener("code-submitted", handleCodeComplete as EventListener);
    
    return () => {
      window.removeEventListener("quiz-complete", handleQuizComplete as EventListener);
      window.removeEventListener("theory-score-recorded", handleTheoryScore as EventListener);
      window.removeEventListener("match-complete", handleMatchComplete as EventListener);
      window.removeEventListener("code-submitted", handleCodeComplete as EventListener);
    };
  }, [recordQuizResults]);
  
  // Context helper that provides session info to AI
  const contextHelpers = useMemo(() => ({
    getSessionContext: () => {
      let context = "";
      switch (mode) {
        case "practice":
          context = getPracticeContext();
          break;
        case "test":
          context = getTestContext();
          break;
        case "interview":
          context = getInterviewContext();
          break;
        default:
          context = "No session context available.";
      }
      
      return context;
    },
    
    // AI BEHAVIOR RULES - called on every message
    getAIRules: () => {
      const topics = session?.selectedTopics.join(", ") || "General";
      const userName = session?.userName || "User";
      const questionsAttempted = session?.questionsAttempted || 0;
      
      return `
=== AI BEHAVIOR RULES (MUST FOLLOW) ===

FORMATTING RULES:
- NEVER use ### or ## headers in your responses
- NEVER use markdown headers - just use plain text or **bold** for emphasis
- Keep responses concise and conversational
- Use bullet points (•) sparingly

QUESTION RULES (MUST FOLLOW EXACTLY):
- You MUST complete EXACTLY 15 questions total
- Current progress: Question ${questionsAttempted + 1} of 15
- NEVER write questions as plain text - ALWAYS use a component (TheoryQuestion, MCQQuiz, CodeEditor, Whiteboard, MatchFollowing)
- If user says "I don't know" or "skip" - give 0/5 rating and move to NEXT question immediately
- NEVER repeat the same question - always move forward

QUESTION SEQUENCE (FOLLOW THIS ORDER):
Q1: MCQQuiz (5 MCQs on ${topics.split(",")[0] || topics})
Q2: TheoryQuestion
Q3: CodeEditor (coding problem)
Q4: TheoryQuestion
Q5: MCQQuiz (5 MCQs)
Q6: MatchFollowing (concept matching)
Q7: TheoryQuestion
Q8: CodeEditor (coding problem)
Q9: TheoryQuestion
Q10: MCQQuiz (5 MCQs)
Q11: Whiteboard or CodeEditor
Q12: TheoryQuestion
Q13: CodeEditor
Q14: TheoryQuestion
Q15: Call endInterview tool to show ScoreCard

MODE: ${mode.toUpperCase()}
USER: ${userName}
TOPICS: ${topics}

${mode === "practice" ? "Give hints when user struggles. Be encouraging and educational." : ""}
${mode === "test" ? "No hints allowed. Be formal and brief. Just acknowledge answers and move on." : ""}
${mode === "interview" ? "Be professional. Ask follow-ups on weak areas. Rate all theory answers 1-5." : ""}
`;
    },
    
    // GREETING TEMPLATE - for first message
    getGreetingTemplate: () => {
      if (session && session.questionsAttempted > 0) return null;
      
      const userName = session?.userName || "there";
      const topics = session?.selectedTopics.join(", ") || "various topics";
      
      if (mode === "practice") {
        return `Hey ${userName}! I'm your AI tutor today. I'll help you practice ${topics}.

You can type your answers or use the microphone button to dictate them.

Let's start with your first question!`;
      }
      
      if (mode === "test") {
        return `Welcome ${userName}! I'm your examiner for today's test on ${topics}.

This is a timed assessment - I won't provide hints, but I'll give detailed feedback at the end.

You can type or use the microphone to answer. Ready? Let's begin!`;
      }
      
      if (mode === "interview") {
        return `Hello ${userName}! I'm your AI interviewer. I'll be conducting your technical interview covering ${topics}.

You can type or use the microphone button to answer.

Before we start with technical questions, could you briefly introduce yourself?`;
      }
      
      return null;
    },
    getInterviewMode: () => mode,
    getUserName: () => session?.userName || "Anonymous",
    getSelectedTopics: () => session?.selectedTopics.join(", ") || "None",
    getCurrentScore: () => `${session?.totalScore || 0}/${session?.maxPossibleScore || 0}`,
    getStrongTopics: () => session?.strongTopics.join(", ") || "Not enough data yet",
    getWeakTopics: () => session?.weakTopics.join(", ") || "Not enough data yet",
    getQuestionsAttempted: () => session?.questionsAttempted || 0,
    getPerformanceSummary: () => {
      if (!session) return "No session data";
      const scorePercent = session.maxPossibleScore > 0 
        ? Math.round((session.totalScore / session.maxPossibleScore) * 100) 
        : 0;
      return `User: ${session.userName}
Mode: ${mode}
Questions Attempted: ${session.questionsAttempted}
Correct: ${session.questionsCorrect}
Score: ${session.totalScore}/${session.maxPossibleScore} (${scorePercent}%)
Strong Topics: ${session.strongTopics.join(", ") || "Not enough data"}
Weak Topics: ${session.weakTopics.join(", ") || "Not enough data"}
Topics Selected: ${session.selectedTopics.join(", ")}`;
    },
  }), [mode, session, getPracticeContext, getTestContext, getInterviewContext]);

  if (!session) {
    return <SessionSetup mode={mode} />;
  }

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      contextKey={session.id}
      contextHelpers={contextHelpers}
    >
      <div className="min-h-screen bg-gray-950">
        <AnimatedBackground />
        <Header mode={mode} />
        
        {/* Completion Modal */}
        <CompletionModal 
          mode={mode} 
          isOpen={showCompletion} 
          onClose={() => setShowCompletion(false)} 
        />
        
        <div className="relative z-10 flex h-screen pt-16">
          <Sidebar mode={mode} />
          
          <div className="flex-1 relative">
            <InterviewThread 
              className="h-full"
              config={{
                mode,
                userName: session.userName,
                topics: session.selectedTopics,
                questionLimits: {
                  mcq: 7,
                  theory: 5,
                  coding: 2,
                  total: 15,
                },
                enableFullscreen: mode === "interview",
              }}
              onQuestionCountUpdate={(count) => {
                // Auto-trigger completion when 15 questions are done
                if (count >= 15 && !showCompletion) {
                  setShowCompletion(true);
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg);
          }
          50% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(180deg);
          }
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        [class*="ThreadContainer"] {
          background: transparent !important;
        }
        
        [class*="MessageInput"] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </TamboProvider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

interface InterviewLayoutProps {
  mode: InterviewMode;
}

export default function InterviewLayout({ mode }: InterviewLayoutProps) {
  return (
    <InterviewProvider mode={mode}>
      <LayoutContent mode={mode} />
    </InterviewProvider>
  );
}
