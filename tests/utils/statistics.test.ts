import { describe, it, expect } from 'vitest';
import { countCharacters, countWords } from '../../src/utils/statistics.js';

describe('Statistics', () => {
  describe('countCharacters', () => {
    it('should count characters correctly', () => {
      const result = countCharacters('Hello world');
      expect(result).toBe(11);
    });

    it('should handle empty input', () => {
      const result = countCharacters('');
      expect(result).toBe(0);
    });

    it('should handle null input', () => {
      const result = countCharacters(null as unknown as string);
      expect(result).toBe(0);
    });

    it('should count special characters', () => {
      const result = countCharacters('Hello, world!');
      expect(result).toBe(13);
    });

    it('should count whitespace', () => {
      const result = countCharacters('   ');
      expect(result).toBe(3);
    });
  });

  describe('countWords', () => {
    it('should count words in simple text', () => {
      const result = countWords('Hello world');
      expect(result).toBe(2);
    });

    it('should count words with punctuation', () => {
      const result = countWords('Hello, world! How are you?');
      expect(result).toBe(5);
    });

    it('should handle empty input', () => {
      const result = countWords('');
      expect(result).toBe(0);
    });

    it('should handle null input', () => {
      const result = countWords(null as unknown as string);
      expect(result).toBe(0);
    });
  });
});
