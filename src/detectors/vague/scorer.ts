import { aggregateVagueClaims } from './aggregator.js';

export const MAX_VAGUE_ATTRIBUTION_SCORE = 12;
export const MAX_SUPERFICIAL_SCORE = 10;
export const MAX_OVERGENERALIZATION_SCORE = 8;
export const MAX_VAGUE_CLAIMS_SCORE =
  MAX_VAGUE_ATTRIBUTION_SCORE + MAX_SUPERFICIAL_SCORE + MAX_OVERGENERALIZATION_SCORE;

const POINTS_PER_VAGUE_ATTRIBUTION = 3;
const POINTS_PER_SUPERFICIAL = 2;
const POINTS_PER_OVERGENERALIZATION = 2;
const CITATION_REDUCTION = 3;

export interface VagueClaimsSubcategory {
  name: string;
  score: number;
  maxScore: number;
  matches: string[];
  count: number;
}

export interface VagueClaimsScoreResult {
  category: 'vague-claims';
  subcategories: VagueClaimsSubcategory[];
  totalScore: number;
  maxScore: number;
  explanation: string;
}

export function scoreVagueClaims(text: string): VagueClaimsScoreResult {
  if (!text || text.trim().length === 0) {
    return {
      category: 'vague-claims',
      subcategories: [],
      totalScore: 0,
      maxScore: MAX_VAGUE_CLAIMS_SCORE,
      explanation: 'No text to analyze',
    };
  }

  const matches = aggregateVagueClaims(text);

  const vagueAttributionRaw = matches.vagueAttributions.length * POINTS_PER_VAGUE_ATTRIBUTION;
  const citationReduction = Math.min(
    matches.legitimateCitations * CITATION_REDUCTION,
    MAX_VAGUE_ATTRIBUTION_SCORE,
  );
  const vagueAttributionScore = Math.max(0, vagueAttributionRaw - citationReduction);
  const cappedVagueAttributionScore = Math.min(vagueAttributionScore, MAX_VAGUE_ATTRIBUTION_SCORE);

  const superficialScore = Math.min(
    matches.superficialAnalysis.length * POINTS_PER_SUPERFICIAL,
    MAX_SUPERFICIAL_SCORE,
  );

  const overgeneralizationScore = Math.min(
    matches.overgeneralizations.length * POINTS_PER_OVERGENERALIZATION,
    MAX_OVERGENERALIZATION_SCORE,
  );

  const subcategories: VagueClaimsSubcategory[] = [
    {
      name: 'vague-attributions',
      score: cappedVagueAttributionScore,
      maxScore: MAX_VAGUE_ATTRIBUTION_SCORE,
      matches: matches.vagueAttributions.map((m) => m.phrase),
      count: matches.vagueAttributions.length,
    },
    {
      name: 'superficial-analysis',
      score: superficialScore,
      maxScore: MAX_SUPERFICIAL_SCORE,
      matches: matches.superficialAnalysis.map((m) => m.phrase),
      count: matches.superficialAnalysis.length,
    },
    {
      name: 'overgeneralizations',
      score: overgeneralizationScore,
      maxScore: MAX_OVERGENERALIZATION_SCORE,
      matches: matches.overgeneralizations.map((m) => m.phrase),
      count: matches.overgeneralizations.length,
    },
  ];

  const totalScore = cappedVagueAttributionScore + superficialScore + overgeneralizationScore;

  const totalPatterns =
    matches.vagueAttributions.length +
    matches.superficialAnalysis.length +
    matches.overgeneralizations.length;

  let explanation: string;
  if (totalPatterns === 0) {
    explanation = 'No vague claims detected';
  } else if (citationReduction > 0) {
    explanation = `Found ${totalPatterns} vague claim pattern${totalPatterns === 1 ? '' : 's'} (${totalScore} points, reduced by ${citationReduction} for legitimate citations)`;
  } else {
    explanation = `Found ${totalPatterns} vague claim pattern${totalPatterns === 1 ? '' : 's'} across ${subcategories.filter((s) => s.count > 0).length} categories (${totalScore} points)`;
  }

  return {
    category: 'vague-claims',
    subcategories,
    totalScore,
    maxScore: MAX_VAGUE_CLAIMS_SCORE,
    explanation,
  };
}
