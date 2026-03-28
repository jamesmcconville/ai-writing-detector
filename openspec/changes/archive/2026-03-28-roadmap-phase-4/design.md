## Context

Phase 4 implements vague claims detection for AI-generated text. These are patterns where text makes claims without concrete evidence, using vague attributions, superficial analysis, and overgeneralizations. This detector helps identify text that sounds authoritative but lacks specificity.

## Goals / Non-Goals

**Goals:**

- Detect vague attributions ("experts agree", "studies show")
- Detect superficial analysis ("it is worth noting", "significant developments")
- Detect overgeneralizations ("everyone knows", "it is well established")
- Recognize legitimate citations to avoid false positives
- Score each category with documented maximum caps

**Non-Goals:**

- Verify factual accuracy of claims
- Distinguish between different types of vague claims semantically
- Machine learning-based credibility assessment

## Decisions

### 1. Pattern Detection Approach

**Decision:** Use regex-based phrase matching with case-insensitivity.

**Rationale:**

- Vague claims have recognizable phrase patterns
- Fast and requires no dependencies
- Easy to extend with new phrases

### 2. Scoring Model

**Decision:** Each category has its own cap:

- Vague Attributions: 12 points max (3 per match)
- Superficial Analysis: 10 points max (2 per match)
- Overgeneralizations: 8 points max (2 per match)
- **Total vague claims max: 30 points**

**Rationale:**

- Per-category caps prevent any single pattern from dominating
- Vague attributions weighted higher (stronger AI signal)
- Total cap allows meaningful contribution to overall score

### 3. Legitimate Citation Recognition

**Decision:** Reduce vague attribution score when specific citations are present.

**Patterns that indicate legitimate citations:**

- Specific years: "According to a 2024 study..."
- Author names: "According to Smith et al..."
- Journal names: "published in Nature..."
- URLs: "https://..."

**Rationale:**

- Avoid penalizing text with proper citations
- Distinguishes between vague and specific claims

## Module Design

### Attribution Phrases (`src/detectors/vague/attribution-phrases.ts`)

```typescript
export const VAGUE_ATTRIBUTION_PHRASES: readonly string[] = [
  'experts agree',
  'studies show',
  'research indicates',
  // ...
];
```

### Superficial Phrases (`src/detectors/vague/superficial-phrases.ts`)

```typescript
export const SUPERFICIAL_PHRASES: readonly string[] = [
  'it is worth noting',
  'significant developments',
  'one could argue',
  // ...
];
```

### Overgeneralization Phrases (`src/detectors/vague/overgeneralization-phrases.ts`)

```typescript
export const OVERGENERALIZATION_PHRASES: readonly string[] = [
  'everyone knows',
  'it is well established',
  'universal consensus',
  // ...
];
```

### Legitimate Citations (`src/detectors/vague/legitimate-citations.ts`)

```typescript
export function hasLegitimateCitation(text: string): boolean;
export function countLegitimateCitations(text: string): number;
```

### Aggregator (`src/detectors/vague/aggregator.ts`)

```typescript
export interface VagueClaimsMatches {
  vagueAttributions: Match[];
  superficialAnalysis: Match[];
  overgeneralizations: Match[];
  legitimateCitations: number;
}

export function aggregateVagueClaims(text: string): VagueClaimsMatches;
```

### Scorer (`src/detectors/vague/scorer.ts`)

```typescript
export interface VagueClaimsScoreResult {
  category: 'vague-claims';
  subcategories: Subcategory[];
  totalScore: number;
  maxScore: number;
  explanation: string;
}

export function scoreVagueClaims(text: string): VagueClaimsScoreResult;
```

## Risks / Trade-offs

| Risk                                           | Mitigation                                  |
| ---------------------------------------------- | ------------------------------------------- |
| False positives on legitimate academic writing | Legitimate citation detection reduces score |
| Phrase lists require maintenance               | Centralize in one file per category         |
| Overgeneralization may match common phrases    | Keep list focused on high-signal patterns   |

## Open Questions

None - requirements are clear from REQUIREMENTS.md Step 4.
