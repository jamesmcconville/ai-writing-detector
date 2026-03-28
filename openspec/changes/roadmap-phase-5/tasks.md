## 1. Phrase Lists

- [ ] 1.1 Create INTENSIFIERS array
- [ ] 1.2 Create SUPERLATIVES array
- [ ] 1.3 Create MARKETING_PHRASES array
- [ ] 1.4 Export all phrase arrays

## 2. Emphasis Detector

- [ ] 2.1 Create EmphasisMatch interface
- [ ] 2.2 Implement detectUndueEmphasis function
- [ ] 2.3 Use case-insensitive matching
- [ ] 2.4 Return match positions

## 3. Promotional Detector

- [ ] 3.1 Create PromotionalMatch interface
- [ ] 3.2 Implement detectPromotionalLanguage function
- [ ] 3.3 Detect marketing-style phrases
- [ ] 3.4 Return match positions

## 4. Elegant Variation Detector

- [ ] 4.1 Create synonym groups
- [ ] 4.2 Create ElegantVariationMatch interface
- [ ] 4.3 Implement detectElegantVariation function
- [ ] 4.4 Track synonym usage across sentences
- [ ] 4.5 Return variation groups

## 5. Aggregator

- [ ] 5.1 Create PromotionalMatches interface
- [ ] 5.2 Implement aggregatePromotionalPatterns function
- [ ] 5.3 Combine all detector results

## 6. Scorer

- [ ] 6.1 Define scoring caps per category
- [ ] 6.2 Create PromotionalScoreResult interface
- [ ] 6.3 Implement scorePromotional function
- [ ] 6.4 Calculate total score with caps

## 7. Testing

- [ ] 7.1 Create tests/detectors/promotional.test.ts
- [ ] 7.2 Test emphasis detection
- [ ] 7.3 Test promotional language detection
- [ ] 7.4 Test elegant variation detection
- [ ] 7.5 Test scoring with caps
- [ ] 7.6 Test empty input handling
