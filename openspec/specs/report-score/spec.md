## Purpose

Display overall score section with the normalized score, classification, and contribution breakdown.

## Requirements

### Requirement: Display overall score section

The system SHALL display an overall score section with the normalized score, classification, and contribution breakdown.

#### Scenario: Show score and classification

- **WHEN** report is generated
- **THEN** score section shows the 0-100 score with classification label

#### Scenario: Show contribution breakdown

- **WHEN** score section is displayed
- **THEN** each category's contribution (score/maxScore) is shown

#### Scenario: Color code by classification

- **WHEN** score is displayed
- **THEN** green color for Likely Human, yellow for Possibly AI, red for Likely AI
