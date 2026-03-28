## Purpose

Define the complete report data structure that holds all analysis results.

## Requirements

### Requirement: Define complete report structure

The system SHALL provide a unified Report interface that aggregates all analysis results into a single data structure.

#### Scenario: Report contains all sections

- **WHEN** a report is generated
- **THEN** it includes statistics, linguistic factors, patterns, score, classification, and timestamp sections

### Requirement: Provide report assembler

The system SHALL provide a function that assembles all analysis results into a complete report.

#### Scenario: Assemble from text input

- **WHEN** text is provided to the assembler
- **THEN** all analyzers and detectors are invoked and results combined
