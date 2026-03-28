import { MAX_NORMALIZED_SCORE } from './types.js';

export function normalizeScore(rawScore: number, maxRawScore: number): number {
  if (rawScore <= MAX_NORMALIZED_SCORE) {
    return Math.round(rawScore * 10) / 10;
  }

  const normalized = (rawScore / maxRawScore) * MAX_NORMALIZED_SCORE;
  return Math.round(normalized * 10) / 10;
}
