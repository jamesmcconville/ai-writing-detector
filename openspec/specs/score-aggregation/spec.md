## Purpose

Aggregate all detector scores into a unified 0-100 probability score with transparent contribution tracking.

## Requirements

### Requirement: Aggregate all detector scores

The system SHALL combine scores from all detector categories (vocabulary, structural, vague claims, promotional) and statistical analyzers into a single unified score.

#### Scenario: Aggregate scores from all categories

- **WHEN** text is analyzed by all detectors
- **THEN** system produces a unified score combining vocabulary, structural, vague claims, promotional, and statistical contributions

#### Scenario: Handle empty text gracefully

- **WHEN** empty or whitespace-only text is provided
- **THEN** system returns a total score of 0 with empty contributions

### Requirement: Track individual score contributions

The system SHALL maintain a breakdown of each category's contribution to the total score for transparency.

#### Scenario: Include contribution breakdown

- **WHEN** scores are aggregated
- **THEN** result includes each category's score, maxScore, and explanation

### Requirement: Normalize scores to 0-100 range

The system SHALL normalize raw scores proportionally when they exceed 100 to ensure the final score is always between 0 and 100.

#### Scenario: Score below 100 remains unchanged

- **WHEN** raw total score is 80
- **THEN** normalized score is 80

#### Scenario: Score above 100 is scaled proportionally

- **WHEN** raw total score is 121 (maximum possible)
- **THEN** normalized score is 100
