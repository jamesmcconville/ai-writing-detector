import { tokenizeSentences } from '../utils/tokenizer.js';

const PASSIVE_VOICE_PATTERNS = [
  /\b(am|is|are|was|were|been|being)\s+\w+ed\b/gi,
  /\b(has|have|had|having)\s+been\s+\w+ed\b/gi,
  /\b\b(will be|will have been)\s+\w+ed\b/gi,
  /\b\b(would be|could be|may be|might be|can|could|should|must)\s+be\s+\w+ed\b/gi,
] as const;

export interface PassiveVoiceResult {
  passiveSentenceCount: number;
  totalSentenceCount: number;
  percentage: number;
  sentences: string[];
  interpretation: string;
}

export function detectPassiveVoice(text: string): PassiveVoiceResult {
  if (!text || text.trim().length === 0) {
    return {
      passiveSentenceCount: 0,
      totalSentenceCount: 0,
      percentage: 0,
      sentences: [],
      interpretation: 'No text to analyze',
    };
  }

  const sentences = tokenizeSentences(text);
  const totalSentenceCount = sentences.length;

  if (totalSentenceCount === 0) {
    return {
      passiveSentenceCount: 0,
      totalSentenceCount: 0,
      percentage: 0,
      sentences: [],
      interpretation: 'No sentences found',
    };
  }

  const passiveSentences: string[] = [];

  for (const sentence of sentences) {
    if (PASSIVE_VOICE_PATTERNS.some(pattern => pattern.test(sentence))) {
      passiveSentences.push(sentence);
    }
  }

  const passiveSentenceCount = passiveSentences.length;
  const percentage = (passiveSentenceCount / totalSentenceCount) * 100;

  let interpretation: string;
  if (percentage > 15) {
    interpretation = 'High passive voice usage (AI signal)';
  } else if (percentage > 10) {
    interpretation = 'Moderate passive voice usage';
  } else {
    interpretation = 'Low passive voice usage (natural)';
  }

  return {
    passiveSentenceCount,
    totalSentenceCount,
    percentage,
    sentences: passiveSentences,
    interpretation,
  };
}
