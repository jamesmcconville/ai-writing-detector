## Purpose

Display linguistic factors section showing each analyzer's result with value and interpretation.

## Requirements

### Requirement: Display linguistic factors section

The system SHALL display a linguistic factors section showing each analyzer's result with value and interpretation.

#### Scenario: Show all linguistic factors

- **WHEN** report is generated
- **THEN** linguistic section includes TTR, sentence length variation, passive voice, transition density, reading level, punctuation, and rare words

#### Scenario: Include interpretation for each factor

- **WHEN** linguistic factors are displayed
- **THEN** each factor includes both the numeric value and human-readable interpretation

#### Scenario: Flag AI signals

- **WHEN** a linguistic factor exceeds AI thresholds
- **THEN** the factor is marked as an AI signal
