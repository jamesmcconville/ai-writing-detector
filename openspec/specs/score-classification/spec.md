## Purpose

Classify the normalized score into human-readable labels with threshold boundaries.

## Requirements

### Requirement: Classify scores into categories

The system SHALL classify the normalized score into one of three categories based on threshold boundaries.

#### Scenario: Score below 30 classified as likely human

- **WHEN** normalized score is 25
- **THEN** classification is "Likely Human-Written"

#### Scenario: Score at boundary classified correctly

- **WHEN** normalized score is exactly 30
- **THEN** classification is "Possibly AI-Generated"

#### Scenario: Score 30-59 classified as possibly AI

- **WHEN** normalized score is 45
- **THEN** classification is "Possibly AI-Generated"

#### Scenario: Score 60+ classified as likely AI

- **WHEN** normalized score is 75
- **THEN** classification is "Likely AI-Generated"

### Requirement: Provide classification explanation

The system SHALL provide a brief explanation of what each classification means.

#### Scenario: Include explanation with classification

- **WHEN** classification is returned
- **THEN** result includes an explanation string describing the confidence level
