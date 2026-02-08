"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════════════════════════════════════

const renderMarkdown = (text: string) => {
  if (!text) return null;
  
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeContent = part.slice(3, -3);
      const firstNewLine = codeContent.indexOf("\n");
      const language = firstNewLine > 0 ? codeContent.slice(0, firstNewLine).trim() : "";
      const code = firstNewLine > 0 ? codeContent.slice(firstNewLine + 1) : codeContent;
      
      return (
        <pre key={index} className="my-3 p-4 bg-black/40 rounded-xl overflow-x-auto border border-white/10">
          {language && <div className="text-xs text-purple-400 mb-2 font-mono">{language}</div>}
          <code className="text-sm font-mono text-green-400 whitespace-pre">{code}</code>
        </pre>
      );
    }
    
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
    
    return <span key={index}>{processInline(part, `p-${index}`)}</span>;
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const whiteboardSchema = z.object({
  title: z.string().describe("Title of the whiteboard question"),
  question: z.string().describe("The problem to solve on whiteboard - supports markdown: **bold**, *italic*, `code`"),
  hints: z.array(z.string()).optional().describe("Hints for the solution"),
  timeLimit: z.number().optional().describe("Time limit in minutes"),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("Difficulty level"),
});

export type WhiteboardProps = z.infer<typeof whiteboardSchema>;

interface Shape {
  id: string;
  type: "rect" | "circle" | "arrow" | "text" | "database" | "server" | "user" | "cloud";
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Whiteboard = ({
  title,
  question,
  hints = [],
  timeLimit,
  difficulty = "medium",
}: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapesState, setShapes] = useTamboComponentState<Shape[]>("shapes", []);
  const shapes = shapesState ?? [];
  
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser" | "select" | "rect" | "circle" | "arrow" | "text" | "database" | "server" | "user" | "cloud">("pen");
  const [brushColor, setBrushColor] = useState("#a855f7");
  const [brushSize, setBrushSize] = useState(3);
  const [showHints, setShowHints] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusState, setSubmitStatus] = useTamboComponentState<"idle" | "submitted">("submitStatus", "idle");
  const submitStatus = submitStatusState ?? "idle";
  
  // Store diagram description for AI to review (visible to Tambo)
  const [diagramDescriptionState, setDiagramDescription] = useTamboComponentState<string>("diagramDescription", "");
  const diagramDescription = diagramDescriptionState ?? "";

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const colors = [
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#22c55e", // Green
    "#eab308", // Yellow
    "#f97316", // Orange
    "#ef4444", // Red
    "#ffffff", // White
  ];

  const tools = [
    { id: "pen", icon: "✏️", label: "Pen" },
    { id: "eraser", icon: "🧹", label: "Eraser" },
    { id: "select", icon: "👆", label: "Select" },
    { id: "rect", icon: "⬜", label: "Rectangle" },
    { id: "circle", icon: "⭕", label: "Circle" },
    { id: "arrow", icon: "➡️", label: "Arrow" },
    { id: "text", icon: "📝", label: "Text" },
  ];

  const systemIcons = [
    { id: "database", icon: "🗄️", label: "Database" },
    { id: "server", icon: "🖥️", label: "Server" },
    { id: "user", icon: "👤", label: "User" },
    { id: "cloud", icon: "☁️", label: "Cloud" },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear and set background
    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#ffffff10";
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw shapes
    shapes.forEach((shape) => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;
      ctx.font = "16px Inter";
      
      if (shape.type === "rect" && shape.width && shape.height) {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle" && shape.width) {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.width / 2, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === "text" && shape.text) {
        ctx.fillText(shape.text, shape.x, shape.y);
      } else if (["database", "server", "user", "cloud"].includes(shape.type)) {
        const icons: Record<string, string> = {
          database: "🗄️",
          server: "🖥️",
          user: "👤",
          cloud: "☁️",
        };
        ctx.font = "32px serif";
        ctx.fillText(icons[shape.type] || "", shape.x, shape.y);
      }

      // Selection indicator
      if (selectedShape === shape.id) {
        ctx.strokeStyle = "#a855f7";
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(shape.x - 5, shape.y - 35, 50, 50);
        ctx.setLineDash([]);
      }
    });
  }, [shapes, selectedShape]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasCoords(e);
    
    if (["database", "server", "user", "cloud"].includes(currentTool)) {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: currentTool as "database" | "server" | "user" | "cloud",
        x: pos.x,
        y: pos.y,
        color: brushColor,
      };
      setShapes([...shapes, newShape]);
      return;
    }

    if (currentTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newShape: Shape = {
          id: Date.now().toString(),
          type: "text",
          x: pos.x,
          y: pos.y,
          text,
          color: brushColor,
        };
        setShapes([...shapes, newShape]);
      }
      return;
    }

    if (currentTool === "rect" || currentTool === "circle") {
      setIsDrawing(true);
      setLastPos(pos);
      return;
    }

    if (currentTool === "pen" || currentTool === "eraser") {
      setIsDrawing(true);
      setLastPos(pos);
    }
  }, [currentTool, getCanvasCoords, brushColor, shapes, setShapes]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getCanvasCoords(e);

    if (currentTool === "pen") {
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setLastPos(pos);
    } else if (currentTool === "eraser") {
      ctx.beginPath();
      ctx.strokeStyle = "#0f0f14";
      ctx.lineWidth = brushSize * 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setLastPos(pos);
    }
  }, [isDrawing, lastPos, currentTool, brushColor, brushSize, getCanvasCoords]);

  const stopDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getCanvasCoords(e);

    if (currentTool === "rect") {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: "rect",
        x: Math.min(lastPos.x, pos.x),
        y: Math.min(lastPos.y, pos.y),
        width: Math.abs(pos.x - lastPos.x),
        height: Math.abs(pos.y - lastPos.y),
        color: brushColor,
      };
      setShapes([...shapes, newShape]);
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(Math.pow(pos.x - lastPos.x, 2) + Math.pow(pos.y - lastPos.y, 2));
      const newShape: Shape = {
        id: Date.now().toString(),
        type: "circle",
        x: lastPos.x,
        y: lastPos.y,
        width: radius * 2,
        color: brushColor,
      };
      setShapes([...shapes, newShape]);
    }

    setIsDrawing(false);
  }, [isDrawing, currentTool, lastPos, getCanvasCoords, brushColor, shapes, setShapes]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw grid
    ctx.strokeStyle = "#ffffff10";
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    setShapes([]);
  };

  const submitDesign = useCallback(async () => {
    setIsSubmitting(true);
    
    // Describe the shapes for AI review
    const shapeDescriptions = shapes.map((shape) => {
      const typeNames: Record<string, string> = {
        rect: "Rectangle",
        circle: "Circle",
        text: "Text",
        database: "Database",
        server: "Server",
        user: "User/Client",
        cloud: "Cloud Service",
      };
      return `${typeNames[shape.type] || shape.type}${shape.text ? `: "${shape.text}"` : ""}`;
    });

    const diagramSummary = shapeDescriptions.length > 0
      ? shapeDescriptions.join(", ")
      : "Empty diagram";

    // Store the diagram description in Tambo state (visible to AI)
    setDiagramDescription(`System Design for "${title}":
Problem: ${question}

Components used (${shapes.length} total):
${diagramSummary}

To get AI feedback, type in the chat: "Please review my system design"`);
    
    setSubmitStatus("submitted");
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
  }, [shapes, title, question, setDiagramDescription, setSubmitStatus]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl">
                🏗️
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[difficulty]}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </span>
                  <span className="text-xs text-white/40">System Design</span>
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
                  💡 Hints
                </button>
              )}
              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                🗑️ Clear
              </button>
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

        {/* Toolbar */}
        <div className="p-3 bg-gray-900/50 border-b border-white/10 flex flex-wrap items-center gap-3">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id as typeof currentTool)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  currentTool === tool.id
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* System Icons */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {systemIcons.map((icon) => (
              <button
                key={icon.id}
                onClick={() => setCurrentTool(icon.id as typeof currentTool)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  currentTool === icon.id
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
                title={icon.label}
              >
                {icon.icon}
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded-full transition-all ${
                  brushColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
            <span className="text-white/40 text-xs">Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-16 accent-purple-500"
            />
            <span className="text-white/60 text-xs w-4">{brushSize}</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-[500px] cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900/50 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-white/40 text-sm">
              Draw your system design diagram using the tools above
            </div>
            {shapes.length > 0 && (
              <div className="px-3 py-1 bg-white/5 rounded-lg text-white/60 text-sm">
                {shapes.length} component{shapes.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <button
            onClick={submitDesign}
            disabled={isSubmitting || shapes.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : submitStatus === "submitted" ? (
              <>✓ Submitted for Review</>
            ) : (
              <>📤 Submit Design</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
