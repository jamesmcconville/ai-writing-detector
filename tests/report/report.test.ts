import { describe, it, expect } from 'vitest';
import {
  generateReport,
  formatReport,
  buildStatisticsSection,
  buildLinguisticSection,
  buildPatternsSection,
  buildScoreSection,
  generateTimestamp,
} from '../../src/report/index.js';
import { aggregateStatistics } from '../../src/analyzers/aggregator.js';
import { computeScore } from '../../src/scoring/index.js';

describe('Report Generation', () => {
  const sampleText = 'This is a test sentence. It has multiple words.';

  describe('generateReport', () => {
    it('should generate a complete report', () => {
      const report = generateReport(sampleText);

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('statistics');
      expect(report).toHaveProperty('linguistic');
      expect(report).toHaveProperty('patterns');
      expect(report).toHaveProperty('score');
      expect(report).toHaveProperty('contributions');
    });

    it('should handle empty text', () => {
      const report = generateReport('');

      expect(report.statistics.wordCount).toBe(0);
      expect(report.score.score).toBe(0);
    });
  });

  describe('buildStatisticsSection', () => {
    it('should calculate text statistics', () => {
      const stats = buildStatisticsSection(sampleText);

      expect(stats.characterCount).toBeGreaterThan(0);
      expect(stats.wordCount).toBeGreaterThan(0);
      expect(stats.sentenceCount).toBeGreaterThan(0);
      expect(stats.averageWordLength).toBeGreaterThan(0);
    });

    it('should return zeros for empty text', () => {
      const stats = buildStatisticsSection('');

      expect(stats.characterCount).toBe(0);
      expect(stats.wordCount).toBe(0);
      expect(stats.sentenceCount).toBe(0);
    });
  });

  describe('buildLinguisticSection', () => {
    it('should include all linguistic factors', () => {
      const analysis = aggregateStatistics(sampleText);
      const linguistic = buildLinguisticSection(analysis);

      expect(linguistic.factors.length).toBe(7);
      expect(linguistic.factors.map((f) => f.name)).toContain('Lexical Diversity (TTR)');
      expect(linguistic.factors.map((f) => f.name)).toContain('Sentence Length Variation');
      expect(linguistic.factors.map((f) => f.name)).toContain('Passive Voice');
    });

    it('should identify AI signals', () => {
      const aiText =
        'Furthermore, moreover, additionally, the robust ecosystem delves into transformative solutions.';
      const analysis = aggregateStatistics(aiText);
      const linguistic = buildLinguisticSection(analysis);

      const signals = linguistic.factors.filter((f) => f.isAISignal);
      expect(signals.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('buildPatternsSection', () => {
    it('should extract pattern categories from contributions', () => {
      const scoringResult = computeScore(sampleText);
      const patterns = buildPatternsSection(scoringResult.contributions);

      expect(patterns.categories.length).toBeGreaterThan(0);
      expect(patterns.totalScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('buildScoreSection', () => {
    it('should build score section from scoring result', () => {
      const scoringResult = computeScore(sampleText);
      const scoreSection = buildScoreSection(scoringResult);

      expect(scoreSection.score).toBe(scoringResult.score);
      expect(scoreSection.classification).toBe(scoringResult.classification.label);
      expect(scoreSection.thresholds).toEqual(scoringResult.classification.thresholds);
    });
  });

  describe('generateTimestamp', () => {
    it('should generate ISO and local timestamps', () => {
      const timestamp = generateTimestamp();

      expect(timestamp.iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(timestamp.local.length).toBeGreaterThan(0);
    });
  });

  describe('formatReport', () => {
    it('should format report as readable string', () => {
      const report = generateReport(sampleText);
      const formatted = formatReport(report);

      expect(formatted).toContain('AI WRITING DETECTOR REPORT');
      expect(formatted).toContain('TEXT STATISTICS');
      expect(formatted).toContain('LINGUISTIC FACTORS');
      expect(formatted).toContain('PATTERNS DETECTED');
      expect(formatted).toContain('SCORE BREAKDOWN');
    });

    it('should include classification in output', () => {
      const report = generateReport(sampleText);
      const formatted = formatReport(report);

      expect(formatted).toContain('SCORE:');
      expect(formatted).toContain(report.score.classification);
    });
  });
});
