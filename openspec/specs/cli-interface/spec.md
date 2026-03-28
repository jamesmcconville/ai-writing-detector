# cli-interface Specification

## Purpose
TBD - created by archiving change roadmap-phase-1. Update Purpose after archive.
## Requirements
### Requirement: CLI provides analyze command

The system SHALL provide an `analyze` command that accepts text input for analysis.

#### Scenario: Analyze with file path

- **WHEN** user runs `ai-writing-detector analyze <filepath>`
- **THEN** the system reads the file and displays statistics

#### Scenario: Analyze from stdin

- **WHEN** user runs `ai-writing-detector analyze --stdin` and provides text via stdin
- **THEN** the system reads from stdin and displays statistics

### Requirement: CLI shows help text

The system SHALL display usage help when invoked with `--help` flag.

#### Scenario: Display help

- **WHEN** user runs `ai-writing-detector --help`
- **THEN** the system displays available commands and options

### Requirement: CLI reports file not found error

The system SHALL display a clear error message when the specified file does not exist.

#### Scenario: File not found

- **WHEN** user runs `ai-writing-detector analyze nonexistent.txt`
- **THEN** the system displays an error message indicating the file was not found
- **AND** the system exits with a non-zero status code

### Requirement: CLI uses commander for argument parsing

The system SHALL use the `commander` npm package for parsing command-line arguments.

#### Scenario: Commander parses arguments

- **WHEN** the CLI is invoked with any combination of arguments
- **THEN** commander handles the parsing and provides structured access to arguments and options

