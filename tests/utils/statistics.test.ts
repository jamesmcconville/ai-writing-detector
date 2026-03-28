import { describe, it, expect } from 'vitest';
import { countCharacters } from '../../src/utils/statistics.js';

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

    it('should handle whitespace', () => {
      const result = countCharacters('   ');
      expect(result).toBe(3);
    });
  });
});
