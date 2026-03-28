## ADDED Requirements

### Requirement: CLI analyze command

The CLI SHALL provide an `analyze` command for analyzing text files.

#### Scenario: Analyze text file

- **WHEN** text file `test.txt` is provided as command argument
- **THEN** the program reads and file and displays character count and word count

#### Scenario: Analyze text from stdin

- **WHEN** text is piped through stdin
- **THEN** the program reads text and displays statistics
- **AND** prevents analysis if text is empty

#### Scenario: Display help message for empty input

- **WHEN** an empty file is provided
- **THEN** the program displays a helpful error message and exits gracefully

#### Scenario: Show usage with --help flag

- **WHEN** `--help` or `--stdin` is provided as arguments
- **THEN** the program displays usage information

### Requirement: Argument parsing

The CLI SHALL support `--file`, `--stdin`, and `--output` options.

#### Scenario: File input option

- **WHEN** `--file path/to/file.txt` is provided
- **THEN** the program reads and analyzes the at that path

#### Scenario: Output format option

- **WHEN** `--output json` or `--output pretty` is provided
- **THEN** the program uses the appropriate format

#### Scenario: Output file option

- **WHEN** `--output file` flag is provided
- **THEN** the program writes output to a specified file instead of stdout

### Requirement: Character and word count display

The CLI SHALL display character count and word count after analysis.

#### Scenario: Character count display

- **WHEN** text is analyzed
- **THEN** the program displays the character count

#### Scenario: Word count display

- **WHEN** text is analyzed
- **THEN** the program displays the word count
