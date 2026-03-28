import { describe, it, expect } from 'vitest';
import { detectRuleOfThree } from '@/detectors/structural/rule-of-three.js';
import { detectNegativeParallelism } from '@/detectors/structural/negative-parallelism.js';
import { detectOutlineConclusions } from '@/detectors/structural/outline-conclusions.js';
import { detectFalseRanges } from '@/detectors/structural/false-ranges.js';
import { aggregateStructuralPatterns } from '@/detectors/structural/aggregator.js';
import {
  scoreStructural,
  MAX_RULE_OF_THREE_SCORE,
  MAX_NEGATIVE_PARALLELISM_SCORE,
  MAX_OUTLINE_CONCLUSIONS_SCORE,
  MAX_FALSE_RANGES_SCORE,
  MAX_STRUCTURAL_SCORE,
  type StructuralSubcategory,
} from '@/detectors/structural/scorer.js';

describe('detectRuleOfThree', () => {
  it('should detect three adjectives', () => {
    const text = 'This approach is efficient, scalable, and maintainable.';
    const matches = detectRuleOfThree(text);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text).toContain('efficient, scalable, and maintainable');
  });

  it('should detect three nouns', () => {
    const text = 'The system handles users, products, and orders.';
    const matches = detectRuleOfThree(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should not detect two items', () => {
    const text = 'This is good and bad.';
    const matches = detectRuleOfThree(text);

    expect(matches).toEqual([]);
  });

  it('should detect three phrases', () => {
    const text = 'We need to improve performance, reduce costs, and increase reliability.';
    const matches = detectRuleOfThree(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should return match positions', () => {
    const text = 'This approach is efficient, scalable, and maintainable.';
    const matches = detectRuleOfThree(text);

    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectRuleOfThree('')).toEqual([]);
  });

  it('should handle whitespace-only input', () => {
    expect(detectRuleOfThree('   \t\n  ')).toEqual([]);
  });
});

describe('detectNegativeParallelism', () => {
  it('should detect not only but also', () => {
    const text = 'It not only improves performance but also enhances reliability.';
    const matches = detectNegativeParallelism(text);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].type).toBe('not-only-but-also');
  });

  it('should detect not just but', () => {
    const text = "It's not just fast but also efficient.";
    const matches = detectNegativeParallelism(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const text = 'Not Only does it work, But Also it is fast.';
    const matches = detectNegativeParallelism(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should return match positions', () => {
    const text = 'It not only works but also scales.';
    const matches = detectNegativeParallelism(text);

    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectNegativeParallelism('')).toEqual([]);
  });
});

describe('detectOutlineConclusions', () => {
  it('should detect despite challenges pattern', () => {
    const text = 'Despite these challenges, AI offers significant opportunities.';
    const matches = detectOutlineConclusions(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect in conclusion pattern', () => {
    const text = 'In conclusion, this technology provides substantial benefits.';
    const matches = detectOutlineConclusions(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should detect in summary pattern', () => {
    const text = 'In summary, the results are promising.';
    const matches = detectOutlineConclusions(text);

    expect(matches.length).toBeGreaterThan(0);
  });

  it('should return match positions', () => {
    const text = 'In conclusion, this works well.';
    const matches = detectOutlineConclusions(text);

    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectOutlineConclusions('')).toEqual([]);
  });
});

describe('detectFalseRanges', () => {
  it('should detect from X to Y pattern', () => {
    const text = 'This affects everyone from students to CEOs.';
    const matches = detectFalseRanges(text);

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text).toContain('from');
    expect(matches[0].text).toContain('to');
  });

  it('should detect multiple false ranges', () => {
    const text = 'from startups to enterprises, from beginners to experts';
    const matches = detectFalseRanges(text);

    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('should return match positions', () => {
    const text = 'This ranges from A to B.';
    const matches = detectFalseRanges(text);

    expect(matches[0].position).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty input', () => {
    expect(detectFalseRanges('')).toEqual([]);
  });
});

describe('aggregateStructuralPatterns', () => {
  it('should combine all pattern types', () => {
    const text =
      'This is efficient, scalable, and maintainable. It not only works but also scales. From startups to enterprises.';
    const result = aggregateStructuralPatterns(text);

    expect(result.ruleOfThree.length).toBeGreaterThan(0);
    expect(result.negativeParallelism.length).toBeGreaterThan(0);
    expect(result.falseRanges.length).toBeGreaterThan(0);
  });

  it('should return empty arrays for no patterns', () => {
    const text = 'The cat sat on the mat.';
    const result = aggregateStructuralPatterns(text);

    expect(result.ruleOfThree).toEqual([]);
    expect(result.negativeParallelism).toEqual([]);
    expect(result.outlineConclusions).toEqual([]);
    expect(result.falseRanges).toEqual([]);
  });

  it('should handle empty input', () => {
    const result = aggregateStructuralPatterns('');

    expect(result.ruleOfThree).toEqual([]);
    expect(result.negativeParallelism).toEqual([]);
    expect(result.outlineConclusions).toEqual([]);
    expect(result.falseRanges).toEqual([]);
  });
});

describe('scoreStructural', () => {
  it('should score rule of three patterns', () => {
    const text = 'This is efficient, scalable, and maintainable. This is good, better, and best.';
    const result = scoreStructural(text);

    const rotCategory = result.subcategories.find(
      (s: StructuralSubcategory) => s.name === 'rule-of-three',
    );
    expect(rotCategory?.score).toBeGreaterThan(0);
  });

  it('should cap scores per category', () => {
    const manyPatterns = Array(20).fill('This is efficient, scalable, and maintainable.').join(' ');
    const result = scoreStructural(manyPatterns);

    const rotCategory = result.subcategories.find(
      (s: StructuralSubcategory) => s.name === 'rule-of-three',
    );
    expect(rotCategory?.score).toBeLessThanOrEqual(MAX_RULE_OF_THREE_SCORE);
  });

  it('should calculate total score', () => {
    const text =
      'This is efficient, scalable, and maintainable. It not only works but also scales.';
    const result = scoreStructural(text);

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThanOrEqual(MAX_STRUCTURAL_SCORE);
  });

  it('should return correct maxScore', () => {
    const result = scoreStructural('test');
    expect(result.maxScore).toBe(MAX_STRUCTURAL_SCORE);
  });

  it('should return explanation', () => {
    const result = scoreStructural('This is efficient, scalable, and maintainable.');
    expect(result.explanation).toBeTruthy();
    expect(typeof result.explanation).toBe('string');
  });

  it('should return category as structural', () => {
    const result = scoreStructural('test');
    expect(result.category).toBe('structural');
  });

  it('should handle empty input', () => {
    const result = scoreStructural('');
    expect(result.totalScore).toBe(0);
  });

  it('should handle whitespace-only input', () => {
    const result = scoreStructural('   \t\n  ');
    expect(result.totalScore).toBe(0);
  });
});

describe('Structural Scoring Constants', () => {
  it('should have MAX_RULE_OF_THREE_SCORE defined', () => {
    expect(MAX_RULE_OF_THREE_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_NEGATIVE_PARALLELISM_SCORE defined', () => {
    expect(MAX_NEGATIVE_PARALLELISM_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_OUTLINE_CONCLUSIONS_SCORE defined', () => {
    expect(MAX_OUTLINE_CONCLUSIONS_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_FALSE_RANGES_SCORE defined', () => {
    expect(MAX_FALSE_RANGES_SCORE).toBeGreaterThan(0);
  });

  it('should have MAX_STRUCTURAL_SCORE as sum of subcategory caps', () => {
    const expectedTotal =
      MAX_RULE_OF_THREE_SCORE +
      MAX_NEGATIVE_PARALLELISM_SCORE +
      MAX_OUTLINE_CONCLUSIONS_SCORE +
      MAX_FALSE_RANGES_SCORE;
    expect(MAX_STRUCTURAL_SCORE).toBe(expectedTotal);
  });
});
