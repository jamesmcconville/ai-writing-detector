import type { StatisticalAnalysisResult } from '../../analyzers/aggregator.js';
import type { LinguisticSection, LinguisticFactor } from '../types.js';

export function buildLinguisticSection(stats: StatisticalAnalysisResult): LinguisticSection {
  const factors: LinguisticFactor[] = [
    {
      name: 'Lexical Diversity (TTR)',
      value: stats.lexicalDiversity.typeTokenRatio,
      unit: '',
      interpretation: stats.lexicalDiversity.interpretation,
      isAISignal:
        stats.lexicalDiversity.typeTokenRatio > 0.8 || stats.lexicalDiversity.typeTokenRatio < 0.4,
    },
    {
      name: 'Sentence Length Variation',
      value: stats.sentenceLength.coefficientOfVariation,
      unit: '',
      interpretation: stats.sentenceLength.interpretation,
      isAISignal: stats.sentenceLength.coefficientOfVariation < 0.35,
    },
    {
      name: 'Passive Voice',
      value: stats.passiveVoice.percentage,
      unit: '%',
      interpretation: stats.passiveVoice.interpretation,
      isAISignal: stats.passiveVoice.percentage > 15,
    },
    {
      name: 'Transition Word Density',
      value: stats.transitionDensity.percentage,
      unit: '%',
      interpretation: stats.transitionDensity.interpretation,
      isAISignal: stats.transitionDensity.percentage > 20,
    },
    {
      name: 'Reading Grade Level',
      value: stats.fleschKincaid.gradeLevel,
      unit: '',
      interpretation: stats.fleschKincaid.interpretation,
      isAISignal: stats.fleschKincaid.gradeLevel > 14,
    },
    {
      name: 'Punctuation Density',
      value: stats.punctuation.perSentence,
      unit: ' per sentence',
      interpretation: stats.punctuation.interpretation,
      isAISignal: stats.punctuation.perSentence > 0.5,
    },
    {
      name: 'Rare Word Usage',
      value: stats.rareWords.percentage,
      unit: '%',
      interpretation: stats.rareWords.interpretation,
      isAISignal: stats.rareWords.percentage > 12,
    },
  ];

  return {
    factors,
    overallScore: stats.overallScore,
    overallInterpretation: stats.overallInterpretation,
  };
}
