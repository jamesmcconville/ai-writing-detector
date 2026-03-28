import { AI_PHRASES } from './ai-words.js';

export interface PhraseMatch {
  phrase: string;
  position: number;
}

export function detectPhrases(text: string): PhraseMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: PhraseMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of AI_PHRASES) {
    const lowerPhrase = phrase.toLowerCase();
    const phraseMatches = lowerText.matchAll(new RegExp(escapeRegex(lowerPhrase), 'g'));

    for (const match of phraseMatches) {
      matches.push({
        phrase: phrase,
        position: match.index ?? 0,
      });
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
