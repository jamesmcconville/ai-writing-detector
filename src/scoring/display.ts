import chalk, { type ChalkInstance } from 'chalk';
import type { ScoreContributor, ScoringResult, ClassificationResult } from './types.js';

function getScoreColor(score: number): ChalkInstance {
  if (score < 30) return chalk.green;
  if (score < 60) return chalk.yellow;
  return chalk.red;
}

export function displayScore(score: number, classification: ClassificationResult): string {
  const color = getScoreColor(score);
  const lines: string[] = [];

  lines.push('');
  lines.push(color.bold('═══════════════════════════════════════════════════════════════'));
  lines.push(color.bold(`  AI PROBABILITY SCORE: ${score}/100`));
  lines.push(color.bold(`  Classification: ${classification.label}`));
  lines.push(color.bold('═══════════════════════════════════════════════════════════════'));
  lines.push('');

  return lines.join('\n');
}

export function displayContribution(contribution: ScoreContributor): string {
  const percentage =
    contribution.maxScore > 0 ? Math.round((contribution.score / contribution.maxScore) * 100) : 0;

  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  const lines: string[] = [];
  lines.push(`  ${chalk.bold(contribution.category.toUpperCase())}`);
  lines.push(`  ${bar} ${contribution.score}/${contribution.maxScore} (${percentage}%)`);
  lines.push(`  ${chalk.dim(contribution.explanation)}`);

  if (contribution.subcategories && contribution.subcategories.length > 0) {
    const activeSubcats = contribution.subcategories.filter((s) => s.count > 0);
    if (activeSubcats.length > 0) {
      lines.push('  Subcategories:');
      for (const sub of activeSubcats) {
        lines.push(
          `    • ${sub.name}: ${sub.score}/${sub.maxScore} (${sub.count} match${sub.count === 1 ? '' : 'es'})`,
        );
      }
    }
  }

  lines.push('');
  return lines.join('\n');
}

export function displaySummary(result: ScoringResult): string {
  const lines: string[] = [];

  lines.push(displayScore(result.score, result.classification));
  lines.push(chalk.bold('  SCORE BREAKDOWN'));
  lines.push(chalk.dim('  ─'.repeat(30)));
  lines.push('');

  const sortedContributions = [...result.contributions].sort((a, b) => b.score - a.score);

  for (const contribution of sortedContributions) {
    lines.push(displayContribution(contribution));
  }

  lines.push(chalk.dim(`  Raw score: ${result.rawScore}/${result.maxRawScore}`));
  if (result.rawScore > 100) {
    lines.push(chalk.dim(`  (Normalized from ${result.rawScore} to ${result.score})`));
  }
  lines.push('');

  return lines.join('\n');
}
