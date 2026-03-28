# AI Writing Detector - Implementation Roadmap

## Overview

This roadmap breaks down the REQUIREMENTS.md into atomic, self-contained tasks that can be executed independently or in parallel by multiple subagents.

**Tech Stack**: TypeScript / NodeJS
**Interface**: Command-line tool (CLI)
**Architecture**: Rule-based text analysis with pattern detection and statistical analysis

---

## Phase 0: Project Foundation

**Goal**: Establish the development environment, project structure, and testing infrastructure.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 0.1 | Initialize NodeJS project with `package.json` | None | Yes | `package.json` with TypeScript, testing deps |
| 0.2 | Configure TypeScript (`tsconfig.json`) | None | Yes | `tsconfig.json` with strict mode |
| 0.3 | Set up testing framework (Vitest or Jest) | 0.1 | No | Test config + sample passing test |
| 0.4 | Create project directory structure | None | Yes | `src/`, `src/detectors/`, `src/analyzers/`, `src/utils/`, `tests/`, `samples/` |
| 0.5 | Add linter/formatter (ESLint + Prettier) | None | Yes | `.eslintrc.js`, `.prettierrc` |
| 0.6 | Prepare sample texts for testing | None | Yes | `samples/ai-generated/`, `samples/human-written/` with 3-5 texts each |

**Parallel Groups**:
- Group A: 0.1, 0.2, 0.4, 0.5, 0.6 (all independent)
- Group B: 0.3 (requires 0.1)

---

## Phase 1: Text Input & Basic Statistics

**Goal**: Accept text input and display character count, word count, and handle empty input gracefully.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 1.1 | Create text tokenizer utility | 0.4 | Yes | `src/utils/tokenizer.ts` |
| 1.2 | Implement character counter | 0.4 | Yes | `src/utils/statistics.ts` - `countCharacters()` |
| 1.3 | Implement word counter | 0.4 | Yes | `src/utils/statistics.ts` - `countWords()` |
| 1.4 | Create CLI entry point with argument parsing | 0.1 | Yes | `src/cli.ts` using commander or yargs |
| 1.5 | Implement file input handler | 1.4 | No | `src/input/file.ts` |
| 1.6 | Implement stdin input handler | 1.4 | No | `src/input/stdin.ts` |
| 1.7 | Add empty input validation | 1.5, 1.6 | No | `src/input/validator.ts` |
| 1.8 | Display basic statistics output | 1.2, 1.3, 1.7 | No | `src/output/display.ts` |
| 1.9 | Write tests for Phase 1 | 1.1-1.8 | No | `tests/phase1.test.ts` |

**Parallel Groups**:
- Group A: 1.1, 1.2, 1.3, 1.4 (all independent)
- Group B: 1.5, 1.6 (requires 1.4)
- Group C: 1.7 (requires 1.5, 1.6)
- Group D: 1.8 (requires 1.2, 1.3, 1.7)
- Group E: 1.9 (requires all previous)

---

## Phase 2: AI Vocabulary Detection

**Goal**: Detect LLM-signature words and phrases commonly overused in AI-generated text.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 2.1 | Create AI vocabulary word list | 0.4 | Yes | `src/detectors/vocabulary/ai-words.ts` - comprehensive term list |
| 2.2 | Implement vocabulary scanner | 2.1 | No | `src/detectors/vocabulary/scanner.ts` |
| 2.3 | Implement phrase detector (multi-word) | 2.1 | No | `src/detectors/vocabulary/phrase-detector.ts` |
| 2.4 | Create vocabulary scoring system | 2.2, 2.3 | No | `src/detectors/vocabulary/scorer.ts` with max cap |
| 2.5 | Write tests for vocabulary detection | 2.4 | No | `tests/detectors/vocabulary.test.ts` |

**Parallel Groups**:
- Group A: 2.1 (independent)
- Group B: 2.2, 2.3 (requires 2.1, can run in parallel with each other)
- Group C: 2.4 (requires 2.2, 2.3)
- Group D: 2.5 (requires 2.4)

---

## Phase 3: Structural Pattern Detection

**Goal**: Detect common structural patterns: rule of three, negative parallelism, outline-style conclusions, false ranges.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 3.1 | Implement "Rule of Three" detector | 1.1 | Yes | `src/detectors/structural/rule-of-three.ts` |
| 3.2 | Implement "Negative Parallelism" detector | 1.1 | Yes | `src/detectors/structural/negative-parallelism.ts` |
| 3.3 | Implement "Outline-style Conclusions" detector | 1.1 | Yes | `src/detectors/structural/outline-conclusions.ts` |
| 3.4 | Implement "False Ranges" detector | 1.1 | Yes | `src/detectors/structural/false-ranges.ts` |
| 3.5 | Create structural pattern aggregator | 3.1-3.4 | No | `src/detectors/structural/aggregator.ts` |
| 3.6 | Implement structural scoring with caps | 3.5 | No | `src/detectors/structural/scorer.ts` |
| 3.7 | Write tests for structural patterns | 3.6 | No | `tests/detectors/structural.test.ts` |

**Parallel Groups**:
- Group A: 3.1, 3.2, 3.3, 3.4 (all independent, can be assigned to 4 different agents)
- Group B: 3.5 (requires all of Group A)
- Group C: 3.6 (requires 3.5)
- Group D: 3.7 (requires 3.6)

---

## Phase 4: Vague Claims Detection

**Goal**: Detect vague attributions, superficial analysis, and overgeneralization patterns.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 4.1 | Create vague attribution phrase list | 0.4 | Yes | `src/detectors/vague/attribution-phrases.ts` |
| 4.2 | Implement vague attribution detector | 4.1 | No | `src/detectors/vague/attribution.ts` |
| 4.3 | Create superficial analysis phrase list | 0.4 | Yes | `src/detectors/vague/superficial-phrases.ts` |
| 4.4 | Implement superficial analysis detector | 4.3 | No | `src/detectors/vague/superficial.ts` |
| 4.5 | Create overgeneralization phrase list | 0.4 | Yes | `src/detectors/vague/overgeneralization-phrases.ts` |
| 4.6 | Implement overgeneralization detector | 4.5 | No | `src/detectors/vague/overgeneralization.ts` |
| 4.7 | Implement legitimate citation whitelist | 0.4 | Yes | `src/detectors/vague/legitimate-citations.ts` |
| 4.8 | Create vague claims aggregator with scoring | 4.2, 4.4, 4.6, 4.7 | No | `src/detectors/vague/aggregator.ts` |
| 4.9 | Write tests for vague claims detection | 4.8 | No | `tests/detectors/vague.test.ts` |

**Parallel Groups**:
- Group A: 4.1, 4.3, 4.5, 4.7 (all independent)
- Group B: 4.2, 4.4, 4.6 (requires respective phrase lists, can run in parallel)
- Group C: 4.8 (requires 4.2, 4.4, 4.6, 4.7)
- Group D: 4.9 (requires 4.8)

---

## Phase 5: Promotional Language Detection

**Goal**: Detect undue emphasis, promotional language, and elegant variation patterns.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 5.1 | Create superlatives and intensifiers list | 0.4 | Yes | `src/detectors/promotional/intensifiers.ts` |
| 5.2 | Implement undue emphasis detector | 5.1 | No | `src/detectors/promotional/emphasis.ts` |
| 5.3 | Create marketing phrase list | 0.4 | Yes | `src/detectors/promotional/marketing-phrases.ts` |
| 5.4 | Implement promotional language detector | 5.3 | No | `src/detectors/promotional/promotional.ts` |
| 5.5 | Implement elegant variation detector | 1.1 | Yes | `src/detectors/promotional/elegant-variation.ts` |
| 5.6 | Create promotional language aggregator with scoring | 5.2, 5.4, 5.5 | No | `src/detectors/promotional/aggregator.ts` |
| 5.7 | Write tests for promotional language detection | 5.6 | No | `tests/detectors/promotional.test.ts` |

**Parallel Groups**:
- Group A: 5.1, 5.3, 5.5 (all independent)
- Group B: 5.2, 5.4 (requires respective lists, can run in parallel)
- Group C: 5.6 (requires 5.2, 5.4, 5.5)
- Group D: 5.7 (requires 5.6)

---

## Phase 6: Statistical Analysis

**Goal**: Implement linguistic factor analyzers: lexical diversity, sentence length variation, passive voice, transition words, reading grade level, punctuation patterns, rare word usage.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 6.1 | Implement Type-Token Ratio calculator | 1.1 | Yes | `src/analyzers/lexical-diversity.ts` |
| 6.2 | Implement sentence length variation analyzer | 1.1 | Yes | `src/analyzers/sentence-length.ts` |
| 6.3 | Implement passive voice detector | 1.1 | Yes | `src/analyzers/passive-voice.ts` |
| 6.4 | Create transition word list | 0.4 | Yes | `src/analyzers/transition-words.ts` |
| 6.5 | Implement transition word density analyzer | 6.4 | No | `src/analyzers/transition-density.ts` |
| 6.6 | Implement Flesch-Kincaid Grade Level calculator | 1.1 | Yes | `src/analyzers/flesch-kincaid.ts` |
| 6.7 | Implement punctuation pattern analyzer | 1.1 | Yes | `src/analyzers/punctuation.ts` |
| 6.8 | Create rare word dictionary/frequency list | 0.4 | Yes | `src/analyzers/rare-words.ts` |
| 6.9 | Implement rare word usage analyzer | 6.8 | No | `src/analyzers/rare-word-usage.ts` |
| 6.10 | Create statistical analyzer aggregator | 6.1-6.9 | No | `src/analyzers/aggregator.ts` |
| 6.11 | Add indicator display for each factor | 6.10 | No | `src/analyzers/display.ts` |
| 6.12 | Write tests for statistical analyzers | 6.11 | No | `tests/analyzers/statistical.test.ts` |

**Parallel Groups**:
- Group A: 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8 (all independent - can assign to 7 agents)
- Group B: 6.5, 6.9 (requires 6.4, 6.8 respectively)
- Group C: 6.10 (requires all of Group A and B)
- Group D: 6.11 (requires 6.10)
- Group E: 6.12 (requires 6.11)

---

## Phase 7: Scoring System

**Goal**: Aggregate all detector scores into a unified 0-100 probability score with classification.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 7.1 | Design scoring model interface | 2.4, 3.6, 4.8, 5.6, 6.10 | No | `src/scoring/types.ts` |
| 7.2 | Implement score aggregator | 7.1 | No | `src/scoring/aggregator.ts` |
| 7.3 | Implement score normalizer (cap at 100) | 7.2 | No | `src/scoring/normalizer.ts` |
| 7.4 | Implement classification system | 7.3 | No | `src/scoring/classifier.ts` |
| 7.5 | Implement color-coded output | 7.4 | No | `src/scoring/display.ts` |
| 7.6 | Write tests for scoring system | 7.5 | No | `tests/scoring/scoring.test.ts` |

**Parallel Groups**:
- Sequential: 7.1 → 7.2 → 7.3 → 7.4 → 7.5 → 7.6

---

## Phase 8: Report Generation

**Goal**: Produce comprehensive reports with all detected patterns, scores, and explanations.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 8.1 | Design report data structure | 7.4 | No | `src/report/types.ts` |
| 8.2 | Implement text statistics section | 1.8 | Yes | `src/report/sections/statistics.ts` |
| 8.3 | Implement linguistic factors section | 6.11 | Yes | `src/report/sections/linguistic.ts` |
| 8.4 | Implement pattern detections section | 2.4, 3.6, 4.8, 5.6 | Yes | `src/report/sections/patterns.ts` |
| 8.5 | Implement overall score section | 7.5 | No | `src/report/sections/score.ts` |
| 8.6 | Create report assembler | 8.1-8.5 | No | `src/report/assembler.ts` |
| 8.7 | Implement CLI report formatter | 8.6 | No | `src/report/formatters/cli.ts` |
| 8.8 | Add timestamp to reports | 8.7 | No | `src/report/timestamp.ts` |
| 8.9 | Write tests for report generation | 8.8 | No | `tests/report/report.test.ts` |

**Parallel Groups**:
- Group A: 8.2, 8.3, 8.4 (independent, can run in parallel)
- Group B: 8.1 (requires 7.4), 8.5 (requires 7.5) - can run in parallel with Group A
- Group C: 8.6 (requires 8.1-8.5)
- Group D: 8.7 → 8.8 → 8.9 (sequential)

---

## Phase 9: Extensions (Optional)

**Goal**: Add advanced features for enhanced user experience.

### Tasks

| ID | Task | Dependencies | Parallelizable | Deliverable |
|----|------|--------------|----------------|-------------|
| 9.1 | Implement text highlighting system | 8.7 | No | `src/extensions/highlighting.ts` |
| 9.2 | Implement category badge display | 9.1 | No | `src/extensions/badges.ts` |
| 9.3 | Implement Zipf's Law analyzer | 6.1 | Yes | `src/analyzers/zipf-law.ts` |
| 9.4 | Implement named entity density analyzer | 1.1 | Yes | `src/analyzers/named-entities.ts` |
| 9.5 | Implement paragraph coherence analyzer | 1.1 | Yes | `src/analyzers/coherence.ts` |
| 9.6 | Add "Copy Results" functionality | 8.7 | Yes | `src/extensions/copy-results.ts` |
| 9.7 | Add "Analyse Another" option | 8.7 | Yes | `src/extensions/analyse-another.ts` |
| 9.8 | Create accuracy measurement suite | All phases | No | `tests/accuracy/` |
| 9.9 | Implement weighting configuration | 7.4 | No | `src/config/weights.ts` |

---

## Dependency Graph Summary

```
Phase 0 (Foundation)
    │
    ├──→ Phase 1 (Input/Stats) ──→ Phase 6 (Statistics) ──→ Phase 7 (Scoring)
    │                                      │                        │
    ├──→ Phase 2 (Vocabulary) ─────────────┼────────────────────────┤
    │                                      │                        │
    ├──→ Phase 3 (Structural) ─────────────┼────────────────────────┤
    │                                      │                        │
    ├──→ Phase 4 (Vague Claims) ───────────┼────────────────────────┤
    │                                      │                        │
    └──→ Phase 5 (Promotional) ────────────┘                        │
                                                                   │
                                                                   ▼
                                                            Phase 8 (Reports)
                                                                   │
                                                                   ▼
                                                            Phase 9 (Extensions)
```

---

## Parallel Execution Strategy

### Maximum Parallelization Opportunities

| Phase | Max Parallel Agents | Tasks for Parallel Execution |
|-------|---------------------|------------------------------|
| 0 | 5 | 0.1, 0.2, 0.4, 0.5, 0.6 |
| 1 | 4 | 1.1, 1.2, 1.3, 1.4 |
| 2 | 2 | 2.2, 2.3 (after 2.1) |
| 3 | 4 | 3.1, 3.2, 3.3, 3.4 |
| 4 | 4 | 4.1, 4.3, 4.5, 4.7 |
| 5 | 3 | 5.1, 5.3, 5.5 |
| 6 | 7 | 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8 |
| 7 | 1 | Sequential |
| 8 | 5 | 8.1, 8.2, 8.3, 8.4, 8.5 |
| 9 | 5 | 9.3, 9.4, 9.5, 9.6, 9.7 |

---

## File Structure Reference

```
ai-writing-detector/
├── src/
│   ├── cli.ts                      # CLI entry point
│   ├── input/
│   │   ├── file.ts
│   │   ├── stdin.ts
│   │   └── validator.ts
│   ├── utils/
│   │   ├── tokenizer.ts
│   │   └── statistics.ts
│   ├── detectors/
│   │   ├── vocabulary/
│   │   │   ├── ai-words.ts
│   │   │   ├── scanner.ts
│   │   │   ├── phrase-detector.ts
│   │   │   └── scorer.ts
│   │   ├── structural/
│   │   │   ├── rule-of-three.ts
│   │   │   ├── negative-parallelism.ts
│   │   │   ├── outline-conclusions.ts
│   │   │   ├── false-ranges.ts
│   │   │   ├── aggregator.ts
│   │   │   └── scorer.ts
│   │   ├── vague/
│   │   │   ├── attribution-phrases.ts
│   │   │   ├── attribution.ts
│   │   │   ├── superficial-phrases.ts
│   │   │   ├── superficial.ts
│   │   │   ├── overgeneralization-phrases.ts
│   │   │   ├── overgeneralization.ts
│   │   │   ├── legitimate-citations.ts
│   │   │   └── aggregator.ts
│   │   └── promotional/
│   │       ├── intensifiers.ts
│   │       ├── emphasis.ts
│   │       ├── marketing-phrases.ts
│   │       ├── promotional.ts
│   │       ├── elegant-variation.ts
│   │       └── aggregator.ts
│   ├── analyzers/
│   │   ├── lexical-diversity.ts
│   │   ├── sentence-length.ts
│   │   ├── passive-voice.ts
│   │   ├── transition-words.ts
│   │   ├── transition-density.ts
│   │   ├── flesch-kincaid.ts
│   │   ├── punctuation.ts
│   │   ├── rare-words.ts
│   │   ├── rare-word-usage.ts
│   │   ├── aggregator.ts
│   │   └── display.ts
│   ├── scoring/
│   │   ├── types.ts
│   │   ├── aggregator.ts
│   │   ├── normalizer.ts
│   │   ├── classifier.ts
│   │   └── display.ts
│   ├── report/
│   │   ├── types.ts
│   │   ├── sections/
│   │   │   ├── statistics.ts
│   │   │   ├── linguistic.ts
│   │   │   ├── patterns.ts
│   │   │   └── score.ts
│   │   ├── assembler.ts
│   │   ├── formatters/
│   │   │   └── cli.ts
│   │   └── timestamp.ts
│   ├── extensions/
│   │   ├── highlighting.ts
│   │   ├── badges.ts
│   │   ├── copy-results.ts
│   │   └── analyse-another.ts
│   └── config/
│       └── weights.ts
├── tests/
│   ├── phase1.test.ts
│   ├── detectors/
│   │   ├── vocabulary.test.ts
│   │   ├── structural.test.ts
│   │   ├── vague.test.ts
│   │   └── promotional.test.ts
│   ├── analyzers/
│   │   └── statistical.test.ts
│   ├── scoring/
│   │   └── scoring.test.ts
│   ├── report/
│   │   └── report.test.ts
│   └── accuracy/
│       └── ...
├── samples/
│   ├── ai-generated/
│   └── human-written/
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── README.md
├── REQUIREMENTS.md
└── ROADMAP.md
```

---

## Estimated Effort

| Phase | Tasks | Complexity | Estimated Time |
|-------|-------|------------|----------------|
| 0 | 6 | Low | 2-3 hours |
| 1 | 9 | Low | 3-4 hours |
| 2 | 5 | Medium | 2-3 hours |
| 3 | 7 | Medium | 4-5 hours |
| 4 | 9 | Medium | 3-4 hours |
| 5 | 7 | Medium | 3-4 hours |
| 6 | 12 | High | 6-8 hours |
| 7 | 6 | Medium | 2-3 hours |
| 8 | 9 | Medium | 3-4 hours |
| 9 | 9 | Variable | 4-6 hours |

**Total Estimated Time**: 32-44 hours (core phases 0-8)

---

## Notes for Subagents

1. **Each task is atomic** - A single subagent can complete it independently
2. **Check dependencies** - Ensure prerequisite tasks are complete before starting
3. **Follow existing patterns** - Look at similar files in the same directory for style
4. **Write tests** - Each task should include or update relevant tests
5. **Document scoring caps** - All scorers must have documented maximum caps
6. **Handle edge cases** - Empty input, very short text, special characters
