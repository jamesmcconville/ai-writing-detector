## Purpose

Format report for CLI output with human-readable terminal display.

## Requirements

### Requirement: Format report for CLI output

The system SHALL provide a CLI formatter that produces human-readable terminal output.

#### Scenario: Use box drawing characters

- **WHEN** report is formatted for CLI
- **THEN** box drawing characters create visual structure around sections

#### Scenario: Use colors for emphasis

- **WHEN** report is formatted
- **THEN** colors highlight scores, classifications, and important values

#### Scenario: Produce complete report string

- **WHEN** formatReport is called
- **THEN** a single string containing the complete formatted report is returned
