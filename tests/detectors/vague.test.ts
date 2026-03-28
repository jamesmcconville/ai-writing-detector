import { describe, it, expect } from 'vitest';
import { VAGUE_ATTRIBUTION_PHRASES } from '@/detectors/vague/attribution-phrases.js';
import { SUPERFICIAL_PHRASES } from '@/detectors/vague/superficial-phrases.js';
import { OVERGENERALIZATION_PHRASES } from '@/detectors/vague/overgeneralization-phrases.js';
import { detectVagueAttribution } from '@/detectors/vague/attribution.js';
import { detectSuperficialAnalysis } from '@/detectors/vague/superficial.js';
import { detectOvergeneralization } from '@/detectors/vague/overgeneralization.js';
import {
  hasLegitimateCitation,
  countLegitimateCitations,
} from '@/detectors/vague/legitimate-citations.js';
import { aggregateVagueClaims } from '@/detectors/vague/aggregator.js';
import {
  scoreVagueClaims,
  MAX_VAGUE_ATTRIBUTION_SCORE,
  MAX_SUPERFICIAL_SCORE,
  MAX_OVERGENERALIZATION_SCORE,
  MAX_VAGUE_CLAIMS_SCORE,
} from '@/detectors/vague/scorer.js';

describe('Vague Attribution Phrases', () => {
  it('should contain common vague attribution phrases', () => {
    expect(VAGUE_ATTRIBUTION_PHRASES).toContain('experts agree');
    expect(VAGUE_ATTRIBUTION_PHRASES).toContain('studies show');
    expect(VAGUE_ATTRIBUTION_PHRASES).toContain('research indicates');
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(VAGUE_ATTRIBUTION_PHRASES)).toBe(true);
  });
});

describe('Superficial Phrases', () => {
  it('should contain common superficial analysis phrases', () => {
    expect(SUPERFICIAL_PHRASES.some((p) => p.includes('worth noting'))).toBe(true);
    expect(SUPERFICIAL_PHRASES.some((p) => p.includes('significant'))).toBe(true);
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(SUPERFICIAL_PHRASES)).toBe(true);
  });
});

describe('Overgeneralization Phrases', () => {
  it('should contain common overgeneralization phrases', () => {
    expect(OVERGENERALIZATION_PHRASES.some((p) => p.includes('everyone knows'))).toBe(true);
    expect(OVERGENERALIZATION_PHRASES.some((p) => p.includes('well established'))).toBe(true);
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(OVERGENERALIZATION_PHRASES)).toBe(true);
  });
});

describe('detectVagueAttribution', () => {
  it('should detect experts agree', () => {
    const text = 'Experts agree that this approach is best.';
    const matches = detectVagueAttribution(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect studies show', () => {
    const text = 'Studies show a clear correlation.';
    const matches = detectVagueAttribution(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const text1 = 'Experts agree...';
    const text2 = 'EXPERTS AGREE...';
    expect(detectVagueAttribution(text1).length).toBeGreaterThan(0);
    expect(detectVagueAttribution(text2).length).toBeGreaterThan(0);
  });

  it('should return match positions', () => {
    const text = 'Experts agree on this point.';
    const matches = detectVagueAttribution(text);
    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectVagueAttribution('')).toEqual([]);
  });
});

describe('detectSuperficialAnalysis', () => {
  it('should detect it is worth noting', () => {
    const text = 'It is worth noting that results vary.';
    const matches = detectSuperficialAnalysis(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect significant developments', () => {
    const text = 'Significant developments have occurred.';
    const matches = detectSuperficialAnalysis(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    expect(detectSuperficialAnalysis('')).toEqual([]);
  });
});

describe('detectOvergeneralization', () => {
  it('should detect everyone knows', () => {
    const text = 'Everyone knows this is true.';
    const matches = detectOvergeneralization(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect it is well established', () => {
    const text = 'It is well established that the earth is round.';
    const matches = detectOvergeneralization(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    expect(detectOvergeneralization('')).toEqual([]);
  });
});

describe('Legitimate Citations', () => {
  it('should detect year citations', () => {
    expect(hasLegitimateCitation('According to a 2024 study...')).toBe(true);
    expect(hasLegitimateCitation('Research from 2023 shows...')).toBe(true);
  });

  it('should detect author citations', () => {
    expect(hasLegitimateCitation('Smith et al. found that...')).toBe(true);
    expect(hasLegitimateCitation('According to Johnson (2024)...')).toBe(true);
  });

  it('should detect journal citations', () => {
    expect(hasLegitimateCitation('Published in Nature...')).toBe(true);
    expect(hasLegitimateCitation('As reported in Science...')).toBe(true);
  });

  it('should count multiple citations', () => {
    const text = 'Smith et al. (2023) and Johnson (2024) both found...';
    expect(countLegitimateCitations(text)).toBeGreaterThanOrEqual(1);
  });

  it('should return false for no citations', () => {
    expect(hasLegitimateCitation('This is a claim.')).toBe(false);
  });

  it('should handle empty input', () => {
    expect(hasLegitimateCitation('')).toBe(false);
    expect(countLegitimateCitations('')).toBe(0);
  });
});

describe('aggregateVagueClaims', () => {
  it('should combine all pattern types', () => {
    const text = 'Experts agree. It is worth noting. Everyone knows this.';
    const result = aggregateVagueClaims(text);

    expect(result.vagueAttributions.length).toBeGreaterThan(0);
    expect(result.superficialAnalysis.length).toBeGreaterThan(0);
    expect(result.overgeneralizations.length).toBeGreaterThan(0);
  });

  it('should count legitimate citations', () => {
    const text = 'Experts agree, but according to Smith et al. (2024)...';
    const result = aggregateVagueClaims(text);
    expect(result.legitimateCitations).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    const result = aggregateVagueClaims('');
    expect(result.vagueAttributions).toEqual([]);
    expect(result.superficialAnalysis).toEqual([]);
    expect(result.overgeneralizations).toEqual([]);
    expect(result.legitimateCitations).toBe(0);
  });
});

describe('scoreVagueClaims', () => {
  it('should score vague attributions', () => {
    const text = 'Experts agree. Studies show. Research indicates.';
    const result = scoreVagueClaims(text);

    const vaCategory = result.subcategories.find((s) => s.name === 'vague-attributions');
    expect(vaCategory?.score).toBeGreaterThan(0);
  });

  it('should cap scores per category', () => {
    const manyPhrases = Array(20).fill('Experts agree.').join(' ');
    const result = scoreVagueClaims(manyPhrases);

    const vaCategory = result.subcategories.find((s) => s.name === 'vague-attributions');
    expect(vaCategory?.score).toBeLessThanOrEqual(MAX_VAGUE_ATTRIBUTION_SCORE);
  });

  it('should reduce score for legitimate citations', () => {
    const textWithCitation = 'Experts agree, according to Smith et al. (2024)...';
    const textWithoutCitation = 'Experts agree on this point.';

    const resultWith = scoreVagueClaims(textWithCitation);
    const resultWithout = scoreVagueClaims(textWithoutCitation);

    expect(resultWith.totalScore).toBeLessThan(resultWithout.totalScore + 5);
  });

  it('should calculate total score', () => {
    const text = 'Experts agree. It is worth noting. Everyone knows.';
    const result = scoreVagueClaims(text);

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(MAX_VAGUE_CLAIMS_SCORE);
  });

  it('should return category as vague-claims', () => {
    const result = scoreVagueClaims('test');
    expect(result.category).toBe('vague-claims');
  });

  it('should handle empty input', () => {
    const result = scoreVagueClaims('');
    expect(result.totalScore).toBe(0);
  });

  it('should handle whitespace-only input', () => {
    const result = scoreVagueClaims('   \t\n  ');
    expect(result.totalScore).toBe(0);
  });
});

describe('Vague Claims Scoring Constants', () => {
  it('should have MAX_VAGUE_ATTRIBUTION_SCORE defined', () => {
    expect(MAX_VAGUE_ATTRIBUTION_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_SUPERFICIAL_SCORE defined', () => {
    expect(MAX_SUPERFICIAL_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_OVERGENERALIZATION_SCORE defined', () => {
    expect(MAX_OVERGENERALIZATION_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_VAGUE_CLAIMS_SCORE as sum of subcategory caps', () => {
    const expectedTotal =
      MAX_VAGUE_ATTRIBUTION_SCORE + MAX_SUPERFICIAL_SCORE + MAX_OVERGENERALIZATION_SCORE;
    expect(MAX_VAGUE_CLAIMS_SCORE).toBe(expectedTotal);
  });
});
