## 1. Rule of Three Detector

- [x] 1.1 Create RuleOfThreeMatch interface
- [x] 1.2 Implement detectRuleOfThree function
- [x] 1.3 Use regex to match "A, B, and C" patterns
- [x] 1.4 Return match positions

## 2. Negative Parallelism Detector

- [x] 2.1 Create NegativeParallelismMatch interface
- [x] 2.2 Implement detectNegativeParallelism function
- [x] 2.3 Detect "not only... but also" patterns
- [x] 2.4 Detect "not just... but" patterns
- [x] 2.5 Use case-insensitive matching

## 3. Outline Conclusions Detector

- [x] 3.1 Create OutlineConclusionMatch interface
- [x] 3.2 Implement detectOutlineConclusions function
- [x] 3.3 Detect "Despite... offers" patterns
- [x] 3.4 Detect "In conclusion" patterns
- [x] 3.5 Detect "In summary" patterns

## 4. False Ranges Detector

- [x] 4.1 Create FalseRangeMatch interface
- [x] 4.2 Implement detectFalseRanges function
- [x] 4.3 Detect "from X to Y" patterns
- [x] 4.4 Return all matches

## 5. Aggregator

- [x] 5.1 Create StructuralMatches interface
- [x] 5.2 Implement aggregateStructuralPatterns function
- [x] 5.3 Combine all detector results

## 6. Scorer

- [x] 6.1 Define scoring caps per category
- [x] 6.2 Create StructuralScoreResult interface
- [x] 6.3 Implement scoreStructural function
- [x] 6.4 Calculate per-category scores with caps
- [x] 6.5 Calculate total score

## 7. Testing

- [x] 7.1 Create tests/detectors/structural.test.ts
- [x] 7.2 Test rule of three detection
- [x] 7.3 Test negative parallelism detection
- [x] 7.4 Test outline conclusions detection
- [x] 7.5 Test false ranges detection
- [x] 7.6 Test scoring with caps
- [x] 7.7 Test empty input handling
