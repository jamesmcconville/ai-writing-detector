import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Setup', () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(content);
  });

  describe('Package.json metadata', () => {
    it('should contain name field', () => {
      expect(packageJson).toHaveProperty('name');
      expect(typeof packageJson.name).toBe('string');
      expect(packageJson.name).toMatch(/^@?[a-z0-9-]+\/?[a-z0-9-]+$/);
    });

    it('should contain version field', () => {
      expect(packageJson).toHaveProperty('version');
      expect(typeof packageJson.version).toBe('string');
    });

    it('should contain description field', () => {
      expect(packageJson).toHaveProperty('description');
      expect(typeof packageJson.description).toBe('string');
    });

    it('should contain author field', () => {
      expect(packageJson).toHaveProperty('author');
    });
  });

  describe('TypeScript dependency', () => {
    it('should have TypeScript as devDependency', () => {
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(devDeps).toHaveProperty('typescript');
    });
  });

  describe('Testing framework dependency', () => {
    it('should have Vitest as devDependency', () => {
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(devDeps).toHaveProperty('vitest');
    });
  });

  describe('Code quality tools', () => {
    it('should have ESLint as devDependency', () => {
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(devDeps).toHaveProperty('eslint');
    });

    it('should have Prettier as devDependency', () => {
      const devDeps = packageJson.devDependencies as Record<string, string>;
      expect(devDeps).toHaveProperty('prettier');
    });
  });

  describe('NPM scripts', () => {
    it('should have build script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts).toHaveProperty('build');
    });

    it('should have test script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts).toHaveProperty('test');
    });

    it('should have lint script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts).toHaveProperty('lint');
    });

    it('should have format script', () => {
      const scripts = packageJson.scripts as Record<string, string>;
      expect(scripts).toHaveProperty('format');
    });
  });
});
