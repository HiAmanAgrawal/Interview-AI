import { TopicData } from "./types";

export const pythonTopic: TopicData = {
  id: "python",
  name: "Python",
  description: "Core Python, OOP, Decorators, Generators, and Best Practices",
  icon: "🐍",
  color: "from-green-500 to-yellow-500",
  
  mcqQuestions: [
    {
      id: "py-mcq-1",
      type: "mcq",
      question: "What is the output of: list('hello')?",
      options: [
        "['hello']",
        "['h', 'e', 'l', 'l', 'o']",
        "'hello'",
        "Error",
      ],
      correctAnswer: 1,
      explanation: "list() converts an iterable to a list, and strings are iterable by character.",
      difficulty: "easy",
      tags: ["strings", "lists"],
    },
    {
      id: "py-mcq-2",
      type: "mcq",
      question: "What is a decorator in Python?",
      options: [
        "A way to decorate output",
        "A function that modifies another function",
        "A type of loop",
        "A class method",
      ],
      correctAnswer: 1,
      explanation: "Decorators are functions that wrap other functions to extend their behavior without modifying them.",
      difficulty: "medium",
      tags: ["decorators", "functions"],
    },
    {
      id: "py-mcq-3",
      type: "mcq",
      question: "What is the difference between a list and a tuple?",
      options: [
        "No difference",
        "Lists are mutable, tuples are immutable",
        "Tuples are faster to create",
        "Lists can only hold numbers",
      ],
      correctAnswer: 1,
      explanation: "Lists are mutable (can be changed), while tuples are immutable (cannot be changed after creation).",
      difficulty: "easy",
      tags: ["data-types"],
    },
    {
      id: "py-mcq-4",
      type: "mcq",
      question: "What does *args do in a function?",
      options: [
        "Creates a required argument",
        "Unpacks a dictionary",
        "Collects positional arguments into a tuple",
        "Creates a global variable",
      ],
      correctAnswer: 2,
      explanation: "*args allows a function to accept any number of positional arguments as a tuple.",
      difficulty: "medium",
      tags: ["functions", "arguments"],
    },
    {
      id: "py-mcq-5",
      type: "mcq",
      question: "What is a generator in Python?",
      options: [
        "A random number generator",
        "A function that yields values lazily",
        "A class constructor",
        "A loop statement",
      ],
      correctAnswer: 1,
      explanation: "Generators are functions that use yield to return values one at a time, enabling lazy evaluation.",
      difficulty: "medium",
      tags: ["generators", "iterators"],
    },
  ],
  
  codingQuestions: [
    {
      id: "py-code-1",
      type: "coding",
      title: "List Comprehension",
      question: "Use list comprehension to create a list of squares for even numbers from 0 to 10.",
      starterCode: `def even_squares():
    # Use list comprehension
    result = # Your code here
    return result

# Should return [0, 4, 16, 36, 64, 100]`,
      testCases: [
        { input: "none", expectedOutput: "[0, 4, 16, 36, 64, 100]" },
      ],
      solution: `def even_squares():
    result = [x**2 for x in range(11) if x % 2 == 0]
    return result`,
      hints: ["Use [expression for item in iterable if condition]", "Check if number is even with % 2"],
      difficulty: "easy",
      language: "python",
      tags: ["list-comprehension"],
    },
    {
      id: "py-code-2",
      type: "coding",
      title: "Implement a Decorator",
      question: "Create a decorator that measures the execution time of a function.",
      starterCode: `import time

def timer_decorator(func):
    # Your code here
    pass

@timer_decorator
def slow_function():
    time.sleep(1)
    return "Done"`,
      testCases: [
        { input: "slow_function()", expectedOutput: "Prints execution time and returns 'Done'" },
      ],
      solution: `import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper`,
      hints: ["Create an inner wrapper function", "Record time before and after", "Return the wrapper"],
      difficulty: "medium",
      language: "python",
      tags: ["decorators"],
    },
  ],
  
  matchQuestions: [
    {
      id: "py-match-1",
      type: "match",
      title: "Match Python Data Types",
      leftColumn: [
        { id: "l1", text: "list" },
        { id: "l2", text: "tuple" },
        { id: "l3", text: "dict" },
        { id: "l4", text: "set" },
        { id: "l5", text: "frozenset" },
      ],
      rightColumn: [
        { id: "r1", text: "Mutable ordered sequence" },
        { id: "r2", text: "Immutable ordered sequence" },
        { id: "r3", text: "Key-value mapping" },
        { id: "r4", text: "Mutable unique elements" },
        { id: "r5", text: "Immutable unique elements" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "easy",
      tags: ["data-types"],
    },
  ],
  
  whiteboardQuestions: [
    {
      id: "py-wb-1",
      type: "whiteboard",
      title: "Python Memory Management",
      question: "Explain how Python handles memory management, including reference counting and garbage collection.",
      hints: [
        "Explain reference counting",
        "Discuss cyclic references",
        "Mention the garbage collector",
        "Talk about memory pools",
      ],
      difficulty: "hard",
      timeLimit: 15,
      tags: ["memory", "internals"],
    },
  ],
};
