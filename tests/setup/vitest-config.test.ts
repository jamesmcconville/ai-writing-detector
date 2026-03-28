import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Testing Framework Configuration', () => {
  const vitestConfigPath = path.resolve(process.cwd(), 'vitest.config.ts');
  let configContent: string;

  beforeAll(() => {
    configContent = fs.readFileSync(vitestConfigPath, 'utf-8');
  });

  describe('Configuration file', () => {
    it('should exist at project root', () => {
      expect(fs.existsSync(vitestConfigPath)).toBe(true);
    });
  });

  describe('Path alias support', () => {
    it('should configure @ path alias', () => {
      expect(configContent).toContain("'@'");
      expect(configContent).toContain('./src');
    });
  });

  describe('Test file patterns', () => {
    it('should include tests directory', () => {
      expect(configContent).toContain('tests/');
    });
  });

  describe('Globals', () => {
    it('should enable globals', () => {
      expect(configContent).toContain('globals');
      expect(configContent).toContain('true');
    });
  });
});
