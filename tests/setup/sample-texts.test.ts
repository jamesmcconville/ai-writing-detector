import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Sample Texts', () => {
  const projectRoot = process.cwd();
  const aiGeneratedDir = path.join(projectRoot, 'samples', 'ai-generated');
  const humanWrittenDir = path.join(projectRoot, 'samples', 'human-written');

  describe('AI-Generated Samples', () => {
    it('should have ai-generated directory', () => {
      expect(fs.existsSync(aiGeneratedDir)).toBe(true);
      expect(fs.statSync(aiGeneratedDir).isDirectory()).toBe(true);
    });

    it('should have at least 3 AI-generated text files', () => {
      const files = fs.readdirSync(aiGeneratedDir).filter((f) => f.endsWith('.txt'));
      expect(files.length).toBeGreaterThanOrEqual(3);
    });

    it('should have texts with meaningful content (50+ words)', () => {
      const files = fs.readdirSync(aiGeneratedDir).filter((f) => f.endsWith('.txt'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(aiGeneratedDir, file), 'utf-8');
        const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
        expect(wordCount).toBeGreaterThanOrEqual(50);
      }
    });
  });

  describe('Human-Written Samples', () => {
    it('should have human-written directory', () => {
      expect(fs.existsSync(humanWrittenDir)).toBe(true);
      expect(fs.statSync(humanWrittenDir).isDirectory()).toBe(true);
    });

    it('should have at least 3 human-written text files', () => {
      const files = fs.readdirSync(humanWrittenDir).filter((f) => f.endsWith('.txt'));
      expect(files.length).toBeGreaterThanOrEqual(3);
    });

    it('should have texts with meaningful content (50+ words)', () => {
      const files = fs.readdirSync(humanWrittenDir).filter((f) => f.endsWith('.txt'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(humanWrittenDir, file), 'utf-8');
        const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
        expect(wordCount).toBeGreaterThanOrEqual(50);
      }
    });
  });

  describe('Diverse Topics', () => {
    it('should cover at least 3 different topics across samples', () => {
      const allFiles = [
        ...fs.readdirSync(aiGeneratedDir).filter((f) => f.endsWith('.txt')),
        ...fs.readdirSync(humanWrittenDir).filter((f) => f.endsWith('.txt')),
      ];
      expect(allFiles.length).toBeGreaterThanOrEqual(6);
    });
  });
});
