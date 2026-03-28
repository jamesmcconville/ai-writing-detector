## Why

Character counting is a basic statistic needed for text analysis. This function provides the foundation for calculating text length metrics.

## What Changes

- Create `src/utils/statistics.ts` with character counting function
- Implement `countCharacters(text: string): number`
- Handle edge cases (empty input, null)

## Capabilities

### New Capabilities

- `character-counter`: Character counting utility for text length analysis

### Modified Capabilities

None - new module.

## Impact

- Creates `src/utils/statistics.ts`
- Provides function used by CLI output and analyzers
- No breaking changes - new module
