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

- [x] 0.1 Initialize NodeJS project with `package.json` [deps: None] [deliverable: `package.json` with TypeScript, testing deps]
- [x] 0.2 Configure TypeScript (`tsconfig.json`) [deps: None] [deliverable: `tsconfig.json` with strict mode]
- [x] 0.3 Set up testing framework (Vitest or Jest) [deps: 0.1] [deliverable: Test config + sample passing test]
- [x] 0.4 Create project directory structure [deps: None] [deliverable: `src/`, `src/detectors/`, `src/analyzers/`, `src/utils/`, `tests/`, `samples/`]
- [ ] 0.5 Add linter/formatter (ESLint + Prettier) [deps: None] [deliverable: `.eslintrc.js`, `.prettierrc`]
- [ ] 0.6 Prepare sample texts for testing [deps: None] [deliverable: `samples/ai-generated/`, `samples/human-written/` with 3-5 texts each]

**Parallel Groups**:
- Group A: 0.1, 0.2, 0.4, 0.5, 0.6 (all independent)
- Group B: 0.3 (requires 0.1)

---

## Phase 1: Text Input & Basic Statistics

**Goal**: Accept text input and display character count, word count, and handle empty input gracefully.

### Tasks

- [ ] 1.1 Create text tokenizer utility [deps: 0.4] [deliverable: `src/utils/tokenizer.ts`]
- [ ] 1.2 Implement character counter [deps: 0.4] [deliverable: `src/utils/statistics.ts` - `countCharacters()`]
- [ ] 1.3 Implement word counter [deps: 0.4] [deliverable: `src/utils/statistics.ts` - `countWords()`]
- [ ] 1.4 Create CLI entry point with argument parsing [deps: 0.1] [deliverable: `src/cli.ts` using commander or yargs]
- [ ] 1.5 Implement file input handler [deps: 1.4] [deliverable: `src/input/file.ts`]
- [ ] 1.6 Implement stdin input handler [deps: 1.4] [deliverable: `src/input/stdin.ts`]
- [ ] 1.7 Add empty input validation [deps: 1.5, 1.6] [deliverable: `src/input/validator.ts`]
- [ ] 1.8 Display basic statistics output [deps: 1.2, 1.3, 1.7] [deliverable: `src/output/display.ts`]
- [ ] 1.9 Write tests for Phase 1 [deps: 1.1-1.8] [deliverable: `tests/phase1.test.ts`]

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

- [ ] 2.1 Create AI vocabulary word list [deps: 0.4] [deliverable: `src/detectors/vocabulary/ai-words.ts` - comprehensive term list]
- [ ] 2.2 Implement vocabulary scanner [deps: 2.1] [deliverable: `src/detectors/vocabulary/scanner.ts`]
- [ ] 2.3 Implement phrase detector (multi-word) [deps: 2.1] [deliverable: `src/detectors/vocabulary/phrase-detector.ts`]
- [ ] 2.4 Create vocabulary scoring system [deps: 2.2, 2.3] [deliverable: `src/detectors/vocabulary/scorer.ts` with max cap]
- [ ] 2.5 Write tests for vocabulary detection [deps: 2.4] [deliverable: `tests/detectors/vocabulary.test.ts`]

**Parallel Groups**:
- Group A: 2.1 (independent)
- Group B: 2.2, 2.3 (requires 2.1, can run in parallel with each other)
- Group C: 2.4 (requires 2.2, 2.3)
- Group D: 2.5 (requires 2.4)

---

## Phase 3: Structural Pattern Detection

**Goal**: Detect common structural patterns: rule of three, negative parallelism, outline-style conclusions, false ranges.

### Tasks

- [ ] 3.1 Implement "Rule of Three" detector [deps: 1.1] [deliverable: `src/detectors/structural/rule-of-three.ts`]
- [ ] 3.2 Implement "Negative Parallelism" detector [deps: 1.1] [deliverable: `src/detectors/structural/negative-parallelism.ts`]
- [ ] 3.3 Implement "Outline-style Conclusions" detector [deps: 1.1] [deliverable: `src/detectors/structural/outline-conclusions.ts`]
- [ ] 3.4 Implement "False Ranges" detector [deps: 1.1] [deliverable: `src/detectors/structural/false-ranges.ts`]
- [ ] 3.5 Create structural pattern aggregator [deps: 3.1-3.4] [deliverable: `src/detectors/structural/aggregator.ts`]
- [ ] 3.6 Implement structural scoring with caps [deps: 3.5] [deliverable: `src/detectors/structural/scorer.ts`]
- [ ] 3.7 Write tests for structural patterns [deps: 3.6] [deliverable: `tests/detectors/structural.test.ts`]

**Parallel Groups**:
- Group A: 3.1, 3.2, 3.3, 3.4 (all independent, can be assigned to 4 different agents)
- Group B: 3.5 (requires all of Group A)
- Group C: 3.6 (requires 3.5)
- Group D: 3.7 (requires 3.6)

---

## Phase 4: Vague Claims Detection

**Goal**: Detect vague attributions, superficial analysis, and overgeneralization patterns.

### Tasks

- [ ] 4.1 Create vague attribution phrase list [deps: 0.4] [deliverable: `src/detectors/vague/attribution-phrases.ts`]
- [ ] 4.2 Implement vague attribution detector [deps: 4.1] [deliverable: `src/detectors/vague/attribution.ts`]
- [ ] 4.3 Create superficial analysis phrase list [deps: 0.4] [deliverable: `src/detectors/vague/superficial-phrases.ts`]
- [ ] 4.4 Implement superficial analysis detector [deps: 4.3] [deliverable: `src/detectors/vague/superficial.ts`]
- [ ] 4.5 Create overgeneralization phrase list [deps: 0.4] [deliverable: `src/detectors/vague/overgeneralization-phrases.ts`]
- [ ] 4.6 Implement overgeneralization detector [deps: 4.5] [deliverable: `src/detectors/vague/overgeneralization.ts`]
- [ ] 4.7 Implement legitimate citation whitelist [deps: 0.4] [deliverable: `src/detectors/vague/legitimate-citations.ts`]
- [ ] 4.8 Create vague claims aggregator with scoring [deps: 4.2, 4.4, 4.6, 4.7] [deliverable: `src/detectors/vague/aggregator.ts`]
- [ ] 4.9 Write tests for vague claims detection [deps: 4.8] [deliverable: `tests/detectors/vague.test.ts`]

**Parallel Groups**:
- Group A: 4.1, 4.3, 4.5, 4.7 (all independent)
- Group B: 4.2, 4.4, 4.6 (requires respective phrase lists, can run in parallel)
- Group C: 4.8 (requires 4.2, 4.4, 4.6, 4.7)
- Group D: 4.9 (requires 4.8)

---

## Phase 5: Promotional Language Detection

**Goal**: Detect undue emphasis, promotional language, and elegant variation patterns.

### Tasks

- [ ] 5.1 Create superlatives and intensifiers list [deps: 0.4] [deliverable: `src/detectors/promotional/intensifiers.ts`]
- [ ] 5.2 Implement undue emphasis detector [deps: 5.1] [deliverable: `src/detectors/promotional/emphasis.ts`]
- [ ] 5.3 Create marketing phrase list [deps: 0.4] [deliverable: `src/detectors/promotional/marketing-phrases.ts`]
- [ ] 5.4 Implement promotional language detector [deps: 5.3] [deliverable: `src/detectors/promotional/promotional.ts`]
- [ ] 5.5 Implement elegant variation detector [deps: 1.1] [deliverable: `src/detectors/promotional/elegant-variation.ts`]
- [ ] 5.6 Create promotional language aggregator with scoring [deps: 5.2, 5.4, 5.5] [deliverable: `src/detectors/promotional/aggregator.ts`]
- [ ] 5.7 Write tests for promotional language detection [deps: 5.6] [deliverable: `tests/detectors/promotional.test.ts`]

**Parallel Groups**:
- Group A: 5.1, 5.3, 5.5 (all independent)
- Group B: 5.2, 5.4 (requires respective lists, can run in parallel)
- Group C: 5.6 (requires 5.2, 5.4, 5.5)
- Group D: 5.7 (requires 5.6)

---

## Phase 6: Statistical Analysis

**Goal**: Implement linguistic factor analyzers: lexical diversity, sentence length variation, passive voice, transition words, reading grade level, punctuation patterns, rare word usage.

### Tasks

- [ ] 6.1 Implement Type-Token Ratio calculator [deps: 1.1] [deliverable: `src/analyzers/lexical-diversity.ts`]
- [ ] 6.2 Implement sentence length variation analyzer [deps: 1.1] [deliverable: `src/analyzers/sentence-length.ts`]
- [ ] 6.3 Implement passive voice detector [deps: 1.1] [deliverable: `src/analyzers/passive-voice.ts`]
- [ ] 6.4 Create transition word list [deps: 0.4] [deliverable: `src/analyzers/transition-words.ts`]
- [ ] 6.5 Implement transition word density analyzer [deps: 6.4] [deliverable: `src/analyzers/transition-density.ts`]
- [ ] 6.6 Implement Flesch-Kincaid Grade Level calculator [deps: 1.1] [deliverable: `src/analyzers/flesch-kincaid.ts`]
- [ ] 6.7 Implement punctuation pattern analyzer [deps: 1.1] [deliverable: `src/analyzers/punctuation.ts`]
- [ ] 6.8 Create rare word dictionary/frequency list [deps: 0.4] [deliverable: `src/analyzers/rare-words.ts`]
- [ ] 6.9 Implement rare word usage analyzer [deps: 6.8] [deliverable: `src/analyzers/rare-word-usage.ts`]
- [ ] 6.10 Create statistical analyzer aggregator [deps: 6.1-6.9] [deliverable: `src/analyzers/aggregator.ts`]
- [ ] 6.11 Add indicator display for each factor [deps: 6.10] [deliverable: `src/analyzers/display.ts`]
- [ ] 6.12 Write tests for statistical analyzers [deps: 6.11] [deliverable: `tests/analyzers/statistical.test.ts`]

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

- [ ] 7.1 Design scoring model interface [deps: 2.4, 3.6, 4.8, 5.6, 6.10] [deliverable: `src/scoring/types.ts`]
- [ ] 7.2 Implement score aggregator [deps: 7.1] [deliverable: `src/scoring/aggregator.ts`]
- [ ] 7.3 Implement score normalizer (cap at 100) [deps: 7.2] [deliverable: `src/scoring/normalizer.ts`]
- [ ] 7.4 Implement classification system [deps: 7.3] [deliverable: `src/scoring/classifier.ts`]
- [ ] 7.5 Implement color-coded output [deps: 7.4] [deliverable: `src/scoring/display.ts`]
- [ ] 7.6 Write tests for scoring system [deps: 7.5] [deliverable: `tests/scoring/scoring.test.ts`]

**Parallel Groups**:
- Sequential: 7.1 → 7.2 → 7.3 → 7.4 → 7.5 → 7.6

---

## Phase 8: Report Generation

**Goal**: Produce comprehensive reports with all detected patterns, scores, and explanations.

### Tasks

- [ ] 8.1 Design report data structure [deps: 7.4] [deliverable: `src/report/types.ts`]
- [ ] 8.2 Implement text statistics section [deps: 1.8] [deliverable: `src/report/sections/statistics.ts`]
- [ ] 8.3 Implement linguistic factors section [deps: 6.11] [deliverable: `src/report/sections/linguistic.ts`]
- [ ] 8.4 Implement pattern detections section [deps: 2.4, 3.6, 4.8, 5.6] [deliverable: `src/report/sections/patterns.ts`]
- [ ] 8.5 Implement overall score section [deps: 7.5] [deliverable: `src/report/sections/score.ts`]
- [ ] 8.6 Create report assembler [deps: 8.1-8.5] [deliverable: `src/report/assembler.ts`]
- [ ] 8.7 Implement CLI report formatter [deps: 8.6] [deliverable: `src/report/formatters/cli.ts`]
- [ ] 8.8 Add timestamp to reports [deps: 8.7] [deliverable: `src/report/timestamp.ts`]
- [ ] 8.9 Write tests for report generation [deps: 8.8] [deliverable: `tests/report/report.test.ts`]

**Parallel Groups**:
- Group A: 8.2, 8.3, 8.4 (independent, can run in parallel)
- Group B: 8.1 (requires 7.4), 8.5 (requires 7.5) - can run in parallel with Group A
- Group C: 8.6 (requires 8.1-8.5)
- Group D: 8.7 → 8.8 → 8.9 (sequential)

---

## Phase 9: Extensions (Optional)

**Goal**: Add advanced features for enhanced user experience.

### Tasks

- [ ] 9.1 Implement text highlighting system [deps: 8.7] [deliverable: `src/extensions/highlighting.ts`]
- [ ] 9.2 Implement category badge display [deps: 9.1] [deliverable: `src/extensions/badges.ts`]
- [ ] 9.3 Implement Zipf's Law analyzer [deps: 6.1] [deliverable: `src/analyzers/zipf-law.ts`]
- [ ] 9.4 Implement named entity density analyzer [deps: 1.1] [deliverable: `src/analyzers/named-entities.ts`]
- [ ] 9.5 Implement paragraph coherence analyzer [deps: 1.1] [deliverable: `src/analyzers/coherence.ts`]
- [ ] 9.6 Add "Copy Results" functionality [deps: 8.7] [deliverable: `src/extensions/copy-results.ts`]
- [ ] 9.7 Add "Analyse Another" option [deps: 8.7] [deliverable: `src/extensions/analyse-another.ts`]
- [ ] 9.8 Create accuracy measurement suite [deps: All phases] [deliverable: `tests/accuracy/`]
- [ ] 9.9 Implement weighting configuration [deps: 7.4] [deliverable: `src/config/weights.ts`]

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