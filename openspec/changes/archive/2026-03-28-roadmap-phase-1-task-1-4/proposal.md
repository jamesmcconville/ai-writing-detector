## Why

The CLI entry point is the foundational to user interaction. We need argument parsing to process file input and stdin input and display statistics.

## What Changes

- Create `src/cli.ts` with CLI framework setup
- Add command for parsing using `commander` library
- Set up basic statistics display (character count, word count)
- Add empty input validation

## Capabilities

### New Capabilities

- `cli-entry`: Command-line interface for the AI writing detector

### Modified Capabilities

None - this is new module.

## Impact

- Creates `src/cli.ts`
- Enables `ai-writing-detector analyze <file>` or `--stdin <text>`
- No breaking changes - new module
