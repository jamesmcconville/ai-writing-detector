import chalk from 'chalk';
import type { Report } from '../types.js';

const BOX_TOP_LEFT = '╔';
const BOX_TOP_RIGHT = '╗';
const BOX_BOTTOM_LEFT = '╚';
const BOX_BOTTOM_RIGHT = '╝';
const BOX_HORIZONTAL = '═';
const BOX_VERTICAL = '║';
const BOX_T_LEFT = '╠';
const BOX_T_RIGHT = '╣';

const WIDTH = 65;

function horizontalLine(char: string = '─'): string {
  return char.repeat(WIDTH);
}

function centerText(text: string): string {
  const padding = Math.max(0, Math.floor((WIDTH - text.length) / 2));
  return ' '.repeat(padding) + text;
}

function getScoreColor(score: number): chalk.Chalk {
  if (score < 30) return chalk.green;
  if (score < 60) return chalk.yellow;
  return chalk.red;
}

export function formatReport(report: Report): string {
  const lines: string[] = [];
  const scoreColor = getScoreColor(report.score.score);

  lines.push('');
  lines.push(chalk.cyan(BOX_TOP_LEFT + BOX_HORIZONTAL.repeat(WIDTH - 2) + BOX_TOP_RIGHT));
  lines.push(
    chalk.cyan(BOX_VERTICAL) +
      chalk.bold.white(centerText('AI WRITING DETECTOR REPORT')) +
      chalk.cyan(BOX_VERTICAL),
  );
  lines.push(chalk.cyan(BOX_T_LEFT + BOX_HORIZONTAL.repeat(WIDTH - 2) + BOX_T_RIGHT));

  lines.push(chalk.cyan(BOX_VERTICAL) + ' '.repeat(WIDTH - 2) + chalk.cyan(BOX_VERTICAL));
  lines.push(
    chalk.cyan(BOX_VERTICAL) +
      scoreColor.bold(
        centerText(`SCORE: ${report.score.score}/100 - ${report.score.classification}`),
      ) +
      chalk.cyan(BOX_VERTICAL),
  );
  lines.push(
    chalk.cyan(BOX_VERTICAL) +
      chalk.dim(centerText(report.score.explanation)) +
      chalk.cyan(BOX_VERTICAL),
  );
  lines.push(chalk.cyan(BOX_VERTICAL) + ' '.repeat(WIDTH - 2) + chalk.cyan(BOX_VERTICAL));
  lines.push(chalk.cyan(BOX_BOTTOM_LEFT + BOX_HORIZONTAL.repeat(WIDTH - 2) + BOX_BOTTOM_RIGHT));
  lines.push('');

  lines.push(chalk.bold.blue('TEXT STATISTICS'));
  lines.push(chalk.dim(horizontalLine()));
  lines.push(`  Characters:         ${report.statistics.characterCount}`);
  lines.push(`  Words:              ${report.statistics.wordCount}`);
  lines.push(`  Sentences:          ${report.statistics.sentenceCount}`);
  lines.push(`  Avg Word Length:    ${report.statistics.averageWordLength}`);
  lines.push(`  Avg Sentence Len:   ${report.statistics.averageSentenceLength}`);
  lines.push('');

  lines.push(chalk.bold.blue('LINGUISTIC FACTORS'));
  lines.push(chalk.dim(horizontalLine()));
  for (const factor of report.linguistic.factors) {
    const signal = factor.isAISignal ? chalk.red(' ⚠') : '';
    lines.push(`  ${factor.name}: ${factor.value}${factor.unit}${signal}`);
    lines.push(chalk.dim(`    ${factor.interpretation}`));
  }
  lines.push(chalk.dim(`  Overall: ${report.linguistic.overallInterpretation}`));
  lines.push('');

  lines.push(chalk.bold.blue('PATTERNS DETECTED'));
  lines.push(chalk.dim(horizontalLine()));

  const activeCategories = report.patterns.categories.filter(
    (c) => c.matchCount > 0 || c.score > 0,
  );

  if (activeCategories.length === 0) {
    lines.push(chalk.dim('  No patterns detected'));
  } else {
    for (const category of activeCategories) {
      const pct = Math.round((category.score / category.maxScore) * 100);
      lines.push(
        `  ${chalk.bold(category.name.toUpperCase())} (${category.score}/${category.maxScore} - ${pct}%)`,
      );

      if (category.subcategories && category.subcategories.length > 0) {
        for (const sub of category.subcategories) {
          if (sub.count > 0) {
            lines.push(
              chalk.dim(
                `    • ${sub.name}: ${sub.count} match${sub.count === 1 ? '' : 'es'} (${sub.score} pts)`,
              ),
            );
          }
        }
      }

      if (category.matches.length > 0 && category.matches.length <= 5) {
        lines.push(chalk.dim(`    Found: ${category.matches.join(', ')}`));
      }
    }
  }
  lines.push('');

  lines.push(chalk.bold.blue('SCORE BREAKDOWN'));
  lines.push(chalk.dim(horizontalLine()));

  const sortedContributions = [...report.contributions].sort((a, b) => b.score - a.score);
  for (const c of sortedContributions) {
    const bar = '█'.repeat(Math.min(20, Math.round((c.score / c.maxScore) * 20))).padEnd(20, '░');
    const color = getScoreColor((c.score / c.maxScore) * 100);
    lines.push(`  ${c.category.padEnd(20)} ${color(bar)} ${c.score}/${c.maxScore}`);
  }
  lines.push('');

  lines.push(chalk.dim(horizontalLine('─')));
  lines.push(chalk.dim(`Analysis performed: ${report.timestamp.local}`));
  lines.push(chalk.dim(`Raw score: ${report.score.rawScore}/${report.score.maxRawScore}`));
  if (report.score.rawScore > 100) {
    lines.push(chalk.dim(`(Normalized from ${report.score.rawScore} to ${report.score.score})`));
  }
  lines.push('');

  return lines.join('\n');
}
