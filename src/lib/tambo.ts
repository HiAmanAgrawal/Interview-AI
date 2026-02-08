/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { MCQQuiz, mcqQuizSchema } from "@/components/tambo/mcq-quiz";
import { ScoreCard, scoreCardSchema } from "@/components/tambo/score-card";
import { CodeEditor, codeEditorSchema } from "@/components/tambo/code-editor";
import { Whiteboard, whiteboardSchema } from "@/components/tambo/whiteboard";
import { MatchFollowing, matchFollowingSchema } from "@/components/tambo/match-following";
import { StressTimer, stressTimerSchema } from "@/components/tambo/stress-timer";
import { TheoryQuestion, theoryQuestionSchema } from "@/components/tambo/theory-question";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";

// Import topic data
import {
  dbmsTopic,
  reactTopic,
  dsaTopic,
  javascriptTopic,
  pythonTopic,
  systemDesignTopic,
  sqlTopic,
  allTopics,
  getTopicById,
} from "@/data/topics";

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
// TOOLS FOR CODING CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════

const getCodingChallenge = (topic: string) => {
  const topicConfig = getTopicById(topic.toLowerCase()) || dsaTopic;
  
  // Find subtopics that prefer coding format
  const codingSubtopics = topicConfig.subtopics.filter((s: { preferredFormats: string[] }) => 
    s.preferredFormats.includes("coding")
  );
  
  if (codingSubtopics.length > 0) {
    const subtopic = codingSubtopics[Math.floor(Math.random() * codingSubtopics.length)];
    const concept = subtopic.keyConcepts[Math.floor(Math.random() * subtopic.keyConcepts.length)];
    
    return {
      title: `${subtopic.name} Challenge`,
      question: `Write a solution related to: ${concept}. Use the ${topicConfig.name} concepts from ${subtopic.name}.`,
      starterCode: `// ${subtopic.name} - ${concept}\nfunction solution() {\n  // Your code here\n}`,
      language: "javascript" as const,
      testCases: [{ input: "example input", expectedOutput: "expected output" }],
      hints: subtopic.keyConcepts.slice(0, 2),
      difficulty: subtopic.difficulty,
      timeLimit: topicConfig.timePerFormat.coding,
      instruction: `Generate a coding problem about "${concept}" from ${subtopic.name}. Use the CodeEditor component.`,
    };
  }
  
  // Default fallback
  return {
    title: "Two Sum",
    question: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
    starterCode: `function twoSum(nums, target) {\n  // Your code here\n}`,
    language: "javascript" as const,
    testCases: [{ input: "[2,7,11,15], 9", expectedOutput: "[0,1]" }],
    hints: ["Use a hash map for O(n) solution"],
    difficulty: "easy" as const,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS FOR MATCH THE FOLLOWING
// ═══════════════════════════════════════════════════════════════════════════

const getMatchQuestion = (topic: string) => {
  const topicConfig = getTopicById(topic.toLowerCase()) || dsaTopic;
  
  // Find subtopics that prefer match format
  const matchSubtopics = topicConfig.subtopics.filter((s: { preferredFormats: string[] }) => 
    s.preferredFormats.includes("match")
  );
  
  if (matchSubtopics.length > 0) {
    const subtopic = matchSubtopics[Math.floor(Math.random() * matchSubtopics.length)];
    
    // Create a match template based on concepts
    const concepts = subtopic.keyConcepts.slice(0, 5);
    return {
      title: `Match ${subtopic.name} Concepts`,
      instructions: `Match the ${subtopic.name} concepts with their correct descriptions`,
      leftColumn: concepts.map((c: string, i: number) => ({ id: `l${i+1}`, text: c })),
      rightColumn: concepts.map((c: string, i: number) => ({ id: `r${i+1}`, text: `Description of ${c}` })),
      correctMatches: concepts.map((_: string, i: number) => ({ leftId: `l${i+1}`, rightId: `r${i+1}` })),
      difficulty: subtopic.difficulty,
      topic: topicConfig.name,
      instruction: `Generate a match-the-following for ${subtopic.name}. Replace placeholder descriptions with actual definitions.`,
    };
  }
  
  // Default fallback
  return {
    title: "Match Time Complexities",
    leftColumn: [
      { id: "l1", text: "Binary Search" },
      { id: "l2", text: "Linear Search" },
    ],
    rightColumn: [
      { id: "r1", text: "O(log n)" },
      { id: "r2", text: "O(n)" },
    ],
    correctMatches: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
    ],
    difficulty: "medium" as const,
    topic: topicConfig.name,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS FOR WHITEBOARD (SYSTEM DESIGN)
// ═══════════════════════════════════════════════════════════════════════════

const getWhiteboardQuestion = () => {
  // Find system design topics with whiteboard preference
  const whiteboardSubtopics = systemDesignTopic.subtopics.filter((s: { preferredFormats: string[] }) =>
    s.preferredFormats.includes("whiteboard")
  );
  
  if (whiteboardSubtopics.length > 0) {
    const subtopic = whiteboardSubtopics[Math.floor(Math.random() * whiteboardSubtopics.length)];
    const concept = subtopic.keyConcepts[Math.floor(Math.random() * subtopic.keyConcepts.length)];
    const prompts = subtopic.samplePrompts || [];
    const prompt = prompts.length > 0 ? prompts[Math.floor(Math.random() * prompts.length)] : `Design a system for: ${concept}`;
    
    return {
      title: `${subtopic.name} Design`,
      question: prompt,
      hints: subtopic.keyConcepts.slice(0, 4),
      timeLimit: systemDesignTopic.timePerFormat.whiteboard / 60, // Convert to minutes
      difficulty: subtopic.difficulty,
    };
  }
  
  // Default fallback
  return {
    title: "URL Shortener Design",
    question: "Design a URL shortening service like bit.ly. Consider scalability, storage, and unique ID generation.",
    hints: ["Consider base62 encoding", "Think about database choices", "How to handle high traffic?"],
    timeLimit: 20,
    difficulty: "medium" as const,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOL FOR STRESS TIMER
// ═══════════════════════════════════════════════════════════════════════════

const getStressTimer = (duration: number = 300) => ({
  duration,
  title: "Interview Timer",
  warningThreshold: 50,
  dangerThreshold: 25,
  showMotivation: true,
});

// ═══════════════════════════════════════════════════════════════════════════
// GET ALL TOPICS
// ═══════════════════════════════════════════════════════════════════════════

const getAllTopics = () => ({
  topics: [
    { id: dbmsTopic.id, name: dbmsTopic.name, icon: dbmsTopic.icon, color: dbmsTopic.color },
    { id: reactTopic.id, name: reactTopic.name, icon: reactTopic.icon, color: reactTopic.color },
    { id: dsaTopic.id, name: dsaTopic.name, icon: dsaTopic.icon, color: dsaTopic.color },
    { id: javascriptTopic.id, name: javascriptTopic.name, icon: javascriptTopic.icon, color: javascriptTopic.color },
    { id: pythonTopic.id, name: pythonTopic.name, icon: pythonTopic.icon, color: pythonTopic.color },
    { id: systemDesignTopic.id, name: systemDesignTopic.name, icon: systemDesignTopic.icon, color: systemDesignTopic.color },
    { id: sqlTopic.id, name: sqlTopic.name, icon: sqlTopic.icon, color: sqlTopic.color },
  ],
});

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS ARRAY
// ═══════════════════════════════════════════════════════════════════════════

export const tools: TamboTool[] = [
  // MCQ Quiz Tools
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
  
  // Coding Challenge Tools
  {
    name: "getCodingChallenge",
    description: "Get a coding challenge for the user to solve. Use this when user asks for a coding question, programming problem, or wants to practice coding. Supports topics: dsa, javascript, python, react, sql.",
    tool: getCodingChallenge,
    inputSchema: z.object({
      topic: z.string().describe("Topic for the coding challenge (dsa, javascript, python, react, sql)"),
    }),
    outputSchema: z.object({
      title: z.string(),
      question: z.string(),
      starterCode: z.string(),
      language: z.string(),
      testCases: z.array(z.any()),
      hints: z.array(z.string()).optional(),
      difficulty: z.string(),
      timeLimit: z.number().optional(),
    }),
  },
  
  // Match the Following Tools
  {
    name: "getMatchQuestion",
    description: "Get a match-the-following question. Use this when user asks for matching questions, concept matching, or association questions. Supports topics: dsa, javascript, python, react, sql, dbms, system-design.",
    tool: getMatchQuestion,
    inputSchema: z.object({
      topic: z.string().describe("Topic for the matching question"),
    }),
    outputSchema: z.object({
      title: z.string(),
      instructions: z.string().optional(),
      leftColumn: z.array(z.object({ id: z.string(), text: z.string() })),
      rightColumn: z.array(z.object({ id: z.string(), text: z.string() })),
      correctMatches: z.array(z.object({ leftId: z.string(), rightId: z.string() })),
      difficulty: z.string(),
      topic: z.string(),
    }),
  },
  
  // Whiteboard / System Design Tools
  {
    name: "getWhiteboardQuestion",
    description: "Get a system design whiteboard question. Use this when user asks for system design question, architecture design, or whiteboard challenge.",
    tool: getWhiteboardQuestion,
    inputSchema: z.object({}),
    outputSchema: z.object({
      title: z.string(),
      question: z.string(),
      hints: z.array(z.string()).optional(),
      timeLimit: z.number().optional(),
      difficulty: z.string(),
    }),
  },
  
  // Timer Tool
  {
    name: "getStressTimer",
    description: "Get a stress timer for interviews. Use this when user wants a countdown timer, interview timer, or time pressure practice.",
    tool: getStressTimer,
    inputSchema: z.object({
      duration: z.number().optional().describe("Duration in seconds, defaults to 300 (5 minutes)"),
    }),
    outputSchema: z.object({
      duration: z.number(),
      title: z.string(),
      warningThreshold: z.number(),
      dangerThreshold: z.number(),
      showMotivation: z.boolean(),
    }),
  },
  
  // Get All Topics
  {
    name: "getAllTopics",
    description: "Get a list of all available topics for practice. Use this when user asks what topics are available, wants to see categories, or is exploring the platform.",
    tool: getAllTopics,
    inputSchema: z.object({}),
    outputSchema: z.object({
      topics: z.array(z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string(),
        color: z.string(),
      })),
    }),
  },
  
  // Population Tools (existing)
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
  
  // Code Review Tool
  {
    name: "reviewCode",
    description: "Review and provide feedback on user's submitted code solution. Use this when user asks for code review, feedback on their solution, or says 'review my code'. Analyzes the code for correctness, efficiency, and best practices.",
    tool: (input: { code: string; language: string; problemTitle: string }) => {
      const { code, language, problemTitle } = input;
      
      // Basic code analysis
      const lineCount = code.split('\n').length;
      const hasComments = code.includes('//') || code.includes('/*') || code.includes('#');
      const hasLoops = /\b(for|while|do)\b/.test(code);
      const hasFunctions = /\b(function|def|const\s+\w+\s*=.*=>)\b/.test(code);
      
      return {
        problemTitle,
        language,
        lineCount,
        hasComments,
        hasLoops,
        hasFunctions,
        feedback: {
          structure: hasFunctions ? "Good: Code is modularized into functions" : "Consider breaking code into reusable functions",
          documentation: hasComments ? "Good: Code includes comments" : "Add comments to explain complex logic",
          efficiency: hasLoops ? "Contains loops - verify time complexity is optimal" : "No loops detected - solution may be efficient",
          suggestions: [
            "Consider edge cases and input validation",
            "Add error handling for robustness",
            "Use descriptive variable names",
            "Write unit tests to verify correctness",
          ],
        },
      };
    },
    inputSchema: z.object({
      code: z.string().describe("The code to review"),
      language: z.string().describe("Programming language (javascript, python, typescript)"),
      problemTitle: z.string().describe("Title of the problem being solved"),
    }),
    outputSchema: z.object({
      problemTitle: z.string(),
      language: z.string(),
      lineCount: z.number(),
      hasComments: z.boolean(),
      hasLoops: z.boolean(),
      hasFunctions: z.boolean(),
      feedback: z.object({
        structure: z.string(),
        documentation: z.string(),
        efficiency: z.string(),
        suggestions: z.array(z.string()),
      }),
    }),
  },
  
  // System Design Review Tool
  {
    name: "reviewSystemDesign",
    description: "Review user's system design whiteboard submission. Use this when user asks for design review, architecture feedback, or says 'review my system design'. Analyzes the design for scalability, reliability, and completeness.",
    tool: (input: { diagramDescription: string; problemTitle: string }) => {
      const { diagramDescription, problemTitle } = input;
      
      // Check for common components
      const hasDatabase = /database|db|storage/i.test(diagramDescription);
      const hasServer = /server|api|backend/i.test(diagramDescription);
      const hasLoadBalancer = /load\s*balancer|lb/i.test(diagramDescription);
      const hasCache = /cache|redis|memcached/i.test(diagramDescription);
      const hasQueue = /queue|kafka|rabbitmq|sqs/i.test(diagramDescription);
      const hasCDN = /cdn|cloudfront|edge/i.test(diagramDescription);
      
      const components = [];
      if (hasDatabase) components.push("Database");
      if (hasServer) components.push("Server/API");
      if (hasLoadBalancer) components.push("Load Balancer");
      if (hasCache) components.push("Cache");
      if (hasQueue) components.push("Message Queue");
      if (hasCDN) components.push("CDN");
      
      const missing = [];
      if (!hasLoadBalancer) missing.push("Load Balancer for horizontal scaling");
      if (!hasCache) missing.push("Caching layer for performance");
      if (!hasQueue) missing.push("Message queue for async processing");
      
      return {
        problemTitle,
        componentCount: components.length,
        identifiedComponents: components,
        feedback: {
          scalability: hasLoadBalancer ? "Good: Has load balancing for horizontal scaling" : "Consider adding load balancer for scalability",
          performance: hasCache ? "Good: Caching layer included" : "Add caching (Redis) to improve performance",
          reliability: hasQueue ? "Good: Async processing with queues" : "Consider message queues for reliability",
          missingComponents: missing,
          overallScore: Math.min(100, components.length * 15 + (hasLoadBalancer ? 10 : 0) + (hasCache ? 10 : 0)),
        },
      };
    },
    inputSchema: z.object({
      diagramDescription: z.string().describe("Description of the system design diagram"),
      problemTitle: z.string().describe("Title of the design problem"),
    }),
    outputSchema: z.object({
      problemTitle: z.string(),
      componentCount: z.number(),
      identifiedComponents: z.array(z.string()),
      feedback: z.object({
        scalability: z.string(),
        performance: z.string(),
        reliability: z.string(),
        missingComponents: z.array(z.string()),
        overallScore: z.number(),
      }),
    }),
  },
  
  // Get user performance summary tool
  {
    name: "getUserPerformanceSummary",
    description: "Get a detailed summary of the user's performance including scores, strong topics, weak topics, and quiz history. Use this when the user asks for their performance, score summary, or wants to know their strong/weak areas.",
    tool: () => {
      // This tool returns a prompt for the AI to use context helpers
      return {
        instruction: "Use the getPerformanceSummary context helper to get the user's detailed performance data. The context helpers have access to the session data including: questionsAttempted, correctAnswers, scores by topic, strong topics, weak topics, and recent attempts.",
        availableContextHelpers: [
          "getSessionContext - Full session context",
          "getPerformanceSummary - Detailed performance metrics",
          "getStrongTopics - List of topics user excels at",
          "getWeakTopics - List of topics needing improvement",
          "getCurrentScore - Current total score",
          "getQuestionsAttempted - Number of questions attempted",
        ],
      };
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      instruction: z.string(),
      availableContextHelpers: z.array(z.string()),
    }),
  },
  
  // Get topic information for generating questions
  {
    name: "getTopicInfo",
    description: "Get detailed information about a topic including subtopics, key concepts, and preferred question formats. Use this to understand what concepts to cover and how to structure questions for a topic.",
    tool: ({ topicId }) => {
      const topic = getTopicById(topicId);
      if (!topic) {
        return {
          error: `Topic '${topicId}' not found`,
          availableTopics: allTopics.map(t => ({ id: t.id, name: t.name })),
        };
      }
      
      return {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        subtopics: topic.subtopics.map((s: { name: string; difficulty: string; preferredFormats: string[]; keyConcepts: string[]; samplePrompts?: string[] }) => ({
          name: s.name,
          difficulty: s.difficulty,
          preferredFormats: s.preferredFormats,
          keyConcepts: s.keyConcepts,
          samplePrompts: s.samplePrompts || [],
        })),
        defaultFormats: topic.defaultFormats,
        timePerFormat: topic.timePerFormat,
        difficultyMix: topic.difficultyMix,
        instruction: `Generate questions based on these subtopics and concepts. Use the preferred formats (mcq, theory, coding, whiteboard, match) as indicated. Follow the difficulty mix: ${topic.difficultyMix.easy}% easy, ${topic.difficultyMix.medium}% medium, ${topic.difficultyMix.hard}% hard.`,
      };
    },
    inputSchema: z.object({
      topicId: z.string().describe("The topic ID to get information for (e.g., 'dbms', 'react', 'dsa')"),
    }),
    outputSchema: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      subtopics: z.array(z.object({
        name: z.string(),
        difficulty: z.string(),
        preferredFormats: z.array(z.string()),
        keyConcepts: z.array(z.string()),
        samplePrompts: z.array(z.string()),
      })).optional(),
      defaultFormats: z.array(z.string()).optional(),
      timePerFormat: z.record(z.number()).optional(),
      difficultyMix: z.record(z.number()).optional(),
      instruction: z.string().optional(),
      error: z.string().optional(),
      availableTopics: z.array(z.object({
        id: z.string(),
        name: z.string(),
      })).optional(),
    }),
  },
  
  // Get all available topics
  {
    name: "getAvailableTopics",
    description: "Get a list of all available topics for interviews/practice. Use this when starting a session or when user asks what topics are available.",
    tool: () => {
      return {
        topics: allTopics.map(t => ({
          id: t.id,
          name: t.name,
          shortName: t.shortName,
          description: t.description,
          icon: t.icon,
          subtopicCount: t.subtopics.length,
          defaultFormats: t.defaultFormats,
        })),
        totalTopics: allTopics.length,
      };
    },
    inputSchema: z.object({}),
    outputSchema: z.object({
      topics: z.array(z.object({
        id: z.string(),
        name: z.string(),
        shortName: z.string(),
        description: z.string(),
        icon: z.string(),
        subtopicCount: z.number(),
        defaultFormats: z.array(z.string()),
      })),
      totalTopics: z.number(),
    }),
  },
  
  // Rate theory question answer
  {
    name: "rateTheoryAnswer",
    description: "Rate a user's theory question answer. Call this after the user submits their answer to a TheoryQuestion component. This will update the component's rating display and record the score.",
    tool: ({ questionId, rating, feedback, topic, timeSpent }) => {
      // Dispatch event to update the TheoryQuestion component
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("theory-rating-update", {
          detail: { id: questionId, rating, feedback }
        }));
        
        // Also dispatch event for score tracking
        window.dispatchEvent(new CustomEvent("theory-score-recorded", {
          detail: {
            topic,
            score: rating,
            maxScore: 5,
            isCorrect: rating >= 3,
            timeSpent: timeSpent || 30, // Default 30 seconds if not provided
          }
        }));
      }
      
      return {
        success: true,
        message: `Rated question ${questionId} with ${rating}/5`,
        rating,
        feedback,
      };
    },
    inputSchema: z.object({
      questionId: z.string().describe("The ID of the theory question to rate"),
      rating: z.number().min(1).max(5).describe("Rating from 1 to 5"),
      feedback: z.string().describe("Constructive feedback for the user's answer"),
      topic: z.string().describe("The topic of the question for score tracking"),
      timeSpent: z.number().optional().describe("Time spent on this question in seconds"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      rating: z.number(),
      feedback: z.string(),
    }),
  },
  
  // End interview and show completion screen
  {
    name: "endInterview",
    description: "End the interview session and trigger the completion screen with redirect options. Call this when all questions are completed or when the interview needs to end.",
    tool: ({ reason, finalScore, totalQuestions }) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("interview-complete", {
          detail: { reason, finalScore, totalQuestions }
        }));
      }
      
      return {
        success: true,
        message: "Interview ended. Showing completion screen with results and navigation options.",
      };
    },
    inputSchema: z.object({
      reason: z.string().describe("Reason for ending (completed, time_up, user_exit)"),
      finalScore: z.number().optional().describe("Final score if available"),
      totalQuestions: z.number().optional().describe("Total questions answered"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS ARRAY
// ═══════════════════════════════════════════════════════════════════════════

export const components: TamboComponent[] = [
  // Quiz Components
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
  
  // Theory Question Component
  {
    name: "TheoryQuestion",
    description: `MANDATORY for ALL theory/explanation/coding questions that need text answers.

ABSOLUTE RULE: NEVER write a question as plain text. ALWAYS use this component!

WHEN TO USE (ALWAYS use component, not plain text):
- ANY question asking user to explain, describe, discuss, or write code
- Follow-up questions - STILL use this component
- Deep dive questions - STILL use this component  
- SQL questions, coding questions without editor - use this component
- ANY question expecting a text/spoken answer

CRITICAL RULES:
1. DO NOT write questions in your message text - ONLY render this component
2. Pass the FULL question including code snippets in the "question" prop
3. Use markdown: **bold**, \`inline code\`, \`\`\`code blocks\`\`\`
4. User answers via CHAT (not in component)
5. After user responds (or says "I don't know"), use rateTheoryAnswer tool
6. If user says "skip" or "I don't know" - rate 0/5, then show NEXT question
7. NEVER repeat the same question - always move forward
8. Use sequential IDs: "theory-1", "theory-2", "theory-3" etc.
9. Pass questionNumber and totalQuestions for progress tracking`,
    component: TheoryQuestion,
    propsSchema: theoryQuestionSchema,
  },
  
  // Code Editor Component
  {
    name: "CodeEditor",
    description: "An interactive code editor with live compilation and test case execution. Use this when user wants to solve a coding problem, practice programming, or write code. Supports JavaScript, Python, and TypeScript with syntax highlighting, test cases, and hints.",
    component: CodeEditor,
    propsSchema: codeEditorSchema,
  },
  
  // Whiteboard Component
  {
    name: "Whiteboard",
    description: "A system design whiteboard for drawing diagrams, architectures, and flowcharts. Use this when user wants to practice system design, draw architecture diagrams, or explain system components visually. Includes drawing tools, shapes, and system icons.",
    component: Whiteboard,
    propsSchema: whiteboardSchema,
  },
  
  // Match the Following Component
  {
    name: "MatchFollowing",
    description: "An interactive matching quiz where users connect items from two columns. Use this when user wants to practice concept matching, association questions, or memory-based learning. Shows colored connection lines and validates answers.",
    component: MatchFollowing,
    propsSchema: matchFollowingSchema,
  },
  
  // Stress Timer Component
  {
    name: "StressTimer",
    description: "A visual countdown timer with stress levels and color effects. Use this when user wants an interview timer, countdown, or time-pressured practice. Changes color from green to yellow to red as time runs out, with motivational messages.",
    component: StressTimer,
    propsSchema: stressTimerSchema,
  },
  
  // Data Visualization Components
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
