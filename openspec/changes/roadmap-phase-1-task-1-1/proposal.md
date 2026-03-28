## Why

Text tokenization is the fundamental operation for the AI writing detector. Before we can analyze text for patterns, we need to break it down into individual tokens (words, sentences, punctuation). that can be processed by our detection algorithms.

## What Changes

- Create `src/utils/tokenizer.ts` with tokenization functions
- Implement word splitting with proper handling of punctuation
- Implement sentence splitting
- Handle edge cases (empty input, special characters)

## Capabilities

### New Capabilities

- `text-tokenization`: Tokenization utilities for breaking text into words, sentences, and paragraphs

### Modified Capabilities

None - this is foundational.

## Impact

- Creates `src/utils/tokenizer.ts`
- Provides functions used by all detectors and analyzers
- No breaking changes - new module
