/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { MCQQuiz, mcqQuizSchema } from "@/components/tambo/mcq-quiz";
import { ScoreCard, scoreCardSchema } from "@/components/tambo/score-card";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════
// PREDEFINED MCQ DATA
// ═══════════════════════════════════════════════════════════════════════════

const dbmsQuestions = [
  {
    id: "dbms-1",
    question: "What does ACID stand for in database transactions?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Application, Control, Integration, Data",
      "Automated, Controlled, Integrated, Distributed",
      "Access, Create, Insert, Delete",
    ],
    correctAnswer: 0,
    explanation: "ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed changes persist).",
  },
  {
    id: "dbms-2",
    question: "Which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: 2,
    explanation: "Third Normal Form (3NF) eliminates transitive dependencies, where non-key attributes depend on other non-key attributes.",
  },
  {
    id: "dbms-3",
    question: "What is a foreign key?",
    options: [
      "A key that encrypts data",
      "A key that references a primary key in another table",
      "The first column of any table",
      "A key used for sorting",
    ],
    correctAnswer: 1,
    explanation: "A foreign key is a column that creates a link between two tables by referencing the primary key of another table.",
  },
  {
    id: "dbms-4",
    question: "Which SQL command is used to remove all records from a table without removing the table structure?",
    options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
    correctAnswer: 2,
    explanation: "TRUNCATE removes all records quickly without logging individual deletions, while keeping the table structure intact.",
  },
  {
    id: "dbms-5",
    question: "What type of JOIN returns all rows from both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctAnswer: 3,
    explanation: "FULL OUTER JOIN returns all rows from both tables, with NULL values for non-matching rows on either side.",
  },
];

const reactQuestions = [
  {
    id: "react-1",
    question: "What is the virtual DOM in React?",
    options: [
      "A direct copy of the browser DOM",
      "A lightweight JavaScript representation of the DOM",
      "A browser API for faster rendering",
      "A CSS framework for React",
    ],
    correctAnswer: 1,
    explanation: "The virtual DOM is a lightweight JavaScript object that represents the actual DOM. React uses it to optimize updates by comparing changes before applying them to the real DOM.",
  },
  {
    id: "react-2",
    question: "What hook is used to perform side effects in functional components?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation: "useEffect is used for side effects like data fetching, subscriptions, or manually changing the DOM.",
  },
  {
    id: "react-3",
    question: "What is the purpose of React.memo()?",
    options: [
      "To create memoized values",
      "To prevent unnecessary re-renders of functional components",
      "To store component state",
      "To handle errors in components",
    ],
    correctAnswer: 1,
    explanation: "React.memo() is a higher-order component that memoizes the rendered output and skips re-rendering if props haven't changed.",
  },
  {
    id: "react-4",
    question: "Which of these is NOT a valid React hook rule?",
    options: [
      "Only call hooks at the top level",
      "Only call hooks from React functions",
      "Hooks can be called inside loops",
      "Custom hooks should start with 'use'",
    ],
    correctAnswer: 2,
    explanation: "Hooks cannot be called inside loops, conditions, or nested functions. They must be called at the top level of a React function.",
  },
  {
    id: "react-5",
    question: "What is the correct way to update state based on previous state?",
    options: [
      "setState(state + 1)",
      "setState(prevState => prevState + 1)",
      "setState(this.state + 1)",
      "state = state + 1",
    ],
    correctAnswer: 1,
    explanation: "Using the functional update form ensures you're working with the most recent state value, which is important for batched updates.",
  },
];

const dsaQuestions = [
  {
    id: "dsa-1",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
  },
  {
    id: "dsa-2",
    question: "Which data structure uses LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    explanation: "A Stack follows LIFO - the last element added is the first one to be removed.",
  },
  {
    id: "dsa-3",
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    explanation: "Quick Sort has O(n²) worst-case complexity when the pivot selection is poor (e.g., already sorted array with first/last element as pivot).",
  },
  {
    id: "dsa-4",
    question: "Which traversal of a Binary Search Tree gives elements in sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    correctAnswer: 2,
    explanation: "Inorder traversal (left, root, right) of a BST visits nodes in ascending order.",
  },
  {
    id: "dsa-5",
    question: "What data structure is typically used for BFS (Breadth-First Search)?",
    options: ["Stack", "Queue", "Heap", "Hash Table"],
    correctAnswer: 1,
    explanation: "BFS uses a Queue to process nodes level by level, ensuring nodes are visited in order of their distance from the source.",
  },
];

const javascriptQuestions = [
  {
    id: "js-1",
    question: "What is the output of: typeof null?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctAnswer: 2,
    explanation: "This is a historical bug in JavaScript. typeof null returns 'object' even though null is a primitive value.",
  },
  {
    id: "js-2",
    question: "What is a closure in JavaScript?",
    options: [
      "A way to close browser windows",
      "A function with access to its outer scope even after the outer function returns",
      "A method to end loops",
      "A type of JavaScript error",
    ],
    correctAnswer: 1,
    explanation: "A closure is a function that remembers and can access variables from its outer (enclosing) scope even after that scope has finished executing.",
  },
  {
    id: "js-3",
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "No difference",
      "'==' compares values, '===' compares values and types",
      "'===' compares values, '==' compares types",
      "'==' is for strings, '===' is for numbers",
    ],
    correctAnswer: 1,
    explanation: "'==' performs type coercion before comparison, while '===' (strict equality) compares both value and type without coercion.",
  },
  {
    id: "js-4",
    question: "What does the 'this' keyword refer to in an arrow function?",
    options: [
      "The object that called the function",
      "The global object",
      "The enclosing lexical scope's 'this'",
      "undefined",
    ],
    correctAnswer: 2,
    explanation: "Arrow functions don't have their own 'this'. They inherit 'this' from the enclosing lexical scope (where the arrow function is defined).",
  },
  {
    id: "js-5",
    question: "What is event bubbling?",
    options: [
      "Creating new events",
      "Events propagating from child to parent elements",
      "Events propagating from parent to child elements",
      "Removing event listeners",
    ],
    correctAnswer: 1,
    explanation: "Event bubbling is when an event triggers on a child element and then propagates up through its ancestors in the DOM tree.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS FOR FETCHING PREDEFINED MCQs
// ═══════════════════════════════════════════════════════════════════════════

const getDBMSQuiz = () => ({
  topic: "DBMS (Database Management Systems)",
  questions: dbmsQuestions,
  difficulty: "medium" as const,
});

const getReactQuiz = () => ({
  topic: "React.js",
  questions: reactQuestions,
  difficulty: "medium" as const,
});

const getDSAQuiz = () => ({
  topic: "Data Structures & Algorithms",
  questions: dsaQuestions,
  difficulty: "medium" as const,
});

const getJavaScriptQuiz = () => ({
  topic: "JavaScript",
  questions: javascriptQuestions,
  difficulty: "medium" as const,
});

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS ARRAY
// ═══════════════════════════════════════════════════════════════════════════

export const tools: TamboTool[] = [
  {
    name: "getDBMSQuiz",
    description: "Get a quiz on Database Management Systems (DBMS) including SQL, normalization, ACID properties, and more. Use this when user asks for DBMS quiz, SQL quiz, or database questions.",
    tool: getDBMSQuiz,
    inputSchema: z.object({}),
    outputSchema: z.object({
      topic: z.string(),
      questions: z.array(z.any()),
      difficulty: z.string(),
    }),
  },
  {
    name: "getReactQuiz",
    description: "Get a quiz on React.js including hooks, virtual DOM, state management, and component lifecycle. Use this when user asks for React quiz or React questions.",
    tool: getReactQuiz,
    inputSchema: z.object({}),
    outputSchema: z.object({
      topic: z.string(),
      questions: z.array(z.any()),
      difficulty: z.string(),
    }),
  },
  {
    name: "getDSAQuiz",
    description: "Get a quiz on Data Structures and Algorithms including arrays, trees, sorting, searching, and complexity analysis. Use this when user asks for DSA quiz, algorithm questions, or data structure questions.",
    tool: getDSAQuiz,
    inputSchema: z.object({}),
    outputSchema: z.object({
      topic: z.string(),
      questions: z.array(z.any()),
      difficulty: z.string(),
    }),
  },
  {
    name: "getJavaScriptQuiz",
    description: "Get a quiz on JavaScript including closures, promises, event loop, prototypes, and ES6+ features. Use this when user asks for JavaScript quiz or JS questions.",
    tool: getJavaScriptQuiz,
    inputSchema: z.object({}),
    outputSchema: z.object({
      topic: z.string(),
      questions: z.array(z.any()),
      difficulty: z.string(),
    }),
  },
  {
    name: "countryPopulation",
    description: "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description: "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS ARRAY
// ═══════════════════════════════════════════════════════════════════════════

export const components: TamboComponent[] = [
  {
    name: "MCQQuiz",
    description: "A component that renders an interactive multiple choice quiz with scoring. Use this component when the user wants to take a quiz, practice MCQs, or test their knowledge on any topic. The component handles question navigation, answer selection, score calculation, and displays results with explanations.",
    component: MCQQuiz,
    propsSchema: mcqQuizSchema,
  },
  {
    name: "ScoreCard",
    description: "A component that displays the user's quiz score and performance metrics. Use this when the user asks for their score, wants to see their performance, or asks 'what is my score'. Shows total score, percentage, topic breakdown, and motivational messages.",
    component: ScoreCard,
    propsSchema: scoreCardSchema,
  },
  {
    name: "Graph",
    description: "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
];
