import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Code Quality Configuration', () => {
  const projectRoot = process.cwd();

  describe('ESLint Configuration', () => {
    it('should have .eslintrc.cjs file', () => {
      const eslintPath = path.join(projectRoot, '.eslintrc.cjs');
      expect(fs.existsSync(eslintPath)).toBe(true);
    });

    it('should use TypeScript parser', () => {
      const eslintPath = path.join(projectRoot, '.eslintrc.cjs');
      const content = fs.readFileSync(eslintPath, 'utf-8');
      expect(content).toContain('@typescript-eslint/parser');
    });

    it('should extend recommended configs', () => {
      const eslintPath = path.join(projectRoot, '.eslintrc.cjs');
      const content = fs.readFileSync(eslintPath, 'utf-8');
      expect(content).toContain('eslint:recommended');
    });
  });

  describe('Prettier Configuration', () => {
    it('should have .prettierrc file', () => {
      const prettierPath = path.join(projectRoot, '.prettierrc');
      expect(fs.existsSync(prettierPath)).toBe(true);
    });

    it('should define semi option', () => {
      const prettierPath = path.join(projectRoot, '.prettierrc');
      const content = JSON.parse(fs.readFileSync(prettierPath, 'utf-8'));
      expect(content).toHaveProperty('semi');
    });

    it('should define singleQuote option', () => {
      const prettierPath = path.join(projectRoot, '.prettierrc');
      const content = JSON.parse(fs.readFileSync(prettierPath, 'utf-8'));
      expect(content).toHaveProperty('singleQuote');
    });

    it('should define trailingComma option', () => {
      const prettierPath = path.join(projectRoot, '.prettierrc');
      const content = JSON.parse(fs.readFileSync(prettierPath, 'utf-8'));
      expect(content).toHaveProperty('trailingComma');
    });

    it('should define printWidth option', () => {
      const prettierPath = path.join(projectRoot, '.prettierrc');
      const content = JSON.parse(fs.readFileSync(prettierPath, 'utf-8'));
      expect(content).toHaveProperty('printWidth');
    });
  });
});
