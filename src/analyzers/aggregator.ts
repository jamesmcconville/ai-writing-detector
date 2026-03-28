import { calculateTTR, type TTRResult } from './lexical-diversity.js';
import { calculateSentenceLengthStats, type SentenceLengthStats } from './sentence-length.js';
import { detectPassiveVoice, type PassiveVoiceResult } from './passive-voice.js';
import { calculateTransitionDensity, type TransitionDensityResult } from './transition-density.js';
import { calculateFleschKincaid, type FleschKincaidResult } from './flesch-kincaid.js';
import { analyzePunctuation, type PunctuationResult } from './punctuation.js';
import { detectRareWords, type RareWordResult } from './rare-words.js';

export interface StatisticalAnalysisResult {
  lexicalDiversity: TTRResult;
  sentenceLength: SentenceLengthStats;
  passiveVoice: PassiveVoiceResult;
  transitionDensity: TransitionDensityResult;
  fleschKincaid: FleschKincaidResult;
  punctuation: PunctuationResult;
  rareWords: RareWordResult;
  overallScore: number;
  overallInterpretation: string;
}

export function aggregateStatistics(text: string): StatisticalAnalysisResult {
  const lexicalDiversity = calculateTTR(text);
  const sentenceLength = calculateSentenceLengthStats(text);
  const passiveVoice = detectPassiveVoice(text);
  const transitionDensity = calculateTransitionDensity(text);
  const fleschKincaid = calculateFleschKincaid(text);
  const punctuation = analyzePunctuation(text);
  const rareWords = detectRareWords(text);

  let score = 0;

  if (lexicalDiversity.typeTokenRatio > 0.8) score += 1;
  else if (lexicalDiversity.typeTokenRatio < 0.4) score += 2;

  if (sentenceLength.coefficientOfVariation < 0.35) score += 2;

  if (passiveVoice.percentage > 15) score += 2;

  if (transitionDensity.percentage > 20) score += 2;

  if (fleschKincaid.gradeLevel > 14) score += 2;

  if (punctuation.perSentence > 0.5) score += 1;

  if (rareWords.percentage > 12) score += 2;

  let overallInterpretation: string;
  if (score >= 8) {
    overallInterpretation = 'Strong AI signals across multiple dimensions';
  } else if (score >= 5) {
    overallInterpretation = 'Some AI signals present';
  } else if (score >= 3) {
    overallInterpretation = 'Minor AI signals detected';
  } else {
    overallInterpretation = 'Text appears naturally written';
  }

  return {
    lexicalDiversity,
    sentenceLength,
    passiveVoice,
    transitionDensity,
    fleschKincaid,
    punctuation,
    rareWords,
    overallScore: score,
    overallInterpretation,
  };
}
