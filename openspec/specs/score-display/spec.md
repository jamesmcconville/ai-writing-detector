## Purpose

Display the final score using color-coded output based on the classification.

## Requirements

### Requirement: Display score with color coding

The system SHALL display the final score using color-coded output based on the classification.

#### Scenario: Green color for likely human

- **WHEN** score is below 30
- **THEN** score is displayed in green

#### Scenario: Yellow color for possibly AI

- **WHEN** score is between 30 and 59 (inclusive)
- **THEN** score is displayed in yellow

#### Scenario: Red color for likely AI

- **WHEN** score is 60 or above
- **THEN** score is displayed in red

### Requirement: Display contribution breakdown

The system SHALL display each category's contribution with its score and explanation.

#### Scenario: Show all contributions

- **WHEN** score breakdown is displayed
- **THEN** each category shows: name, score/maxScore, and explanation
