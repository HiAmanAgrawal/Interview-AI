"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UserActivity {
  id: string;
  type: "mcq" | "coding" | "whiteboard" | "match" | "timer";
  topic?: string;
  title: string;
  timestamp: Date;
  score?: number;
  maxScore?: number;
  timeSpent?: number; // in seconds
  code?: string;
  diagramData?: string; // JSON string of shapes
  status: "started" | "completed" | "submitted";
  feedback?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  isTemp: boolean;
  createdAt: Date;
  activities: UserActivity[];
  totalScore: number;
  quizzesCompleted: number;
  codingChallengesCompleted: number;
  whiteboardsCompleted: number;
}

interface SessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  createQuickSession: (name: string) => void;
  logout: () => void;
  addActivity: (activity: Omit<UserActivity, "id" | "timestamp">) => void;
  updateActivity: (id: string, updates: Partial<UserActivity>) => void;
  getActivitySummary: () => string;
  submitForReview: (activityId: string, data: { code?: string; diagram?: string }) => Promise<string>;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("interview-session");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.activities = parsed.activities.map((a: UserActivity) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
        setSession(parsed);
      } catch {
        localStorage.removeItem("interview-session");
      }
    }
    setIsLoading(false);
  }, []);

  // Save session to localStorage when it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem("interview-session", JSON.stringify(session));
    }
  }, [session]);

  const createQuickSession = useCallback((name: string) => {
    const newSession: UserSession = {
      id: `session-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, "")}@temp.session`,
      image: null,
      isTemp: true,
      createdAt: new Date(),
      activities: [],
      totalScore: 0,
      quizzesCompleted: 0,
      codingChallengesCompleted: 0,
      whiteboardsCompleted: 0,
    };
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("interview-session");
    setSession(null);
  }, []);

  const addActivity = useCallback((activity: Omit<UserActivity, "id" | "timestamp">) => {
    if (!session) return;

    const newActivity: UserActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    };

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activities: [...prev.activities, newActivity],
      };
    });

    return newActivity.id;
  }, [session]);

  const updateActivity = useCallback((id: string, updates: Partial<UserActivity>) => {
    setSession((prev) => {
      if (!prev) return prev;

      const updatedActivities = prev.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );

      // Recalculate stats
      let totalScore = 0;
      let quizzesCompleted = 0;
      let codingChallengesCompleted = 0;
      let whiteboardsCompleted = 0;

      updatedActivities.forEach((a) => {
        if (a.status === "completed" || a.status === "submitted") {
          if (a.score) totalScore += a.score;
          if (a.type === "mcq" || a.type === "match") quizzesCompleted++;
          if (a.type === "coding") codingChallengesCompleted++;
          if (a.type === "whiteboard") whiteboardsCompleted++;
        }
      });

      return {
        ...prev,
        activities: updatedActivities,
        totalScore,
        quizzesCompleted,
        codingChallengesCompleted,
        whiteboardsCompleted,
      };
    });
  }, []);

  const getActivitySummary = useCallback(() => {
    if (!session) return "No active session.";

    const recentActivities = session.activities.slice(-5);
    if (recentActivities.length === 0) {
      return `User "${session.name}" has just started. No activities yet.`;
    }

    const summary = recentActivities.map((a) => {
      const status = a.status === "completed" ? "✓" : a.status === "submitted" ? "📤" : "⏳";
      const score = a.score !== undefined ? ` (Score: ${a.score}/${a.maxScore})` : "";
      return `${status} ${a.type}: ${a.title}${score}`;
    }).join("\n");

    return `User: ${session.name}
Session Stats:
- Total Score: ${session.totalScore}
- Quizzes Completed: ${session.quizzesCompleted}
- Coding Challenges: ${session.codingChallengesCompleted}
- Whiteboards: ${session.whiteboardsCompleted}

Recent Activities:
${summary}`;
  }, [session]);

  const submitForReview = useCallback(async (activityId: string, data: { code?: string; diagram?: string }): Promise<string> => {
    // Update activity with submitted data
    updateActivity(activityId, {
      status: "submitted",
      code: data.code,
      diagramData: data.diagram,
    });

    // Generate AI feedback (simulated - in real app, this would call Tambo)
    const activity = session?.activities.find((a) => a.id === activityId);
    if (!activity) return "Activity not found.";

    // Return a prompt for Tambo to review
    if (data.code) {
      return `Please review this ${activity.type} submission for "${activity.title}":\n\n\`\`\`\n${data.code}\n\`\`\`\n\nProvide feedback on correctness, efficiency, and code quality.`;
    }

    if (data.diagram) {
      return `Please review this system design submission for "${activity.title}". The user has created a diagram with the following components: ${data.diagram}. Provide feedback on the architecture, scalability, and potential improvements.`;
    }

    return "Submission received. Processing review...";
  }, [session, updateActivity]);

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        createQuickSession,
        logout,
        addActivity,
        updateActivity,
        getActivitySummary,
        submitForReview,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
