import { tokenizeWords } from '../utils/tokenizer.js';

export interface TTRResult {
  typeTokenRatio: number;
  uniqueWordCount: number;
  totalWordCount: number;
  interpretation: string;
}

export function calculateTTR(text: string): TTRResult {
  if (!text || text.trim().length === 0) {
    return {
      typeTokenRatio: 0,
      uniqueWordCount: 0,
      totalWordCount: 0,
      interpretation: 'No text to analyze',
    };
  }

  const words = tokenizeWords(text);
  const totalWordCount = words.length;

  if (totalWordCount === 0) {
    return {
      typeTokenRatio: 0,
      uniqueWordCount: 0,
      totalWordCount: 0,
      interpretation: 'No words found',
    };
  }

  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const uniqueWordCount = uniqueWords.size;
  const typeTokenRatio = uniqueWordCount / totalWordCount;

  let interpretation: string;
  if (typeTokenRatio > 0.8) {
    interpretation = 'High diversity - varied vocabulary';
  } else if (typeTokenRatio < 0.4) {
    interpretation = 'Low diversity - repetitive vocabulary';
  } else {
    interpretation = 'Moderate diversity';
  }

  return {
    typeTokenRatio,
    uniqueWordCount,
    totalWordCount,
    interpretation,
  };
}
