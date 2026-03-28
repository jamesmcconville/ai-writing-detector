import { describe, it, expect } from 'vitest';
import { calculateTTR } from '@/analyzers/lexical-diversity.js';
import { calculateSentenceLengthStats } from '@/analyzers/sentence-length.js';
import { detectPassiveVoice } from '@/analyzers/passive-voice.js';
import { TRANSITION_WORDS } from '@/analyzers/transition-words.js';
import { calculateTransitionDensity } from '@/analyzers/transition-density.js';
import { calculateFleschKincaid } from '@/analyzers/flesch-kincaid.js';
import { analyzePunctuation } from '@/analyzers/punctuation.js';
import { detectRareWords } from '@/analyzers/rare-words.js';
import { aggregateStatistics } from '@/analyzers/aggregator.js';

describe('calculateTTR', () => {
  it('should calculate type-token ratio', () => {
    const text = 'the cat sat on the mat';
    const result = calculateTTR(text);
    expect(result.totalWordCount).toBe(6);
    expect(result.uniqueWordCount).toBe(5);
    expect(result.typeTokenRatio).toBeCloseTo(5/6, 2);
  });

  it('should handle empty input', () => {
    const result = calculateTTR('');
    expect(result.typeTokenRatio).toBe(0);
  });

  it('should identify high diversity', () => {
    const text = 'unique distinct different varied diverse separate individual';
    const result = calculateTTR(text);
    expect(result.interpretation).toContain('High diversity');
  });
});

describe('calculateSentenceLengthStats', () => {
  it('should calculate sentence length statistics', () => {
    const text = 'Short sentence. This is a longer sentence with more words.';
    const result = calculateSentenceLengthStats(text);
    expect(result.sentenceCount).toBe(2);
    expect(result.mean).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    const result = calculateSentenceLengthStats('');
    expect(result.sentenceCount).toBe(0);
  });

  it('should detect uniform sentences', () => {
    const text = 'This is one. This is two. This is three. This is four.';
    const result = calculateSentenceLengthStats(text);
    expect(result.coefficientOfVariation).toBeLessThan(0.35);
  });
});

describe('detectPassiveVoice', () => {
  it('should detect passive voice', () => {
    const text = 'The work was done by the team. The report was completed.';
    const result = detectPassiveVoice(text);
    expect(result.passiveSentenceCount).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    const result = detectPassiveVoice('');
    expect(result.percentage).toBe(0);
  });
});

describe('TRANSITION_WORDS', () => {
  it('should contain common transition words', () => {
    expect(TRANSITION_WORDS).toContain('furthermore');
    expect(TRANSITION_WORDS).toContain('moreover');
    expect(TRANSITION_WORDS).toContain('therefore');
  });
});

describe('calculateTransitionDensity', () => {
  it('should calculate transition word density', () => {
    const text = 'Furthermore, this is important. Moreover, it matters.';
    const result = calculateTransitionDensity(text);
    expect(result.transitionWordCount).toBeGreaterThan(0);
  });

  it('should handle empty input', () => {
    const result = calculateTransitionDensity('');
    expect(result.percentage).toBe(0);
  });
});

describe('calculateFleschKincaid', () => {
  it('should calculate grade level', () => {
    const text = 'The cat sat on the mat.';
    const result = calculateFleschKincaid(text);
    expect(result.gradeLevel).toBeGreaterThan(0);
    expect(result.wordCount).toBe(6);
  });

  it('should handle empty input', () => {
    const result = calculateFleschKincaid('');
    expect(result.gradeLevel).toBe(0);
  });
});

describe('analyzePunctuation', () => {
  it('should count punctuation marks', () => {
    const text = 'First; second: third — and fourth...';
    const result = analyzePunctuation(text);
    expect(result.semicolonCount).toBe(1);
    expect(result.colonCount).toBe(1);
    expect(result.emDashCount).toBe(1);
    expect(result.ellipsisCount).toBe(1);
  });

  it('should handle empty input', () => {
    const result = analyzePunctuation('');
    expect(result.totalPunctuation).toBe(0);
  });
});

describe('detectRareWords', () => {
  it('should detect rare words', () => {
    const text = 'The quixotic ephemeral serendipity was extraordinary.';
    const result = detectRareWords(text);
    expect(result.rareWordCount).toBeGreaterThan(0);
  });

  it('should not flag common words', () => {
    const text = 'the be to of and a in that have';
    const result = detectRareWords(text);
    expect(result.rareWordCount).toBe(0);
  });

  it('should handle empty input', () => {
    const result = detectRareWords('');
    expect(result.percentage).toBe(0);
  });
});

describe('aggregateStatistics', () => {
  it('should combine all analyzers', () => {
    const text = 'The cat sat on the mat. The work was completed by the team.';
    const result = aggregateStatistics(text);
    
    expect(result.lexicalDiversity).toBeDefined();
    expect(result.sentenceLength).toBeDefined();
    expect(result.passiveVoice).toBeDefined();
    expect(result.transitionDensity).toBeDefined();
    expect(result.fleschKincaid).toBeDefined();
    expect(result.punctuation).toBeDefined();
    expect(result.rareWords).toBeDefined();
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    const result = aggregateStatistics('');
    expect(result.overallScore).toBeLessThanOrEqual(4);
  });
});
