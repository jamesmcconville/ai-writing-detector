## ADDED Requirements

### Requirement: Display shows character count

The system SHALL display the character count of the input text.

#### Scenario: Character count displayed

- **WHEN** displayStatistics is called with text
- **THEN** the output includes the character count labeled as "Characters"

### Requirement: Display shows word count

The system SHALL display the word count of the input text.

#### Scenario: Word count displayed

- **WHEN** displayStatistics is called with text
- **THEN** the output includes the word count labeled as "Words"

### Requirement: Display format is consistent

The system SHALL display statistics in a consistent, readable format.

#### Scenario: Consistent output format

- **WHEN** displayStatistics is called
- **THEN** the output follows the format:
  ```
  Text Statistics:
  Characters: <count>
  Words: <count>
  ```

### Requirement: Display uses existing statistics functions

The system SHALL use the existing `countCharacters` and `countWords` functions from `src/utils/statistics.ts`.

#### Scenario: Statistics functions are reused

- **WHEN** displayStatistics calculates statistics
- **THEN** it delegates to countCharacters and countWords from the utilities module
