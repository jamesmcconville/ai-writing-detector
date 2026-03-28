import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('TypeScript Configuration', () => {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  let tsconfig: Record<string, unknown>;

  beforeAll(() => {
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    tsconfig = JSON.parse(content);
  });

  describe('Strict mode', () => {
    it('should enable strict mode', () => {
      expect(tsconfig.compilerOptions).toHaveProperty('strict', true);
    });
  });

  describe('Modern JavaScript target', () => {
    it('should target ES2022', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions.target).toBe('ES2022');
    });
  });

  describe('Path alias configuration', () => {
    it('should set baseUrl to root', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions.baseUrl).toBe('.');
    });

    it('should configure @/* path alias', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      const paths = compilerOptions.paths as Record<string, string[]>;
      expect(paths).toHaveProperty('@/*');
      expect(paths['@/*']).toContain('./src/*');
    });
  });

  describe('Output directory configuration', () => {
    it('should set outDir to dist', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions.outDir).toBe('./dist');
    });

    it('should set rootDir to .', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions.rootDir).toBe('.');
    });
  });

  describe('Source maps', () => {
    it('should enable source maps', () => {
      const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>;
      expect(compilerOptions.sourceMap).toBe(true);
    });
  });
});
