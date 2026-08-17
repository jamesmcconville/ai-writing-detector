import { aggregatePromotionalPatterns } from './aggregator.js';
import { extractSentence } from '@/utils/sentence-extractor.js';
import type { MatchExample } from '@/report/types.js';

export const MAX_EMPHASIS_SCORE = 10;
export const MAX_PROMOTIONAL_SCORE = 12;
export const MAX_ELEGANT_VARIATION_SCORE = 8;
export const MAX_PROMOTIONAL_LANGUAGE_SCORE =
  MAX_EMPHASIS_SCORE + MAX_PROMOTIONAL_SCORE + MAX_ELEGANT_VARIATION_SCORE;

const POINTS_PER_EMPHASIS = 2;
const POINTS_PER_PROMOTIONAL = 3;
const POINTS_PER_VARIATION_GROUP = 4;

export interface PromotionalSubcategory {
  name: string;
  score: number;
  maxScore: number;
  matches: string[];
  count: number;
  examples: MatchExample[];
}

export interface PromotionalScoreResult {
  category: 'promotional-language';
  subcategories: PromotionalSubcategory[];
  totalScore: number;
  maxScore: number;
  explanation: string;
  examples: MatchExample[];
}

export function scorePromotional(text: string): PromotionalScoreResult {
  if (!text || text.trim().length === 0) {
    return {
      category: 'promotional-language',
      subcategories: [],
      totalScore: 0,
      maxScore: MAX_PROMOTIONAL_LANGUAGE_SCORE,
      explanation: 'No text to analyze',
      examples: [],
    };
  }

  const matches = aggregatePromotionalPatterns(text);

  const emphasisScore = Math.min(
    matches.undueEmphasis.length * POINTS_PER_EMPHASIS,
    MAX_EMPHASIS_SCORE,
  );

  const promotionalScore = Math.min(
    matches.promotionalLanguage.length * POINTS_PER_PROMOTIONAL,
    MAX_PROMOTIONAL_SCORE,
  );

  const variationScore = Math.min(
    matches.elegantVariation.length * POINTS_PER_VARIATION_GROUP,
    MAX_ELEGANT_VARIATION_SCORE,
  );

  const emphasisExamples: MatchExample[] = matches.undueEmphasis.map((m) => {
    const start = m.position;
    const end = m.position + m.term.length;
    const context = extractSentence(text, start, end);
    return {
      term: m.term,
      sentence: context.sentence,
      start,
      end,
      category: 'promotional-language',
      subcategory: 'undue-emphasis',
    };
  });

  const promotionalExamples: MatchExample[] = matches.promotionalLanguage.map((m) => {
    const start = m.position;
    const end = m.position + m.phrase.length;
    const context = extractSentence(text, start, end);
    return {
      term: m.phrase,
      sentence: context.sentence,
      start,
      end,
      category: 'promotional-language',
      subcategory: 'promotional-language',
    };
  });

  // Elegant variation matches do not carry position information, so we cannot extract sentence context.
  const variationExamples: MatchExample[] = [];

  const subcategories: PromotionalSubcategory[] = [
    {
      name: 'undue-emphasis',
      score: emphasisScore,
      maxScore: MAX_EMPHASIS_SCORE,
      matches: matches.undueEmphasis.map((m) => m.term),
      count: matches.undueEmphasis.length,
      examples: emphasisExamples,
    },
    {
      name: 'promotional-language',
      score: promotionalScore,
      maxScore: MAX_PROMOTIONAL_SCORE,
      matches: matches.promotionalLanguage.map((m) => m.phrase),
      count: matches.promotionalLanguage.length,
      examples: promotionalExamples,
    },
    {
      name: 'elegant-variation',
      score: variationScore,
      maxScore: MAX_ELEGANT_VARIATION_SCORE,
      matches: matches.elegantVariation.map((m) => `${m.found.join(', ')}`),
      count: matches.elegantVariation.length,
      examples: variationExamples,
    },
  ];

  const totalScore = emphasisScore + promotionalScore + variationScore;

  const totalPatterns =
    matches.undueEmphasis.length +
    matches.promotionalLanguage.length +
    matches.elegantVariation.length;

  const examples = [...emphasisExamples, ...promotionalExamples, ...variationExamples];

  const explanation =
    totalPatterns === 0
      ? 'No promotional language patterns detected'
      : `Found ${totalPatterns} promotional pattern${totalPatterns === 1 ? '' : 's'} across ${subcategories.filter((s) => s.count > 0).length} categories (${totalScore} points)`;

  return {
    category: 'promotional-language',
    subcategories,
    totalScore,
    maxScore: MAX_PROMOTIONAL_LANGUAGE_SCORE,
    explanation,
    examples,
  };
}
