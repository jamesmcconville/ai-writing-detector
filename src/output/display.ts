import { countCharacters, countWords } from '@/utils/statistics.js';

export function displayStatistics(text: string): void {
  const characters = countCharacters(text);
  const words = countWords(text);

  console.log('Text Statistics:');
  console.log(`Characters: ${characters}`);
  console.log(`Words: ${words}`);
}
