import { SUPERFICIAL_PHRASES } from './superficial-phrases.js';

export interface SuperficialMatch {
  phrase: string;
  position: number;
}

export function detectSuperficialAnalysis(text: string): SuperficialMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: SuperficialMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of SUPERFICIAL_PHRASES) {
    const lowerPhrase = phrase.toLowerCase();
    const phraseMatches = lowerText.matchAll(new RegExp(escapeRegex(lowerPhrase), 'g'));

    for (const match of phraseMatches) {
      if (match.index !== undefined) {
        matches.push({
          phrase: phrase,
          position: match.index,
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
