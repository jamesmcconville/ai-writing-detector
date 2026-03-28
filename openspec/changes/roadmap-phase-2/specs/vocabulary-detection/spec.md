## ADDED Requirements

### Requirement: Detect AI vocabulary words

The system SHALL detect single-word AI vocabulary terms in text using case-insensitive matching.

#### Scenario: Detect single AI word

- **WHEN** text contains "delve" or "Delve" or "DELVE"
- **THEN** the scanner identifies the term as an AI vocabulary match

#### Scenario: Detect multiple AI words

- **WHEN** text contains "delve", "robust", and "leverage"
- **THEN** the scanner identifies all three terms as AI vocabulary matches

#### Scenario: No AI words present

- **WHEN** text contains no AI vocabulary terms
- **THEN** the scanner returns an empty list of matches

### Requirement: Detect AI phrases

The system SHALL detect multi-word AI phrases in text using case-insensitive matching.

#### Scenario: Detect AI phrase

- **WHEN** text contains "it is worth noting"
- **THEN** the phrase detector identifies it as an AI phrase match

#### Scenario: Detect phrase with case variation

- **WHEN** text contains "It Is Worth Noting" or "IT IS WORTH NOTING"
- **THEN** the phrase detector still identifies it as a match

#### Scenario: No AI phrases present

- **WHEN** text contains no AI phrases
- **THEN** the phrase detector returns an empty list of matches

### Requirement: Score vocabulary matches

The system SHALL calculate a score based on distinct AI vocabulary matches with a documented maximum cap.

#### Scenario: Score increases with distinct terms

- **WHEN** text contains 3 distinct AI vocabulary terms
- **THEN** the score is 3 times the points per term

#### Scenario: Score caps at maximum

- **WHEN** text contains 10 distinct AI vocabulary terms
- **THEN** the score is capped at MAX_VOCABULARY_SCORE

#### Scenario: Repeated terms count once

- **WHEN** text contains "delve" 5 times and "robust" 3 times
- **THEN** only 2 distinct terms are counted

### Requirement: Return match details

The system SHALL return details about which terms were matched and where they appear.

#### Scenario: Match includes term and position

- **WHEN** vocabulary scanning finds matches
- **THEN** each match includes the term and its position in the text

### Requirement: Handle empty input

The system SHALL handle empty or whitespace-only input gracefully.

#### Scenario: Empty text returns no matches

- **WHEN** vocabulary scanning is called with empty string
- **THEN** the result contains no matches and a score of 0
