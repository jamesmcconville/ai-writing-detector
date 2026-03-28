import { MARKETING_PHRASES } from './marketing-phrases.js';

export interface PromotionalMatch {
  phrase: string;
  position: number;
}

export function detectPromotionalLanguage(text: string): PromotionalMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: PromotionalMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of MARKETING_PHRASES) {
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
