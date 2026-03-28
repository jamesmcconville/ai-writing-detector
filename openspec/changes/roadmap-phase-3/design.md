## Context

Phase 3 implements structural pattern detection for AI-generated text. These patterns are syntactic constructions that AI models frequently use but are less common in human writing. The detectors will analyze sentence structure to identify these patterns.

## Goals / Non-Goals

**Goals:**

- Detect "rule of three" patterns (three parallel items)
- Detect negative parallelism ("not only... but also")
- Detect outline-style conclusions (formulaic endings)
- Detect false ranges ("from X to Y" with illogical endpoints)
- Score each category with documented maximum caps
- Provide match details for each detected pattern

**Non-Goals:**

- Grammar parsing (regex-based pattern matching suffices)
- Semantic understanding of parallel items
- Machine learning-based pattern detection

## Decisions

### 1. Pattern Detection Approach

**Decision:** Use regex-based pattern matching with sentence tokenization.

**Rationale:**

- Structural patterns have recognizable syntactic forms
- Regex is fast and requires no dependencies
- Sentence tokenization helps bound pattern searches

### 2. Scoring Model

**Decision:** Each pattern category has its own cap:

- Rule of Three: 10 points max (2 per match)
- Negative Parallelism: 8 points max (2 per match)
- Outline Conclusions: 10 points max (5 per match)
- False Ranges: 6 points max (2 per match)
- **Total structural max: 34 points**

**Rationale:**

- Per-category caps prevent any single pattern from dominating
- Outline conclusions are weighted higher (stronger AI signal)
- Total cap allows meaningful contribution to overall score

### 3. Rule of Three Detection

**Decision:** Detect three parallel items separated by commas with optional conjunction.

**Pattern:**

- `A, B, and C` where A, B, C are similar (adjectives, nouns, phrases)
- Use regex to detect the structure, not semantic similarity

### 4. Negative Parallelism Patterns

**Decision:** Detect common negative parallelism constructions.

**Patterns:**

- "not only... but also"
- "not just... but"
- "neither... nor"
- "either... or" (when used emphatically)

## Module Design

### Rule of Three (`src/detectors/structural/rule-of-three.ts`)

```typescript
export interface RuleOfThreeMatch {
  text: string;
  position: number;
}

export function detectRuleOfThree(text: string): RuleOfThreeMatch[];
```

### Negative Parallelism (`src/detectors/structural/negative-parallelism.ts`)

```typescript
export interface NegativeParallelismMatch {
  text: string;
  position: number;
  type: string;
}

export function detectNegativeParallelism(text: string): NegativeParallelismMatch[];
```

### Outline Conclusions (`src/detectors/structural/outline-conclusions.ts`)

```typescript
export interface OutlineConclusionMatch {
  text: string;
  position: number;
}

export function detectOutlineConclusions(text: string): OutlineConclusionMatch[];
```

### False Ranges (`src/detectors/structural/false-ranges.ts`)

```typescript
export interface FalseRangeMatch {
  text: string;
  position: number;
}

export function detectFalseRanges(text: string): FalseRangeMatch[];
```

### Aggregator (`src/detectors/structural/aggregator.ts`)

```typescript
export interface StructuralMatches {
  ruleOfThree: RuleOfThreeMatch[];
  negativeParallelism: NegativeParallelismMatch[];
  outlineConclusions: OutlineConclusionMatch[];
  falseRanges: FalseRangeMatch[];
}

export function aggregateStructuralPatterns(text: string): StructuralMatches;
```

### Scorer (`src/detectors/structural/scorer.ts`)

```typescript
export interface StructuralScoreResult {
  category: 'structural';
  subcategories: Array<{
    name: string;
    score: number;
    maxScore: number;
    matches: string[];
  }>;
  totalScore: number;
  maxScore: number;
  explanation: string;
}

export function scoreStructural(text: string): StructuralScoreResult;
```

## Risks / Trade-offs

| Risk                                                 | Mitigation                                   |
| ---------------------------------------------------- | -------------------------------------------- |
| False positives on legitimate parallelism            | Per-category caps limit impact               |
| Rule of three detection may miss variations          | Start with common patterns, expand as needed |
| Outline conclusions may match legitimate conclusions | Weight moderately, not heavily               |

## Open Questions

None - requirements are clear from REQUIREMENTS.md Step 3.
