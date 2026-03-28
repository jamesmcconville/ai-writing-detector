export function tokenizeWords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const words = text.match(/[a-zA-Z0-9']+/g);
  return words || [];
}

/**
 * Tokenizes text into individual sentences.
 * @param text - The input text to tokenize
 * @returns An array of sentences
 */
export function tokenizeSentences(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  // Split on sentence-ending punctuation followed by whitespace or end of string
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return sentences;
}

/**
 * Counts the number of characters in text.
 * @param text - The input text
 * @returns The character count
 */
export function countCharacters(text: string): number {
  if (!text) {
    return 0;
  }
  return text.length;
}
