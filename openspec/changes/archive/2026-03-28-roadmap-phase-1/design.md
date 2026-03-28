## Context

The AI Writing Detector project has completed the foundational setup (Phase 0) and has basic tokenization and statistics utilities implemented. The codebase currently includes:

- `src/utils/tokenizer.ts` - Word and sentence tokenization
- `src/utils/statistics.ts` - Character and word counting

This design covers the remaining Phase 1 tasks: CLI interface, input handling, validation, and output display.

## Goals / Non-Goals

**Goals:**

- Provide a command-line interface using `commander` for argument parsing
- Support file input via path argument and stdin via `--stdin` flag
- Validate input is non-empty before allowing analysis to proceed
- Display basic statistics (character count, word count) in formatted output
- Follow existing TypeScript patterns in the codebase

**Non-Goals:**

- Pattern detection (Phase 2+)
- Report generation (Phase 8)
- Configuration file support
- Multiple output formats

## Decisions

### 1. CLI Framework: Commander

**Decision:** Use `commander` package for CLI argument parsing.

**Rationale:**

- De facto standard for Node.js CLIs
- Lightweight, well-documented
- Supports subcommands, flags, and help generation
- TypeScript support via `@types/commander`

**Alternatives considered:**

- `yargs`: More verbose configuration, heavier
- Manual parsing: Reinventing the wheel, error-prone

### 2. Input Architecture

**Decision:** Separate input handlers into distinct modules with a common interface.

```
src/input/
├── file.ts      # File reading with error handling
├── stdin.ts     # Stdin streaming reader
└── validator.ts # Empty/whitespace validation
```

**Rationale:**

- Single Responsibility Principle
- Easier to test each handler independently
- Clear separation between input source and validation

### 3. Validation Strategy

**Decision:** Validate after input is collected, throw custom `EmptyInputError`.

**Rationale:**

- Centralized validation logic
- Custom error class provides clear error messages
- Prevents analysis from running on invalid input

### 4. Output Format

**Decision:** Simple formatted console output using `console.log` with labeled statistics.

**Rationale:**

- Matches the existing minimalist approach
- No external formatting dependencies needed
- Easy to extend in Phase 8 for full reports

## Module Design

### CLI Entry Point (`src/cli.ts`)

```typescript
// Pseudo-structure
import { Command } from 'commander';
import { readFileInput } from './input/file.js';
import { readStdinInput } from './input/stdin.js';
import { validateInput } from './input/validator.js';
import { displayStatistics } from './output/display.js';
import { countCharacters, countWords } from './utils/statistics.js';

const program = new Command();
program
  .name('ai-writing-detector')
  .command('analyze <file>')
  .option('--stdin', 'Read from stdin instead of file')
  .action(async (file, options) => {
    const text = options.stdin ? await readStdinInput() : await readFileInput(file);
    validateInput(text);
    displayStatistics(text);
  });
```

### File Input (`src/input/file.ts`)

- Exports `readFileInput(path: string): Promise<string>`
- Uses Node.js `fs/promises` for async file reading
- Throws descriptive errors for:
  - File not found
  - Permission denied
  - Invalid path

### Stdin Input (`src/input/stdin.ts`)

- Exports `readStdinInput(): Promise<string>`
- Streams stdin to string
- Handles empty stdin gracefully

### Validator (`src/input/validator.ts`)

- Exports `validateInput(text: string): void`
- Throws `EmptyInputError` if text is empty or whitespace-only
- Custom error class with clear message

### Display (`src/output/display.ts`)

- Exports `displayStatistics(text: string): void`
- Shows character count and word count
- Format: `Characters: N\nWords: N`

## Risks / Trade-offs

| Risk                                       | Mitigation                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| Large file input could cause memory issues | Document that tool is for typical article/essay lengths; future: add streaming support |
| Stdin timeout on empty pipe                | Document usage; no timeout initially                                                   |
| Unicode handling in character count        | Use JavaScript string `.length` which counts UTF-16 code units (documented behavior)   |

## Migration Plan

1. Add `commander` dependency to `package.json`
2. Create `src/input/` directory structure
3. Create `src/output/` directory
4. Implement modules in dependency order (file → stdin → validator → display → cli)
5. Update `package.json` start script
6. Run tests and quality checks

## Open Questions

None - all requirements are clear from REQUIREMENTS.md Step 1.
