import { countCharacters, countWords, countSentences } from '../../utils/statistics.js';
import { tokenizeWords, tokenizeSentences } from '../../utils/tokenizer.js';
import type { StatisticsSection } from '../types.js';

export function buildStatisticsSection(text: string): StatisticsSection {
  if (!text || text.trim().length === 0) {
    return {
      characterCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      averageWordLength: 0,
      averageSentenceLength: 0,
    };
  }

  const characterCount = countCharacters(text);
  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);

  const words = tokenizeWords(text);
  const sentences = tokenizeSentences(text);

  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
  const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

  const totalSentenceLength = sentences.reduce(
    (sum, sentence) => sum + sentence.split(/\s+/).length,
    0,
  );
  const averageSentenceLength = sentenceCount > 0 ? totalSentenceLength / sentenceCount : 0;

  return {
    characterCount,
    wordCount,
    sentenceCount,
    averageWordLength: Math.round(averageWordLength * 10) / 10,
    averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
  };
}
