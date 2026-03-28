## Why

AI-generated text has measurable statistical differences from human writing across several linguistic dimensions. This phase implements statistical analyzers that calculate metrics like Type-Token Ratio (lexical diversity), sentence length variation, passive voice frequency, transition word density
Flesch-Kincaid Grade Level
punctuation patterns
and rare word usage.

## What Changes

- **Type-Token Ratio**: Calculate lexical diversity (unique words / total words)
- **Sentence Length Variation**: Measure standard deviation and coefficient of variation of sentence lengths
- **Passive Voice Detector**: Identify passive voice constructions and- **Transition Word Density**: Detect formal discourse markers
- **Flesch-Kincaid Grade Level**: Calculate readability grade level
- **Punctuation Patterns**: Analyze punctuation usage (semicolons, em-dashes, colons)
- **Rare Word Usage**: Identify uncommon words frequency
- **Statistical Aggregator**: Combine all analyzer results
- **Indicator Display**: Display each factor with labeled percentage and explanation

## Capabilities

### New Capabilities

- `statistical-analysis`: Calculate linguistic metrics (lexical diversity, sentence length variation, passive voice frequency, transition word density, reading grade level, punctuation patterns, rare word usage) with threshold-based indicators

## Impact

**Files Created:**

- `src/analyzers/lexical-diversity.ts` - Type-Token Ratio
- `src/analyzers/sentence-length.ts` - Sentence length variation
- `src/analyzers/passive-voice.ts` - Passive voice detection
- `src/analyzers/transition-words.ts` - Transition word list
- `src/analyzers/transition-density.ts` - Transition word density
- `src/analyzers/flesch-kincaid.ts` - Flesch-Kincaid Grade Level
- `src/analyzers/punctuation.ts` - Punctuation analysis
- `src/analyzers/rare-words.ts` - Rare word dictionary
- `src/analyzers/rare-word-usage.ts` - Rare word usage analyzer
- `src/analyzers/aggregator.ts` - Statistical aggregator
- `src/analyzers/display.ts` - Indicator display
- `tests/analyzers/statistical.test.ts` - Tests
