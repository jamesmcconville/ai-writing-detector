import type { ClassificationResult } from './types.js';
import { HUMAN_THRESHOLD, AI_THRESHOLD } from './types.js';

export function classifyScore(score: number): ClassificationResult {
  if (score < HUMAN_THRESHOLD) {
    return {
      label: 'Likely Human-Written',
      explanation:
        'The text shows few or no patterns typically associated with AI-generated content.',
      thresholds: {
        human: HUMAN_THRESHOLD,
        ai: AI_THRESHOLD,
      },
    };
  }

  if (score < AI_THRESHOLD) {
    return {
      label: 'Possibly AI-Generated',
      explanation:
        'The text contains some patterns that may indicate AI generation, but results are inconclusive.',
      thresholds: {
        human: HUMAN_THRESHOLD,
        ai: AI_THRESHOLD,
      },
    };
  }

  return {
    label: 'Likely AI-Generated',
    explanation:
      'The text exhibits multiple patterns strongly associated with AI-generated content.',
    thresholds: {
      human: HUMAN_THRESHOLD,
      ai: AI_THRESHOLD,
    },
  };
}
