# word-counter Specification

## Purpose
TBD - created by archiving change roadmap-phase-1-task-1-3. Update Purpose after archive.
## Requirements
### Requirement: Word counting function

The system SHALL provide a function to count words in text.

#### Scenario: Count words in simple text

- **WHEN** text "Hello world" is provided
- **THEN** the function returns 2

#### Scenario: Count words with punctuation

- **WHEN** text "Hello, world! How are you?" is provided
- **THEN** the function returns 4

#### Scenario: Handle empty input

- **WHEN** empty string is provided
- **THEN** the function returns 0

#### Scenario: Handle null input

- **WHEN** null is provided
- **THEN** the function returns 0

