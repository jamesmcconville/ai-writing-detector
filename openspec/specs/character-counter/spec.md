# character-counter Specification

## Purpose
TBD - created by archiving change roadmap-phase-1-task-1-2. Update Purpose after archive.
## Requirements
### Requirement: Character counting function

The system SHALL provide a function to count characters in text.

#### Scenario: Count characters in normal text

- **WHEN** text "Hello world" is provided
- **THEN** the function returns 11

#### Scenario: Handle empty input

- **WHEN** empty string is provided
- **THEN** the function returns 0

#### Scenario: Handle null input

- **WHEN** null is provided
- **THEN** the function returns 0

