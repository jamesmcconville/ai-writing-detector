import { Command } from 'commander';
import { readFileInput } from '@/input/file.js';
import { readStdinInput } from '@/input/stdin.js';
import { validateInput } from '@/input/validator.js';
import { displayStatistics } from '@/output/display.js';

const program = new Command();

program
  .name('ai-writing-detector')
  .description('Detect AI-generated writing using rule-based text analysis')
  .version('0.1.0');

program
  .command('analyze <file>')
  .description('Analyze text for AI-generated patterns')
  .option('--stdin', 'Read from stdin instead of file')
  .action(async (file: string, options: { stdin?: boolean }) => {
    try {
      const text = options.stdin ? await readStdinInput() : await readFileInput(file);

      validateInput(text);
      displayStatistics(text);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });

program.parse();
