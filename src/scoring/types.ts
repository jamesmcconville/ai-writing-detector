import type { MatchExample } from '../report/types.js';

/**
 * Scoring system types and interfaces for aggregating all detector results
 * into a unified 0-100 probability score.
 */

/**
 * Represents a single category's contribution to the overall score.
 * All detector results are normalized to this interface for aggregation.
 */
export interface ScoreContributor {
  category: string;
  score: number;
  maxScore: number;
  explanation: string;
  matches?: string[];
  subcategories?: SubcategoryResult[];
  examples?: MatchExample[];
}

/**
 * Represents a subcategory within a detector (e.g., 'rule-of-three' within 'structural')
 */
export interface SubcategoryResult {
  name: string;
  score: number;
  maxScore: number;
  matches: string[];
  count: number;
  examples?: MatchExample[];
}

/**
 * The aggregated score from all detectors before normalization.
 */
export interface AggregatedScore {
  /** All category contributions */
  contributions: ScoreContributor[];
  /** Sum of all raw scores (may exceed 100) */
  rawTotal: number;
  /** Sum of all max scores (130 for current detector set) */
  maxPossible: number;
}

/**
 * Classification result mapping score to human-readable label.
 */
export interface ClassificationResult {
  /** The classification label */
  label: 'Likely Human-Written' | 'Possibly AI-Generated' | 'Likely AI-Generated';
  /** Brief explanation of what this classification means */
  explanation: string;
  /** The threshold boundaries used for classification */
  thresholds: {
    human: number;
    ai: number;
  };
}

/**
 * Complete scoring result with all information needed for display.
 */
export interface ScoringResult {
  /** Normalized score (0-100) */
  score: number;
  /** Raw score before normalization */
  rawScore: number;
  /** Maximum possible raw score */
  maxRawScore: number;
  /** Classification based on score */
  classification: ClassificationResult;
  /** Individual category contributions */
  contributions: ScoreContributor[];
}

// Constants for scoring
export const MAX_RAW_SCORE = 130; // 24 (vocab) + 34 (structural) + 30 (vague) + 30 (promotional) + 12 (statistical)
export const HUMAN_THRESHOLD = 30;
export const AI_THRESHOLD = 60;
export const MAX_NORMALIZED_SCORE = 100;
