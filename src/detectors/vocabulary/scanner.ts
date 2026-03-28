import { AI_WORDS } from './ai-words.js';

export interface VocabularyMatch {
  term: string;
  position: number;
}

export function scanForVocabulary(text: string): VocabularyMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: VocabularyMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const word of AI_WORDS) {
    const wordPattern = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    const wordMatches = lowerText.matchAll(wordPattern);

    for (const match of wordMatches) {
      matches.push({
        term: word,
        position: match.index ?? 0,
      });
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
