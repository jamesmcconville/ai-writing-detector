import { describe, it, expect } from 'vitest';
import { tokenizeWords, tokenizeSentences, countCharacters } from '../../src/utils/tokenizer.js';

describe('Tokenizer', () => {
  describe('tokenizeWords', () => {
    it('should tokenize simple text', () => {
      const result = tokenizeWords('Hello world');
      expect(result).toEqual(['Hello', 'world']);
    });

    it('should handle punctuation', () => {
      const result = tokenizeWords('Hello, world! How are you?');
      expect(result).toEqual(['Hello', 'world', 'How', 'are', 'you']);
    });

    it('should handle empty input', () => {
      const result = tokenizeWords('');
      expect(result).toEqual([]);
    });

    it('should handle whitespace-only input', () => {
      const result = tokenizeWords('   ');
      expect(result).toEqual([]);
    });

    it('should handle multiple spaces between words', () => {
      const result = tokenizeWords('Hello    world');
      expect(result).toEqual(['Hello', 'world']);
    });
  });

  describe('tokenizeSentences', () => {
    it('should split simple sentences', () => {
      const result = tokenizeSentences('Hello world. How are you?');
      expect(result).toEqual(['Hello world.', 'How are you?']);
    });

    it('should handle single sentence', () => {
      const result = tokenizeSentences('Just one sentence.');
      expect(result).toEqual(['Just one sentence.']);
    });

    it('should handle empty input', () => {
      const result = tokenizeSentences('');
      expect(result).toEqual([]);
    });

    it('should handle exclamation marks', () => {
      const result = tokenizeSentences('Wow! Amazing!');
      expect(result).toEqual(['Wow!', 'Amazing!']);
    });

    it('should handle question marks', () => {
      const result = tokenizeSentences('What? Why?');
      expect(result).toEqual(['What?', 'Why?']);
    });
  });

  describe('countCharacters', () => {
    it('should count characters correctly', () => {
      const result = countCharacters('Hello world');
      expect(result).toBe(11);
    });

    it('should handle empty input', () => {
      const result = countCharacters('');
      expect(result).toBe(0);
    });

    it('should handle whitespace', () => {
      const result = countCharacters('Hello world');
      expect(result).toBe(11);
    });

    it('should count special characters', () => {
      const result = countCharacters('Hello, world!');
      expect(result).toBe(13);
    });
  });
});
