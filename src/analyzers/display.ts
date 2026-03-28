import type { StatisticalAnalysisResult } from './aggregator.js';

export function displayStatisticalIndicators(result: StatisticalAnalysisResult): void {
  console.log('\n=== Statistical Analysis ===\n');

  console.log(`Lexical Diversity (TTR): ${result.lexicalDiversity.typeTokenRatio.toFixed(2)}`);
  console.log(`  Unique words: ${result.lexicalDiversity.uniqueWordCount} / ${result.lexicalDiversity.totalWordCount}`);
  console.log(`  ${result.lexicalDiversity.interpretation}\n`);

  console.log(`Sentence Length Variation:`);
  console.log(`  Mean: ${result.sentenceLength.mean.toFixed(1)} words`);
  console.log(`  Coefficient of Variation: ${result.sentenceLength.coefficientOfVariation.toFixed(2)}`);
  console.log(`  ${result.sentenceLength.interpretation}\n`);

  console.log(`Passive Voice: ${result.passiveVoice.percentage.toFixed(1)}%`);
  console.log(`  ${result.passiveVoice.sentences.length} passive sentences found`);
  console.log(`  ${result.passiveVoice.interpretation}\n`);

  console.log(`Transition Word Density: ${result.transitionDensity.percentage.toFixed(1)}%`);
  console.log(`  ${result.transitionDensity.transitionWordCount} transition words in ${result.transitionDensity.totalSentenceCount} sentences`);
  console.log(`  ${result.transitionDensity.interpretation}\n`);

  console.log(`Flesch-Kincaid Grade Level: ${result.fleschKincaid.gradeLevel.toFixed(1)}`);
  console.log(`  Reading Ease: ${result.fleschKincaid.readingEase.toFixed(1)}`);
  console.log(`  ${result.fleschKincaid.interpretation}\n`);

  console.log(`Punctuation Analysis:`);
  console.log(`  Semicolons: ${result.punctuation.semicolonCount}`);
  console.log(`  Em-dashes: ${result.punctuation.emDashCount}`);
  console.log(`  Colons: ${result.punctuation.colonCount}`);
  console.log(`  Ellipses: ${result.punctuation.ellipsisCount}`);
  console.log(`  ${result.punctuation.interpretation}\n`);

  console.log(`Rare Word Usage: ${result.rareWords.percentage.toFixed(1)}%`);
  console.log(`  ${result.rareWords.rareWordCount} rare words in ${result.rareWords.totalWordCount} total`);
  console.log(`  ${result.rareWords.interpretation}\n`);

  console.log(`Overall Score: ${result.overallScore}/14`);
  console.log(`${result.overallInterpretation}`);
}
