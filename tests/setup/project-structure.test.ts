import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Structure', () => {
  const projectRoot = process.cwd();

  describe('Source directories', () => {
    it('should have src/ directory', () => {
      const srcPath = path.join(projectRoot, 'src');
      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.statSync(srcPath).isDirectory()).toBe(true);
    });

    it('should have src/detectors/ directory', () => {
      const detectorsPath = path.join(projectRoot, 'src', 'detectors');
      expect(fs.existsSync(detectorsPath)).toBe(true);
      expect(fs.statSync(detectorsPath).isDirectory()).toBe(true);
    });

    it('should have src/analyzers/ directory', () => {
      const analyzersPath = path.join(projectRoot, 'src', 'analyzers');
      expect(fs.existsSync(analyzersPath)).toBe(true);
      expect(fs.statSync(analyzersPath).isDirectory()).toBe(true);
    });

    it('should have src/utils/ directory', () => {
      const utilsPath = path.join(projectRoot, 'src', 'utils');
      expect(fs.existsSync(utilsPath)).toBe(true);
      expect(fs.statSync(utilsPath).isDirectory()).toBe(true);
    });
  });

  describe('Test directories', () => {
    it('should have tests/ directory', () => {
      const testsPath = path.join(projectRoot, 'tests');
      expect(fs.existsSync(testsPath)).toBe(true);
      expect(fs.statSync(testsPath).isDirectory()).toBe(true);
    });
  });

  describe('Sample directories', () => {
    it('should have samples/ directory', () => {
      const samplesPath = path.join(projectRoot, 'samples');
      expect(fs.existsSync(samplesPath)).toBe(true);
      expect(fs.statSync(samplesPath).isDirectory()).toBe(true);
    });
  });
});
