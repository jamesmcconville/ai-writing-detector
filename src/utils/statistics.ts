import { tokenizeWords, tokenizeSentences } from './tokenizer.js';

export function countCharacters(text: string | null): number {
  if (!text) {
    return 0;
  }
  return text.length;
}

export function countWords(text: string | null): number {
  if (!text) {
    return 0;
  }
  return tokenizeWords(text).length;
}

export function countSentences(text: string | null): number {
  if (!text) {
    return 0;
  }
  return tokenizeSentences(text).length;
}
