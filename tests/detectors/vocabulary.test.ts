import { describe, it, expect } from 'vitest';
import { AI_WORDS, AI_PHRASES } from '@/detectors/vocabulary/ai-words.js';
import { scanForVocabulary, type VocabularyMatch } from '@/detectors/vocabulary/scanner.js';
import { detectPhrases } from '@/detectors/vocabulary/phrase-detector.js';
import {
  scoreVocabulary,
  MAX_VOCABULARY_SCORE,
  POINTS_PER_TERM,
} from '@/detectors/vocabulary/scorer.js';

describe('AI Words List', () => {
  it('should contain common AI vocabulary words', () => {
    expect(AI_WORDS).toContain('delve');
    expect(AI_WORDS).toContain('robust');
    expect(AI_WORDS).toContain('leverage');
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(AI_WORDS)).toBe(true);
  });

  it('should have all lowercase words', () => {
    for (const word of AI_WORDS) {
      expect(word).toBe(word.toLowerCase());
    }
  });
});

describe('AI Phrases List', () => {
  it('should contain common AI phrases', () => {
    expect(AI_PHRASES.some((phrase) => phrase.includes('worth noting'))).toBe(true);
  });

  it('should be a readonly array', () => {
    expect(Array.isArray(AI_PHRASES)).toBe(true);
  });

  it('should have all lowercase phrases', () => {
    for (const phrase of AI_PHRASES) {
      expect(phrase).toBe((phrase as string).toLowerCase());
    }
  });
});

describe('scanForVocabulary', () => {
  it('should detect single AI word', () => {
    const text = 'Let us delve into this topic.';
    const matches = scanForVocabulary(text);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m: VocabularyMatch) => m.term === 'delve')).toBe(true);
  });

  it('should detect multiple AI words', () => {
    const text = 'We need to leverage robust solutions and navigate the ecosystem.';
    const matches = scanForVocabulary(text);

    expect(matches.length).toBeGreaterThanOrEqual(3);
    const terms = matches.map((m: VocabularyMatch) => m.term);
    expect(terms).toContain('leverage');
    expect(terms).toContain('robust');
    expect(terms).toContain('navigate');
  });

  it('should be case-insensitive', () => {
    const text1 = 'Delve into this topic.';
    const text2 = 'DELVE into this topic.';
    const text3 = 'delve into this topic.';

    expect(scanForVocabulary(text1).length).toBe(1);
    expect(scanForVocabulary(text2).length).toBe(1);
    expect(scanForVocabulary(text3).length).toBe(1);
  });

  it('should return match positions', () => {
    const text = 'Let us delve into this.';
    const matches = scanForVocabulary(text);

    expect(matches[0].position).toBeGreaterThanOrEqual(0);
    expect(text.substring(matches[0].position).toLowerCase()).toContain('delve');
  });

  it('should return empty array for no matches', () => {
    const text = 'The cat sat on the mat and ate some food.';
    const matches = scanForVocabulary(text);

    expect(matches).toEqual([]);
  });

  it('should handle empty input', () => {
    expect(scanForVocabulary('')).toEqual([]);
  });

  it('should handle whitespace-only input', () => {
    expect(scanForVocabulary('   \t\n  ')).toEqual([]);
  });
});

describe('detectPhrases', () => {
  it('should detect AI phrase', () => {
    const text = 'It is worth noting that this approach works.';
    const matches = detectPhrases(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should be case-insensitive', () => {
    const text1 = 'It is worth noting that...';
    const text2 = 'IT IS WORTH NOTING that...';
    const text3 = 'it is worth noting that...';

    expect(detectPhrases(text1).length).toBeGreaterThan(0);
    expect(detectPhrases(text2).length).toBeGreaterThan(0);
    expect(detectPhrases(text3).length).toBeGreaterThan(0);
  });

  it('should return phrase positions', () => {
    const text = 'It is worth noting that this works.';
    const matches = detectPhrases(text);

    if (matches.length > 0) {
      expect(matches[0].position).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return empty array for no matches', () => {
    const text = 'The quick brown fox jumps over the lazy dog.';
    const matches = detectPhrases(text);

    expect(matches).toEqual([]);
  });

  it('should handle empty input', () => {
    expect(detectPhrases('')).toEqual([]);
  });
});

describe('scoreVocabulary', () => {
  it('should score based on distinct terms', () => {
    const text = 'We delve and delve and delve again into robust solutions.';
    const result = scoreVocabulary(text);

    expect(result.distinctCount).toBe(2);
    expect(result.score).toBe(2 * POINTS_PER_TERM);
  });

  it('should cap score at MAX_VOCABULARY_SCORE', () => {
    const manyTerms = [
      'delve',
      'robust',
      'leverage',
      'navigate',
      'ecosystem',
      'transformative',
      'revolutionary',
      'comprehensive',
      'holistic',
      'nuanced',
    ].join(' ');

    const result = scoreVocabulary(manyTerms);

    expect(result.score).toBeLessThanOrEqual(MAX_VOCABULARY_SCORE);
  });

  it('should return correct maxScore', () => {
    const result = scoreVocabulary('delve');
    expect(result.maxScore).toBe(MAX_VOCABULARY_SCORE);
  });

  it('should return explanation', () => {
    const result = scoreVocabulary('delve');
    expect(result.explanation).toBeTruthy();
    expect(typeof result.explanation).toBe('string');
  });

  it('should return category as vocabulary', () => {
    const result = scoreVocabulary('delve');
    expect(result.category).toBe('vocabulary');
  });

  it('should return matches array', () => {
    const result = scoreVocabulary('delve and robust');
    expect(Array.isArray(result.matches)).toBe(true);
    expect(result.matches.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle empty input', () => {
    const result = scoreVocabulary('');
    expect(result.score).toBe(0);
    expect(result.matches).toEqual([]);
  });

  it('should handle whitespace-only input', () => {
    const result = scoreVocabulary('   \t\n  ');
    expect(result.score).toBe(0);
    expect(result.matches).toEqual([]);
  });

  it('should handle text with no AI vocabulary', () => {
    const result = scoreVocabulary('The cat sat on the mat.');
    expect(result.score).toBe(0);
    expect(result.matches).toEqual([]);
  });
});

describe('Vocabulary Scoring Constants', () => {
  it('should have MAX_VOCABULARY_SCORE defined', () => {
    expect(MAX_VOCABULARY_SCORE).toBeGreaterThan(0);
    expect(typeof MAX_VOCABULARY_SCORE).toBe('number');
  });

  it('should have POINTS_PER_TERM defined', () => {
    expect(POINTS_PER_TERM).toBeGreaterThan(0);
    expect(typeof POINTS_PER_TERM).toBe('number');
  });

  it('should have reasonable score cap', () => {
    expect(MAX_VOCABULARY_SCORE).toBeLessThanOrEqual(30);
  });
});
