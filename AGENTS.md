# AI Writing Detector - Agent Guidelines

TypeScript/Node.js CLI that detects AI-generated writing via rule-based text analysis. Heuristic scoring, not model inference.

## Commands

```bash
npm install            # deps
npm run build          # tsc + tsc-alias (must run before CLI)
npm run start -- analyze <file>          # analyze a file
npm run start -- analyze <file> --stdin  # analyze from stdin
npm test               # vitest run
npm test -- --grep "rule of three"       # focused test
npm run test:watch     # vitest watch
npm run lint && npm run typecheck && npm test  # verify order
npm run lint:fix       # auto-fix
npm run format         # prettier --write
```

## Key Quirks

- **ESM** (`"type": "module"` in package.json) — use `.js` extensions in imports even for `.ts` sources.
- **`tsc-alias`** resolves `@/*` path aliases in compiled output. If you add a new `@/` import, it just works after build.
- **Build before run** — `npm run start` executes `dist/cli.js`, so `npm run build` must succeed first.
- **Vitest globals enabled** — `describe`, `it`, `expect` are available without imports.
- **Tests live in `tests/`** (not `test/`), mirroring `src/` structure: `src/detectors/vocabulary/scanner.ts` → `tests/detectors/vocabulary/scanner.test.ts`.

## Architecture

```
src/
├── cli.ts                 # entry: `analyze <file> [--stdin]`
├── input/                 # file, stdin, validator
├── utils/                 # tokenizer, statistics
├── detectors/             # rule-based pattern detectors
│   ├── vocabulary/        # AI-typical words & phrases
│   ├── structural/        # rule-of-three, negative parallelism, outline conclusions, false ranges
│   ├── vague/             # attribution, superficial, overgeneralization
│   └── promotional/       # intensifiers, marketing phrases, elegant variation
├── analyzers/             # statistical: lexical diversity, sentence length, passive voice, transitions, Flesch-Kincaid, punctuation, rare words
├── scoring/               # aggregation, normalization, classification, display
├── report/                # report assembly, sections, CLI formatter, timestamp
└── output/                # console display helpers
```

The CLI wires the full pipeline: statistics → scoring → report summary. Classification thresholds: `<30` = Likely Human, `30-59` = Possibly AI, `60+` = Likely AI.

## Scoring Conventions

Every detector scorer must:
1. Return a score between 0 and its documented max cap
2. Export the cap as a `const MAX_*_SCORE = N`
3. Return an explanation string for why points were awarded

## Development Loop

This repo was built with an agent-driven loop (`LOOP.md`). Use `/opsx-loop` to continue phased development from `ROADMAP.md`. Phases 0–8 are complete; Phase 9 (Extensions) is remaining.

`openspec/` contains spec artifacts from completed phases. `openspec/changes/archive/` holds archived changes.

## Style

- Prettier: `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`
- ESLint: `@typescript-eslint/recommended` + `eslint:recommended`
- Imports: Node built-ins → external deps → internal `@/` modules
- Files: kebab-case for utilities, PascalCase for classes
- No `as any`, `@ts-ignore`, or `@ts-expect-error`

## Guardrails

- Never commit unless explicitly requested
- Fix minimally when debugging — don't refactor while fixing
- Test edge cases: empty input, very short text, special characters
- Handle failures gracefully — empty input should prevent analysis, not crash

## References

- `ROADMAP.md` — implementation phases and dependency graph
- `REQUIREMENTS.md` — original challenge brief
- `LOOP.md` — agent development loop documentation
- `samples/ai-generated/` and `samples/human-written/` — test texts
