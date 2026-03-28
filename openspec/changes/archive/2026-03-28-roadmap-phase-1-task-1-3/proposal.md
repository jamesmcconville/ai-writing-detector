## Why

Word counting is a basic statistic needed for text analysis. Combined with character count, it provides basic metrics about text length and complexity.

## What Changes

- Add `countWords(text: string): number` function to `src/utils/statistics.ts`
- Handle edge cases (empty input, null)
- Use existing tokenizer for implementation

## Capabilities

### New Capabilities

None - extends existing `statistics` capability.

### Modified Capabilities

- `statistics`: Add word counting function

## Impact

- Adds `countWords` to `src/utils/statistics.ts`
- Provides function used by CLI output and analyzers
- No breaking changes - new function
