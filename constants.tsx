import React from 'react';
import { ExplanationLevel, Subject, ExplanationLevelOption } from './types';
import { BeakerIcon, CalculatorIcon, HeartIcon, SparklesIcon } from './components/icons';

export const SUBJECTS: Subject[] = [
  { id: 'general', name: 'General', icon: React.createElement(SparklesIcon) },
  { id: 'physics', name: 'Physics', icon: React.createElement(BeakerIcon) },
  { id: 'chemistry', name: 'Chemistry', icon: React.createElement(BeakerIcon) },
  { id: 'biology', name: 'Biology', icon: React.createElement(HeartIcon) },
  { id: 'maths', name: 'Mathematics', icon: React.createElement(CalculatorIcon) },
];

export const EXPLANATION_LEVEL_OPTIONS: ExplanationLevelOption[] = [
  { value: ExplanationLevel.GENERAL, label: 'General Explanation' },
  { value: ExplanationLevel.CLASS_6, label: 'For Class 6' },
  { value: ExplanationLevel.CLASS_10, label: 'For Class 10' },
  { value: ExplanationLevel.NEET_JEE, label: 'For NEET/JEE Aspirants' },
];

export const getSystemInstructionForLevel = (level: ExplanationLevel): string => {
  switch (level) {
    case ExplanationLevel.CLASS_6:
      return "Explain this concept in a very simple way that a 6th-grade student can easily understand. Use simple analogies and avoid complex jargon.";
    case ExplanationLevel.CLASS_10:
      return "Explain this concept as you would to a 10th-grade student. You can assume basic knowledge of science and math. The explanation should be clear, concise, and help with board exam preparation.";
    case ExplanationLevel.NEET_JEE:
      return "Explain this concept in-depth, suitable for a student preparing for competitive exams like NEET or JEE. Cover all nuances, formulas, and potential trick questions. Be technically accurate and thorough.";
    case ExplanationLevel.GENERAL:
    default:
      return "You are Learnova, a friendly and knowledgeable AI study assistant. Your goal is to explain concepts clearly and accurately. Format your answers using markdown for readability, including headings, bold text, and lists where appropriate.";
  }
};

export const GEMINI_TEXT_MODEL_NAME = 'gemini-1.5-flash-latest';
export const GEMINI_MULTIMODAL_MODEL_NAME = 'gemini-1.5-flash-latest';

export const FREE_USES_LIMIT = 25;
export const ANONYMOUS_USES_LIMIT = 5;
export const PDF_EXPORT_LIMIT = 10;
export const PREMIUM_PRICE_INR = 39;
