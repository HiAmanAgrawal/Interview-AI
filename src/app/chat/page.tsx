"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import Link from "next/link";

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
// HEADER
// ═══════════════════════════════════════════════════════════════════════════

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-xl">🎯</span>
        </div>
        <span className="text-xl font-bold text-white">InterviewAI</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-2">
          {[
            { label: "DBMS", emoji: "🗄️" },
            { label: "React", emoji: "⚛️" },
            { label: "DSA", emoji: "🧮" },
            { label: "JavaScript", emoji: "📜" },
          ].map((topic) => (
            <div
              key={topic.label}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-sm flex items-center gap-1.5 cursor-default"
            >
              <span>{topic.emoji}</span>
              <span className="hidden lg:inline">{topic.label}</span>
            </div>
          ))}
        </nav>
        
        <Link 
          href="/"
          className="px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 hover:text-white transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  </header>
);

// ═══════════════════════════════════════════════════════════════════════════
// QUICK PROMPTS SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

const QuickPrompts = () => (
  <div className="hidden lg:block w-72 shrink-0 p-4 border-r border-white/10 overflow-y-auto">
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Quick Prompts</h3>
        <p className="text-xs text-white/50">Click to try these prompts</p>
      </div>
      
      {/* Predefined Quizzes */}
      <div>
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Predefined Quizzes</h4>
        <div className="space-y-2">
          {[
            { prompt: "Give me a DBMS quiz", icon: "🗄️", color: "from-blue-500/20 to-cyan-500/20" },
            { prompt: "Start a React quiz", icon: "⚛️", color: "from-cyan-500/20 to-blue-500/20" },
            { prompt: "DSA practice questions", icon: "🧮", color: "from-green-500/20 to-emerald-500/20" },
            { prompt: "JavaScript MCQs please", icon: "📜", color: "from-yellow-500/20 to-orange-500/20" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                const input = document.querySelector('textarea');
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
                  nativeInputValueSetter?.call(input, item.prompt);
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.focus();
                }
              }}
              className={`w-full p-3 rounded-xl bg-gradient-to-r ${item.color} border border-white/10 text-left hover:border-white/30 transition-all group`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-sm text-white/80">{item.prompt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom Topics */}
      <div>
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Custom Topics</h4>
        <div className="space-y-2">
          {[
            { prompt: "Generate MCQs on Python basics", icon: "🐍" },
            { prompt: "Quiz me on SQL joins", icon: "🔗" },
            { prompt: "System design questions", icon: "🏗️" },
            { prompt: "CSS flexbox quiz", icon: "🎨" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                const input = document.querySelector('textarea');
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
                  nativeInputValueSetter?.call(input, item.prompt);
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.focus();
                }
              }}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/60">{item.prompt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Score Section */}
      <div>
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Track Progress</h4>
        <button
          onClick={() => {
            const input = document.querySelector('textarea');
            if (input) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
              nativeInputValueSetter?.call(input, "What is my score?");
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.focus();
            }
          }}
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
      
      {/* Tips */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <div className="text-sm font-medium text-white mb-1">Pro Tip</div>
            <p className="text-xs text-white/50">
              You can ask for MCQs on any topic! Just type &quot;Generate MCQs on [topic]&quot; and the AI will create custom questions for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function ChatPage() {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
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
}
