/**
 * Topic Types
 * Type definitions for topic configuration (AI generates questions dynamically)
 */

export type QuestionFormat = "mcq" | "theory" | "coding" | "whiteboard" | "match";

export interface SubTopic {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  // Preferred question formats for this subtopic
  preferredFormats: QuestionFormat[];
  // Key concepts to cover
  keyConcepts: string[];
  // Example question prompts for AI
  samplePrompts?: string[];
}

export interface TopicConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  
  // Subtopics with their configurations
  subtopics: SubTopic[];
  
  // Default question format preferences for this topic
  defaultFormats: QuestionFormat[];
  
  // Estimated time per question type (in seconds)
  timePerFormat: {
    mcq: number;
    theory: number;
    coding: number;
    whiteboard: number;
    match: number;
  };
  
  // Difficulty distribution recommendation
  difficultyMix: {
    easy: number;   // percentage
    medium: number;
    hard: number;
  };
  
  // Tags for categorization
  tags: string[];
}

// Legacy types for backward compatibility (keep existing components working)
export interface MCQQuestion {
  id: string;
  type: "mcq";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface CodingQuestion {
  id: string;
  type: "coding";
  title: string;
  question: string;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
  solution?: string;
  hints?: string[];
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number;
  language: "javascript" | "python" | "typescript";
  tags?: string[];
}

export interface MatchQuestion {
  id: string;
  type: "match";
  title: string;
  instructions?: string;
  leftColumn: { id: string; text: string }[];
  rightColumn: { id: string; text: string }[];
  correctMatches: { leftId: string; rightId: string }[];
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface WhiteboardQuestion {
  id: string;
  type: "whiteboard";
  title: string;
  question: string;
  hints?: string[];
  sampleDiagram?: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number;
  tags?: string[];
}

// Legacy TopicData type (for backward compatibility)
export interface TopicData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  mcqQuestions: MCQQuestion[];
  codingQuestions: CodingQuestion[];
  matchQuestions: MatchQuestion[];
  whiteboardQuestions: WhiteboardQuestion[];
}

export type AnyQuestion = MCQQuestion | CodingQuestion | MatchQuestion | WhiteboardQuestion;
