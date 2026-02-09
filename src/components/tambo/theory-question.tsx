"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const theoryQuestionSchema = z.object({
  id: z.string().describe("Unique identifier for the question"),
  topic: z.string().describe("The topic this question belongs to"),
  question: z.string().describe("The theory question to ask - DO NOT repeat this in your message text. Can include code with backticks."),
  questionNumber: z.number().optional().describe("Current question number (e.g., 1, 2, 3)"),
  totalQuestions: z.number().optional().describe("Total questions in this session"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
  hint: z.string().optional().describe("Optional hint for the question"),
  timeLimit: z.number().optional().describe("Time limit in seconds (default: 180)"),
});

export type TheoryQuestionProps = z.infer<typeof theoryQuestionSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN/CODE RENDERER
// ═══════════════════════════════════════════════════════════════════════════

const renderMarkdownText = (text: string) => {
  // Guard against undefined/null text
  if (!text) return null;
  
  // Add line breaks after sentences (full stop, question mark, exclamation followed by space and uppercase letter)
  const processedText = text
    .replace(/\.(\s+)(?=[A-Z])/g, '.\n')
    .replace(/\?(\s+)(?=[A-Z])/g, '?\n')
    .replace(/!(\s+)(?=[A-Z])/g, '!\n');
  
  // Split by code blocks first (triple backticks)
  const parts = processedText.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    // Handle code blocks
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeContent = part.slice(3, -3);
      const firstNewLine = codeContent.indexOf("\n");
      const language = firstNewLine > 0 ? codeContent.slice(0, firstNewLine).trim() : "";
      const code = firstNewLine > 0 ? codeContent.slice(firstNewLine + 1) : codeContent;
      
      return (
        <pre key={index} className="my-3 p-4 bg-black/40 rounded-xl overflow-x-auto border border-white/10">
          {language && (
            <div className="text-xs text-purple-400 mb-2 font-mono">{language}</div>
          )}
          <code className="text-sm font-mono text-green-400 whitespace-pre">{code}</code>
        </pre>
      );
    }
    
    // Process inline formatting: bold, italic, inline code
    const processInlineFormatting = (text: string, baseKey: string): React.ReactNode[] => {
      const result: React.ReactNode[] = [];
      // Regex to match **bold**, *italic*, `code`
      const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
      let lastIndex = 0;
      let match;
      let matchIndex = 0;
      
      while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          result.push(<span key={`${baseKey}-text-${matchIndex}`}>{text.slice(lastIndex, match.index)}</span>);
        }
        
        const matched = match[0];
        if (matched.startsWith("**") && matched.endsWith("**")) {
          // Bold text
          result.push(
            <strong key={`${baseKey}-bold-${matchIndex}`} className="font-bold text-white">
              {matched.slice(2, -2)}
            </strong>
          );
        } else if (matched.startsWith("*") && matched.endsWith("*")) {
          // Italic text
          result.push(
            <em key={`${baseKey}-italic-${matchIndex}`} className="italic text-white/90">
              {matched.slice(1, -1)}
            </em>
          );
        } else if (matched.startsWith("`") && matched.endsWith("`")) {
          // Inline code
          result.push(
            <code 
              key={`${baseKey}-code-${matchIndex}`}
              className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-mono text-sm"
            >
              {matched.slice(1, -1)}
            </code>
          );
        }
        
        lastIndex = regex.lastIndex;
        matchIndex++;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        result.push(<span key={`${baseKey}-text-end`}>{text.slice(lastIndex)}</span>);
      }
      
      return result.length > 0 ? result : [<span key={`${baseKey}-plain`}>{text}</span>];
    };
    
    // Split by newlines and render with <br /> for non-code parts
    const lines = part.split('\n');
    return (
      <span key={index}>
        {lines.map((line, lineIdx) => (
          <React.Fragment key={`line-${index}-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            {processInlineFormatting(line, `part-${index}-line-${lineIdx}`)}
          </React.Fragment>
        ))}
      </span>
    );
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT - Wide, White Theme, No Answer Input
// ═══════════════════════════════════════════════════════════════════════════

export const TheoryQuestion = ({
  id = "",
  topic = "",
  question = "",
  questionNumber,
  totalQuestions,
  difficulty = "medium",
  hint,
  timeLimit = 180,
}: TheoryQuestionProps) => {
  // All hooks must be called unconditionally at the top
  const [showHint, setShowHint] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // State visible to AI - use stable keys even if id is empty
  const stableId = id || "loading";
  const [status, setStatus] = useTamboComponentState<"waiting" | "answered" | "rated">(
    `theory-${stableId}-status`,
    "waiting"
  );
  const [rating, setRating] = useTamboComponentState<number>(
    `theory-${stableId}-rating`,
    0
  );
  const [feedback, setFeedback] = useTamboComponentState<string>(
    `theory-${stableId}-feedback`,
    ""
  );

  // Track if timeout has been triggered
  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Timer effect - only counts time
  useEffect(() => {
    if (!isTimerRunning || status !== "waiting") return;
    
    const interval = setInterval(() => {
      setTimeSpent((prev) => {
        if (prev >= timeLimit) {
          setIsTimerRunning(false);
          setHasTimedOut(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, status, timeLimit]);

  // Separate effect to dispatch timeout event (avoids setState during render)
  useEffect(() => {
    if (hasTimedOut && id && topic) {
      // Use setTimeout to ensure this happens after render
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("theory-question-timeout", {
          detail: { id, topic, question, timeLimit }
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [hasTimedOut, id, topic, question, timeLimit]);

  // Listen for answer submission from chat
  useEffect(() => {
    const handleAnswerSubmitted = (event: CustomEvent) => {
      if (event.detail?.questionId === id) {
        setIsTimerRunning(false);
        setStatus("answered");
      }
    };
    
    window.addEventListener("theory-answer-received", handleAnswerSubmitted as EventListener);
    return () => window.removeEventListener("theory-answer-received", handleAnswerSubmitted as EventListener);
  }, [id, setStatus]);

  // Listen for rating updates
  useEffect(() => {
    const handleRatingUpdate = (event: CustomEvent) => {
      if (event.detail?.id === id) {
        setRating(event.detail.rating);
        setFeedback(event.detail.feedback);
        setStatus("rated");
      }
    };
    
    window.addEventListener("theory-rating-update", handleRatingUpdate as EventListener);
    return () => window.removeEventListener("theory-rating-update", handleRatingUpdate as EventListener);
  }, [id, setRating, setFeedback, setStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const difficultyConfig = {
    easy: { 
      gradient: "from-green-500 to-emerald-500", 
      badge: "bg-green-500/20 text-green-400 border-green-500/30",
      glow: "shadow-green-500/20"
    },
    medium: { 
      gradient: "from-yellow-500 to-orange-500", 
      badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      glow: "shadow-yellow-500/20"
    },
    hard: { 
      gradient: "from-red-500 to-pink-500", 
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
      glow: "shadow-red-500/20"
    },
  };

  // Use fallback to medium if difficulty is invalid
  const config = difficultyConfig[difficulty] || difficultyConfig.medium;
  const timeRemaining = Math.max(0, timeLimit - timeSpent);
  const isTimeWarning = timeRemaining < 30;
  const isTimeUp = timeRemaining <= 0;

  // Guard against missing required props - AFTER all hooks
  if (!id || !topic) {
    return (
      <div className="w-full my-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">💭</div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Question...</h2>
          <p className="text-white/50">Preparing your theory question</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4">
      <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-xl ${config.glow} overflow-hidden`}>
        {/* Header with gradient accent */}
        <div className={`px-6 py-4 bg-gradient-to-r ${config.gradient} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💭</span>
              <span className="text-sm font-medium text-white/90">
                {topic}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full border ${config.badge}`}>
                {difficulty.toUpperCase()}
              </span>
              {questionNumber && totalQuestions && (
                <span className="text-sm text-white/60">
                  Q{questionNumber}/{totalQuestions}
                </span>
              )}
            </div>
            
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isTimeUp ? "bg-red-500/30 text-red-300" : 
              isTimeWarning ? "bg-yellow-500/30 text-yellow-300" : 
              "bg-white/20 text-white"
            }`}>
              <span className="text-sm">⏱️</span>
              <span className="font-mono text-sm font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Question - Wide and Prominent with Markdown Support */}
        <div className="px-6 py-6">
          <div className="text-white text-lg leading-relaxed font-medium">
            {renderMarkdownText(question || "Loading question...")}
          </div>
          
          {/* Hint */}
          {hint && status === "waiting" && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                <span>💡</span>
                {showHint ? "Hide Hint" : "Need a hint?"}
              </button>
              
              {showHint && (
                <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <p className="text-purple-300 text-sm">{hint}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Answer Instructions or Rating */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10">
          {status === "waiting" && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>💬</span>
              <span>Type your answer in the chat below</span>
              {isTimeUp && (
                <span className="ml-auto text-red-400 font-medium">Time's up!</span>
              )}
            </div>
          )}
          
          {status === "answered" && !rating && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span>Evaluating your answer...</span>
            </div>
          )}
          
          {status === "rated" && (
            <div className="space-y-3">
              {/* Rating Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Your Score:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${star <= (rating || 0) ? "text-yellow-400" : "text-white/20"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-white">{rating || 0}/5</span>
                </div>
                <span className="text-sm text-white/40">
                  Time: {formatTime(timeSpent)}
                </span>
              </div>
              
              {/* Feedback */}
              {feedback && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-blue-300 text-sm">{feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export for external rating updates
export const updateTheoryRating = (id: string, newRating: number, newFeedback: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("theory-rating-update", {
      detail: { id, rating: newRating, feedback: newFeedback }
    }));
  }
};
