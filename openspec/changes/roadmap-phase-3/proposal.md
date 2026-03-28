## Why

AI-generated text frequently uses specific structural patterns that are rare in human writing. These patterns include the "rule of three" (grouping things in threes), negative parallelism ("not only... but also"), outline-style conclusions, and false ranges. Detecting these patterns provides strong signals for AI-generated content.

## What Changes

- **Rule of Three Detector**: Detect parallel structures with three items (adjectives, nouns, phrases)
- **Negative Parallelism Detector**: Detect "not only... but also" and similar rigid parallel structures
- **Outline-style Conclusions Detector**: Detect formulaic conclusion patterns
- **False Ranges Detector**: Detect "from X to Y" constructions with illogical endpoints
- **Structural Aggregator**: Combine all structural pattern detections
- **Structural Scorer**: Score structural patterns with documented caps per category
- **Tests**: Comprehensive tests for all structural patterns

## Capabilities

### New Capabilities

- `structural-patterns`: Detect AI-typical structural patterns (rule of three, negative parallelism, outline conclusions, false ranges) with per-category scoring caps

## Impact

**Files Created:**

- `src/detectors/structural/rule-of-three.ts` - Rule of three detector
- `src/detectors/structural/negative-parallelism.ts` - Negative parallelism detector
- `src/detectors/structural/outline-conclusions.ts` - Outline conclusions detector
- `src/detectors/structural/false-ranges.ts` - False ranges detector
- `src/detectors/structural/aggregator.ts` - Pattern aggregator
- `src/detectors/structural/scorer.ts` - Scoring system
- `tests/detectors/structural.test.ts` - Tests

**Dependencies:**

- Uses existing `src/utils/tokenizer.ts` for sentence tokenization

**Scoring Design:**

- Each pattern category has its own maximum cap
- Caps prevent any single pattern from dominating the score
