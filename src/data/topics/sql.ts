import { TopicData } from "./types";

export const sqlTopic: TopicData = {
  id: "sql",
  name: "SQL",
  description: "Queries, Joins, Aggregations, Subqueries, and Advanced SQL",
  icon: "🔗",
  color: "from-indigo-500 to-purple-500",
  
  mcqQuestions: [
    {
      id: "sql-mcq-1",
      type: "mcq",
      question: "Which JOIN returns only matching rows from both tables?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
      correctAnswer: 2,
      explanation: "INNER JOIN returns only rows that have matching values in both tables.",
      difficulty: "easy",
      tags: ["joins"],
    },
    {
      id: "sql-mcq-2",
      type: "mcq",
      question: "What is the difference between WHERE and HAVING?",
      options: [
        "No difference",
        "WHERE filters rows, HAVING filters groups",
        "HAVING filters rows, WHERE filters groups",
        "WHERE is faster",
      ],
      correctAnswer: 1,
      explanation: "WHERE filters individual rows before grouping, HAVING filters groups after GROUP BY.",
      difficulty: "medium",
      tags: ["filtering", "aggregation"],
    },
    {
      id: "sql-mcq-3",
      type: "mcq",
      question: "What does DISTINCT do?",
      options: [
        "Sorts results",
        "Removes duplicate rows",
        "Counts rows",
        "Groups rows",
      ],
      correctAnswer: 1,
      explanation: "DISTINCT removes duplicate rows from the result set.",
      difficulty: "easy",
      tags: ["basics"],
    },
    {
      id: "sql-mcq-4",
      type: "mcq",
      question: "Which clause is used to sort results?",
      options: ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"],
      correctAnswer: 1,
      explanation: "ORDER BY is used to sort the result set by one or more columns.",
      difficulty: "easy",
      tags: ["basics", "sorting"],
    },
    {
      id: "sql-mcq-5",
      type: "mcq",
      question: "What is a correlated subquery?",
      options: [
        "A subquery that runs once",
        "A subquery that references the outer query",
        "A query with joins",
        "A stored procedure",
      ],
      correctAnswer: 1,
      explanation: "A correlated subquery references columns from the outer query and executes once for each row of the outer query.",
      difficulty: "hard",
      tags: ["subqueries", "advanced"],
    },
  ],
  
  codingQuestions: [
    {
      id: "sql-code-1",
      type: "coding",
      title: "Employee Salary Query",
      question: "Write a query to find employees earning more than their managers.",
      starterCode: `-- Table: employees
-- Columns: id, name, salary, manager_id

SELECT `,
      testCases: [
        { input: "employees table with manager relationships", expectedOutput: "List of employees earning more than managers" },
      ],
      solution: `SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;`,
      hints: ["Self-join the employees table", "Compare salaries after joining"],
      difficulty: "medium",
      language: "javascript",
      tags: ["self-join"],
    },
    {
      id: "sql-code-2",
      type: "coding",
      title: "Consecutive Numbers",
      question: "Find all numbers that appear at least three times consecutively in a logs table.",
      starterCode: `-- Table: logs
-- Columns: id, num

SELECT DISTINCT `,
      testCases: [
        { input: "logs: [{1,1}, {2,1}, {3,1}, {4,2}]", expectedOutput: "1" },
      ],
      solution: `SELECT DISTINCT l1.num
FROM logs l1
JOIN logs l2 ON l1.id = l2.id - 1
JOIN logs l3 ON l2.id = l3.id - 1
WHERE l1.num = l2.num AND l2.num = l3.num;`,
      hints: ["Join the table with itself", "Check consecutive IDs", "Compare values"],
      difficulty: "medium",
      language: "javascript",
      tags: ["self-join", "consecutive"],
    },
  ],
  
  matchQuestions: [
    {
      id: "sql-match-1",
      type: "match",
      title: "Match SQL Functions with Results",
      leftColumn: [
        { id: "l1", text: "COUNT(*)" },
        { id: "l2", text: "SUM()" },
        { id: "l3", text: "AVG()" },
        { id: "l4", text: "MAX()" },
        { id: "l5", text: "MIN()" },
      ],
      rightColumn: [
        { id: "r1", text: "Number of rows" },
        { id: "r2", text: "Total of values" },
        { id: "r3", text: "Mean of values" },
        { id: "r4", text: "Largest value" },
        { id: "r5", text: "Smallest value" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "easy",
      tags: ["aggregation"],
    },
  ],
  
  whiteboardQuestions: [],
};
