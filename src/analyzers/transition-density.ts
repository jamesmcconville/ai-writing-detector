import { tokenizeSentences } from '../utils/tokenizer.js';
import { TRANSITION_WORDS } from './transition-words.js';

export interface TransitionDensityResult {
  transitionWordCount: number;
  totalSentenceCount: number;
  percentage: number;
  wordsFound: string[];
  interpretation: string;
}

export function calculateTransitionDensity(text: string): TransitionDensityResult {
  if (!text || text.trim().length === 0) {
    return {
      transitionWordCount: 0,
      totalSentenceCount: 0,
      percentage: 0,
      wordsFound: [],
      interpretation: 'No text to analyze',
    };
  }

  const sentences = tokenizeSentences(text);
  const totalSentenceCount = sentences.length;

  if (totalSentenceCount === 0) {
    return {
      transitionWordCount: 0,
      totalSentenceCount: 0,
      percentage: 0,
      wordsFound: [],
      interpretation: 'No sentences found',
    };
  }

  const lowerText = text.toLowerCase();
  const wordsFound: string[] = [];

  for (const word of TRANSITION_WORDS) {
    const pattern = new RegExp(`\\b${word}\\b`, 'gi');
    if (pattern.test(lowerText)) {
      wordsFound.push(word);
    }
  }

  const transitionWordCount = wordsFound.length;
  const percentage = (transitionWordCount / totalSentenceCount) * 100;

  let interpretation: string;
  if (percentage > 20) {
    interpretation = 'High transition density (AI signal)';
  } else if (percentage > 10) {
    interpretation = 'Moderate transition density';
  } else {
    interpretation = 'Low transition density (natural)';
  }

  return {
    transitionWordCount,
    totalSentenceCount,
    percentage,
    wordsFound,
    interpretation,
  };
}
