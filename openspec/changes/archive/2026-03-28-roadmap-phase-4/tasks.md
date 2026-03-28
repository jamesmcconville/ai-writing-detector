## 1. Phrase Lists

- [x] 1.1 Create VAGUE_ATTRIBUTION_PHRASES array
- [x] 1.2 Create SUPERFICIAL_PHRASES array
- [x] 1.3 Create OVERGENERALIZATION_PHRASES array
- [x] 1.4 Export all phrase arrays

## 2. Attribution Detector

- [x] 2.1 Create VagueAttributionMatch interface
- [x] 2.2 Implement detectVagueAttribution function
- [x] 2.3 Use case-insensitive matching
- [x] 2.4 Return match positions

## 3. Superficial Analysis Detector

- [x] 3.1 Create SuperficialMatch interface
- [x] 3.2 Implement detectSuperficialAnalysis function
- [x] 3.3 Detect hedging and filler phrases
- [x] 3.4 Return match positions

## 4. Overgeneralization Detector

- [x] 4.1 Create OvergeneralizationMatch interface
- [x] 4.2 Implement detectOvergeneralization function
- [x] 4.3 Detect universal framing patterns
- [x] 4.4 Return match positions

## 5. Legitimate Citations

- [x] 5.1 Create citation recognition patterns
- [x] 5.2 Implement hasLegitimateCitation function
- [x] 5.3 Implement countLegitimateCitations function
- [x] 5.4 Detect specific years, authors, journals

## 6. Aggregator

- [x] 6.1 Create VagueClaimsMatches interface
- [x] 6.2 Implement aggregateVagueClaims function
- [x] 6.3 Combine all detector results
- [x] 6.4 Count legitimate citations

## 7. Scorer

- [x] 7.1 Define scoring caps per category
- [x] 7.2 Create VagueClaimsScoreResult interface
- [x] 7.3 Implement scoreVagueClaims function
- [x] 7.4 Reduce score for legitimate citations
- [x] 7.5 Calculate total score with caps

## 8. Testing

- [x] 8.1 Create tests/detectors/vague.test.ts
- [x] 8.2 Test vague attribution detection
- [x] 8.3 Test superficial analysis detection
- [x] 8.4 Test overgeneralization detection
- [x] 8.5 Test legitimate citation recognition
- [x] 8.6 Test scoring with caps
- [x] 8.7 Test empty input handling
