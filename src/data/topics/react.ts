import { TopicData } from "./types";

export const reactTopic: TopicData = {
  id: "react",
  name: "React.js",
  description: "Hooks, Components, State Management, and Modern React Patterns",
  icon: "⚛️",
  color: "from-cyan-500 to-blue-500",
  
  mcqQuestions: [
    {
      id: "react-mcq-1",
      type: "mcq",
      question: "What is the virtual DOM in React?",
      options: [
        "A direct copy of the browser DOM",
        "A lightweight JavaScript representation of the DOM",
        "A browser API for faster rendering",
        "A CSS framework for React",
      ],
      correctAnswer: 1,
      explanation: "The virtual DOM is a lightweight JavaScript object that represents the actual DOM. React uses it to optimize updates by comparing changes before applying them.",
      difficulty: "easy",
      tags: ["fundamentals", "virtual-dom"],
    },
    {
      id: "react-mcq-2",
      type: "mcq",
      question: "What hook is used for side effects?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation: "useEffect is used for side effects like data fetching, subscriptions, or manually changing the DOM.",
      difficulty: "easy",
      tags: ["hooks"],
    },
    {
      id: "react-mcq-3",
      type: "mcq",
      question: "What is the purpose of React.memo()?",
      options: [
        "To create memoized values",
        "To prevent unnecessary re-renders of functional components",
        "To store component state",
        "To handle errors in components",
      ],
      correctAnswer: 1,
      explanation: "React.memo() is a higher-order component that memoizes the rendered output and skips re-rendering if props haven't changed.",
      difficulty: "medium",
      tags: ["optimization", "memoization"],
    },
    {
      id: "react-mcq-4",
      type: "mcq",
      question: "Which is NOT a valid React hook rule?",
      options: [
        "Only call hooks at the top level",
        "Only call hooks from React functions",
        "Hooks can be called inside loops",
        "Custom hooks should start with 'use'",
      ],
      correctAnswer: 2,
      explanation: "Hooks cannot be called inside loops, conditions, or nested functions. They must be called at the top level.",
      difficulty: "medium",
      tags: ["hooks", "rules"],
    },
    {
      id: "react-mcq-5",
      type: "mcq",
      question: "What is the correct way to update state based on previous state?",
      options: [
        "setState(state + 1)",
        "setState(prevState => prevState + 1)",
        "setState(this.state + 1)",
        "state = state + 1",
      ],
      correctAnswer: 1,
      explanation: "Using the functional update form ensures you're working with the most recent state value.",
      difficulty: "easy",
      tags: ["state", "hooks"],
    },
  ],
  
  codingQuestions: [
    {
      id: "react-code-1",
      type: "coding",
      title: "Implement useDebounce Hook",
      question: "Create a custom hook called useDebounce that debounces a value by a specified delay.",
      starterCode: `function useDebounce(value, delay) {
  // Your code here
  
}

// Usage example:
// const debouncedSearch = useDebounce(searchTerm, 500);`,
      testCases: [
        {
          input: "value: 'hello', delay: 500",
          expectedOutput: "Returns 'hello' after 500ms delay",
        },
      ],
      solution: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}`,
      hints: ["Use useState to store the debounced value", "Use useEffect with setTimeout", "Don't forget cleanup!"],
      difficulty: "medium",
      language: "javascript",
      tags: ["hooks", "custom-hooks"],
    },
    {
      id: "react-code-2",
      type: "coding",
      title: "Toggle Component",
      question: "Create a Toggle component that switches between on/off states and accepts an onChange callback.",
      starterCode: `function Toggle({ initialState = false, onChange }) {
  // Your code here
  
  return (
    // Your JSX here
  );
}`,
      testCases: [
        {
          input: "initialState: false",
          expectedOutput: "Renders toggle in off state, clicking toggles to on",
        },
      ],
      solution: `function Toggle({ initialState = false, onChange }) {
  const [isOn, setIsOn] = useState(initialState);
  
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };
  
  return (
    <button onClick={handleToggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}`,
      hints: ["Use useState for the toggle state", "Call onChange when state changes"],
      difficulty: "easy",
      language: "javascript",
      tags: ["components", "state"],
    },
  ],
  
  matchQuestions: [
    {
      id: "react-match-1",
      type: "match",
      title: "Match React Hooks with Their Purpose",
      leftColumn: [
        { id: "l1", text: "useState" },
        { id: "l2", text: "useEffect" },
        { id: "l3", text: "useContext" },
        { id: "l4", text: "useRef" },
        { id: "l5", text: "useMemo" },
      ],
      rightColumn: [
        { id: "r1", text: "Manage local component state" },
        { id: "r2", text: "Perform side effects" },
        { id: "r3", text: "Access context values" },
        { id: "r4", text: "Persist values across renders" },
        { id: "r5", text: "Memoize expensive calculations" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "easy",
      tags: ["hooks"],
    },
  ],
  
  whiteboardQuestions: [
    {
      id: "react-wb-1",
      type: "whiteboard",
      title: "Design a Component Architecture",
      question: "Design the component architecture for a social media feed with posts, comments, and likes. Show component hierarchy and data flow.",
      hints: [
        "Start with App component at the top",
        "Break down into Feed, Post, Comment components",
        "Consider where state should live",
        "Show props flowing down",
      ],
      difficulty: "medium",
      timeLimit: 15,
      tags: ["architecture", "components"],
    },
  ],
};
