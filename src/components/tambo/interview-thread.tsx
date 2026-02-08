"use client";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputMcpResourceButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContainer, useThreadContainerContext } from "./thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { useMergeRefs } from "@/lib/thread-hooks";
import type { Suggestion } from "@tambo-ai/react";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export interface InterviewConfig {
  mode: "practice" | "test" | "interview";
  userName: string;
  topics: string[];
  questionLimits?: {
    mcq: number;
    theory: number;
    coding: number;
    total: number;
  };
  enableFullscreen?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// FULLSCREEN MANAGER WITH TAB WARNING IN THREAD
// ═══════════════════════════════════════════════════════════════════════════

const FullscreenManager = ({ 
  enabled, 
  onTabSwitch,
  onFullscreenEnter,
}: { 
  enabled: boolean; 
  onTabSwitch?: (count: number) => void;
  onFullscreenEnter?: () => void;
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const hasNotifiedFullscreen = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Request fullscreen on mount
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
          
          // Notify once when fullscreen is entered
          if (!hasNotifiedFullscreen.current) {
            hasNotifiedFullscreen.current = true;
            onFullscreenEnter?.();
          }
        }
      } catch (e) {
        console.log("Fullscreen request failed:", e);
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(enterFullscreen, 500);
    return () => clearTimeout(timer);
  }, [enabled, onFullscreenEnter]);

  useEffect(() => {
    if (!enabled) return;

    let wasFullscreen = !!document.fullscreenElement;

    // Handle fullscreen change (including ESC key exit)
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // Detect if user exited fullscreen (was in fullscreen, now not)
      if (wasFullscreen && !isNowFullscreen) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        setShowWarning(true);
        onTabSwitch?.(newCount);
        
        // Dispatch fullscreen exit event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("fullscreen-exit-detected", {
            detail: { count: newCount }
          }));
        }
        
        setTimeout(() => setShowWarning(false), 5000);
      }
      wasFullscreen = isNowFullscreen;
    };

    // Handle visibility change (tab switch detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1;
        setTabSwitchCount(newCount);
        setShowWarning(true);
        onTabSwitch?.(newCount);
        
        // Auto-hide warning after 5 seconds
        setTimeout(() => setShowWarning(false), 5000);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, tabSwitchCount, onTabSwitch]);

  if (!enabled) return null;

  return (
    <>
      {/* Tab Switch Warning - Fixed Banner */}
      {showWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Tab Switch Warning #{tabSwitchCount}</p>
              <p className="text-sm text-red-200">
                {tabSwitchCount >= 3 
                  ? "Final warning! Next switch will end your interview." 
                  : `${3 - tabSwitchCount} warning(s) remaining before interview ends.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
          isFullscreen 
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        }`}>
          {isFullscreen ? (
            <>
              <span>🔒</span>
              <span>Fullscreen Mode</span>
            </>
          ) : (
            <>
              <span>⚠️</span>
              <span>Press F11 for fullscreen</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Tab Warning Message Component (displays in thread)
const TabWarningMessage = ({ count }: { count: number }) => (
  <div className="w-full my-4 px-4">
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🚨</span>
        <div>
          <h4 className="text-red-700 font-semibold">Tab Switch Detected - Warning #{count}</h4>
          <p className="text-red-600 text-sm mt-1">
            {count === 1 && "Please stay on this tab during your interview. Switching tabs is monitored."}
            {count === 2 && "Second warning! One more tab switch and your interview will be terminated."}
            {count >= 3 && "Final warning! Switching tabs again will automatically end your interview session."}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// INTERVIEW THREAD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface InterviewThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof messageVariants>["variant"];
  config: InterviewConfig;
  onQuestionCountUpdate?: (count: number) => void;
}

export const InterviewThread = React.forwardRef<
  HTMLDivElement,
  InterviewThreadProps
>(({ className, variant, config, onQuestionCountUpdate, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef);
  const { thread } = useTamboThread();
  const { setValue, submit } = useTamboThreadInput();
  const hasGreeted = useRef(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [tabWarnings, setTabWarnings] = useState<number[]>([]);

  // Handle tab switch - add warning to thread
  const handleTabSwitch = useCallback((count: number) => {
    setTabWarnings(prev => [...prev, count]);
    
    // Also send a message to the AI about the tab switch
    if (count >= 3) {
      setValue("[SYSTEM] User has switched tabs 3 times. Issue a final warning that one more switch will end the interview.");
      setTimeout(() => submit(), 100);
    }
  }, [setValue, submit]);

  // Handle fullscreen enter - notify AI
  const handleFullscreenEnter = useCallback(() => {
    setValue("[SYSTEM] Fullscreen mode activated. Remind the user they are now in fullscreen mode and tab switches will be monitored. Begin the interview.");
    setTimeout(() => submit(), 100);
  }, [setValue, submit]);

  // Listen for question timeout events
  useEffect(() => {
    const handleTimeout = (event: CustomEvent) => {
      console.log("[InterviewThread] Question timeout:", event.detail);
      setValue(`[SYSTEM] User ran out of time for question "${event.detail.id}". Award 0 marks for this question. Briefly acknowledge the timeout and IMMEDIATELY proceed to the next question. Do not dwell on the missed question.`);
      setTimeout(() => submit(), 100);
    };

    const handleFullscreenExit = (event: CustomEvent) => {
      console.log("[InterviewThread] Fullscreen exit detected:", event.detail);
      const count = event.detail.count;
      if (count >= 3) {
        setValue("[SYSTEM] User has exited fullscreen 3 times. Issue FINAL WARNING that one more violation will terminate the interview. This is serious.");
      } else {
        setValue(`[SYSTEM] User exited fullscreen mode (Warning #${count}). Issue a warning that staying in fullscreen is required. ${3 - count} warnings remaining before interview termination.`);
      }
      setTimeout(() => submit(), 100);
    };

    window.addEventListener("theory-question-timeout", handleTimeout as EventListener);
    window.addEventListener("fullscreen-exit-detected", handleFullscreenExit as EventListener);

    return () => {
      window.removeEventListener("theory-question-timeout", handleTimeout as EventListener);
      window.removeEventListener("fullscreen-exit-detected", handleFullscreenExit as EventListener);
    };
  }, [setValue, submit]);

  // Auto-send initial greeting
  useEffect(() => {
    if (hasGreeted.current) return;
    if (!thread || thread.messages.length > 0) return;

    hasGreeted.current = true;

    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      const greeting = getInitialGreeting(config);
      // Set the value and then submit
      setValue(greeting);
      // Need a small delay for the value to be set
      setTimeout(() => submit(), 100);
    }, 500);

    return () => clearTimeout(timer);
  }, [thread, config, setValue, submit]);

  // Track question count from messages
  useEffect(() => {
    if (!thread) return;
    
    let count = 0;
    thread.messages.forEach((msg) => {
      // Count rendered components as questions
      if (msg.renderedComponent) {
        count++;
      }
    });
    
    setQuestionCount(count);
    onQuestionCountUpdate?.(count);
  }, [thread, onQuestionCountUpdate]);

  const getInitialGreeting = (cfg: InterviewConfig): string => {
    const { mode, userName, topics } = cfg;
    const topicList = topics.join(", ");
    
    switch (mode) {
      case "practice":
        return `[SYSTEM] Start a practice session. User: ${userName}. Topics: ${topicList}. 

EXACTLY 15 QUESTIONS REQUIRED. YOU MUST COMPLETE ALL 15!

Greet the user warmly, mention they can type or use the microphone.

MANDATORY QUESTION SEQUENCE (FOLLOW EXACTLY):
Q1: MCQQuiz (5 MCQs)
Q2: TheoryQuestion 
Q3: CodeEditor (coding problem)
Q4: TheoryQuestion
Q5: MCQQuiz (5 MCQs on different topic)
Q6: MatchFollowing (concept matching)
Q7: TheoryQuestion
Q8: CodeEditor (coding problem)
Q9: TheoryQuestion
Q10: MCQQuiz (5 MCQs)
Q11: Whiteboard (if system design topic, else CodeEditor)
Q12: TheoryQuestion
Q13: CodeEditor (final coding)
Q14: TheoryQuestion
Q15: ScoreCard (show final results)

ABSOLUTE RULES - MUST FOLLOW:
1. EVERY question MUST use a component (MCQQuiz, TheoryQuestion, CodeEditor, Whiteboard, MatchFollowing)
2. NEVER write questions as plain text - ALWAYS render TheoryQuestion component for theory questions
3. If user says "I don't know" or "skip" - provide the answer briefly, then show NEXT question immediately
4. NEVER repeat the same question - always move forward
5. Track: "Question X of 15"
6. After rating a theory answer, IMMEDIATELY show next question component
7. MCQQuiz counts as ONE question (contains 5 MCQs inside)
8. You MUST reach Q15 (ScoreCard) - don't stop early!
9. Give hints in practice mode when user struggles`;
      
      case "test":
        return `[SYSTEM] Start a test session. User: ${userName}. Topics: ${topicList}.

EXACTLY 15 QUESTIONS REQUIRED. YOU MUST COMPLETE ALL 15!

Greet briefly as examiner. No hints allowed. Start immediately.

MANDATORY QUESTION SEQUENCE (FOLLOW EXACTLY):
Q1: MCQQuiz (5 MCQs)
Q2: TheoryQuestion 
Q3: TheoryQuestion
Q4: CodeEditor (coding problem)
Q5: MCQQuiz (5 MCQs)
Q6: TheoryQuestion
Q7: MatchFollowing (concept matching)
Q8: TheoryQuestion
Q9: CodeEditor (coding problem)
Q10: MCQQuiz (5 MCQs)
Q11: TheoryQuestion
Q12: Whiteboard (if system design, else CodeEditor)
Q13: TheoryQuestion
Q14: CodeEditor (final coding)
Q15: ScoreCard (show final results)

ABSOLUTE RULES - MUST FOLLOW:
1. EVERY question MUST use a component (MCQQuiz, TheoryQuestion, CodeEditor, Whiteboard, MatchFollowing)
2. NEVER write questions as plain text - ALWAYS render TheoryQuestion component
3. If user says "I don't know" or "skip" - rate 0, move to NEXT question immediately
4. NEVER repeat the same question - always move forward
5. Track: "Question X of 15"
6. No hints, no explanations during test
7. After each answer, acknowledge briefly → show NEXT question component
8. MCQQuiz counts as ONE question (contains 5 MCQs inside)
9. You MUST reach Q15 (ScoreCard) - don't stop early!`;
      
      case "interview":
        return `[SYSTEM] Start a technical interview. User: ${userName}. Topics: ${topicList}.

EXACTLY 15 QUESTIONS in structured rounds. YOU MUST COMPLETE ALL 15!

Greet professionally. Ask for brief introduction, then begin immediately.

MANDATORY QUESTION SEQUENCE (FOLLOW EXACTLY):
Q1: MCQQuiz (5 MCQs on ${topics[0] || topicList})
Q2: TheoryQuestion 
Q3: CodeEditor (coding problem)
Q4: TheoryQuestion
Q5: MCQQuiz (5 MCQs on different topic)
Q6: MatchFollowing (concept matching)
Q7: TheoryQuestion
Q8: CodeEditor (coding problem)
Q9: TheoryQuestion
Q10: MCQQuiz (5 MCQs)
Q11: Whiteboard (system design if applicable)
Q12: TheoryQuestion
Q13: CodeEditor (final coding)
Q14: TheoryQuestion
Q15: ScoreCard (show final results)

ABSOLUTE RULES - MUST FOLLOW:
1. EVERY question MUST use a component (MCQQuiz, TheoryQuestion, CodeEditor, Whiteboard, MatchFollowing)
2. NEVER write questions as plain text - ALWAYS render TheoryQuestion component
3. If user says "I don't know" or "skip" - rate 0/5, say "Let's move on" and show NEXT question immediately
4. NEVER repeat the same question - always move forward
5. Track: "Question X of 15"
6. After rating a theory answer, IMMEDIATELY show next question component
7. MCQQuiz counts as ONE question (contains 5 MCQs inside)
8. You MUST reach Q15 (ScoreCard) - don't stop early!
6. At the end, show ScoreCard with detailed feedback`;
      
      default:
        return `Hello ${userName}! Let's begin.`;
    }
  };

  // Mode-specific suggestions
  const getSuggestions = (): Suggestion[] => {
    const limits = config.questionLimits || { mcq: 5, theory: 3, coding: 2, total: 10 };
    const remaining = limits.total - questionCount;
    
    if (remaining <= 0) {
      return [
        {
          id: "end-session",
          title: "📊 Show Results",
          detailedSuggestion: "Show me my final score and performance summary",
          messageId: "results",
        },
      ];
    }

    switch (config.mode) {
      case "practice":
        return [
          {
            id: "next-question",
            title: "📝 Next Question",
            detailedSuggestion: "Give me another question",
            messageId: "next",
          },
          {
            id: "hint",
            title: "💡 Need a Hint",
            detailedSuggestion: "I need a hint for this question",
            messageId: "hint",
          },
          {
            id: "explain",
            title: "📖 Explain",
            detailedSuggestion: "Can you explain this concept?",
            messageId: "explain",
          },
        ];
      
      case "test":
        return [
          {
            id: "submit",
            title: "✅ Submit",
            detailedSuggestion: "Submit my answer",
            messageId: "submit",
          },
          {
            id: "skip",
            title: "⏭️ Skip",
            detailedSuggestion: "Skip this question",
            messageId: "skip",
          },
        ];
      
      case "interview":
        return [
          {
            id: "ready",
            title: "✅ I'm Ready",
            detailedSuggestion: "I'm ready for the next question",
            messageId: "ready",
          },
          {
            id: "clarify",
            title: "❓ Clarify",
            detailedSuggestion: "Can you clarify the question?",
            messageId: "clarify",
          },
        ];
      
      default:
        return [];
    }
  };

  return (
    <div className="flex h-full w-full relative">
      <FullscreenManager 
        enabled={config.mode === "interview" && config.enableFullscreen !== false}
        onTabSwitch={handleTabSwitch}
        onFullscreenEnter={handleFullscreenEnter}
      />

      <ThreadContainer
        ref={mergedRef}
        disableSidebarSpacing
        className={className}
        {...props}
      >
        {/* Question Counter */}
        {config.mode !== "practice" && (
          <div className="absolute top-4 left-4 z-40">
            <div className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-white/60 text-xs">Questions</p>
              <p className="text-xl font-bold text-white">
                {questionCount}/{config.questionLimits?.total || 10}
              </p>
            </div>
          </div>
        )}

        <ScrollableMessageContainer className="p-4">
          {/* Tab Switch Warnings displayed in thread */}
          {tabWarnings.map((count, idx) => (
            <TabWarningMessage key={`tab-warning-${idx}`} count={count} />
          ))}
          
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        <div className="px-4 pb-4">
          <MessageInput>
            <MessageInputTextarea placeholder="Type your answer or use the microphone..." />
            <MessageInputToolbar>
              <MessageInputFileButton />
              <MessageInputMcpPromptButton />
              <MessageInputMcpResourceButton />
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>

        <MessageSuggestions initialSuggestions={getSuggestions()}>
          <MessageSuggestionsList />
        </MessageSuggestions>
      </ThreadContainer>

      {historyPosition === "right" && (
        <div className="w-64 border-l border-white/10 bg-gray-900/50" />
      )}
    </div>
  );
});
InterviewThread.displayName = "InterviewThread";
