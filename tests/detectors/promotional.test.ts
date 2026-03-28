import { describe, it, expect } from 'vitest';
import { INTENSIFIERS, SUPERLATIVES } from '@/detectors/promotional/intensifiers.js';
import { MARKETING_PHRASES } from '@/detectors/promotional/marketing-phrases.js';
import { detectUndueEmphasis } from '@/detectors/promotional/emphasis.js';
import { detectPromotionalLanguage } from '@/detectors/promotional/promotional.js';
import { detectElegantVariation } from '@/detectors/promotional/elegant-variation.js';
import { aggregatePromotionalPatterns } from '@/detectors/promotional/aggregator.js';
import {
  scorePromotional,
  MAX_EMPHASIS_SCORE,
  MAX_PROMOTIONAL_SCORE,
  MAX_ELEGANT_VARIATION_SCORE,
  MAX_PROMOTIONAL_LANGUAGE_SCORE,
} from '@/detectors/promotional/scorer.js';

describe('Intensifiers List', () => {
  it('should contain common intensifiers', () => {
    expect(INTENSIFIERS).toContain('absolutely');
    expect(INTENSIFIERS).toContain('extremely');
    expect(INTENSIFIERS).toContain('incredibly');
  });

  it('should contain superlatives', () => {
    expect(SUPERLATIVES).toContain('best');
    expect(SUPERLATIVES).toContain('greatest');
  });

  it('should be readonly arrays', () => {
    expect(Array.isArray(INTENSIFIERS)).toBe(true);
    expect(Array.isArray(SUPERLATIVES)).toBe(true);
  });
});

describe('Marketing Phrases List', () => {
  it('should contain common marketing phrases', () => {
    expect(MARKETING_PHRASES).toContain('game-changer');
    expect(MARKETING_PHRASES).toContain('revolutionary');
    expect(MARKETING_PHRASES).toContain('cutting-edge');
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(MARKETING_PHRASES)).toBe(true);
  });
});

describe('detectUndueEmphasis', () => {
  it('should detect intensifiers', () => {
    const text = 'This is absolutely incredible.';
    const matches = detectUndueEmphasis(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect superlatives', () => {
    const text = 'This is the best solution.';
    const matches = detectUndueEmphasis(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const text1 = 'This is TREMENDOUS.';
    const text2 = 'This is tremendous.';
    expect(detectUndueEmphasis(text1).length).toBeGreaterThan(0);
    expect(detectUndueEmphasis(text2).length).toBeGreaterThan(0);
  });

  it('should return match positions', () => {
    const text = 'This is truly remarkable.';
    const matches = detectUndueEmphasis(text);
    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectUndueEmphasis('')).toEqual([]);
  });
});

describe('detectPromotionalLanguage', () => {
  it('should detect game-changer', () => {
    const text = 'This is a game-changer.';
    const matches = detectPromotionalLanguage(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect revolutionary', () => {
    const text = 'This revolutionary approach changes everything.';
    const matches = detectPromotionalLanguage(text);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    expect(detectPromotionalLanguage('')).toEqual([]);
  });
});

describe('detectElegantVariation', () => {
  it('should detect organization synonym cycling', () => {
    const text =
      'The company announced results. The organization confirmed growth. The firm expanded.';
    const matches = detectElegantVariation(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m) => m.count >= 2)).toBe(true);
  });

  it('should not detect variation with consistent terminology', () => {
    const text = 'The company announced. The company confirmed. The company expanded.';
    const matches = detectElegantVariation(text);
    expect(matches.length).toBe(0);
  });

  it('should handle empty input', () => {
    expect(detectElegantVariation('')).toEqual([]);
  });
});

describe('aggregatePromotionalPatterns', () => {
  it('should combine all pattern types', () => {
    const text =
      'This absolutely incredible game-changer helps the company. The organization benefits.';
    const result = aggregatePromotionalPatterns(text);

    expect(result.undueEmphasis.length).toBeGreaterThan(0);
    expect(result.promotionalLanguage.length).toBeGreaterThan(0);
    expect(result.elegantVariation.length).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    const result = aggregatePromotionalPatterns('');
    expect(result.undueEmphasis).toEqual([]);
    expect(result.promotionalLanguage).toEqual([]);
    expect(result.elegantVariation).toEqual([]);
  });
});

describe('scorePromotional', () => {
  it('should score emphasis patterns', () => {
    const text = 'This is truly remarkable and absolutely incredible.';
    const result = scorePromotional(text);

    const emphasisCat = result.subcategories.find((s) => s.name === 'undue-emphasis');
    expect(emphasisCat?.score).toBeGreaterThan(0);
  });

  it('should cap scores per category', () => {
    const manyPhrases = Array(20).fill('This is absolutely incredible.').join(' ');
    const result = scorePromotional(manyPhrases);

    const emphasisCat = result.subcategories.find((s) => s.name === 'undue-emphasis');
    expect(emphasisCat?.score).toBeLessThanOrEqual(MAX_EMPHASIS_SCORE);
  });

  it('should calculate total score', () => {
    const text =
      'This absolutely incredible game-changer transforms the company. The organization benefits.';
    const result = scorePromotional(text);

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(MAX_PROMOTIONAL_LANGUAGE_SCORE);
  });

  it('should return category as promotional-language', () => {
    const result = scorePromotional('test');
    expect(result.category).toBe('promotional-language');
  });

  it('should handle empty input', () => {
    const result = scorePromotional('');
    expect(result.totalScore).toBe(0);
  });

  it('should handle whitespace-only input', () => {
    const result = scorePromotional('   \t\n  ');
    expect(result.totalScore).toBe(0);
  });
});

describe('Promotional Scoring Constants', () => {
  it('should have MAX_EMPHASIS_SCORE defined', () => {
    expect(MAX_EMPHASIS_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_PROMOTIONAL_SCORE defined', () => {
    expect(MAX_PROMOTIONAL_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_ELEGANT_VARIATION_SCORE defined', () => {
    expect(MAX_ELEGANT_VARIATION_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_PROMOTIONAL_LANGUAGE_SCORE as sum of subcategory caps', () => {
    const expectedTotal = MAX_EMPHASIS_SCORE + MAX_PROMOTIONAL_SCORE + MAX_ELEGANT_VARIATION_SCORE;
    expect(MAX_PROMOTIONAL_LANGUAGE_SCORE).toBe(expectedTotal);
  });
});
