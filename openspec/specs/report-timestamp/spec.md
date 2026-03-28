## Purpose

Include timestamp indicating when the analysis was performed.

## Requirements

### Requirement: Include timestamp in reports

The system SHALL include a timestamp indicating when the analysis was performed.

#### Scenario: Generate ISO 8601 timestamp

- **WHEN** report is generated
- **THEN** timestamp is in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

#### Scenario: Display timestamp in report

- **WHEN** report is displayed
- **THEN** timestamp appears in header or footer section
