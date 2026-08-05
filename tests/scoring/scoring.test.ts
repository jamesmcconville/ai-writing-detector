import { describe, it, expect } from 'vitest';
import {
  aggregateScores,
  normalizeScore,
  classifyScore,
  computeScore,
  MAX_RAW_SCORE,
  HUMAN_THRESHOLD,
  AI_THRESHOLD,
} from '../../src/scoring/index.js';
import { displayScore, displaySummary } from '../../src/scoring/display.js';

describe('Score Aggregator', () => {
  it('should return zero scores for empty text', () => {
    const result = aggregateScores('');
    expect(result.rawTotal).toBe(0);
    expect(result.contributions).toHaveLength(0);
  });

  it('should return zero scores for whitespace-only text', () => {
    const result = aggregateScores('   \n\t  ');
    expect(result.rawTotal).toBe(0);
  });

  it('should aggregate all detector categories', () => {
    const text = 'This is a test sentence.';
    const result = aggregateScores(text);

    expect(result.contributions).toHaveLength(5);
    expect(result.contributions.map((c) => c.category)).toContain('vocabulary');
    expect(result.contributions.map((c) => c.category)).toContain('structural');
    expect(result.contributions.map((c) => c.category)).toContain('vague-claims');
    expect(result.contributions.map((c) => c.category)).toContain('promotional-language');
    expect(result.contributions.map((c) => c.category)).toContain('statistical');
  });

  it('should sum scores from all categories', () => {
    const text = 'This is a test sentence.';
    const result = aggregateScores(text);

    const expectedSum = result.contributions.reduce(
      (sum: number, c: { score: number }) => sum + c.score,
      0,
    );
    expect(result.rawTotal).toBe(expectedSum);
  });

  it('should include max possible score', () => {
    const text = 'Test.';
    const result = aggregateScores(text);

    expect(result.maxPossible).toBe(MAX_RAW_SCORE);
  });
});

describe('Score Normalizer', () => {
  it('should return score unchanged when below 100', () => {
    expect(normalizeScore(50, 121)).toBe(50);
    expect(normalizeScore(0, 121)).toBe(0);
    expect(normalizeScore(99.9, 121)).toBe(99.9);
  });

  it('should normalize score proportionally when above 100', () => {
    const result = normalizeScore(121, 121);
    expect(result).toBe(100);
  });

  it('should preserve relative proportions when normalizing', () => {
    const rawScore = 110;
    const result = normalizeScore(rawScore, 121);
    const expected = (110 / 121) * 100;
    expect(result).toBeCloseTo(expected, 0);
  });

  it('should round to one decimal place', () => {
    const result = normalizeScore(100.5, 121);
    expect(result.toString()).toMatch(/^\d+\.?\d?$/);
  });
});

describe('Score Classifier', () => {
  it('should classify scores below 30 as Likely Human-Written', () => {
    const result = classifyScore(0);
    expect(result.label).toBe('Likely Human-Written');

    const result2 = classifyScore(15);
    expect(result2.label).toBe('Likely Human-Written');

    const result3 = classifyScore(29.9);
    expect(result3.label).toBe('Likely Human-Written');
  });

  it('should classify score 30 as Possibly AI-Generated', () => {
    const result = classifyScore(30);
    expect(result.label).toBe('Possibly AI-Generated');
  });

  it('should classify scores 30-59 as Possibly AI-Generated', () => {
    const result = classifyScore(45);
    expect(result.label).toBe('Possibly AI-Generated');

    const result2 = classifyScore(59.9);
    expect(result2.label).toBe('Possibly AI-Generated');
  });

  it('should classify score 60 as Likely AI-Generated', () => {
    const result = classifyScore(60);
    expect(result.label).toBe('Likely AI-Generated');
  });

  it('should classify scores 60+ as Likely AI-Generated', () => {
    const result = classifyScore(75);
    expect(result.label).toBe('Likely AI-Generated');

    const result2 = classifyScore(100);
    expect(result2.label).toBe('Likely AI-Generated');
  });

  it('should include explanation with each classification', () => {
    const result = classifyScore(50);
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  it('should include threshold values in result', () => {
    const result = classifyScore(50);
    expect(result.thresholds.human).toBe(HUMAN_THRESHOLD);
    expect(result.thresholds.ai).toBe(AI_THRESHOLD);
  });
});

describe('computeScore', () => {
  it('should return complete scoring result for empty text', () => {
    const result = computeScore('');

    expect(result.score).toBe(0);
    expect(result.rawScore).toBe(0);
    expect(result.maxRawScore).toBe(MAX_RAW_SCORE);
    expect(result.classification.label).toBe('Likely Human-Written');
    expect(result.contributions).toHaveLength(0);
  });

  it('should return complete scoring result for normal text', () => {
    const text = 'This is a simple test sentence.';
    const result = computeScore(text);

    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.rawScore).toBeGreaterThanOrEqual(0);
    expect(result.classification).toBeDefined();
    expect(result.contributions.length).toBeGreaterThan(0);
  });

  it('should normalize high scores to 100 max', () => {
    const aiText = `Let us delve into this robust and transformative ecosystem.
    It is not only innovative but also groundbreaking and revolutionary.
    Studies show that this approach is efficient, scalable, and maintainable.
    Experts agree this is a game-changer with tremendous potential.
    Furthermore, moreover, additionally, and consequently, this is remarkable.`;

    const result = computeScore(aiText);

    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe('Display Functions', () => {
  it('should display score with classification', () => {
    const result = classifyScore(45);
    const output = displayScore(45, result);

    expect(output).toContain('45');
    expect(output).toContain('Possibly AI-Generated');
  });

  it('should display full summary', () => {
    const text = 'Test sentence.';
    const result = computeScore(text);
    const output = displaySummary(result);

    expect(output).toContain('AI PROBABILITY SCORE');
    expect(output).toContain('SCORE BREAKDOWN');
  });
});
