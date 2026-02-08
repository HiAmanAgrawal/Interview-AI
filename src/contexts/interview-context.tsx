"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type InterviewMode = "practice" | "test" | "interview";

export interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
  lastAttempted: Date;
}

export interface QuestionAttempt {
  id: string;
  type: "mcq" | "coding" | "match" | "whiteboard";
  topic: string;
  question: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  timeSpent: number; // seconds
  timestamp: Date;
  difficulty: "easy" | "medium" | "hard";
}

export interface InterviewRound {
  id: string;
  topic: string;
  type: "mcq" | "coding" | "match" | "whiteboard";
  status: "pending" | "in_progress" | "completed";
  score?: number;
  maxScore?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface InterviewSession {
  id: string;
  mode: InterviewMode;
  userId: string;
  userName: string;
  
  // Topics configuration
  selectedTopics: string[];
  currentTopic: string | null;
  
  // Progress tracking
  questionsAttempted: number;
  questionsCorrect: number;
  totalScore: number;
  maxPossibleScore: number;
  
  // Topic-wise performance
  topicScores: Record<string, TopicScore>;
  
  // Question history
  attempts: QuestionAttempt[];
  
  // Interview specific
  rounds: InterviewRound[];
  currentRound: number;
  interviewStatus: "not_started" | "introduction" | "in_progress" | "completed" | "review";
  
  // Timing
  startedAt: Date;
  lastActivityAt: Date;
  timeSpentSeconds: number;
  
  // Analysis
  strongTopics: string[];
  weakTopics: string[];
  averageTimePerQuestion: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewContextType {
  session: InterviewSession | null;
  isLoading: boolean;
  
  // Session management
  startSession: (config: {
    mode: InterviewMode;
    userName: string;
    topics: string[];
  }) => void;
  endSession: () => void;
  
  // Question tracking
  recordAttempt: (attempt: Omit<QuestionAttempt, "id" | "timestamp">) => void;
  
  // Quiz tracking (for full quiz completion)
  recordQuizResults: (quizResult: {
    topic: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    percentage: number;
    difficulty: string;
    questions?: Array<{
      question: string;
      isCorrect: boolean;
    }>;
  }) => void;
  
  // Topic management
  setCurrentTopic: (topic: string) => void;
  
  // Interview round management
  startRound: (topic: string, type: InterviewRound["type"]) => void;
  completeRound: (score: number, maxScore: number) => void;
  
  // Context for AI
  getAIContext: () => string;
  getPracticeContext: () => string;
  getInterviewContext: () => string;
  getTestContext: () => string;
  
  // Analytics
  getTopicAnalysis: () => {
    strong: string[];
    weak: string[];
    needsWork: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

const AVAILABLE_TOPICS = [
  "DBMS",
  "React",
  "DSA",
  "JavaScript",
  "Python",
  "System Design",
  "SQL",
];

const createEmptySession = (
  mode: InterviewMode,
  userName: string,
  topics: string[]
): InterviewSession => ({
  id: `session-${Date.now()}`,
  mode,
  userId: `user-${Date.now()}`,
  userName,
  selectedTopics: topics,
  currentTopic: topics[0] || null,
  questionsAttempted: 0,
  questionsCorrect: 0,
  totalScore: 0,
  maxPossibleScore: 0,
  topicScores: {},
  attempts: [],
  rounds: topics.map((topic, idx) => ({
    id: `round-${idx}`,
    topic,
    type: "mcq" as const,
    status: "pending" as const,
  })),
  currentRound: 0,
  interviewStatus: "not_started",
  startedAt: new Date(),
  lastActivityAt: new Date(),
  timeSpentSeconds: 0,
  strongTopics: [],
  weakTopics: [],
  averageTimePerQuestion: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const InterviewContext = createContext<InterviewContextType | null>(null);

export const useInterviewContext = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterviewContext must be used within InterviewProvider");
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export const InterviewProvider = ({ 
  children,
  mode 
}: { 
  children: React.ReactNode;
  mode?: InterviewMode;
}) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage - only if mode matches
  useEffect(() => {
    const savedSession = localStorage.getItem("interview-session-v2");
    console.log("[InterviewContext] Loading session, mode:", mode, "saved:", savedSession ? "yes" : "no");
    
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        
        // Only restore if mode matches (or no mode specified)
        if (mode && parsed.mode !== mode) {
          console.log("[InterviewContext] Mode mismatch, clearing session. Expected:", mode, "Got:", parsed.mode);
          localStorage.removeItem("interview-session-v2");
          setIsLoading(false);
          return;
        }
        
        // Restore dates
        parsed.startedAt = new Date(parsed.startedAt);
        parsed.lastActivityAt = new Date(parsed.lastActivityAt);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        parsed.attempts = parsed.attempts.map((a: QuestionAttempt) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
        parsed.topicScores = Object.fromEntries(
          Object.entries(parsed.topicScores).map(([k, v]) => [
            k,
            { ...(v as TopicScore), lastAttempted: new Date((v as TopicScore).lastAttempted) },
          ])
        );
        
        console.log("[InterviewContext] Session restored:", parsed.userName, "Topics:", parsed.selectedTopics);
        setSession(parsed);
      } catch (e) {
        console.error("[InterviewContext] Error parsing session:", e);
        localStorage.removeItem("interview-session-v2");
      }
    }
    setIsLoading(false);
  }, [mode]);

  // Save session to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem("interview-session-v2", JSON.stringify(session));
    }
  }, [session]);

  // Calculate strong and weak topics
  const analyzeTopics = useCallback((topicScores: Record<string, TopicScore>) => {
    const scored = Object.entries(topicScores)
      .filter(([, score]) => score.total >= 2)
      .sort(([, a], [, b]) => b.percentage - a.percentage);

    const strong = scored.filter(([, s]) => s.percentage >= 70).map(([t]) => t);
    const weak = scored.filter(([, s]) => s.percentage < 50).map(([t]) => t);
    const needsWork = scored.filter(([, s]) => s.percentage >= 50 && s.percentage < 70).map(([t]) => t);

    return { strong, weak, needsWork };
  }, []);

  const startSession = useCallback((config: {
    mode: InterviewMode;
    userName: string;
    topics: string[];
  }) => {
    console.log("[InterviewContext] Starting new session:", config);
    const newSession = createEmptySession(config.mode, config.userName, config.topics);
    newSession.interviewStatus = "introduction";
    setSession(newSession);
    // Save immediately
    localStorage.setItem("interview-session-v2", JSON.stringify(newSession));
    console.log("[InterviewContext] Session created and saved:", newSession.id);
  }, []);

  const endSession = useCallback(() => {
    localStorage.removeItem("interview-session-v2");
    setSession(null);
  }, []);

  const recordAttempt = useCallback((attempt: Omit<QuestionAttempt, "id" | "timestamp">) => {
    console.log("[InterviewContext] Recording attempt:", attempt.topic, attempt.isCorrect ? "correct" : "wrong");
    
    setSession((prev) => {
      if (!prev) {
        console.warn("[InterviewContext] No session to record attempt");
        return prev;
      }

      const newAttempt: QuestionAttempt = {
        ...attempt,
        id: `attempt-${Date.now()}`,
        timestamp: new Date(),
      };

      // Update topic scores
      const topicScore = prev.topicScores[attempt.topic] || {
        topic: attempt.topic,
        correct: 0,
        total: 0,
        percentage: 0,
        lastAttempted: new Date(),
      };

      const updatedTopicScore: TopicScore = {
        ...topicScore,
        correct: topicScore.correct + (attempt.isCorrect ? 1 : 0),
        total: topicScore.total + 1,
        percentage: Math.round(
          ((topicScore.correct + (attempt.isCorrect ? 1 : 0)) /
            (topicScore.total + 1)) *
            100
        ),
        lastAttempted: new Date(),
      };

      const newTopicScores = {
        ...prev.topicScores,
        [attempt.topic]: updatedTopicScore,
      };

      const analysis = analyzeTopics(newTopicScores);

      const newAttempts = [...prev.attempts, newAttempt];
      const totalTime = newAttempts.reduce((sum, a) => sum + a.timeSpent, 0);

      const updated = {
        ...prev,
        questionsAttempted: prev.questionsAttempted + 1,
        questionsCorrect: prev.questionsCorrect + (attempt.isCorrect ? 1 : 0),
        totalScore: prev.totalScore + attempt.score,
        maxPossibleScore: prev.maxPossibleScore + attempt.maxScore,
        topicScores: newTopicScores,
        attempts: newAttempts,
        strongTopics: analysis.strong,
        weakTopics: analysis.weak,
        averageTimePerQuestion: Math.round(totalTime / newAttempts.length),
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("[InterviewContext] Updated session - Total:", updated.questionsAttempted, "Correct:", updated.questionsCorrect);
      return updated;
    });
  }, [analyzeTopics]);

  // Record full quiz results (when MCQ quiz completes)
  const recordQuizResults = useCallback((quizResult: {
    topic: string;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    percentage: number;
    difficulty: string;
    questions?: Array<{
      question: string;
      isCorrect: boolean;
    }>;
  }) => {
    console.log("[InterviewContext] Recording quiz results:", quizResult);
    
    setSession((prev) => {
      if (!prev) {
        console.warn("[InterviewContext] No session to record quiz results");
        return prev;
      }

      // Update topic scores
      const existingScore = prev.topicScores[quizResult.topic] || {
        topic: quizResult.topic,
        correct: 0,
        total: 0,
        percentage: 0,
        lastAttempted: new Date(),
      };

      const updatedTopicScore: TopicScore = {
        topic: quizResult.topic,
        correct: existingScore.correct + quizResult.correctAnswers,
        total: existingScore.total + quizResult.totalQuestions,
        percentage: Math.round(
          ((existingScore.correct + quizResult.correctAnswers) /
            (existingScore.total + quizResult.totalQuestions)) *
            100
        ),
        lastAttempted: new Date(),
      };

      const newTopicScores = {
        ...prev.topicScores,
        [quizResult.topic]: updatedTopicScore,
      };

      const analysis = analyzeTopics(newTopicScores);

      const updated = {
        ...prev,
        questionsAttempted: prev.questionsAttempted + quizResult.totalQuestions,
        questionsCorrect: prev.questionsCorrect + quizResult.correctAnswers,
        totalScore: prev.totalScore + quizResult.correctAnswers,
        maxPossibleScore: prev.maxPossibleScore + quizResult.totalQuestions,
        topicScores: newTopicScores,
        strongTopics: analysis.strong,
        weakTopics: analysis.weak,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("[InterviewContext] Quiz recorded - Total Q:", updated.questionsAttempted, "Correct:", updated.questionsCorrect, "Score:", updated.totalScore);
      return updated;
    });
  }, [analyzeTopics]);

  const setCurrentTopic = useCallback((topic: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, currentTopic: topic, updatedAt: new Date() };
    });
  }, []);

  const startRound = useCallback((topic: string, type: InterviewRound["type"]) => {
    setSession((prev) => {
      if (!prev) return prev;

      const rounds = prev.rounds.map((r, idx) =>
        idx === prev.currentRound
          ? { ...r, topic, type, status: "in_progress" as const, startedAt: new Date() }
          : r
      );

      return {
        ...prev,
        rounds,
        currentTopic: topic,
        interviewStatus: "in_progress",
        updatedAt: new Date(),
      };
    });
  }, []);

  const completeRound = useCallback((score: number, maxScore: number) => {
    setSession((prev) => {
      if (!prev) return prev;

      const rounds = prev.rounds.map((r, idx) =>
        idx === prev.currentRound
          ? { ...r, status: "completed" as const, score, maxScore, completedAt: new Date() }
          : r
      );

      const allCompleted = rounds.every((r) => r.status === "completed");

      return {
        ...prev,
        rounds,
        currentRound: allCompleted ? prev.currentRound : prev.currentRound + 1,
        interviewStatus: allCompleted ? "completed" : "in_progress",
        currentTopic: allCompleted ? null : prev.selectedTopics[prev.currentRound + 1] || null,
        updatedAt: new Date(),
      };
    });
  }, []);

  // AI Context generation
  const getAIContext = useCallback((): string => {
    if (!session) {
      return `No active session. Available topics: ${AVAILABLE_TOPICS.join(", ")}`;
    }

    const scorePercent = session.maxPossibleScore > 0
      ? Math.round((session.totalScore / session.maxPossibleScore) * 100)
      : 0;

    return `
=== INTERVIEW SESSION CONTEXT ===
Mode: ${session.mode.toUpperCase()}
User: ${session.userName}
Session ID: ${session.id}

=== PROGRESS ===
Questions Attempted: ${session.questionsAttempted}
Questions Correct: ${session.questionsCorrect}
Total Score: ${session.totalScore}/${session.maxPossibleScore} (${scorePercent}%)
Average Time Per Question: ${session.averageTimePerQuestion}s

=== TOPICS ===
Selected Topics: ${session.selectedTopics.join(", ")}
Current Topic: ${session.currentTopic || "None"}
Strong Topics: ${session.strongTopics.length > 0 ? session.strongTopics.join(", ") : "Not enough data yet"}
Weak Topics: ${session.weakTopics.length > 0 ? session.weakTopics.join(", ") : "Not enough data yet"}

=== TOPIC PERFORMANCE ===
${Object.entries(session.topicScores)
  .map(([topic, score]) => `${topic}: ${score.correct}/${score.total} (${score.percentage}%)`)
  .join("\n") || "No topic data yet"}

=== RECENT ATTEMPTS (Last 5) ===
${session.attempts
  .slice(-5)
  .map((a) => `- ${a.topic} (${a.type}): ${a.isCorrect ? "✓ Correct" : "✗ Incorrect"} - ${a.score}/${a.maxScore}`)
  .join("\n") || "No attempts yet"}
`.trim();
  }, [session]);

  const getPracticeContext = useCallback((): string => {
    if (!session || session.mode !== "practice") {
      return "Practice mode not active. Start a practice session to begin.";
    }

    const context = getAIContext();
    const insights: string[] = [];

    if (session.weakTopics.length > 0) {
      insights.push(`RECOMMENDATION: Focus on weak topics: ${session.weakTopics.join(", ")}`);
    }
    if (session.questionsAttempted > 5 && session.averageTimePerQuestion > 60) {
      insights.push("INSIGHT: You're taking longer than average. Try to improve speed.");
    }
    if (session.strongTopics.length > 0) {
      insights.push(`STRENGTH: You're doing well in: ${session.strongTopics.join(", ")}`);
    }

    return `
${context}

=== PRACTICE MODE INSTRUCTIONS ===
You are a friendly AI tutor helping the user practice.
- Provide hints when they struggle
- Explain answers thoroughly
- Focus on weak topics: ${session.weakTopics.join(", ") || "None identified yet"}
- Give encouragement and insights

=== INSIGHTS ===
${insights.join("\n") || "Keep practicing to unlock insights!"}
`.trim();
  }, [session, getAIContext]);

  const getTestContext = useCallback((): string => {
    if (!session || session.mode !== "test") {
      return "Test mode not active. Start a test session to begin.";
    }

    const context = getAIContext();

    return `
${context}

=== TEST MODE INSTRUCTIONS ===
You are a strict examiner conducting a timed test.
- Do NOT provide hints or help during the test
- Only acknowledge answers as received
- Track time and question count
- Provide detailed feedback ONLY after test completion
- Cover all selected topics evenly
- Mix question difficulty (easy, medium, hard)

=== TEST STATUS ===
Questions to cover per topic: ~3-5
Total expected questions: ${session.selectedTopics.length * 4}
Remaining topics: ${session.selectedTopics.filter(t => !session.topicScores[t] || session.topicScores[t].total < 3).join(", ") || "All covered"}
`.trim();
  }, [session, getAIContext]);

  const getInterviewContext = useCallback((): string => {
    if (!session || session.mode !== "interview") {
      return "Interview mode not active. Start an interview session to begin.";
    }

    const context = getAIContext();
    const completedRounds = session.rounds.filter((r) => r.status === "completed");
    const pendingRounds = session.rounds.filter((r) => r.status === "pending");

    return `
${context}

=== INTERVIEW MODE INSTRUCTIONS ===
You are a professional technical interviewer.
- Be professional but friendly
- Ask follow-up questions based on answers
- Challenge the candidate appropriately
- Cover all selected topics systematically
- Provide constructive feedback at the end

=== INTERVIEW PROGRESS ===
Status: ${session.interviewStatus}
Current Round: ${session.currentRound + 1}/${session.rounds.length}
Completed Rounds: ${completedRounds.length}
${completedRounds.map((r) => `  ✓ ${r.topic} (${r.type}): ${r.score}/${r.maxScore}`).join("\n")}

Pending Rounds:
${pendingRounds.map((r) => `  ○ ${r.topic}`).join("\n") || "All rounds completed!"}

=== CANDIDATE ANALYSIS ===
Major Strengths: ${session.strongTopics.join(", ") || "To be determined"}
Areas for Improvement: ${session.weakTopics.join(", ") || "To be determined"}
Overall Performance: ${session.maxPossibleScore > 0 ? Math.round((session.totalScore / session.maxPossibleScore) * 100) : 0}%

=== NEXT STEPS ===
${session.interviewStatus === "introduction" 
  ? "Start with an introduction. Ask the candidate about their background."
  : session.interviewStatus === "completed"
  ? "Provide detailed feedback and final assessment."
  : `Continue with ${session.currentTopic || session.selectedTopics[session.currentRound]} round.`}
`.trim();
  }, [session, getAIContext]);

  const getTopicAnalysis = useCallback(() => {
    if (!session) {
      return { strong: [], weak: [], needsWork: [] };
    }
    return analyzeTopics(session.topicScores);
  }, [session, analyzeTopics]);

  const value = useMemo<InterviewContextType>(
    () => ({
      session,
      isLoading,
      startSession,
      endSession,
      recordAttempt,
      recordQuizResults,
      setCurrentTopic,
      startRound,
      completeRound,
      getAIContext,
      getPracticeContext,
      getInterviewContext,
      getTestContext,
      getTopicAnalysis,
    }),
    [
      session,
      isLoading,
      startSession,
      endSession,
      recordAttempt,
      recordQuizResults,
      setCurrentTopic,
      startRound,
      completeRound,
      getAIContext,
      getPracticeContext,
      getInterviewContext,
      getTestContext,
      getTopicAnalysis,
    ]
  );

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

// Export available topics
export { AVAILABLE_TOPICS };
