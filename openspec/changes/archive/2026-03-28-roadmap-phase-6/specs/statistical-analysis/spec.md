## ADDED Requirements

### Requirement: Calculate Type-Token Ratio

The system SHALL calculate lexical diversity as the ratio of unique words to total words.

#### Scenario: High diversity text

- **WHEN** text has many unique words relative to total words
- **THEN** TTR is above a certain threshold

#### Scenario: Low diversity text

- **WHEN** text has few unique words relative to total words
- **THEN** TTR is below a certain threshold

### Requirement: Calculate sentence length variation

The system SHALL measure the standard deviation and coefficient of variation of sentence lengths.

#### Scenario: Uniform sentences

- **WHEN** all sentences have similar lengths
- **THEN** coefficient of variation is below 0.35

#### Scenario: Varied sentences

- **WHEN** sentences have varied lengths
- **THEN** coefficient of variation is above 0.35

### Requirement: Detect passive voice

The system SHALL identify passive voice constructions in sentences.

#### Scenario: Passive voice detected

- **WHEN** text contains "was done by the team"
- **THEN** passive voice is detected

### Requirement: Calculate transition word density

The system SHALL calculate the percentage of sentences containing formal discourse markers.

#### Scenario: High transition density

- **WHEN** more than 20% of sentences contain transition words
- **THEN** density indicates AI-like patterns

### Requirement: Calculate Flesch-Kincaid Grade Level

The system SHALL calculate readability grade level.

#### Scenario: High grade level

- **WHEN** text has high complexity
- **THEN** FK grade is above 14

### Requirement: Analyze punctuation patterns

The system SHALL analyze the density of semicolons, em-dashes, colons, and ellipses.

### Requirement: Detect rare word usage

The system SHALL identify uncommon words based on frequency threshold.

#### Scenario: High rare word usage

- **WHEN** text contains many uncommon words
- **THEN** rare word count indicates AI-like patterns

### Requirement: Handle empty input

The system SHALL handle empty or whitespace-only input gracefully.
