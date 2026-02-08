import { TopicConfig } from "./types";

export const dbmsTopic: TopicConfig = {
  id: "dbms",
  name: "Database Management Systems",
  shortName: "DBMS",
  description: "SQL, Normalization, Transactions, Indexing, and Database Design",
  icon: "🗄️",
  color: "from-blue-500 to-cyan-500",
  
  subtopics: [
    {
      id: "dbms-fundamentals",
      name: "DBMS Fundamentals",
      description: "Core concepts of database management systems",
      difficulty: "easy",
      preferredFormats: ["mcq", "theory"],
      keyConcepts: [
        "What is DBMS",
        "DBMS vs File System",
        "Types of databases (Relational, NoSQL, Graph)",
        "Database schema",
        "Data models",
      ],
      samplePrompts: [
        "Explain the difference between DBMS and traditional file systems",
        "What are the advantages of using a DBMS?",
        "Compare relational and NoSQL databases",
      ],
    },
    {
      id: "dbms-acid",
      name: "ACID Properties",
      description: "Transaction properties and reliability",
      difficulty: "medium",
      preferredFormats: ["mcq", "theory"],
      keyConcepts: [
        "Atomicity",
        "Consistency", 
        "Isolation",
        "Durability",
        "Transaction management",
      ],
      samplePrompts: [
        "What does ACID stand for?",
        "Explain atomicity with an example",
        "How does isolation prevent dirty reads?",
      ],
    },
    {
      id: "dbms-normalization",
      name: "Normalization",
      description: "Database normalization forms and techniques",
      difficulty: "medium",
      preferredFormats: ["mcq", "theory", "match"],
      keyConcepts: [
        "1NF - First Normal Form",
        "2NF - Second Normal Form", 
        "3NF - Third Normal Form",
        "BCNF - Boyce-Codd Normal Form",
        "Functional dependencies",
        "Transitive dependencies",
        "Denormalization",
      ],
      samplePrompts: [
        "What is the purpose of normalization?",
        "Explain the difference between 2NF and 3NF",
        "When would you consider denormalization?",
      ],
    },
    {
      id: "dbms-keys",
      name: "Keys and Relationships",
      description: "Database keys and table relationships",
      difficulty: "easy",
      preferredFormats: ["mcq", "match"],
      keyConcepts: [
        "Primary key",
        "Foreign key",
        "Candidate key",
        "Super key",
        "Composite key",
        "One-to-one relationships",
        "One-to-many relationships",
        "Many-to-many relationships",
      ],
    },
    {
      id: "dbms-sql",
      name: "SQL Queries",
      description: "Structured Query Language fundamentals",
      difficulty: "medium",
      preferredFormats: ["mcq", "coding"],
      keyConcepts: [
        "SELECT statements",
        "WHERE clause",
        "JOIN operations",
        "GROUP BY and HAVING",
        "Subqueries",
        "INSERT, UPDATE, DELETE",
        "CREATE, ALTER, DROP",
        "Aggregate functions",
      ],
      samplePrompts: [
        "Write a query to find duplicate emails",
        "Explain the difference between WHERE and HAVING",
        "What are the different types of JOINs?",
      ],
    },
    {
      id: "dbms-indexing",
      name: "Indexing",
      description: "Database indexing and performance optimization",
      difficulty: "hard",
      preferredFormats: ["theory", "mcq"],
      keyConcepts: [
        "B-Tree indexes",
        "Hash indexes",
        "Clustered vs Non-clustered",
        "Index selection",
        "Query optimization",
        "Index overhead",
      ],
    },
    {
      id: "dbms-transactions",
      name: "Transactions & Concurrency",
      description: "Transaction management and concurrency control",
      difficulty: "hard",
      preferredFormats: ["theory", "mcq"],
      keyConcepts: [
        "Commit and Rollback",
        "Savepoints",
        "Locking mechanisms",
        "Deadlocks",
        "Isolation levels",
        "Concurrency problems (dirty read, phantom read)",
      ],
    },
    {
      id: "dbms-schema-design",
      name: "Schema Design",
      description: "Database schema and ER diagram design",
      difficulty: "medium",
      preferredFormats: ["whiteboard", "theory"],
      keyConcepts: [
        "ER diagrams",
        "Entity relationships",
        "Cardinality",
        "Schema normalization",
        "Star schema",
        "Snowflake schema",
      ],
      samplePrompts: [
        "Design a database schema for an e-commerce platform",
        "Create an ER diagram for a library management system",
      ],
    },
  ],
  
  defaultFormats: ["mcq", "theory", "coding"],
  
  timePerFormat: {
    mcq: 45,      // 45 seconds per MCQ
    theory: 120,  // 2 minutes per theory question
    coding: 300,  // 5 minutes per coding question
    whiteboard: 600, // 10 minutes per whiteboard
    match: 60,    // 1 minute per match question
  },
  
  difficultyMix: {
    easy: 30,
    medium: 50,
    hard: 20,
  },
  
  tags: ["database", "sql", "backend", "data"],
};
