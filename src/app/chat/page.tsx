"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { SessionProvider, useSession } from "@/contexts/session-context";
import Link from "next/link";
import { useState } from "react";

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
// HEADER WITH SESSION
// ═══════════════════════════════════════════════════════════════════════════

const Header = () => {
  const { session, logout, createQuickSession } = useSession();
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [quickName, setQuickName] = useState("");

  const handleQuickLogin = () => {
    if (quickName.trim()) {
      createQuickSession(quickName.trim());
      setShowQuickLogin(false);
      setQuickName("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-xl">🎯</span>
          </div>
          <span className="text-xl font-bold text-white">InterviewAI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Feature badges */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {[
              { label: "MCQ", emoji: "📝", color: "from-blue-500/20 to-cyan-500/20" },
              { label: "Code", emoji: "💻", color: "from-purple-500/20 to-pink-500/20" },
              { label: "Match", emoji: "🔗", color: "from-indigo-500/20 to-purple-500/20" },
              { label: "Design", emoji: "🏗️", color: "from-pink-500/20 to-rose-500/20" },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${item.color} border border-white/10 text-white/70 text-xs flex items-center gap-1`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          {/* Session Status */}
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">{session.name}</span>
                {session.isTemp && (
                  <span className="text-xs text-green-400/60">(temp)</span>
                )}
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/40">
                <span>🏆 {session.totalScore}</span>
                <span>📝 {session.quizzesCompleted}</span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowQuickLogin(!showQuickLogin)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-all"
              >
                ⚡ Quick Login
              </button>
              
              {/* Quick Login Dropdown */}
              {showQuickLogin && (
                <div className="absolute right-0 top-12 w-72 p-4 bg-gray-900 border border-white/10 rounded-xl shadow-2xl">
                  <p className="text-white/60 text-sm mb-3">Enter your name to start tracking progress:</p>
                  <input
                    type="text"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 mb-3"
                    onKeyDown={(e) => e.key === "Enter" && handleQuickLogin()}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleQuickLogin}
                      disabled={!quickName.trim()}
                      className="flex-1 px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-all disabled:opacity-50"
                    >
                      Start Session
                    </button>
                    <button
                      onClick={() => setShowQuickLogin(false)}
                      className="px-3 py-2 bg-white/10 text-white/70 text-sm rounded-lg hover:bg-white/20 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <Link
                      href="/login"
                      className="block text-center text-sm text-white/50 hover:text-white transition-colors"
                    >
                      Or sign in with Google →
                    </Link>
                  </div>
                </div>
              )}
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
// QUICK PROMPTS SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

const QuickPrompts = () => {
  const { session } = useSession();
  
  const setPrompt = (prompt: string) => {
    const input = document.querySelector('textarea');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, prompt);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  };

  return (
    <div className="hidden lg:block w-80 shrink-0 p-4 border-r border-white/10 overflow-y-auto">
      <div className="space-y-6">
        {/* Session Status */}
        {session && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-lg font-bold text-white">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-white font-medium">{session.name}</div>
                <div className="text-xs text-green-400">Session Active</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-white">{session.totalScore}</div>
                <div className="text-xs text-white/50">Score</div>
              </div>
              <div className="p-2 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-white">{session.quizzesCompleted}</div>
                <div className="text-xs text-white/50">Quizzes</div>
              </div>
              <div className="p-2 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-white">{session.codingChallengesCompleted}</div>
                <div className="text-xs text-white/50">Code</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Quick Prompts</h3>
          <p className="text-xs text-white/50">Click to try these features</p>
        </div>
        
        {/* MCQ Quizzes */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">MCQ Quizzes</h4>
          <div className="space-y-2">
            {[
              { prompt: "Give me a DBMS quiz", icon: "🗄️", color: "from-blue-500/20 to-cyan-500/20" },
              { prompt: "Start a React quiz", icon: "⚛️", color: "from-cyan-500/20 to-blue-500/20" },
              { prompt: "DSA practice questions", icon: "🧮", color: "from-green-500/20 to-emerald-500/20" },
              { prompt: "JavaScript MCQs", icon: "📜", color: "from-yellow-500/20 to-orange-500/20" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(item.prompt)}
                className={`w-full p-3 rounded-xl bg-gradient-to-r ${item.color} border border-white/10 text-left hover:border-white/30 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-sm text-white/80">{item.prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Coding Challenges */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Coding Challenges</h4>
          <div className="space-y-2">
            {[
              { prompt: "Give me a DSA coding challenge", icon: "💻", desc: "Data Structures" },
              { prompt: "JavaScript coding problem", icon: "📜", desc: "JS Algorithms" },
              { prompt: "Python coding challenge", icon: "🐍", desc: "Python Basics" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(item.prompt)}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-left hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <div className="text-sm text-white/80">{item.prompt}</div>
                    <div className="text-xs text-white/40">{item.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Match the Following */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Match the Following</h4>
          <div className="space-y-2">
            {[
              { prompt: "Give me a matching quiz on DSA", icon: "🔗", color: "from-indigo-500/20 to-purple-500/20" },
              { prompt: "SQL matching question", icon: "🗄️", color: "from-blue-500/20 to-indigo-500/20" },
              { prompt: "JavaScript concepts matching", icon: "📜", color: "from-yellow-500/20 to-orange-500/20" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(item.prompt)}
                className={`w-full p-3 rounded-xl bg-gradient-to-r ${item.color} border border-white/10 text-left hover:border-white/30 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-sm text-white/80">{item.prompt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* System Design */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">System Design</h4>
          <button
            onClick={() => setPrompt("Give me a system design whiteboard question")}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-left hover:border-pink-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">🏗️</span>
              <div>
                <div className="text-sm font-medium text-white">Whiteboard Challenge</div>
                <div className="text-xs text-white/50">Practice system design</div>
              </div>
            </div>
          </button>
        </div>

        {/* Timer */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Interview Timer</h4>
          <div className="space-y-2">
            <button
              onClick={() => setPrompt("Start a 5 minute interview timer")}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-left hover:border-green-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">⏱️</span>
                <div>
                  <div className="text-sm text-white/80">5 Minute Timer</div>
                  <div className="text-xs text-white/40">Quick practice</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setPrompt("Start a 30 minute interview timer")}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-left hover:border-orange-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">🔥</span>
                <div>
                  <div className="text-sm text-white/80">30 Minute Timer</div>
                  <div className="text-xs text-white/40">Full interview simulation</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Score Section */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Track Progress</h4>
          <button
            onClick={() => setPrompt("What is my score?")}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-left hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
              <div>
                <div className="text-sm font-medium text-white">View My Score</div>
                <div className="text-xs text-white/50">Check your progress</div>
              </div>
            </div>
          </button>
        </div>

        {/* Review My Work */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Get AI Feedback</h4>
          <div className="space-y-2">
            <button
              onClick={() => setPrompt("Please review my submitted code and give feedback")}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-left hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">🔍</span>
                <div>
                  <div className="text-sm text-white/80">Review My Code</div>
                  <div className="text-xs text-white/40">Get feedback on submissions</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setPrompt("Please review my system design and give feedback")}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-left hover:border-pink-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:scale-110 transition-transform">🏗️</span>
                <div>
                  <div className="text-sm text-white/80">Review My Design</div>
                  <div className="text-xs text-white/40">Get architecture feedback</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Available Topics */}
        <div>
          <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">All Topics</h4>
          <button
            onClick={() => setPrompt("What topics are available?")}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📚</span>
              <span className="text-sm text-white/60">Browse all topics</span>
            </div>
          </button>
        </div>
        
        {/* Tips */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <div className="text-sm font-medium text-white mb-1">Pro Tips</div>
              <ul className="text-xs text-white/50 space-y-1">
                <li>• Ask for MCQs on any topic</li>
                <li>• Request coding challenges by difficulty</li>
                <li>• Try &quot;match the following&quot; for concept mapping</li>
                <li>• Use timers for realistic practice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INNER CHAT CONTENT (needs session context)
// ═══════════════════════════════════════════════════════════════════════════

const ChatContent = () => {
  const mcpServers = useMcpServers();
  const { session } = useSession();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      // Pass session context to Tambo
      contextKey={session?.id || "anonymous"}
    >
      <div className="min-h-screen bg-gray-950">
        <AnimatedBackground />
        <Header />
        
        <div className="relative z-10 flex h-screen pt-16">
          <QuickPrompts />
          
          <div className="flex-1 relative">
            <MessageThreadFull className="h-full" />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        /* Custom styles for the chat */
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
        
        /* Improve message thread styling */
        [class*="ThreadContainer"] {
          background: transparent !important;
        }
        
        [class*="MessageInput"] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
        }
        
        [class*="MessageInputTextarea"] {
          background: transparent !important;
        }
        
        /* Style thread history */
        [class*="ThreadHistory"] {
          background: rgba(0, 0, 0, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Custom scrollbar */
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
// MAIN PAGE EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function ChatPage() {
  return (
    <SessionProvider>
      <ChatContent />
    </SessionProvider>
  );
}
