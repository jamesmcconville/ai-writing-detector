import type { ScoringResult, ScoreContributor } from '../scoring/types.js';
import type { StatisticalAnalysisResult } from '../analyzers/aggregator.js';

export interface ReportTimestamp {
  iso: string;
  local: string;
}

export interface StatisticsSection {
  characterCount: number;
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
}

export interface LinguisticFactor {
  name: string;
  value: number;
  unit: string;
  interpretation: string;
  isAISignal: boolean;
}

export interface LinguisticSection {
  factors: LinguisticFactor[];
  overallScore: number;
  overallInterpretation: string;
}

export interface PatternCategory {
  name: string;
  score: number;
  maxScore: number;
  matchCount: number;
  matches: string[];
  subcategories?: PatternSubcategory[];
}

export interface PatternSubcategory {
  name: string;
  score: number;
  maxScore: number;
  count: number;
  matches: string[];
}

export interface PatternsSection {
  categories: PatternCategory[];
  totalScore: number;
  totalMaxScore: number;
}

export interface ScoreSection {
  score: number;
  rawScore: number;
  maxRawScore: number;
  classification: string;
  explanation: string;
  thresholds: {
    human: number;
    ai: number;
  };
}

export interface Report {
  timestamp: ReportTimestamp;
  statistics: StatisticsSection;
  linguistic: LinguisticSection;
  patterns: PatternsSection;
  score: ScoreSection;
  contributions: ScoreContributor[];
}
