## Context

Phase 6 implements statistical analysis for AI-generated text. These analyzers measure linguistic properties that differ between AI and human writing across multiple dimensions.

## Goals / Non-Goals

**Goals:**

- Implement Type-Token Ratio (lexical diversity) calculator
- Implement sentence length variation analyzer
- Implement passive voice detector
- Implement transition word density analyzer
- Implement Flesch-Kincaid Grade Level calculator
- Implement punctuation pattern analyzer
- Implement rare word usage analyzer
- Create aggregator to combine all analyzer results
- Add indicator display for each factor

**Non-Goals:**

- Advanced NLP-based analysis
- Machine learning-based linguistic models
- Sentiment analysis

## Decisions

### 1. Scoring Model

**Decision:** Each analyzer provides a score contribution and indicator value.

**Analyzers:**

- Type-Token Ratio: 0-100 (percentage)
- Sentence Length Variation: coefficient of variation (0-2)
- Passive Voice: percentage of sentences (0-100)
- Transition Word Density: percentage of sentences (0-100)
- Flesch-Kincaid: grade level (number)
- Punctuation Patterns: density score
- Rare Word Usage: percentage of total words (0-100)

### 2. Thresholds

**Decision:** Define AI-typical thresholds for each metric:

- TTR outside normal range (0.4-0.6 or or 0.8): possible AI
- Sentence length CV < 0.35: AI signal
- Passive voice > 15%: AI signal
- Transition density > 20%: AI signal
- FK Grade > 14: AI signal

- Rare word > 12%: AI signal

### 3. Rare Word Detection

**Decision:** Use a frequency list of common English words and mark words as "rare" if they appear below a certain frequency threshold.

## Module Design

- All analyzers follow a consistent pattern: accept text, return { metric name, value, raw score, max score
  explanation
  indicator (AI/Likely Human/Mixed)
  thresholds

- Aggregator combines all results into unified interface

## Risks / Trade-offs

| Risk                                     | Mitigation                         |
| ---------------------------------------- | ---------------------------------- |
| Short texts may yield unreliable metrics | Document minimum text length       |
| Edge cases in tokenization               | Handle gracefully in each analyzer |
