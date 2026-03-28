## Why

The AI Writing Detector currently has tokenization and basic statistics utilities (character count, word count) implemented, but lacks the user-facing CLI interface and input handling to actually use these capabilities. Users cannot submit text for analysis, and there is no graceful handling of empty or invalid input. This change completes Phase 1 by building the command-line interface that makes the existing utilities usable.

## What Changes

- **CLI Entry Point**: Create `src/cli.ts` using Commander.js for argument parsing, supporting `analyze <file>` command and `--stdin` flag
- **File Input Handler**: Implement `src/input/file.ts` to read text from files with proper error handling
- **Stdin Input Handler**: Implement `src/input/stdin.ts` to read text from standard input for piped usage
- **Input Validation**: Implement `src/input/validator.ts` to validate text is non-empty before analysis proceeds
- **Statistics Display**: Implement `src/output/display.ts` to show character count and word count in a formatted output
- **Tests**: Create comprehensive tests for all Phase 1 components in `tests/phase1.test.ts`

## Capabilities

### New Capabilities

- `cli-interface`: Command-line interface with argument parsing, supporting `analyze <file>` command and `--stdin` flag for flexible text input
- `input-handling`: File and stdin input handlers with error handling for missing files, permission errors, and invalid paths
- `input-validation`: Empty input validation that prevents analysis from proceeding on empty or whitespace-only text
- `output-display`: Formatted console output for basic text statistics (character count, word count)

### Modified Capabilities

None - these are new capabilities building on existing utilities.

## Impact

**New Files Created:**

- `src/cli.ts` - CLI entry point with Commander.js
- `src/input/file.ts` - File input handler
- `src/input/stdin.ts` - Stdin input handler
- `src/input/validator.ts` - Input validation
- `src/output/display.ts` - Output formatting
- `tests/phase1.test.ts` - Phase 1 tests

**Dependencies Added:**

- `commander` - For CLI argument parsing

**Affected Systems:**

- `package.json` - Add commander dependency, update start script
- Build output will include new CLI entry point at `dist/cli.js`

**Usage Examples:**

```bash
# Analyze a file
npm run start -- analyze samples/test.txt

# Analyze from stdin
echo "Hello world" | npm run start -- analyze --stdin

# Error on empty input
npm run start -- analyze empty.txt  # Exits with error message
```
