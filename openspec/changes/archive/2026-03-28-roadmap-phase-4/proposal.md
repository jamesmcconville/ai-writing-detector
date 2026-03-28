## Why

AI-generated text often makes broad claims without concrete evidence, hiding behind phrases that sound authoritative but name no actual sources. These vague attributions, superficial analyses, and overgeneralizations are hallmarks of AI writing. Detecting these patterns helps identify text that lacks specificity and credibility.

## What Changes

- **Vague Attribution Detector**: Detect phrases like "experts agree", "studies show", "research indicates"
- **Superficial Analysis Detector**: Detect hedging and filler like "it is worth noting", "significant developments"
- **Overgeneralization Detector**: Detect patterns like "everyone knows", "it is well established"
- **Legitimate Citation Whitelist**: Recognize specific, concrete citations that should not be flagged
- **Vague Claims Aggregator**: Combine all vague claim detections
- **Vague Claims Scorer**: Score vague claims with per-category caps
- **Tests**: Comprehensive tests for all vague claim patterns

## Capabilities

### New Capabilities

- `vague-claims`: Detect vague attributions, superficial analysis, and overgeneralizations in text, with per-category scoring caps and legitimate citation recognition

## Impact

**Files Created:**

- `src/detectors/vague/attribution-phrases.ts` - Vague attribution phrases
- `src/detectors/vague/attribution.ts` - Attribution detector
- `src/detectors/vague/superficial-phrases.ts` - Superficial analysis phrases
- `src/detectors/vague/superficial.ts` - Superficial analysis detector
- `src/detectors/vague/overgeneralization-phrases.ts` - Overgeneralization phrases
- `src/detectors/vague/overgeneralization.ts` - Overgeneralization detector
- `src/detectors/vague/legitimate-citations.ts` - Citation whitelist
- `src/detectors/vague/aggregator.ts` - Pattern aggregator
- `src/detectors/vague/scorer.ts` - Scoring system
- `tests/detectors/vague.test.ts` - Tests

**Dependencies:**

- Uses existing tokenization utilities

**Scoring Design:**

- Each category has its own maximum cap
- Legitimate citations reduce vague attribution score
