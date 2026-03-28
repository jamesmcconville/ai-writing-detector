import { INTENSIFIERS, SUPERLATIVES } from './intensifiers.js';

export interface EmphasisMatch {
  term: string;
  position: number;
  type: 'intensifier' | 'superlative';
}

export function detectUndueEmphasis(text: string): EmphasisMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: EmphasisMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const term of INTENSIFIERS) {
    const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
    const termMatches = lowerText.matchAll(pattern);

    for (const match of termMatches) {
      if (match.index !== undefined) {
        matches.push({
          term: term,
          position: match.index,
          type: 'intensifier',
        });
      }
    }
  }

  for (const term of SUPERLATIVES) {
    const pattern = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
    const termMatches = lowerText.matchAll(pattern);

    for (const match of termMatches) {
      if (match.index !== undefined) {
        matches.push({
          term: term,
          position: match.index,
          type: 'superlative',
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
