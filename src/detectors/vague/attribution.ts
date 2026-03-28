import { VAGUE_ATTRIBUTION_PHRASES } from './attribution-phrases.js';

export interface VagueAttributionMatch {
  phrase: string;
  position: number;
}

export function detectVagueAttribution(text: string): VagueAttributionMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: VagueAttributionMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of VAGUE_ATTRIBUTION_PHRASES) {
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
