## ADDED Requirements

### Requirement: AI-generated samples directory

The project SHALL have a directory containing AI-generated sample texts for testing.

#### Scenario: AI-generated samples directory exists

- **WHEN** the project structure is examined
- **THEN** samples/ai-generated/ directory exists
- **AND** it contains at least 3 text files

### Requirement: Human-written samples directory

The project SHALL have a directory containing human-written sample texts for testing.

#### Scenario: Human-written samples directory exists

- **WHEN** the project structure is examined
- **THEN** samples/human-written/ directory exists
- **AND** it contains at least 3 text files

### Requirement: Sample text format

All sample texts SHALL be plain text files with meaningful content (at least 100 words).

#### Scenario: Sample texts have meaningful content

- **WHEN** a sample text file is read
- **THEN** it contains at least 100 words of text
- **AND** the content is coherent and readable

### Requirement: Diverse topics

Sample texts SHALL cover diverse topics to test detector across different writing styles.

#### Scenario: Samples cover diverse topics

- **WHEN** sample texts are examined
- **THEN** they cover at least 3 different topics
