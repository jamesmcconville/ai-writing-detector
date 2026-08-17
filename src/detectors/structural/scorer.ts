import { aggregateStructuralPatterns } from './aggregator.js';
import { extractSentence } from '@/utils/sentence-extractor.js';
import type { MatchExample } from '@/report/types.js';

export const MAX_RULE_OF_THREE_SCORE = 10;
export const MAX_NEGATIVE_PARALLELISM_SCORE = 8;
export const MAX_OUTLINE_CONCLUSIONS_SCORE = 10;
export const MAX_FALSE_RANGES_SCORE = 6;
export const MAX_STRUCTURAL_SCORE =
  MAX_RULE_OF_THREE_SCORE +
  MAX_NEGATIVE_PARALLELISM_SCORE +
  MAX_OUTLINE_CONCLUSIONS_SCORE +
  MAX_FALSE_RANGES_SCORE;

const POINTS_PER_RULE_OF_THREE = 2;
const POINTS_PER_NEGATIVE_PARALLELISM = 2;
const POINTS_PER_OUTLINE_CONCLUSION = 5;
const POINTS_PER_FALSE_RANGE = 2;

function buildStructuralExamples(
  text: string,
  matches: Array<{ text: string; position: number }>,
  subcategory: string,
): MatchExample[] {
  return matches.map((m) => {
    const start = m.position;
    const end = m.position + m.text.length;
    const context = extractSentence(text, start, end);
    return {
      term: m.text,
      sentence: context.sentence,
      start,
      end,
      category: 'structural',
      subcategory,
    };
  });
}

export interface StructuralSubcategory {
  name: string;
  score: number;
  maxScore: number;
  matches: string[];
  count: number;
  examples: MatchExample[];
}

export interface StructuralScoreResult {
  category: 'structural';
  subcategories: StructuralSubcategory[];
  totalScore: number;
  maxScore: number;
  explanation: string;
  examples: MatchExample[];
}

export function scoreStructural(text: string): StructuralScoreResult {
  if (!text || text.trim().length === 0) {
    return {
      category: 'structural',
      subcategories: [],
      totalScore: 0,
      maxScore: MAX_STRUCTURAL_SCORE,
      explanation: 'No text to analyze',
      examples: [],
    };
  }

  const matches = aggregateStructuralPatterns(text);

  const ruleOfThreeScore = Math.min(
    matches.ruleOfThree.length * POINTS_PER_RULE_OF_THREE,
    MAX_RULE_OF_THREE_SCORE,
  );

  const negativeParallelismScore = Math.min(
    matches.negativeParallelism.length * POINTS_PER_NEGATIVE_PARALLELISM,
    MAX_NEGATIVE_PARALLELISM_SCORE,
  );

  const outlineConclusionsScore = Math.min(
    matches.outlineConclusions.length * POINTS_PER_OUTLINE_CONCLUSION,
    MAX_OUTLINE_CONCLUSIONS_SCORE,
  );

  const falseRangesScore = Math.min(
    matches.falseRanges.length * POINTS_PER_FALSE_RANGE,
    MAX_FALSE_RANGES_SCORE,
  );

  const ruleOfThreeExamples = buildStructuralExamples(
    text,
    matches.ruleOfThree,
    'rule-of-three',
  );
  const negativeParallelismExamples = buildStructuralExamples(
    text,
    matches.negativeParallelism,
    'negative-parallelism',
  );
  const outlineConclusionsExamples = buildStructuralExamples(
    text,
    matches.outlineConclusions,
    'outline-conclusions',
  );
  const falseRangesExamples = buildStructuralExamples(text, matches.falseRanges, 'false-ranges');

  const subcategories: StructuralSubcategory[] = [
    {
      name: 'rule-of-three',
      score: ruleOfThreeScore,
      maxScore: MAX_RULE_OF_THREE_SCORE,
      matches: matches.ruleOfThree.map((m) => m.text),
      count: matches.ruleOfThree.length,
      examples: ruleOfThreeExamples,
    },
    {
      name: 'negative-parallelism',
      score: negativeParallelismScore,
      maxScore: MAX_NEGATIVE_PARALLELISM_SCORE,
      matches: matches.negativeParallelism.map((m) => m.text),
      count: matches.negativeParallelism.length,
      examples: negativeParallelismExamples,
    },
    {
      name: 'outline-conclusions',
      score: outlineConclusionsScore,
      maxScore: MAX_OUTLINE_CONCLUSIONS_SCORE,
      matches: matches.outlineConclusions.map((m) => m.text),
      count: matches.outlineConclusions.length,
      examples: outlineConclusionsExamples,
    },
    {
      name: 'false-ranges',
      score: falseRangesScore,
      maxScore: MAX_FALSE_RANGES_SCORE,
      matches: matches.falseRanges.map((m) => m.text),
      count: matches.falseRanges.length,
      examples: falseRangesExamples,
    },
  ];

  const totalScore =
    ruleOfThreeScore + negativeParallelismScore + outlineConclusionsScore + falseRangesScore;

  const totalPatterns =
    matches.ruleOfThree.length +
    matches.negativeParallelism.length +
    matches.outlineConclusions.length +
    matches.falseRanges.length;

  const examples = [
    ...ruleOfThreeExamples,
    ...negativeParallelismExamples,
    ...outlineConclusionsExamples,
    ...falseRangesExamples,
  ];

  const explanation =
    totalPatterns === 0
      ? 'No structural patterns detected'
      : `Found ${totalPatterns} structural pattern${totalPatterns === 1 ? '' : 's'} across ${subcategories.filter((s) => s.count > 0).length} categories (${totalScore} points)`;

  return {
    category: 'structural',
    subcategories,
    totalScore,
    maxScore: MAX_STRUCTURAL_SCORE,
    explanation,
    examples,
  };
}
