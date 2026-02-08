import { TopicData } from "./types";

export const dbmsTopic: TopicData = {
  id: "dbms",
  name: "Database Management Systems",
  description: "SQL, Normalization, Transactions, Indexing, and Database Design",
  icon: "🗄️",
  color: "from-blue-500 to-cyan-500",
  
  mcqQuestions: [
    {
      id: "dbms-mcq-1",
      type: "mcq",
      question: "What does ACID stand for in database transactions?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Application, Control, Integration, Data",
        "Automated, Controlled, Integrated, Distributed",
        "Access, Create, Insert, Delete",
      ],
      correctAnswer: 0,
      explanation: "ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed changes persist).",
      difficulty: "easy",
      tags: ["transactions", "fundamentals"],
    },
    {
      id: "dbms-mcq-2",
      type: "mcq",
      question: "Which normal form eliminates transitive dependencies?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 2,
      explanation: "Third Normal Form (3NF) eliminates transitive dependencies, where non-key attributes depend on other non-key attributes.",
      difficulty: "medium",
      tags: ["normalization"],
    },
    {
      id: "dbms-mcq-3",
      type: "mcq",
      question: "What is a foreign key?",
      options: [
        "A key that encrypts data",
        "A key that references a primary key in another table",
        "The first column of any table",
        "A key used for sorting",
      ],
      correctAnswer: 1,
      explanation: "A foreign key is a column that creates a link between two tables by referencing the primary key of another table.",
      difficulty: "easy",
      tags: ["keys", "relationships"],
    },
    {
      id: "dbms-mcq-4",
      type: "mcq",
      question: "Which SQL command removes all records without logging?",
      options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
      correctAnswer: 2,
      explanation: "TRUNCATE removes all records quickly without logging individual deletions, keeping the table structure intact.",
      difficulty: "medium",
      tags: ["sql", "commands"],
    },
    {
      id: "dbms-mcq-5",
      type: "mcq",
      question: "What type of JOIN returns all rows from both tables?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctAnswer: 3,
      explanation: "FULL OUTER JOIN returns all rows from both tables, with NULL values for non-matching rows.",
      difficulty: "medium",
      tags: ["sql", "joins"],
    },
  ],
  
  codingQuestions: [
    {
      id: "dbms-code-1",
      type: "coding",
      title: "Find Duplicate Emails",
      question: "Write a SQL query to find all duplicate emails in a table named 'users' with columns 'id' and 'email'.",
      starterCode: `-- Write your SQL query here
SELECT `,
      testCases: [
        {
          input: "users: [{id: 1, email: 'a@b.com'}, {id: 2, email: 'c@d.com'}, {id: 3, email: 'a@b.com'}]",
          expectedOutput: "a@b.com",
        },
      ],
      solution: "SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;",
      hints: ["Use GROUP BY with HAVING clause", "COUNT(*) can help find duplicates"],
      difficulty: "easy",
      language: "javascript",
      tags: ["sql", "aggregation"],
    },
    {
      id: "dbms-code-2",
      type: "coding",
      title: "Second Highest Salary",
      question: "Write a SQL query to find the second highest salary from an 'employees' table. If there is no second highest, return null.",
      starterCode: `-- Write your SQL query here
SELECT `,
      testCases: [
        {
          input: "employees: [{id: 1, salary: 100}, {id: 2, salary: 200}, {id: 3, salary: 300}]",
          expectedOutput: "200",
        },
      ],
      solution: "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);",
      hints: ["Use subquery to find max first", "Then find max less than that"],
      difficulty: "medium",
      language: "javascript",
      tags: ["sql", "subquery"],
    },
  ],
  
  matchQuestions: [
    {
      id: "dbms-match-1",
      type: "match",
      title: "Match SQL Commands with Their Purpose",
      instructions: "Match each SQL command with its correct description",
      leftColumn: [
        { id: "l1", text: "SELECT" },
        { id: "l2", text: "INSERT" },
        { id: "l3", text: "UPDATE" },
        { id: "l4", text: "DELETE" },
        { id: "l5", text: "CREATE" },
      ],
      rightColumn: [
        { id: "r1", text: "Retrieves data from tables" },
        { id: "r2", text: "Adds new records to a table" },
        { id: "r3", text: "Modifies existing records" },
        { id: "r4", text: "Removes records from a table" },
        { id: "r5", text: "Creates new database objects" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
        { leftId: "l5", rightId: "r5" },
      ],
      difficulty: "easy",
      tags: ["sql", "commands"],
    },
    {
      id: "dbms-match-2",
      type: "match",
      title: "Match Normal Forms with Definitions",
      leftColumn: [
        { id: "l1", text: "1NF" },
        { id: "l2", text: "2NF" },
        { id: "l3", text: "3NF" },
        { id: "l4", text: "BCNF" },
      ],
      rightColumn: [
        { id: "r1", text: "Atomic values only, no repeating groups" },
        { id: "r2", text: "No partial dependencies on composite key" },
        { id: "r3", text: "No transitive dependencies" },
        { id: "r4", text: "Every determinant is a candidate key" },
      ],
      correctMatches: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
        { leftId: "l3", rightId: "r3" },
        { leftId: "l4", rightId: "r4" },
      ],
      difficulty: "medium",
      tags: ["normalization"],
    },
  ],
  
  whiteboardQuestions: [
    {
      id: "dbms-wb-1",
      type: "whiteboard",
      title: "Design an E-Commerce Database Schema",
      question: "Design a database schema for an e-commerce platform. Include tables for users, products, orders, and payments. Show relationships and key constraints.",
      hints: [
        "Start with core entities: Users, Products, Orders",
        "Consider one-to-many relationships",
        "Add a junction table for order items",
        "Include payment status tracking",
      ],
      difficulty: "medium",
      timeLimit: 20,
      tags: ["schema-design", "er-diagram"],
    },
  ],
};
