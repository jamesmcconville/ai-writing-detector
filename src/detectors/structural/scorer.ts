import { aggregateStructuralPatterns } from './aggregator.js';

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

export interface StructuralSubcategory {
  name: string;
  score: number;
  maxScore: number;
  matches: string[];
  count: number;
}

export interface StructuralScoreResult {
  category: 'structural';
  subcategories: StructuralSubcategory[];
  totalScore: number;
  maxScore: number;
  explanation: string;
}

export function scoreStructural(text: string): StructuralScoreResult {
  if (!text || text.trim().length === 0) {
    return {
      category: 'structural',
      subcategories: [],
      totalScore: 0,
      maxScore: MAX_STRUCTURAL_SCORE,
      explanation: 'No text to analyze',
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

  const subcategories: StructuralSubcategory[] = [
    {
      name: 'rule-of-three',
      score: ruleOfThreeScore,
      maxScore: MAX_RULE_OF_THREE_SCORE,
      matches: matches.ruleOfThree.map((m) => m.text),
      count: matches.ruleOfThree.length,
    },
    {
      name: 'negative-parallelism',
      score: negativeParallelismScore,
      maxScore: MAX_NEGATIVE_PARALLELISM_SCORE,
      matches: matches.negativeParallelism.map((m) => m.text),
      count: matches.negativeParallelism.length,
    },
    {
      name: 'outline-conclusions',
      score: outlineConclusionsScore,
      maxScore: MAX_OUTLINE_CONCLUSIONS_SCORE,
      matches: matches.outlineConclusions.map((m) => m.text),
      count: matches.outlineConclusions.length,
    },
    {
      name: 'false-ranges',
      score: falseRangesScore,
      maxScore: MAX_FALSE_RANGES_SCORE,
      matches: matches.falseRanges.map((m) => m.text),
      count: matches.falseRanges.length,
    },
  ];

  const totalScore =
    ruleOfThreeScore + negativeParallelismScore + outlineConclusionsScore + falseRangesScore;

  const totalPatterns =
    matches.ruleOfThree.length +
    matches.negativeParallelism.length +
    matches.outlineConclusions.length +
    matches.falseRanges.length;

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
  };
}
