import { OVERGENERALIZATION_PHRASES } from './overgeneralization-phrases.js';

export interface OvergeneralizationMatch {
  phrase: string;
  position: number;
}

export function detectOvergeneralization(text: string): OvergeneralizationMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: OvergeneralizationMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of OVERGENERALIZATION_PHRASES) {
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
