"use client";

import { useState } from "react";
import { SessionProvider, useSession } from "@/contexts/session-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl animate-blob" />
    <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-transparent blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
    <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-pink-500/10 to-transparent blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

// Inner login content that uses session
const LoginContent = () => {
  const { createQuickSession, session } = useSession();
  const [quickName, setQuickName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to chat
  if (session) {
    router.push("/chat");
    return null;
  }

  const handleQuickSession = () => {
    if (!quickName.trim()) return;
    setIsLoading(true);
    createQuickSession(quickName.trim());
    setTimeout(() => {
      router.push("/chat");
    }, 500);
  };

  const handleGoogleLogin = async () => {
    // For now, show a message that Google login needs configuration
    alert("Google login requires OAuth configuration. Use Quick Session for testing.");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-3xl">🎯</span>
            </div>
            <span className="text-2xl font-bold text-white">InterviewAI</span>
          </Link>
          <p className="text-white/50 mt-4">Sign in to track your progress</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <h1 className="text-2xl font-semibold text-white text-center mb-6">Welcome Back</h1>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Quick Session */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Quick Session (No Sign-up Required)</label>
              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleQuickSession()}
              />
            </div>
            <button
              onClick={handleQuickSession}
              disabled={!quickName.trim() || isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  ⚡ Start Quick Session
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm text-white/70">
                  Quick sessions let you practice immediately. Your progress is saved locally and synced with the AI for personalized feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
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

// Main export with SessionProvider
export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginContent />
    </SessionProvider>
  );
}
