## ADDED Requirements

### Requirement: File input handler reads text files

The system SHALL provide a file input handler that reads the contents of a text file.

#### Scenario: Read existing file

- **WHEN** readFileInput is called with a valid file path
- **THEN** the function returns the file contents as a string

#### Scenario: File not found error

- **WHEN** readFileInput is called with a non-existent file path
- **THEN** the function throws an error with message indicating file not found

#### Scenario: Permission denied error

- **WHEN** readFileInput is called with a file path that cannot be read due to permissions
- **THEN** the function throws an error indicating permission denied

### Requirement: Stdin input handler reads from standard input

The system SHALL provide a stdin input handler that reads text from standard input.

#### Scenario: Read from stdin

- **WHEN** readStdinInput is called and stdin contains text
- **THEN** the function returns the stdin contents as a string

#### Scenario: Empty stdin

- **WHEN** readStdinInput is called and stdin is empty
- **THEN** the function returns an empty string

#### Scenario: Piped input

- **WHEN** text is piped to the CLI via stdin
- **THEN** readStdinInput captures all the piped text
