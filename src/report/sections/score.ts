import type { ScoringResult } from '../../scoring/types.js';
import type { ScoreSection } from '../types.js';

export function buildScoreSection(scoringResult: ScoringResult): ScoreSection {
  return {
    score: scoringResult.score,
    rawScore: scoringResult.rawScore,
    maxRawScore: scoringResult.maxRawScore,
    classification: scoringResult.classification.label,
    explanation: scoringResult.classification.explanation,
    thresholds: scoringResult.classification.thresholds,
  };
}
