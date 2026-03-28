import { tokenizeWords } from '../utils/tokenizer.js';
import { tokenizeSentences } from '../utils/tokenizer.js';

export interface FleschKincaidResult {
  gradeLevel: number;
  readingEase: number;
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  interpretation: string;
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e$)/, '');
  word = word.replace(/y$/, 'i');
  
  const vowelMatches = word.match(/[aeiouy]/gi);
  return Math.max(1, vowelMatches ? vowelMatches.length : 0);
}

export function calculateFleschKincaid(text: string): FleschKincaidResult {
  if (!text || text.trim().length === 0) {
    return {
      gradeLevel: 0,
      readingEase: 0,
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
      interpretation: 'No text to analyze',
    };
  }

  const words = tokenizeWords(text);
  const sentences = tokenizeSentences(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      gradeLevel: 0,
      readingEase: 0,
      wordCount,
      sentenceCount,
      syllableCount: 0,
      interpretation: 'Insufficient text for analysis',
    };
  }

  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const readingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord;

  let interpretation: string;
  if (gradeLevel > 14) {
    interpretation = 'Very difficult - high complexity (AI signal)';
  } else if (gradeLevel > 12) {
    interpretation = 'Difficult - complex vocabulary';
  } else if (gradeLevel < 8) {
    interpretation = 'Easy - simple vocabulary';
  } else {
    interpretation = 'Moderate difficulty - standard readability';
  }

  return {
    gradeLevel,
    readingEase,
    wordCount,
    sentenceCount,
    syllableCount,
    interpretation,
  };
}
