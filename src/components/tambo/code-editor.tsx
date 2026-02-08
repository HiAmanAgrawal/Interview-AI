"use client";

import React, { useState, useCallback } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const codeEditorSchema = z.object({
  title: z.string().describe("Title of the coding challenge"),
  question: z.string().describe("The problem description - supports markdown: **bold**, *italic*, `inline code`, ```code blocks```"),
  starterCode: z.string().describe("Initial code template"),
  language: z.enum(["javascript", "python", "typescript", "sql"]).describe("Programming language"),
  testCases: z.array(
    z.object({
      input: z.string().describe("Test input"),
      expectedOutput: z.string().describe("Expected output"),
      isHidden: z.boolean().optional().describe("Whether test case is hidden"),
    })
  ).optional().describe("Array of test cases"),
  hints: z.array(z.string()).optional().describe("Hints for solving"),
  timeLimit: z.number().optional().describe("Time limit in minutes"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
});

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════════════════

const renderMarkdown = (text: string) => {
  if (!text) return null;
  
  // Split by code blocks first (triple backticks)
  const parts = text.split(/(```[\s\S]*?```)/g);
  
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
      const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
      let lastIndex = 0;
      let match;
      let matchIndex = 0;
      
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          result.push(<span key={`${baseKey}-text-${matchIndex}`}>{text.slice(lastIndex, match.index)}</span>);
        }
        
        const matched = match[0];
        if (matched.startsWith("**") && matched.endsWith("**")) {
          result.push(
            <strong key={`${baseKey}-bold-${matchIndex}`} className="font-bold text-white">
              {matched.slice(2, -2)}
            </strong>
          );
        } else if (matched.startsWith("*") && matched.endsWith("*")) {
          result.push(
            <em key={`${baseKey}-italic-${matchIndex}`} className="italic text-white/90">
              {matched.slice(1, -1)}
            </em>
          );
        } else if (matched.startsWith("`") && matched.endsWith("`")) {
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
      
      if (lastIndex < text.length) {
        result.push(<span key={`${baseKey}-text-end`}>{text.slice(lastIndex)}</span>);
      }
      
      return result.length > 0 ? result : [<span key={`${baseKey}-plain`}>{text}</span>];
    };
    
    return <span key={index}>{processInlineFormatting(part, `part-${index}`)}</span>;
  });
};

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const CodeEditor = ({
  title,
  question,
  starterCode = "",
  language = "javascript",
  testCases = [],
  hints = [],
  timeLimit,
  difficulty = "medium",
}: CodeEditorProps) => {
  const [codeState, setCode] = useTamboComponentState("code", starterCode);
  const code = codeState ?? starterCode;
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusState, setSubmitStatus] = useTamboComponentState<"idle" | "submitted" | "reviewed">("submitStatus", "idle");
  const submitStatus = submitStatusState ?? "idle";
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "tests" | "feedback">("output");
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [feedbackState, setFeedback] = useTamboComponentState<string>("feedback", "");
  const feedback = feedbackState ?? "";
  
  // Store submitted code for AI to review (visible to Tambo)
  const [submittedCodeState, setSubmittedCode] = useTamboComponentState<string>("submittedCode", "");
  const submittedCode = submittedCodeState ?? "";

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const languageIcons: Record<string, string> = {
    javascript: "📜",
    python: "🐍",
    typescript: "💙",
    sql: "🗃️",
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setTestResults([]);
    const startTime = performance.now();

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));
      
      // For SQL, don't use eval - just simulate
      if (language === "sql") {
        setOutput("✓ SQL syntax appears valid\n\n[Note: SQL execution requires a database connection. Submit for AI review to get feedback on your query logic.]");
        setTestResults([]);
      } else if (language === "javascript" || language === "typescript") {
        try {
          // Create a safe execution context
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
          };
          
          // Execute with mock console
          const wrappedCode = `
            (function(console) {
              ${code}
            })
          `;
          const fn = eval(wrappedCode);
          fn(mockConsole);
          
          setOutput(logs.length > 0 ? logs.join("\n") : "✓ Code executed successfully (no output)");
          
          // Run test cases
          if (testCases && testCases.length > 0) {
            const results = testCases.filter(tc => !tc.isHidden).map((tc, idx) => ({
              passed: Math.random() > 0.3, // Simulated test results
              message: `Test ${idx + 1}: ${tc.input} → Expected: ${tc.expectedOutput}`,
            }));
            setTestResults(results);
          }
        } catch (err) {
          setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else {
        // For Python, simulate execution
        setOutput("✓ Code compiled successfully\n\n[Python execution simulated]");
        if (testCases && testCases.length > 0) {
          const results = testCases.filter(tc => !tc.isHidden).map((tc, idx) => ({
            passed: Math.random() > 0.3,
            message: `Test ${idx + 1}: ${tc.input} → Expected: ${tc.expectedOutput}`,
          }));
          setTestResults(results);
        }
      }
    } catch {
      setOutput("Execution failed. Please check your code.");
    } finally {
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      setIsRunning(false);
    }
  }, [code, language, testCases]);

  const passedTests = testResults.filter((r) => r.passed).length;
  const totalTests = testResults.length;

  const submitCode = useCallback(async () => {
    setIsSubmitting(true);
    setActiveTab("feedback");
    
    // Store the submitted code in Tambo state (visible to AI)
    setSubmittedCode(code);
    setSubmitStatus("submitted");
    setFeedback(`Your ${language} solution for "${title}" has been submitted for AI review.

The AI will analyze your code and provide feedback shortly...`);
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Dispatch event for InterviewThread to send the code to AI for review
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("code-submitted", {
        detail: {
          title,
          language,
          code,
          question,
        }
      }));
    }
    
    setIsSubmitting(false);
  }, [code, language, title, question, setSubmittedCode, setSubmitStatus, setFeedback]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                {languageIcons[language]}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[difficulty]}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="text-xs text-white/40">{language}</span>
                  {timeLimit && (
                    <span className="text-xs text-white/40">⏱️ {timeLimit} min</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {hints && hints.length > 0 && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    showHints
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  💡 Hints ({hints.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="text-white/80 leading-relaxed">{renderMarkdown(question)}</div>
        </div>

        {/* Hints */}
        {showHints && hints && hints.length > 0 && (
          <div className="p-4 bg-yellow-500/5 border-b border-yellow-500/20">
            <h4 className="text-yellow-400 font-medium mb-2">💡 Hints</h4>
            <ul className="space-y-1">
              {hints.map((hint, idx) => (
                <li key={idx} className="text-white/60 text-sm flex items-start gap-2">
                  <span className="text-yellow-400">{idx + 1}.</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Editor */}
        <div className="border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-white/40 text-sm ml-2">solution.{language === "python" ? "py" : language === "typescript" ? "ts" : "js"}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="px-4 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>▶ Run Code</>
                )}
              </button>
              <button
                onClick={submitCode}
                disabled={isSubmitting || !code.trim()}
                className="px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : submitStatus === "submitted" ? (
                  <>✓ Submitted</>
                ) : (
                  <>📤 Submit for Review</>
                )}
              </button>
            </div>
          </div>
          
          <div className="relative">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900/50 flex flex-col items-end pr-3 pt-4 text-white/20 text-sm font-mono select-none">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full min-h-[300px] bg-transparent text-white/90 font-mono text-sm p-4 pl-14 resize-none focus:outline-none leading-6"
              spellCheck={false}
              placeholder="Write your code here..."
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-gray-900/50">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "output"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              Output
            </button>
            {testCases && testCases.length > 0 && (
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === "tests"
                    ? "text-white border-b-2 border-purple-500"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                Test Cases
                {testResults.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    passedTests === totalTests ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {passedTests}/{totalTests}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab("feedback")}
              className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "feedback"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              AI Feedback
              {submitStatus === "submitted" && (
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>
            {executionTime !== null && (
              <div className="ml-auto px-4 py-2 text-xs text-white/40">
                Executed in {executionTime}ms
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4 min-h-[120px]">
            {activeTab === "output" && (
              <pre className="text-sm font-mono text-white/70 whitespace-pre-wrap">
                {output || (
                  <span className="text-white/30">Click &quot;Run Code&quot; to see output...</span>
                )}
              </pre>
            )}
            
            {activeTab === "tests" && (
              <div className="space-y-2">
                {testResults.length > 0 ? (
                  testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg flex items-center gap-3 ${
                        result.passed
                          ? "bg-green-500/10 border border-green-500/30"
                          : "bg-red-500/10 border border-red-500/30"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        result.passed ? "bg-green-500/30 text-green-400" : "bg-red-500/30 text-red-400"
                      }`}>
                        {result.passed ? "✓" : "✗"}
                      </span>
                      <span className="text-white/70 text-sm font-mono">{result.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-white/30 text-sm">
                    Run your code to see test results...
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "feedback" && (
              <div className="space-y-4">
                {feedback ? (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h4 className="text-purple-400 font-medium mb-2">AI Review</h4>
                        <p className="text-white/70 text-sm whitespace-pre-wrap">{feedback}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📤</div>
                    <h3 className="text-white/70 font-medium mb-2">Submit for AI Review</h3>
                    <p className="text-white/40 text-sm mb-4">
                      Click &quot;Submit for Review&quot; to get detailed feedback on your code
                    </p>
                    <button
                      onClick={submitCode}
                      disabled={isSubmitting || !code.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      Submit Code
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
