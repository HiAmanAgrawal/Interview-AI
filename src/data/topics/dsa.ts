import { TopicData } from "./types";

export const dsaTopic: TopicData = {
  id: "dsa",
  name: "Data Structures & Algorithms",
  description: "Arrays, Trees, Graphs, Sorting, Searching, and Complexity Analysis",
  icon: "🧮",
  color: "from-green-500 to-emerald-500",
  
  mcqQuestions: [
    {
      id: "dsa-mcq-1",
      type: "mcq",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
      difficulty: "easy",
      tags: ["searching", "complexity"],
    },
    {
      id: "dsa-mcq-2",
      type: "mcq",
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "A Stack follows LIFO - the last element added is the first one to be removed.",
      difficulty: "easy",
      tags: ["stack", "fundamentals"],
    },
    {
      id: "dsa-mcq-3",
      type: "mcq",
      question: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
      correctAnswer: 2,
      explanation: "Quick Sort has O(n²) worst-case complexity when pivot selection is poor.",
      difficulty: "medium",
      tags: ["sorting", "complexity"],
    },
    {
      id: "dsa-mcq-4",
      type: "mcq",
      question: "Which BST traversal gives elements in sorted order?",
      options: ["Preorder", "Postorder", "Inorder", "Level order"],
      correctAnswer: 2,
      explanation: "Inorder traversal (left, root, right) of a BST visits nodes in ascending order.",
      difficulty: "medium",
      tags: ["trees", "traversal"],
    },
    {
      id: "dsa-mcq-5",
      type: "mcq",
      question: "What data structure is used for BFS?",
      options: ["Stack", "Queue", "Heap", "Hash Table"],
      correctAnswer: 1,
      explanation: "BFS uses a Queue to process nodes level by level.",
      difficulty: "easy",
      tags: ["graphs", "bfs"],
    },
  ],
  
  codingQuestions: [
    {
      id: "dsa-code-1",
      type: "coding",
      title: "Two Sum",
      question: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
      starterCode: `function twoSum(nums, target) {
  // Your code here
  
}

// Example:
// twoSum([2, 7, 11, 15], 9) should return [0, 1]`,
      testCases: [
        { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]" },
        { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]" },
        { input: "[3, 3], 6", expectedOutput: "[0, 1]" },
      ],
      solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      hints: ["Use a hash map for O(n) solution", "Store number and its index", "Check for complement"],
      difficulty: "easy",
      language: "javascript",
      tags: ["arrays", "hash-map"],
    },
    {
      id: "dsa-code-2",
      type: "coding",
      title: "Reverse Linked List",
      question: "Reverse a singly linked list iteratively.",
      starterCode: `function reverseList(head) {
  // Your code here
  // head is the first node with .val and .next properties
  
}`,
      testCases: [
        { input: "[1, 2, 3, 4, 5]", expectedOutput: "[5, 4, 3, 2, 1]" },
        { input: "[1, 2]", expectedOutput: "[2, 1]" },
      ],
      solution: `function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
      hints: ["Use three pointers: prev, current, next", "Iterate through the list", "Change next pointer direction"],
      difficulty: "easy",
      language: "javascript",
      tags: ["linked-list"],
    },
    {
      id: "dsa-code-3",
      type: "coding",
      title: "Valid Parentheses",
      question: "Given a string containing '(', ')', '{', '}', '[', ']', determine if the input is valid.",
      starterCode: `function isValid(s) {
  // Your code here
  
}

// Examples:
// isValid("()") -> true
// isValid("()[]{}") -> true
// isValid("(]") -> false`,
      testCases: [
        { input: '"()"', expectedOutput: "true" },
        { input: '"()[]{}"', expectedOutput: "true" },
        { input: '"(]"', expectedOutput: "false" },
        { input: '"([)]"', expectedOutput: "false" },
      ],
      solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      hints: ["Use a stack", "Push opening brackets", "Pop and compare for closing brackets"],
      difficulty: "easy",
      language: "javascript",
      tags: ["stack", "strings"],
    },
  ],
  
  matchQuestions: [
    {
      id: "dsa-match-1",
      type: "match",
      title: "Match Time Complexities",
      leftColumn: [
        { id: "l1", text: "Binary Search" },
        { id: "l2", text: "Linear Search" },
        { id: "l3", text: "Merge Sort" },
        { id: "l4", text: "Bubble Sort" },
        { id: "l5", text: "Hash Table Lookup" },
      ],
      rightColumn: [
        { id: "r1", text: "O(log n)" },
        { id: "r2", text: "O(n)" },
        { id: "r3", text: "O(n log n)" },
        { id: "r4", text: "O(n²)" },
        { id: "r5", text: "O(1)" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "medium",
      tags: ["complexity"],
    },
  ],
  
  whiteboardQuestions: [
    {
      id: "dsa-wb-1",
      type: "whiteboard",
      title: "Design LRU Cache",
      question: "Design a data structure for Least Recently Used (LRU) cache. It should support get and put operations in O(1) time.",
      hints: [
        "Use a combination of data structures",
        "Hash map for O(1) lookup",
        "Doubly linked list for O(1) removal/insertion",
        "Most recently used at head, least at tail",
      ],
      difficulty: "hard",
      timeLimit: 25,
      tags: ["cache", "design"],
    },
  ],
};
