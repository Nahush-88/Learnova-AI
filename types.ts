import { Timestamp } from 'firebase/firestore';

export enum ExplanationLevel {
  GENERAL = 'general',
  CLASS_6 = 'class_6',
  CLASS_10 = 'class_10',
  NEET_JEE = 'neet_jee',
}

export interface ExplanationLevelOption {
  value: ExplanationLevel;
  label: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: React.ReactElement;
}

export interface Conversation {
  id: string;
  question: string;
  answer: string;
  timestamp: Timestamp;
}