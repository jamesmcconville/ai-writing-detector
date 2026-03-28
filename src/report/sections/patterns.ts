import type { ScoreContributor } from '../../scoring/types.js';
import type { PatternsSection, PatternCategory } from '../types.js';

export function buildPatternsSection(contributions: ScoreContributor[]): PatternsSection {
  const patternCategories = contributions.filter((c) => c.category !== 'statistical');

  const categories: PatternCategory[] = patternCategories.map((c) => ({
    name: c.category,
    score: c.score,
    maxScore: c.maxScore,
    matchCount: c.subcategories
      ? c.subcategories.reduce((sum, s) => sum + s.count, 0)
      : c.matches?.length || 0,
    matches: c.matches || [],
    subcategories: c.subcategories?.map((s) => ({
      name: s.name,
      score: s.score,
      maxScore: s.maxScore,
      count: s.count,
      matches: s.matches,
    })),
  }));

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const totalMaxScore = categories.reduce((sum, c) => sum + c.maxScore, 0);

  return {
    categories,
    totalScore,
    totalMaxScore,
  };
}
