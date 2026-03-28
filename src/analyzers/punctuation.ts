import { tokenizeSentences } from '../utils/tokenizer.js';

export interface PunctuationResult {
  semicolonCount: number;
  emDashCount: number;
  colonCount: number;
  ellipsisCount: number;
  totalPunctuation: number;
  perSentence: number;
  interpretation: string;
}

export function analyzePunctuation(text: string): PunctuationResult {
  if (!text || text.trim().length === 0) {
    return {
      semicolonCount: 0,
      emDashCount: 0,
      colonCount: 0,
      ellipsisCount: 0,
      totalPunctuation: 0,
      perSentence: 0,
      interpretation: 'No text to analyze',
    };
  }

  const sentences = tokenizeSentences(text);
  const sentenceCount = sentences.length || 1;

  const semicolonMatches = text.match(/;/g) || [];
  const emDashMatches = text.match(/—/g) || [];
  const colonMatches = text.match(/:/g) || [];
  const ellipsisMatches = text.match(/\.{3,}|…/g) || [];

  const semicolonCount = semicolonMatches.length;
  const emDashCount = emDashMatches.length;
  const colonCount = colonMatches.length;
  const ellipsisCount = ellipsisMatches.length;
  const totalPunctuation = semicolonCount + emDashCount + colonCount + ellipsisCount;
  const perSentence = totalPunctuation / sentenceCount;

  let interpretation: string;
  if (perSentence > 0.5) {
    interpretation = 'High punctuation density (AI signal)';
  } else if (perSentence > 0.3) {
    interpretation = 'Moderate punctuation density';
  } else {
    interpretation = 'Low punctuation density (natural)';
  }

  return {
    semicolonCount,
    emDashCount,
    colonCount,
    ellipsisCount,
    totalPunctuation,
    perSentence,
    interpretation,
  };
}
