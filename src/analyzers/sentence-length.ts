import { tokenizeSentences } from '../utils/tokenizer.js';

export interface SentenceLengthStats {
  mean: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  sentenceCount: number;
  lengths: number[];
  interpretation: string;
}

export function calculateSentenceLengthStats(text: string): SentenceLengthStats {
  if (!text || text.trim().length === 0) {
    return {
      mean: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      sentenceCount: 0,
      lengths: [],
      interpretation: 'No text to analyze',
    };
  }

  const sentences = tokenizeSentences(text);
  const sentenceCount = sentences.length;

  if (sentenceCount === 0) {
    return {
      mean: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      sentenceCount: 0,
      lengths: [],
      interpretation: 'No sentences found',
    };
  }

  const lengths = sentences.map(s => {
    const words = s.trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  });

  const mean = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;

  if (lengths.length === 1) {
    return {
      mean,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      sentenceCount,
      lengths,
      interpretation: 'Only one sentence',
    };
  }

  const squaredDiffs = lengths.map(len => Math.pow(len - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;

  let interpretation: string;
  if (coefficientOfVariation < 0.35) {
    interpretation = 'Low variation - uniform sentence lengths (AI signal)';
  } else if (coefficientOfVariation > 0.7) {
    interpretation = 'High variation - varied sentence structure';
  } else {
    interpretation = 'Moderate variation - natural rhythm';
  }

  return {
    mean,
    standardDeviation,
    coefficientOfVariation,
    sentenceCount,
    lengths,
    interpretation,
  };
}
