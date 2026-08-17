export interface SentenceContext {
  sentence: string;
  start: number;
  end: number;
}

/**
 * Extracts the sentence containing a match at the given position.
 * Scans backward for the previous sentence-ending punctuation (.!? followed by whitespace or start),
 * and forward for the next sentence-ending punctuation.
 * Clamps to text boundaries if no punctuation is found.
 */
export function extractSentence(text: string, matchStart: number, matchEnd: number): SentenceContext {
  const len = text.length;

  // Scan backward for sentence start
  let sentenceStart = 0;
  for (let i = matchStart - 1; i >= 0; i--) {
    const char = text[i];
    if ((char === '.' || char === '!' || char === '?') && i + 1 < len && /\s/.test(text[i + 1])) {
      sentenceStart = i + 2; // Skip past the punctuation and the whitespace
      break;
    }
  }

  // Scan forward for sentence end
  let sentenceEnd = len;
  for (let i = matchEnd; i < len; i++) {
    const char = text[i];
    if ((char === '.' || char === '!' || char === '?') && (i + 1 >= len || /\s/.test(text[i + 1]))) {
      sentenceEnd = i + 1; // Include the punctuation
      break;
    }
  }

  // Clamp to text boundaries
  sentenceStart = Math.max(0, Math.min(sentenceStart, len));
  sentenceEnd = Math.max(0, Math.min(sentenceEnd, len));

  return {
    sentence: text.slice(sentenceStart, sentenceEnd).trim(),
    start: sentenceStart,
    end: sentenceEnd,
  };
}
