## Why

AI-generated text exhibits distinctive vocabulary patterns—certain words and phrases appear with significantly higher frequency than in human writing. Language models favor terms like "delve into", "navigate", "robust", "leverage", and "ecosystem". This phase builds detectors that identify these LLM-signature vocabulary patterns and contribute to the overall AI probability score.

## What Changes

- **AI Vocabulary Word List**: Create `src/detectors/vocabulary/ai-words.ts` with comprehensive lists of AI-typical single words and multi-word phrases
- **Vocabulary Scanner**: Implement `src/detectors/vocabulary/scanner.ts` to scan text for AI vocabulary terms
- **Phrase Detector**: Implement `src/detectors/vocabulary/phrase-detector.ts` to detect multi-word AI phrases
- **Vocabulary Scorer**: Implement `src/detectors/vocabulary/scorer.ts` with scoring logic and documented maximum cap
- **Tests**: Create comprehensive tests in `tests/detectors/vocabulary.test.ts`

## Capabilities

### New Capabilities

- `vocabulary-detection`: Detect LLM-signature vocabulary terms and phrases in text, with scoring capped to prevent dominance

## Impact

**Files Created:**

- `src/detectors/vocabulary/ai-words.ts` - Word and phrase lists
- `src/detectors/vocabulary/scanner.ts` - Single word scanner
- `src/detectors/vocabulary/phrase-detector.ts` - Multi-word phrase detector
- `src/detectors/vocabulary/scorer.ts` - Scoring system with max cap
- `tests/detectors/vocabulary.test.ts` - Comprehensive tests

**Dependencies:**

- Uses existing `src/utils/tokenizer.ts` for word tokenization

**Scoring Design:**

- Each distinct AI vocabulary term contributes points
- Maximum cap prevents this single category from dominating the overall score
- Both single words and multi-word phrases are detected
