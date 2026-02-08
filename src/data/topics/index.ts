/**
 * Topic Data Index
 * Central export for all topic configurations
 * 
 * Topics define what concepts to cover and preferred question formats.
 * The AI generates questions dynamically based on this configuration.
 */

export * from "./types";
export { dbmsTopic } from "./dbms";
export { reactTopic } from "./react";
export { dsaTopic } from "./dsa";
export { javascriptTopic } from "./javascript";
export { pythonTopic } from "./python";
export { systemDesignTopic } from "./system-design";
export { sqlTopic } from "./sql";

import { TopicConfig } from "./types";
import { dbmsTopic } from "./dbms";
import { reactTopic } from "./react";
import { dsaTopic } from "./dsa";
import { javascriptTopic } from "./javascript";
import { pythonTopic } from "./python";
import { systemDesignTopic } from "./system-design";
import { sqlTopic } from "./sql";

// All available topics
export const allTopics: TopicConfig[] = [
  dbmsTopic,
  reactTopic,
  dsaTopic,
  javascriptTopic,
  pythonTopic,
  systemDesignTopic,
  sqlTopic,
];

// Get topic by ID
export const getTopicById = (id: string): TopicConfig | undefined => {
  return allTopics.find((t) => t.id === id);
};

// Get topic names for display
export const getTopicNames = (): string[] => {
  return allTopics.map((t) => t.shortName);
};
