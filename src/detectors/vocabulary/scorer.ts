import { scanForVocabulary, type VocabularyMatch } from './scanner.js';
import { detectPhrases, type PhraseMatch } from './phrase-detector.js';
import { extractSentence } from '@/utils/sentence-extractor.js';
import type { MatchExample } from '@/report/types.js';

export const MAX_VOCABULARY_SCORE = 24;
export const POINTS_PER_TERM = 3;

export interface VocabularyScoreResult {
  category: 'vocabulary';
  matches: string[];
  distinctCount: number;
  score: number;
  maxScore: number;
  explanation: string;
  examples: MatchExample[];
}

export function scoreVocabulary(text: string): VocabularyScoreResult {
  if (!text || text.trim().length === 0) {
    return {
      category: 'vocabulary',
      matches: [],
      distinctCount: 0,
      score: 0,
      maxScore: MAX_VOCABULARY_SCORE,
      explanation: 'No text to analyze',
      examples: [],
    };
  }

  const wordMatches = scanForVocabulary(text);
  const phraseMatches = detectPhrases(text);

  const distinctTerms = new Set<string>();

  for (const match of wordMatches) {
    distinctTerms.add(match.term);
  }

  for (const match of phraseMatches) {
    distinctTerms.add(match.phrase);
  }

  const distinctCount = distinctTerms.size;
  const rawScore = distinctCount * POINTS_PER_TERM;
  const score = Math.min(rawScore, MAX_VOCABULARY_SCORE);

  const allMatches = [
    ...wordMatches.map((m: VocabularyMatch) => m.term),
    ...phraseMatches.map((m: PhraseMatch) => m.phrase),
  ];

  const examples: MatchExample[] = [
    ...wordMatches.map((m: VocabularyMatch) => {
      const start = m.position;
      const end = m.position + m.term.length;
      const context = extractSentence(text, start, end);
      return {
        term: m.term,
        sentence: context.sentence,
        start,
        end,
        category: 'vocabulary',
        subcategory: 'ai-vocabulary',
      };
    }),
    ...phraseMatches.map((m: PhraseMatch) => {
      const start = m.position;
      const end = m.position + m.phrase.length;
      const context = extractSentence(text, start, end);
      return {
        term: m.phrase,
        sentence: context.sentence,
        start,
        end,
        category: 'vocabulary',
        subcategory: 'ai-phrases',
      };
    }),
  ];

  const explanation =
    distinctCount === 0
      ? 'No AI vocabulary terms detected'
      : `Found ${distinctCount} distinct AI vocabulary term${distinctCount === 1 ? '' : 's'} (${score} points${rawScore > MAX_VOCABULARY_SCORE ? ', capped' : ''})`;

  return {
    category: 'vocabulary',
    matches: allMatches,
    distinctCount,
    score,
    maxScore: MAX_VOCABULARY_SCORE,
    explanation,
    examples,
  };
}
