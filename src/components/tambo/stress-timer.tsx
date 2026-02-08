"use client";

import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";
import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const stressTimerSchema = z.object({
  duration: z.number().describe("Total duration in seconds"),
  title: z.string().optional().describe("Title for the timer"),
  warningThreshold: z.number().optional().describe("Percentage at which warning starts (default 50)"),
  dangerThreshold: z.number().optional().describe("Percentage at which danger starts (default 25)"),
  onTimeUp: z.function().optional().describe("Callback when time is up"),
  showMotivation: z.boolean().optional().describe("Show motivational messages"),
});

export type StressTimerProps = z.infer<typeof stressTimerSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const StressTimer = ({
  duration = 300, // 5 minutes default
  title = "Time Remaining",
  warningThreshold = 50,
  dangerThreshold = 25,
  showMotivation = true,
}: StressTimerProps) => {
  const [timeLeftState, setTimeLeft] = useTamboComponentState("timeLeft", duration);
  const timeLeft = timeLeftState ?? duration;
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const percentage = (timeLeft / duration) * 100;
  
  // Determine stress level
  const getStressLevel = useCallback(() => {
    if (percentage <= dangerThreshold) return "danger";
    if (percentage <= warningThreshold) return "warning";
    return "safe";
  }, [percentage, dangerThreshold, warningThreshold]);

  const stressLevel = getStressLevel();

  // Color configurations based on stress level
  const stressColors = {
    safe: {
      primary: "#22c55e",
      secondary: "#16a34a",
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      glow: "shadow-green-500/30",
      ring: "ring-green-500",
    },
    warning: {
      primary: "#eab308",
      secondary: "#ca8a04",
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      glow: "shadow-yellow-500/30",
      ring: "ring-yellow-500",
    },
    danger: {
      primary: "#ef4444",
      secondary: "#dc2626",
      gradient: "from-red-500 to-rose-600",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      glow: "shadow-red-500/50",
      ring: "ring-red-500",
    },
  };

  const colors = stressColors[stressLevel];

  // Motivational messages based on stress level
  const motivationalMessages = {
    safe: [
      "Great pace! Keep it up! 💪",
      "You're doing awesome! 🌟",
      "Plenty of time, stay focused! 🎯",
    ],
    warning: [
      "Time to pick up the pace! ⚡",
      "Focus! You've got this! 🔥",
      "Stay calm, work smart! 🧠",
    ],
    danger: [
      "Final push! Give it your all! 🚀",
      "Every second counts! ⏰",
      "You can do this! Almost there! 💥",
    ],
  };

  const [motivationIndex, setMotivationIndex] = useState(0);
  const currentMessage = motivationalMessages[stressLevel][motivationIndex % motivationalMessages[stressLevel].length];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(Math.max(0, timeLeft - 1));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, setTimeLeft]);

  // Pulse effect based on stress level
  useEffect(() => {
    if (stressLevel === "danger" && isRunning) {
      const intensity = Math.sin(Date.now() / 200) * 0.5 + 0.5;
      setPulseIntensity(intensity);
      
      const animFrame = requestAnimationFrame(function animate() {
        const newIntensity = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        setPulseIntensity(newIntensity);
        if (stressLevel === "danger" && isRunning) {
          requestAnimationFrame(animate);
        }
      });

      return () => cancelAnimationFrame(animFrame);
    }
  }, [stressLevel, isRunning]);

  // Change motivation message periodically
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setMotivationIndex((prev) => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  // Play tick sound in danger mode
  useEffect(() => {
    if (stressLevel === "danger" && isRunning && timeLeft <= 10) {
      // Would play tick sound here in real implementation
    }
  }, [stressLevel, isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const addTime = (seconds: number) => {
    setTimeLeft(timeLeft + seconds);
  };

  // Calculate ring progress
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border ${colors.border} overflow-hidden transition-all duration-500 ${
          stressLevel === "danger" && isRunning ? "animate-pulse" : ""
        }`}
        style={{
          boxShadow: stressLevel === "danger" && isRunning 
            ? `0 0 ${30 + pulseIntensity * 30}px ${colors.primary}40`
            : `0 0 20px ${colors.primary}20`,
        }}
      >
        {/* Header */}
        <div className={`p-4 border-b ${colors.border} ${colors.bg}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              {title}
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
              {stressLevel.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Timer Circle */}
        <div className="p-8 flex flex-col items-center">
          <div className="relative w-64 h-64">
            {/* Background effects */}
            <div 
              className={`absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-500`}
              style={{ backgroundColor: colors.primary }}
            />

            {/* Circular progress */}
            <svg className="w-full h-full -rotate-90 relative z-10">
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              
              {/* Progress circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke={`url(#timerGradient-${stressLevel})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id={`timerGradient-${stressLevel}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor={colors.secondary} />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div 
                className={`text-5xl font-bold font-mono tracking-wider ${colors.text} transition-colors duration-500`}
                style={{
                  textShadow: stressLevel === "danger" && isRunning
                    ? `0 0 ${10 + pulseIntensity * 10}px ${colors.primary}`
                    : "none",
                }}
              >
                {formatTime(timeLeft)}
              </div>
              
              <div className="text-white/40 text-sm mt-2">
                {percentage.toFixed(0)}% remaining
              </div>

              {/* Pulse indicator */}
              {stressLevel === "danger" && isRunning && (
                <div className="mt-4 flex gap-1">
                  <span 
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span 
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span 
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
              )}
            </div>

            {/* Tick marks */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-white/20 rounded-full"
                style={{
                  left: "50%",
                  top: "4px",
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  transformOrigin: "50% 124px",
                }}
              />
            ))}
          </div>

          {/* Motivation message */}
          {showMotivation && isRunning && (
            <div 
              className={`mt-6 px-4 py-2 rounded-xl ${colors.bg} ${colors.text} text-sm font-medium transition-all duration-500`}
            >
              {currentMessage}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-900/50 border-t border-white/10">
          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className={`px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center gap-2`}
              >
                <span>▶</span> Start
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseTimer}
                    className="px-4 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-all"
                  >
                    ⏸️ Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeTimer}
                    className="px-4 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all"
                  >
                    ▶️ Resume
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={resetTimer}
              className="px-4 py-3 bg-white/5 text-white/70 rounded-xl hover:bg-white/10 transition-all"
            >
              🔄 Reset
            </button>

            {isRunning && (
              <button
                onClick={() => addTime(60)}
                className="px-4 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all"
              >
                +1 min
              </button>
            )}
          </div>
        </div>

        {/* Time Up Overlay */}
        {timeLeft === 0 && isRunning && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-50 animate-pulse">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-3xl font-bold text-white mb-2">TIME&apos;S UP!</h2>
            <p className="text-white/70 mb-6">Great effort! Review your work.</p>
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-white/90 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Audio element for tick sound */}
        <audio ref={audioRef} preload="auto">
          <source src="/tick.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};
