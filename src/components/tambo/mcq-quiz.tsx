"use client";

import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const mcqQuizSchema = z.object({
  topic: z.string().describe("The topic of the quiz, e.g., 'DBMS', 'React', 'JavaScript'"),
  questions: z.array(
    z.object({
      id: z.string().describe("Unique identifier for the question"),
      question: z.string().describe("The question text"),
      options: z.array(z.string()).describe("Array of 4 answer options"),
      correctAnswer: z.number().describe("Index of the correct answer (0-3)"),
      explanation: z.string().optional().describe("Explanation of the correct answer"),
    })
  ).describe("Array of MCQ questions"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
});

export type MCQQuizProps = z.infer<typeof mcqQuizSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MCQQuiz = ({ topic, questions = [], difficulty = "medium" }: MCQQuizProps) => {
  const [currentQuestionState, setCurrentQuestion] = useTamboComponentState("currentQuestion", 0);
  const [selectedAnswersState, setSelectedAnswers] = useTamboComponentState<Record<string, number>>("selectedAnswers", {});
  const [showResultsState, setShowResults] = useTamboComponentState("showResults", false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Time tracking
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  
  // Timer effect
  useEffect(() => {
    if (showResultsState) return; // Stop timer when results are shown
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [showResultsState]);
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Quiz summary state - visible to AI for context
  const [, setQuizSummary] = useTamboComponentState<{
    topic: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    percentage: number;
    status: "in_progress" | "completed";
    wrongQuestionIds: string[];
    difficulty: string;
    timeSpent: number; // seconds
  } | null>("quizSummary", null);
  
  // Ensure we have valid default values
  const currentQuestion = currentQuestionState ?? 0;
  const selectedAnswers = selectedAnswersState ?? {};
  const showResults = showResultsState ?? false;
  
  // Guard against empty or undefined questions
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Quiz...</h2>
          <p className="text-white/50">Preparing questions for {topic || "your quiz"}</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }
  
  const safeCurrentQuestion = Math.min(currentQuestion, questions.length - 1);
  const currentQ = questions[safeCurrentQuestion];
  const totalQuestions = questions.length;
  
  // Additional safety check for currentQ and its required properties
  if (!currentQ || !currentQ.options || !Array.isArray(currentQ.options) || currentQ.options.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 p-8 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading Question...</h2>
          <p className="text-white/50">Preparing your quiz for {topic || "this topic"}</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    );
  }
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };
  
  const handleSelectAnswer = (answerIndex: number) => {
    if (showResults || !currentQ) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: answerIndex,
    });
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      // Calculate final results and store for AI
      let correct = 0;
      const wrongIds: string[] = [];
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correct++;
        } else {
          wrongIds.push(q.id);
        }
      });
      
      // Calculate time spent
      const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      const quizResultData = {
        topic,
        totalQuestions,
        correctAnswers: correct,
        wrongAnswers: totalQuestions - correct,
        percentage: Math.round((correct / totalQuestions) * 100),
        status: "completed" as const,
        wrongQuestionIds: wrongIds,
        difficulty: difficulty || "medium",
        timeSpent: timeSpentSeconds,
        avgTimePerQuestion: Math.round(timeSpentSeconds / totalQuestions),
      };
      
      // Store quiz summary for AI context
      setQuizSummary(quizResultData);
      
      // Dispatch custom event for InterviewContext to catch
      if (typeof window !== "undefined") {
        console.log("[MCQQuiz] Dispatching quiz-complete event:", quizResultData);
        window.dispatchEvent(new CustomEvent("quiz-complete", { 
          detail: quizResultData 
        }));
      }
      
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation(false);
  };
  
  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  
  // Results Screen
  if (showResults) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-white/50">Quiz Complete</span>
                <h2 className="text-2xl font-bold text-white">{topic}</h2>
              </div>
              <div className="text-5xl">
                {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎯" : percentage >= 40 ? "📚" : "💪"}
              </div>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-4 border-purple-500/50 mb-6">
              <div>
                <div className="text-4xl font-bold text-white">{percentage}%</div>
                <div className="text-sm text-white/50">Score</div>
              </div>
            </div>
            
            <div className="text-lg text-white/70 mb-8">
              You got <span className="text-green-400 font-bold">{score}</span> out of <span className="text-white font-bold">{totalQuestions}</span> questions correct
            </div>
            
            {/* Performance Message */}
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium ${
              percentage >= 80 
                ? "bg-green-500/20 text-green-400" 
                : percentage >= 60 
                  ? "bg-yellow-500/20 text-yellow-400" 
                  : "bg-red-500/20 text-red-400"
            }`}>
              {percentage >= 80 
                ? "Excellent! You've mastered this topic!" 
                : percentage >= 60 
                  ? "Good job! Keep practicing!" 
                  : "Keep learning! You'll get there!"}
            </div>
          </div>
          
          {/* Question Review */}
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-white/50 mb-4">Question Review</h3>
            <div className="space-y-2">
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <div 
                    key={q.id}
                    className={`p-3 rounded-xl flex items-center justify-between ${
                      isCorrect 
                        ? "bg-green-500/10 border border-green-500/30" 
                        : "bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCorrect ? "bg-green-500/30 text-green-400" : "bg-red-500/30 text-red-400"
                      }`}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <span className="text-white/80 text-sm line-clamp-1">Q{idx + 1}: {q.question}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-3">
            <p className="text-white/50 text-sm text-center mb-3">
              Type in the chat to continue, or click a button below
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => {
                  // Dispatch event to continue the interview
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("mcq-continue", {
                      detail: { topic, score, totalQuestions, percentage }
                    }));
                  }
                }}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                ✅ Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz Screen
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-lg font-semibold text-white">{topic}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[difficulty]}`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                  ⏱️ {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{safeCurrentQuestion + 1}/{totalQuestions}</div>
            <div className="text-xs text-white/50">Questions</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((safeCurrentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        
        {/* Question */}
        <div className="p-6">
          <h3 className="text-xl text-white mb-6 leading-relaxed">{currentQ.question}</h3>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              const showFeedback = showExplanation && isSelected;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={selectedAnswers[currentQ.id] !== undefined}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-4 ${
                    showFeedback
                      ? isCorrect
                        ? "bg-green-500/20 border-2 border-green-500/50"
                        : "bg-red-500/20 border-2 border-red-500/50"
                      : isSelected
                        ? "bg-purple-500/20 border-2 border-purple-500/50 scale-[1.02]"
                        : selectedAnswers[currentQ.id] !== undefined && isCorrect
                          ? "bg-green-500/20 border-2 border-green-500/50"
                          : "bg-white/5 border-2 border-transparent hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                    showFeedback
                      ? isCorrect
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : isSelected
                        ? "bg-purple-500 text-white"
                        : selectedAnswers[currentQ.id] !== undefined && isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-white/10 text-white/60"
                  }`}>
                    {showFeedback ? (isCorrect ? "✓" : "✗") : String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-white/90">{option}</span>
                </button>
              );
            })}
          </div>
          
          {/* Explanation */}
          {showExplanation && currentQ.explanation && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <div className="text-blue-400 font-medium mb-1">Explanation</div>
                  <p className="text-white/70 text-sm">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={safeCurrentQuestion === 0}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              safeCurrentQuestion === 0
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            ← Previous
          </button>
          
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === safeCurrentQuestion 
                    ? "bg-purple-500 w-6" 
                    : selectedAnswers[questions[idx]?.id] !== undefined
                      ? "bg-white/50"
                      : "bg-white/20"
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQ?.id] === undefined}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              selectedAnswers[currentQ?.id] === undefined
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
            }`}
          >
            {safeCurrentQuestion === totalQuestions - 1 ? "Finish" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};
