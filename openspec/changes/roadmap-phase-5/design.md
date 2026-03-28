## Context

Phase 5 implements promotional language detection for AI-generated text. AI writing tends to oversell using superlatives, marketing-style phrasing, and elegant variation (cycling through synonyms rather than repeating words naturally).

## Goals / Non-Goals

**Goals:**

- Detect undue emphasis (excessive superlatives, intensifiers)
- Detect marketing-style promotional language
- Detect elegant variation (synonym cycling)
- Score each category with documented maximum caps

**Non-Goals:**

- Sentiment analysis
- Brand mention detection
- Product feature extraction

## Decisions

### 1. Scoring Model

**Decision:** Each category has its own cap:

- Undue Emphasis: 10 points max (2 per match)
- Marketing Phrases: 12 points max (3 per match)
- Elegant Variation: 8 points max (4 per variation group)
- **Total promotional max: 30 points**

### 2. Elegant Variation Detection

**Decision:** Track synonym groups across sentences and detect when the same entity is referred to by different but equivalent terms.

**Synonym Groups:**

- Organization terms: company, organization, firm, enterprise, business, corporation
- People terms: individual, person, user, customer, client
- Analysis terms: study, research, analysis, investigation, examination

### 3. Pattern Detection Approach

**Decision:** Use regex-based phrase matching with case-insensitivity for all detectors except elegant variation, which requires token-level analysis.

## Module Design

### Intensifiers (`src/detectors/promotional/intensifiers.ts`)

Lists of superlatives and intensifier words.

### Marketing Phrases (`src/detectors/promotional/marketing-phrases.ts`)

Lists of promotional/marketing phrases.

### Emphasis Detector (`src/detectors/promotional/emphasis.ts`)

Detects excessive use of superlatives and intensifiers.

### Promotional Detector (`src/detectors/promotional/promotional.ts`)

Detects marketing-style language.

### Elegant Variation (`src/detectors/promotional/elegant-variation.ts`)

Detects synonym cycling for the same entity.

### Aggregator (`src/detectors/promotional/aggregator.ts`)

Combines all detector results.

### Scorer (`src/detectors/promotional/scorer.ts`)

Scores promotional patterns with caps.

## Risks / Trade-offs

| Risk                                         | Mitigation                                         |
| -------------------------------------------- | -------------------------------------------------- |
| False positives on legitimate marketing copy | Expected - marketing copy IS promotional by nature |
| Elegant variation detection may miss groups  | Start with common synonym groups                   |
| Intensifier list requires maintenance        | Centralize in one file                             |

## Open Questions

None - requirements are clear from REQUIREMENTS.md Step 5.
