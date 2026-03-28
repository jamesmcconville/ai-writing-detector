## Why

AI-generated text tends to oversell, using superlatives and marketing-style phrasing that reads more like advertising copy than natural writing. This phase detects promotional language patterns including undue emphasis, marketing phrases, and elegant variation (cycling through synonyms for the same concept).

## What Changes

- **Intensifiers List**: Create lists of superlatives and intensifiers
- **Undue Emphasis Detector**: Detect excessive superlatives and emphatic language
- **Marketing Phrases List**: Create list of promotional/marketing phrases
- **Promotional Language Detector**: Detect marketing-style phrasing
- **Elegant Variation Detector**: Detect cycling through synonyms for the same entity
- **Promotional Aggregator**: Combine all promotional pattern detections
- **Promotional Scorer**: Score promotional patterns with caps
- **Tests**: Comprehensive tests for promotional language

## Capabilities

### New Capabilities

- `promotional-language`: Detect promotional language patterns (undue emphasis, marketing phrases, elegant variation) with per-category scoring caps

## Impact

**Files Created:**

- `src/detectors/promotional/intensifiers.ts` - Intensifier/superlative lists
- `src/detectors/promotional/emphasis.ts` - Emphasis detector
- `src/detectors/promotional/marketing-phrases.ts` - Marketing phrase lists
- `src/detectors/promotional/promotional.ts` - Promotional language detector
- `src/detectors/promotional/elegant-variation.ts` - Elegant variation detector
- `src/detectors/promotional/aggregator.ts` - Pattern aggregator
- `src/detectors/promotional/scorer.ts` - Scoring system
- `tests/detectors/promotional.test.ts` - Tests

**Scoring Design:**

- Each category has its own maximum cap
- Elegant variation requires tracking synonym groups across sentences
