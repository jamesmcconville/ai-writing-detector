const COMMON_WORDS = new Set<string>([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will',
  'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'person', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
  'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
]);

export interface RareWordResult {
  rareWordCount: number;
  totalWordCount: number;
  percentage: number;
  wordsFound: string[];
  interpretation: string;
}

export function detectRareWords(text: string): RareWordResult {
  if (!text || text.trim().length === 0) {
    return {
      rareWordCount: 0,
      totalWordCount: 0,
      percentage: 0,
      wordsFound: [],
      interpretation: 'No text to analyze',
    };
  }

  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const totalWordCount = words.length;

  if (totalWordCount === 0) {
    return {
      rareWordCount: 0,
      totalWordCount: 0,
      percentage: 0,
      wordsFound: [],
      interpretation: 'No words found',
    };
  }

  const rareWords = words.filter(word => !COMMON_WORDS.has(word));
  const rareWordCount = rareWords.length;
  const percentage = (rareWordCount / totalWordCount) * 100;

  const uniqueRareWords = [...new Set(rareWords)];
  const wordsFound = uniqueRareWords.slice(0, 10);

  let interpretation: string;
  if (percentage > 12) {
    interpretation = 'High rare word usage (AI signal)';
  } else if (percentage > 8) {
    interpretation = 'Moderate rare word usage';
  } else {
    interpretation = 'Low rare word usage (natural)';
  }

  return {
    rareWordCount,
    totalWordCount,
    percentage,
    wordsFound,
    interpretation,
  };
}
