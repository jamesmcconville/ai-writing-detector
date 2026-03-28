## 1. Word List

- [x] 1.1 Create AI_WORDS array with single-word vocabulary
- [x] 1.2 Create AI_PHRASES array with multi-word phrases
- [x] 1.3 Export both arrays from ai-words.ts

## 2. Scanner Implementation

- [x] 2.1 Create VocabularyMatch interface
- [x] 2.2 Implement scanForVocabulary function
- [x] 2.3 Use case-insensitive matching
- [x] 2.4 Return match positions

## 3. Phrase Detector Implementation

- [x] 3.1 Create PhraseMatch interface
- [x] 3.2 Implement detectPhrases function
- [x] 3.3 Use case-insensitive substring matching
- [x] 3.4 Return phrase positions

## 4. Scorer Implementation

- [x] 4.1 Define MAX_VOCABULARY_SCORE constant (15)
- [x] 4.2 Define POINTS_PER_TERM constant (3)
- [x] 4.3 Create VocabularyScoreResult interface
- [x] 4.4 Implement scoreVocabulary function
- [x] 4.5 Combine word and phrase matches
- [x] 4.6 Count distinct terms only
- [x] 4.7 Apply score cap

## 5. Testing

- [x] 5.1 Create tests/detectors/vocabulary.test.ts
- [x] 5.2 Test single word detection
- [x] 5.3 Test phrase detection
- [x] 5.4 Test case insensitivity
- [x] 5.5 Test scoring with distinct terms
- [x] 5.6 Test score cap enforcement
- [x] 5.7 Test empty input handling
