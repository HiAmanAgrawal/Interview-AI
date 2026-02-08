/**
 * Topic Types
 * Type definitions for all question formats
 */

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
  timeLimit?: number; // in minutes
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
  correctMatches: { leftId: string; rightId: string }[]; // Array of match pairs
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface WhiteboardQuestion {
  id: string;
  type: "whiteboard";
  title: string;
  question: string;
  hints?: string[];
  sampleDiagram?: string; // URL or base64
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number;
  tags?: string[];
}

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
