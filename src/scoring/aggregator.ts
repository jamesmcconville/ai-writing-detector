import type { ScoreContributor, AggregatedScore } from './types.js';
import { scoreVocabulary } from '../detectors/vocabulary/scorer.js';
import { scoreStructural } from '../detectors/structural/scorer.js';
import { scoreVagueClaims } from '../detectors/vague/scorer.js';
import { scorePromotional } from '../detectors/promotional/scorer.js';
import { aggregateStatistics } from '../analyzers/aggregator.js';

const MAX_POSSIBLE_RAW = 130;

export function aggregateScores(text: string): AggregatedScore {
  if (!text || text.trim().length === 0) {
    return {
      contributions: [],
      rawTotal: 0,
      maxPossible: MAX_POSSIBLE_RAW,
    };
  }

  const vocabularyResult = scoreVocabulary(text);
  const structuralResult = scoreStructural(text);
  const vagueResult = scoreVagueClaims(text);
  const promotionalResult = scorePromotional(text);
  const statisticalResult = aggregateStatistics(text);

  const contributions: ScoreContributor[] = [
    {
      category: vocabularyResult.category,
      score: vocabularyResult.score,
      maxScore: vocabularyResult.maxScore,
      explanation: vocabularyResult.explanation,
    },
    {
      category: structuralResult.category,
      score: structuralResult.totalScore,
      maxScore: structuralResult.maxScore,
      explanation: structuralResult.explanation,
      subcategories: structuralResult.subcategories,
    },
    {
      category: vagueResult.category,
      score: vagueResult.totalScore,
      maxScore: vagueResult.maxScore,
      explanation: vagueResult.explanation,
      subcategories: vagueResult.subcategories,
    },
    {
      category: promotionalResult.category,
      score: promotionalResult.totalScore,
      maxScore: promotionalResult.maxScore,
      explanation: promotionalResult.explanation,
      subcategories: promotionalResult.subcategories,
    },
    {
      category: 'statistical',
      score: statisticalResult.overallScore,
      maxScore: 12,
      explanation: statisticalResult.overallInterpretation,
    },
  ];

  const rawTotal = contributions.reduce((sum, c) => sum + c.score, 0);

  return {
    contributions,
    rawTotal,
    maxPossible: MAX_POSSIBLE_RAW,
  };
}
