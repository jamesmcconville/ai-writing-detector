# vague-claims Specification

## Purpose
TBD - created by archiving change roadmap-phase-4. Update Purpose after archive.
## Requirements
### Requirement: Detect vague attributions

The system SHALL detect phrases that appeal to unnamed sources or authorities.

#### Scenario: Detect experts agree

- **WHEN** text contains "Experts agree that this is important."
- **THEN** the detector identifies a vague attribution

#### Scenario: Detect studies show

- **WHEN** text contains "Studies show a correlation."
- **THEN** the detector identifies a vague attribution

#### Scenario: Detect research indicates

- **WHEN** text contains "Research indicates positive results."
- **THEN** the detector identifies a vague attribution

### Requirement: Detect superficial analysis

The system SHALL detect hedging and filler phrases that sound analytical but lack substance.

#### Scenario: Detect it is worth noting

- **WHEN** text contains "It is worth noting that..."
- **THEN** the detector identifies superficial analysis

#### Scenario: Detect significant developments

- **WHEN** text contains "Significant developments have occurred."
- **THEN** the detector identifies superficial analysis

### Requirement: Detect overgeneralizations

The system SHALL detect patterns that frame limited information as universal.

#### Scenario: Detect everyone knows

- **WHEN** text contains "Everyone knows this is true."
- **THEN** the detector identifies an overgeneralization

#### Scenario: Detect it is well established

- **WHEN** text contains "It is well established that..."
- **THEN** the detector identifies an overgeneralization

### Requirement: Recognize legitimate citations

The system SHALL reduce vague attribution scoring when specific citations are present.

#### Scenario: Specific year reduces vague score

- **WHEN** text contains "According to a 2024 study by Smith..."
- **THEN** the vague attribution score is reduced

#### Scenario: Author citation reduces vague score

- **WHEN** text contains "As Johnson et al. demonstrated..."
- **THEN** the vague attribution score is reduced

### Requirement: Score vague claims with caps

The system SHALL calculate scores for each category with documented maximum caps.

#### Scenario: Each category has max cap

- **WHEN** text contains many vague attribution phrases
- **THEN** the score for that category is capped at its maximum

#### Scenario: Total score is sum of subcategory scores

- **WHEN** vague claims are detected
- **THEN** the total score is the sum of all subcategory scores

### Requirement: Handle empty input

The system SHALL handle empty or whitespace-only input gracefully.

#### Scenario: Empty text returns no matches

- **WHEN** vague claims detection is called with empty string
- **THEN** the result contains no matches and a score of 0

