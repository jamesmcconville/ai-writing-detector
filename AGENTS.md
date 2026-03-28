# AI Writing Detector - Agent Guidelines

This document provides essential context for AI coding agents working in this repository.

## Project Overview

A **TypeScript/NodeJS CLI tool** that detects AI-generated writing using rule-based text analysis. The system analyzes text across multiple dimensions—vocabulary, sentence structure, rhetorical patterns, and statistical properties—to produce a detailed report showing the likelihood the text was AI-generated.

## Build, Test, and Lint Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run all tests
npm test

# Run a single test file
npm test -- src/detectors/vocabulary.test.ts
npm test -- --grep "rule of three"

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix lint errors
npm run lint:fix

# Format code
npm run format

# Type check
npm run typecheck

# Run the CLI
npm run start -- analyze samples/test.txt
npm run start -- analyze --stdin < input.txt
```

## Code Style Guidelines

### Imports

```typescript
// Node built-ins first
import fs from 'fs';
import path from 'path';

// External dependencies second
import { Command } from 'commander';
import chalk from 'chalk';

// Internal modules last (use alias paths)
import { tokenize } from '@/utils/tokenizer';
import { countWords } from '@/utils/statistics';
import { VocabularyScorer } from '@/detectors/vocabulary/scorer';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (utilities) | kebab-case | `tokenize-text.ts`, `count-words.ts` |
| Files (classes) | PascalCase | `VocabularyScorer.ts` |
| Classes | PascalCase | `PatternDetector`, `ScoreAggregator` |
| Functions | camelCase | `countCharacters()`, `detectRuleOfThree()` |
| Constants | SCREAMING_SNAKE | `MAX_VOCABULARY_SCORE`, `AI_WORD_LIST` |
| Interfaces | PascalCase with I prefix (optional) | `DetectorResult`, `AnalysisReport` |
| Types | PascalCase | `ScoreCategory`, `PatternMatch` |

### TypeScript Guidelines

```typescript
// Prefer explicit types for function parameters and returns
export function countWords(text: string): number {
  return tokenize(text).length;
}

// Use interfaces for object shapes
interface DetectionResult {
  readonly pattern: string;
  readonly matches: readonly PatternMatch[];
  readonly score: number;
  readonly maxScore: number;
}

// Use const assertions for readonly arrays
const AI_VOCABULARY = ['delve', 'navigate', 'robust'] as const;

// Avoid any - use unknown when type is uncertain
function parseInput(data: unknown): string {
  if (typeof data !== 'string') {
    throw new TypeError('Expected string input');
  }
  return data;
}

// Use optional chaining and nullish coalescing
const wordCount = text?.trim()?.length ?? 0;
```

### Error Handling

```typescript
// Create custom error classes for domain errors
class EmptyInputError extends Error {
  constructor(message = 'Input text cannot be empty') {
    super(message);
    this.name = 'EmptyInputError';
  }
}

class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

// Throw early, handle at boundaries
function analyzeText(text: string): AnalysisReport {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new EmptyInputError();
  }
  // ... analysis logic
}

// Result objects for recoverable failures
type Result<T, E = Error> = 
  | { success: true; value: T }
  | { success: false; error: E };
```

### File Structure

```
src/
├── cli.ts                 # CLI entry point
├── input/                 # Input handling (file, stdin)
├── utils/                 # Shared utilities (tokenizer, statistics)
├── detectors/             # Pattern detectors by category
│   ├── vocabulary/
│   ├── structural/
│   ├── vague/
│   └── promotional/
├── analyzers/             # Statistical analyzers
├── scoring/               # Score aggregation and classification
└── report/                # Report generation
```

### Scoring Conventions

Each detector must:
1. Return a score between 0 and its maximum cap
2. Document the maximum cap in a constant
3. Provide explanatory text for why points were awarded

```typescript
const MAX_VOCABULARY_SCORE = 15;
const POINTS_PER_AI_TERM = 3;

function scoreVocabulary(matches: string[]): ScoreResult {
  const distinctMatches = new Set(matches);
  const rawScore = distinctMatches.size * POINTS_PER_AI_TERM;
  const score = Math.min(rawScore, MAX_VOCABULARY_SCORE);
  
  return {
    category: 'vocabulary',
    matches: Array.from(distinctMatches),
    score,
    maxScore: MAX_VOCABULARY_SCORE,
    explanation: `Found ${distinctMatches.size} AI-typical terms`,
  };
}
```

## Testing Guidelines

```typescript
// Test file location mirrors src structure
// src/detectors/vocabulary/scanner.ts -> tests/detectors/vocabulary/scanner.test.ts

import { describe, it, expect } from 'vitest';
import { scanForVocabulary } from '@/detectors/vocabulary/scanner';

describe('VocabularyScanner', () => {
  it('should detect AI vocabulary terms', () => {
    const text = 'Let us delve into this robust ecosystem.';
    const result = scanForVocabulary(text);
    
    expect(result.matches).toContain('delve');
    expect(result.matches).toContain('robust');
    expect(result.matches).toContain('ecosystem');
  });

  it('should respect scoring cap', () => {
    const saturatedText = 'delve navigate robust ecosystem leverage...';
    const result = scanForVocabulary(saturatedText);
    
    expect(result.score).toBeLessThanOrEqual(MAX_VOCABULARY_SCORE);
  });

  it('should handle empty input gracefully', () => {
    expect(() => scanForVocabulary('')).not.toThrow();
    expect(scanForVocabulary('').matches).toEqual([]);
  });
});
```

## Key Domain Concepts

- **Pattern Detectors**: Match specific AI-writing patterns (vocabulary, structural, vague claims, promotional)
- **Statistical Analyzers**: Calculate linguistic metrics (lexical diversity, sentence length variation, etc.)
- **Score Aggregation**: Combines all detector scores into 0-100 probability
- **Classification Thresholds**: <30 = Likely Human, 30-59 = Possibly AI, 60+ = Likely AI

## Guardrails

- **Never suppress type errors** with `as any`, `@ts-ignore`, or `@ts-expect-error`
- **Never commit** unless explicitly requested
- **Fix minimally** when debugging—don't refactor while fixing
- **Test edge cases**: empty input, very short text, special characters
- **Document scoring caps**: Every scorer must have a documented maximum
- **Handle failures gracefully**: Empty input should prevent analysis, not crash

## References

- Full requirements: `REQUIREMENTS.md`
- Implementation roadmap: `ROADMAP.md`
- Sample texts: `samples/ai-generated/` and `samples/human-written/`
