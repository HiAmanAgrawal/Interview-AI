"use client";

import React, { useState, useCallback } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════════════════

const renderMarkdown = (text: string) => {
  if (!text) return null;
  
  const processInline = (text: string, baseKey: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;
    let i = 0;
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(<span key={`${baseKey}-${i++}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      const m = match[0];
      if (m.startsWith("**")) {
        result.push(<strong key={`${baseKey}-${i++}`} className="font-bold text-white">{m.slice(2, -2)}</strong>);
      } else if (m.startsWith("*")) {
        result.push(<em key={`${baseKey}-${i++}`} className="italic">{m.slice(1, -1)}</em>);
      } else if (m.startsWith("`")) {
        result.push(<code key={`${baseKey}-${i++}`} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-mono text-sm">{m.slice(1, -1)}</code>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) result.push(<span key={`${baseKey}-end`}>{text.slice(lastIndex)}</span>);
    return result.length > 0 ? result : [<span key={`${baseKey}-plain`}>{text}</span>];
  };
  
  return processInline(text, "md");
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const matchFollowingSchema = z.object({
  title: z.string().describe("Title of the matching question"),
  instructions: z.string().optional().describe("Instructions for the user"),
  leftColumn: z.array(
    z.object({
      id: z.string().describe("Unique identifier"),
      text: z.string().describe("Display text"),
    })
  ).describe("Left column items to match from"),
  rightColumn: z.array(
    z.object({
      id: z.string().describe("Unique identifier"),
      text: z.string().describe("Display text"),
    })
  ).describe("Right column items to match to"),
  correctMatches: z.array(
    z.object({
      leftId: z.string().describe("ID of the left column item"),
      rightId: z.string().describe("ID of the matching right column item"),
    })
  ).describe("Array of correct match pairs"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
  topic: z.string().optional().describe("Topic of the question"),
});

// Convert array of matches to record for internal use
type MatchPair = { leftId: string; rightId: string };
type MatchFollowingSchemaType = z.infer<typeof matchFollowingSchema>;

export interface MatchFollowingProps extends Omit<MatchFollowingSchemaType, 'correctMatches'> {
  correctMatches: MatchPair[] | Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MatchFollowing = ({
  title,
  instructions = "Match the items in the left column with their corresponding items in the right column",
  leftColumn = [],
  rightColumn = [],
  correctMatches = [],
  difficulty = "medium",
  topic,
}: MatchFollowingProps) => {
  const [matchesState, setMatches] = useTamboComponentState<Record<string, string>>("matches", {});
  const matches = matchesState ?? {};
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [showResultsState, setShowResults] = useTamboComponentState("showResults", false);
  const showResults = showResultsState ?? false;
  
  const [hoveredRight, setHoveredRight] = useState<string | null>(null);

  // Convert correctMatches to record format if it's an array
  const correctMatchesRecord: Record<string, string> = Array.isArray(correctMatches)
    ? correctMatches.reduce((acc, { leftId, rightId }) => ({ ...acc, [leftId]: rightId }), {} as Record<string, string>)
    : correctMatches;

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const getMatchColor = (index: number) => {
    const colors = [
      { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-400", line: "#a855f7" },
      { bg: "bg-pink-500/20", border: "border-pink-500", text: "text-pink-400", line: "#ec4899" },
      { bg: "bg-cyan-500/20", border: "border-cyan-500", text: "text-cyan-400", line: "#06b6d4" },
      { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-400", line: "#22c55e" },
      { bg: "bg-yellow-500/20", border: "border-yellow-500", text: "text-yellow-400", line: "#eab308" },
      { bg: "bg-orange-500/20", border: "border-orange-500", text: "text-orange-400", line: "#f97316" },
    ];
    return colors[index % colors.length];
  };

  const handleLeftClick = useCallback((leftId: string) => {
    if (showResults) return;
    
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
    }
  }, [selectedLeft, showResults]);

  const handleRightClick = useCallback((rightId: string) => {
    if (showResults || !selectedLeft) return;

    // Remove any existing match for this left item or right item
    const newMatches = { ...matches };
    
    // Remove if this left already has a match
    if (newMatches[selectedLeft]) {
      delete newMatches[selectedLeft];
    }
    
    // Remove if this right is already matched
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === rightId) {
        delete newMatches[key];
      }
    });

    // Add new match
    newMatches[selectedLeft] = rightId;
    setMatches(newMatches);
    setSelectedLeft(null);
  }, [selectedLeft, matches, showResults, setMatches]);

  const removeMatch = useCallback((leftId: string) => {
    if (showResults) return;
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
  }, [matches, showResults, setMatches]);

  const checkAnswers = () => {
    setShowResults(true);
    
    // Calculate score and dispatch event for score tracking and AI continuation
    const correct = Object.keys(matches).filter((leftId) => correctMatchesRecord[leftId] === matches[leftId]).length;
    const total = leftColumn.length;
    const percentage = Math.round((correct / total) * 100);
    
    if (typeof window !== "undefined") {
      // Dispatch event for score tracking
      window.dispatchEvent(new CustomEvent("match-complete", {
        detail: {
          topic: topic || "General",
          score: correct,
          totalQuestions: total,
          percentage,
          isCorrect: correct >= total / 2,
        }
      }));
      
      // Dispatch event for AI to continue (after a delay to show results)
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("match-continue", {
          detail: { topic: topic || "General", score: correct, totalQuestions: total, percentage }
        }));
      }, 2000); // 2 second delay
    }
  };

  const resetQuiz = () => {
    setMatches({});
    setShowResults(false);
    setSelectedLeft(null);
  };

  const getMatchIndex = (leftId: string) => {
    const sortedKeys = Object.keys(matches).sort();
    return sortedKeys.indexOf(leftId);
  };

  const getRightMatchIndex = (rightId: string) => {
    const matchEntry = Object.entries(matches).find(([, rId]) => rId === rightId);
    if (!matchEntry) return -1;
    const sortedKeys = Object.keys(matches).sort();
    return sortedKeys.indexOf(matchEntry[0]);
  };

  const isCorrect = (leftId: string) => {
    return correctMatchesRecord[leftId] === matches[leftId];
  };

  const correctCount = Object.keys(matches).filter((leftId) => isCorrect(leftId)).length;
  const totalQuestions = leftColumn.length;
  const allMatched = Object.keys(matches).length === leftColumn.length;

  if (!leftColumn.length || !rightColumn.length) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Match Quiz...</h2>
          <p className="text-white/50">Preparing your matching challenge</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                🔗
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[difficulty]}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  {topic && <span className="text-xs text-white/40">{topic}</span>}
                  <span className="text-xs text-white/40">
                    {Object.keys(matches).length}/{totalQuestions} matched
                  </span>
                </div>
              </div>
            </div>
            {showResults && (
              <div className={`px-4 py-2 rounded-xl ${
                correctCount === totalQuestions 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                Score: {correctCount}/{totalQuestions}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="text-white/70">{renderMarkdown(instructions)}</div>
          {!showResults && (
            <p className="text-white/40 text-sm mt-2">
              💡 Click an item on the left, then click its match on the right
            </p>
          )}
        </div>

        {/* Matching Area */}
        <div className="p-6">
          <div className="flex justify-center relative" style={{ gap: "160px" }}>
            {/* SVG for connection lines - positioned between columns */}
            <svg 
              className="absolute pointer-events-none" 
              style={{ 
                left: "50%", 
                transform: "translateX(-50%)",
                width: "200px",
                height: "100%",
                top: "0",
                zIndex: 1,
              }}
            >
              {Object.entries(matches).map(([leftId, rightId]) => {
                const leftIndex = leftColumn.findIndex((l) => l.id === leftId);
                const rightIndex = rightColumn.findIndex((r) => r.id === rightId);
                const matchIdx = getMatchIndex(leftId);
                const color = getMatchColor(matchIdx);
                
                // Account for header (Column A/B) - ~40px, then each item ~80px (with spacing)
                const headerOffset = 50;
                const itemHeight = 76; // Height of each item including gap
                const startY = headerOffset + leftIndex * itemHeight + 32; // Center of item
                const endY = headerOffset + rightIndex * itemHeight + 32;
                
                let strokeColor = color.line;
                if (showResults) {
                  strokeColor = isCorrect(leftId) ? "#22c55e" : "#ef4444";
                }

                return (
                  <path
                    key={leftId}
                    d={`M 0 ${startY} C 60 ${startY}, 140 ${endY}, 200 ${endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={showResults && !isCorrect(leftId) ? "8,4" : "none"}
                    opacity={0.9}
                  />
                );
              })}
            </svg>

            {/* Left Column */}
            <div className="space-y-4 relative z-10">
              <h3 className="text-white/50 text-sm font-medium mb-4 text-center">Column A</h3>
              {leftColumn.map((item, index) => {
                const isMatched = matches[item.id];
                const matchIdx = getMatchIndex(item.id);
                const color = isMatched ? getMatchColor(matchIdx) : null;
                
                let borderClass = "border-white/20 hover:border-white/40";
                let bgClass = "bg-white/5 hover:bg-white/10";
                
                if (showResults && isMatched) {
                  if (isCorrect(item.id)) {
                    borderClass = "border-green-500";
                    bgClass = "bg-green-500/10";
                  } else {
                    borderClass = "border-red-500";
                    bgClass = "bg-red-500/10";
                  }
                } else if (selectedLeft === item.id) {
                  borderClass = "border-purple-500 ring-2 ring-purple-500/30";
                  bgClass = "bg-purple-500/10";
                } else if (color) {
                  borderClass = color.border;
                  bgClass = color.bg;
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => !showResults && handleLeftClick(item.id)}
                    role="button"
                    tabIndex={showResults ? -1 : 0}
                    className={`w-64 p-4 rounded-xl border-2 ${borderClass} ${bgClass} text-left transition-all duration-200 relative group cursor-pointer ${showResults ? "cursor-default" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
                        {index + 1}
                      </span>
                      <span className="text-white/90">{item.text}</span>
                    </div>
                    {isMatched && !showResults && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMatch(item.id);
                        }}
                        role="button"
                        tabIndex={0}
                        className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-red-600"
                      >
                        ×
                      </span>
                    )}
                    {showResults && isMatched && (
                      <span className={`absolute -right-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isCorrect(item.id) ? "bg-green-500" : "bg-red-500"
                      }`}>
                        {isCorrect(item.id) ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="space-y-4 relative z-10">
              <h3 className="text-white/50 text-sm font-medium mb-4 text-center">Column B</h3>
              {rightColumn.map((item, index) => {
                const isMatched = Object.values(matches).includes(item.id);
                const matchIdx = getRightMatchIndex(item.id);
                const color = isMatched && matchIdx >= 0 ? getMatchColor(matchIdx) : null;
                
                let borderClass = "border-white/20 hover:border-white/40";
                let bgClass = "bg-white/5 hover:bg-white/10";
                
                if (showResults && isMatched) {
                  // Find the left item that matched this
                  const leftId = Object.keys(matches).find((k) => matches[k] === item.id);
                  if (leftId && isCorrect(leftId)) {
                    borderClass = "border-green-500";
                    bgClass = "bg-green-500/10";
                  } else {
                    borderClass = "border-red-500";
                    bgClass = "bg-red-500/10";
                  }
                } else if (hoveredRight === item.id && selectedLeft) {
                  borderClass = "border-purple-500";
                  bgClass = "bg-purple-500/10";
                } else if (color) {
                  borderClass = color.border;
                  bgClass = color.bg;
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => !showResults && handleRightClick(item.id)}
                    onMouseEnter={() => setHoveredRight(item.id)}
                    onMouseLeave={() => setHoveredRight(null)}
                    role="button"
                    tabIndex={showResults ? -1 : 0}
                    className={`w-64 p-4 rounded-xl border-2 ${borderClass} ${bgClass} text-left transition-all duration-200 ${
                      selectedLeft && !showResults ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/50">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-white/90">{item.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/50 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-all"
          >
            Reset
          </button>
          
          {!showResults ? (
            <button
              onClick={checkAnswers}
              disabled={!allMatched}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className={`text-lg font-semibold ${
                correctCount === totalQuestions ? "text-green-400" : "text-yellow-400"
              }`}>
                {correctCount === totalQuestions ? "🎉 Perfect!" : `${correctCount}/${totalQuestions} Correct`}
              </span>
              <button
                onClick={resetQuiz}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
