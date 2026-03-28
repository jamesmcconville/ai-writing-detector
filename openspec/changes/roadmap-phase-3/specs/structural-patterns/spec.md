## ADDED Requirements

### Requirement: Detect rule of three patterns

The system SHALL detect sentences containing three parallel items separated by commas with a conjunction.

#### Scenario: Detect three adjectives

- **WHEN** text contains "This approach is efficient, scalable, and maintainable."
- **THEN** the detector identifies a rule of three pattern

#### Scenario: Detect three nouns

- **WHEN** text contains "The system handles users, products, and orders."
- **THEN** the detector identifies a rule of three pattern

#### Scenario: No rule of three in two items

- **WHEN** text contains "This is good and bad."
- **THEN** the detector does not identify a rule of three pattern

### Requirement: Detect negative parallelism

The system SHALL detect rigid parallel structures like "not only... but also".

#### Scenario: Detect not only but also

- **WHEN** text contains "It not only improves performance but also enhances reliability."
- **THEN** the detector identifies negative parallelism

#### Scenario: Detect not just but

- **WHEN** text contains "It's not just fast but also efficient."
- **THEN** the detector identifies negative parallelism

#### Scenario: Case insensitive detection

- **WHEN** text contains "Not Only does it work, But Also it's fast."
- **THEN** the detector still identifies the pattern

### Requirement: Detect outline-style conclusions

The system SHALL detect formulaic conclusion patterns that follow predictable structures.

#### Scenario: Detect despite challenges pattern

- **WHEN** text contains "Despite these challenges, AI offers significant opportunities."
- **THEN** the detector identifies an outline-style conclusion

#### Scenario: Detect in conclusion with pattern

- **WHEN** text contains "In conclusion, this technology provides substantial benefits."
- **THEN** the detector identifies an outline-style conclusion

### Requirement: Detect false ranges

The system SHALL detect "from X to Y" constructions where endpoints may not form a logical scale.

#### Scenario: Detect from X to Y pattern

- **WHEN** text contains "This affects everyone from students to CEOs."
- **THEN** the detector identifies a false range pattern

#### Scenario: Multiple false ranges

- **WHEN** text contains "from startups to enterprises, from beginners to experts"
- **THEN** the detector identifies both false range patterns

### Requirement: Score structural patterns with caps

The system SHALL calculate scores for each pattern category with documented maximum caps.

#### Scenario: Each category has max cap

- **WHEN** text contains many rule of three patterns
- **THEN** the score for that category is capped at its maximum

#### Scenario: Total score is sum of subcategory scores

- **WHEN** structural patterns are detected
- **THEN** the total score is the sum of all subcategory scores

### Requirement: Return match details

The system SHALL return details about which patterns were matched and where they appear.

#### Scenario: Match includes text and position

- **WHEN** structural patterns are detected
- **THEN** each match includes the matched text and its position

### Requirement: Handle empty input

The system SHALL handle empty or whitespace-only input gracefully.

#### Scenario: Empty text returns no matches

- **WHEN** structural detection is called with empty string
- **THEN** the result contains no matches and a score of 0
