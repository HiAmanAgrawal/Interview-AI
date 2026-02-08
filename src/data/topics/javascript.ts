import { TopicData } from "./types";

export const javascriptTopic: TopicData = {
  id: "javascript",
  name: "JavaScript",
  description: "ES6+, Closures, Promises, Event Loop, and Advanced Patterns",
  icon: "📜",
  color: "from-yellow-500 to-orange-500",
  
  mcqQuestions: [
    {
      id: "js-mcq-1",
      type: "mcq",
      question: "What is the output of: typeof null?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correctAnswer: 2,
      explanation: "This is a historical bug in JavaScript. typeof null returns 'object'.",
      difficulty: "easy",
      tags: ["types", "quirks"],
    },
    {
      id: "js-mcq-2",
      type: "mcq",
      question: "What is a closure?",
      options: [
        "A way to close browser windows",
        "A function with access to its outer scope after the outer function returns",
        "A method to end loops",
        "A type of JavaScript error",
      ],
      correctAnswer: 1,
      explanation: "A closure is a function that remembers variables from its outer scope even after that scope has finished.",
      difficulty: "medium",
      tags: ["closures", "scope"],
    },
    {
      id: "js-mcq-3",
      type: "mcq",
      question: "What's the difference between '==' and '==='?",
      options: [
        "No difference",
        "'==' compares values, '===' compares values and types",
        "'===' compares values, '==' compares types",
        "'==' is for strings, '===' is for numbers",
      ],
      correctAnswer: 1,
      explanation: "'==' performs type coercion, while '===' compares both value and type.",
      difficulty: "easy",
      tags: ["operators", "comparison"],
    },
    {
      id: "js-mcq-4",
      type: "mcq",
      question: "What does 'this' refer to in an arrow function?",
      options: [
        "The object that called the function",
        "The global object",
        "The enclosing lexical scope's 'this'",
        "undefined",
      ],
      correctAnswer: 2,
      explanation: "Arrow functions don't have their own 'this'. They inherit 'this' from the enclosing scope.",
      difficulty: "medium",
      tags: ["this", "arrow-functions"],
    },
    {
      id: "js-mcq-5",
      type: "mcq",
      question: "What is event bubbling?",
      options: [
        "Creating new events",
        "Events propagating from child to parent elements",
        "Events propagating from parent to child elements",
        "Removing event listeners",
      ],
      correctAnswer: 1,
      explanation: "Event bubbling is when an event propagates from the target element up through its ancestors.",
      difficulty: "medium",
      tags: ["events", "dom"],
    },
  ],
  
  codingQuestions: [
    {
      id: "js-code-1",
      type: "coding",
      title: "Implement Debounce",
      question: "Implement a debounce function that delays invoking a function until after wait milliseconds.",
      starterCode: `function debounce(func, wait) {
  // Your code here
  
}

// Usage:
// const debouncedFn = debounce(() => console.log('Hello'), 300);`,
      testCases: [
        { input: "func called 5 times rapidly, wait: 300ms", expectedOutput: "func executes once after 300ms" },
      ],
      solution: `function debounce(func, wait) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}`,
      hints: ["Store the timeout ID", "Clear previous timeout on each call", "Use setTimeout to delay execution"],
      difficulty: "medium",
      language: "javascript",
      tags: ["functions", "timing"],
    },
    {
      id: "js-code-2",
      type: "coding",
      title: "Flatten Array",
      question: "Implement a function to flatten a nested array to a specified depth.",
      starterCode: `function flatten(arr, depth = 1) {
  // Your code here
  
}

// flatten([1, [2, [3, [4]]]], 2) -> [1, 2, 3, [4]]`,
      testCases: [
        { input: "[[1, 2], [3, 4]], 1", expectedOutput: "[1, 2, 3, 4]" },
        { input: "[1, [2, [3, [4]]]], 2", expectedOutput: "[1, 2, 3, [4]]" },
      ],
      solution: `function flatten(arr, depth = 1) {
  if (depth === 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}`,
      hints: ["Use recursion", "Track depth level", "Use reduce to build result"],
      difficulty: "medium",
      language: "javascript",
      tags: ["arrays", "recursion"],
    },
    {
      id: "js-code-3",
      type: "coding",
      title: "Promise.all Implementation",
      question: "Implement your own version of Promise.all",
      starterCode: `function promiseAll(promises) {
  // Your code here
  
}`,
      testCases: [
        { input: "[Promise.resolve(1), Promise.resolve(2)]", expectedOutput: "[1, 2]" },
      ],
      solution: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`,
      hints: ["Return a new Promise", "Track completion count", "Maintain order of results"],
      difficulty: "hard",
      language: "javascript",
      tags: ["promises", "async"],
    },
  ],
  
  matchQuestions: [
    {
      id: "js-match-1",
      type: "match",
      title: "Match Array Methods with Their Purpose",
      leftColumn: [
        { id: "l1", text: "map()" },
        { id: "l2", text: "filter()" },
        { id: "l3", text: "reduce()" },
        { id: "l4", text: "find()" },
        { id: "l5", text: "some()" },
      ],
      rightColumn: [
        { id: "r1", text: "Transform each element" },
        { id: "r2", text: "Keep elements matching condition" },
        { id: "r3", text: "Accumulate to single value" },
        { id: "r4", text: "Get first matching element" },
        { id: "r5", text: "Check if any element matches" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "easy",
      tags: ["arrays", "methods"],
    },
  ],
  
  whiteboardQuestions: [
    {
      id: "js-wb-1",
      type: "whiteboard",
      title: "Explain the Event Loop",
      question: "Draw and explain how the JavaScript event loop works, including the call stack, callback queue, and microtask queue.",
      hints: [
        "Show the call stack",
        "Include Web APIs",
        "Show callback queue (macrotasks)",
        "Show microtask queue for Promises",
      ],
      difficulty: "medium",
      timeLimit: 15,
      tags: ["event-loop", "async"],
    },
  ],
};
