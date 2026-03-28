import { computeScore } from '../scoring/index.js';
import { aggregateStatistics } from '../analyzers/aggregator.js';
import { buildStatisticsSection } from './sections/statistics.js';
import { buildLinguisticSection } from './sections/linguistic.js';
import { buildPatternsSection } from './sections/patterns.js';
import { buildScoreSection } from './sections/score.js';
import { generateTimestamp } from './timestamp.js';
import type { Report } from './types.js';

export function generateReport(text: string): Report {
  const timestamp = generateTimestamp();
  const statistics = buildStatisticsSection(text);
  const scoringResult = computeScore(text);
  const statisticalAnalysis = aggregateStatistics(text);
  const linguistic = buildLinguisticSection(statisticalAnalysis);
  const patterns = buildPatternsSection(scoringResult.contributions);
  const score = buildScoreSection(scoringResult);

  return {
    timestamp,
    statistics,
    linguistic,
    patterns,
    score,
    contributions: scoringResult.contributions,
  };
}
