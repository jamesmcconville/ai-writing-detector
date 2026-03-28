import type { ScoringResult, AggregatedScore, ClassificationResult } from './types.js';
import { MAX_RAW_SCORE } from './types.js';
import { aggregateScores } from './aggregator.js';
import { normalizeScore } from './normalizer.js';
import { classifyScore } from './classifier.js';

export function computeScore(text: string): ScoringResult {
  const aggregated = aggregateScores(text);
  const normalizedScore = normalizeScore(aggregated.rawTotal, aggregated.maxPossible);
  const classification = classifyScore(normalizedScore);

  return {
    score: normalizedScore,
    rawScore: aggregated.rawTotal,
    maxRawScore: aggregated.maxPossible,
    classification,
    contributions: aggregated.contributions,
  };
}

export * from './types.js';
export * from './aggregator.js';
export * from './normalizer.js';
export * from './classifier.js';
export * from './display.js';
