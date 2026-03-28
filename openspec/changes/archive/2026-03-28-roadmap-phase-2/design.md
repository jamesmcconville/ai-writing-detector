## Context

Phase 2 implements vocabulary detection for AI-generated text. This detector identifies LLM-signature words and phrases that appear with unusual frequency in AI writing. The detector integrates with the existing tokenizer and will contribute scores to the overall AI probability calculation (Phase 7).

## Goals / Non-Goals

**Goals:**

- Detect single-word AI vocabulary terms (e.g., "delve", "robust", "leverage")
- Detect multi-word AI phrases (e.g., "it is worth noting", "it's important to note")
- Score based on distinct matches with a documented maximum cap
- Provide match details (which terms found, where they appear)

**Non-Goals:**

- Context-aware vocabulary analysis (simple presence detection suffices)
- Statistical frequency analysis within the text
- Machine learning-based vocabulary detection

## Decisions

### 1. Word List Sources

**Decision:** Compile vocabulary from Wikipedia's "Signs of AI writing" article and commonly cited AI-typical terms.

**Rationale:**

- Wikipedia article provides well-documented, community-validated examples
- Commonly cited terms have been observed in real AI outputs
- List should be comprehensive but focused on high-signal terms

### 2. Case-Insensitive Matching

**Decision:** All vocabulary matching is case-insensitive.

**Rationale:**

- AI terms may appear at sentence starts (capitalized) or mid-sentence
- Case variations don't change the AI-typical nature of the term
- Simpler implementation with better recall

### 3. Scoring Model

**Decision:** Each distinct AI term contributes 3 points, capped at 15 points maximum.

**Rationale:**

- Distinct terms prevent gaming by repeating the same word
- 3 points per term provides meaningful contribution without dominating
- 15 point cap (5 distinct terms) prevents vocabulary from overwhelming other signals

### 4. Phrase vs Word Detection

**Decision:** Separate modules for single words and multi-word phrases.

**Rationale:**

- Phrases require different matching logic (word boundaries differ)
- Allows independent evolution of word and phrase lists
- Cleaner separation of concerns

## Module Design

### AI Words (`src/detectors/vocabulary/ai-words.ts`)

```typescript
// Exports:
export const AI_WORDS: readonly string[] = [...];
export const AI_PHRASES: readonly string[] = [...];
```

**Word List Categories:**

- Academic/formal: "delve", "navigate", "robust", "leverage", "ecosystem"
- Transformative: "transformative", "revolutionary", "groundbreaking"
- Analysis: "comprehensive", "holistic", "systematic", "nuanced"
- Connection: "foster", "facilitate", "enhance", "streamline"

### Scanner (`src/detectors/vocabulary/scanner.ts`)

```typescript
export interface VocabularyMatch {
  term: string;
  position: number;
}

export function scanForVocabulary(text: string): VocabularyMatch[];
```

- Tokenizes text using existing tokenizer
- Matches against AI_WORDS list
- Returns all matches with positions

### Phrase Detector (`src/detectors/vocabulary/phrase-detector.ts`)

```typescript
export interface PhraseMatch {
  phrase: string;
  position: number;
}

export function detectPhrases(text: string): PhraseMatch[];
```

- Uses case-insensitive substring matching
- Matches against AI_PHRASES list
- Returns all phrase matches with positions

### Scorer (`src/detectors/vocabulary/scorer.ts`)

```typescript
export const MAX_VOCABULARY_SCORE = 15;
export const POINTS_PER_TERM = 3;

export interface VocabularyScoreResult {
  category: 'vocabulary';
  matches: string[];
  distinctCount: number;
  score: number;
  maxScore: number;
  explanation: string;
}

export function scoreVocabulary(text: string): VocabularyScoreResult;
```

## Risks / Trade-offs

| Risk                                           | Mitigation                                       |
| ---------------------------------------------- | ------------------------------------------------ |
| False positives on legitimate academic writing | Score cap limits impact; other detectors balance |
| Word list maintenance burden                   | Centralize in one file; document sources         |
| Phrase matching may overlap with word matches  | Deduplicate in scorer; count distinct terms only |

## Open Questions

None - requirements are clear from REQUIREMENTS.md Step 2.
