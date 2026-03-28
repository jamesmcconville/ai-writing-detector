## ADDED Requirements

### Requirement: Word tokenization

The system SHALL provide a function to tokenize text into individual words.

#### Scenario: Tokenize simple text

- **WHEN** text "Hello world" is provided
- **THEN** the function returns ["Hello", "world"]

#### Scenario: Handle punctuation

- **WHEN** text "Hello, world! How are you?" is provided
- **THEN** the function returns ["Hello", "world", "How", "are", "you"]

#### Scenario: Handle empty input

- **WHEN** empty string is provided
- **THEN** the function returns an empty array

### Requirement: Sentence tokenization

The system SHALL provide a function to split text into sentences.

#### Scenario: Split simple sentences

- **WHEN** text "Hello world. How are you?" is provided
- **THEN** the function returns ["Hello world.", "How are you?"]

#### Scenario: Handle single sentence

- **WHEN** text "Just one sentence." is provided
- **THEN** the function returns ["Just one sentence."]

#### Scenario: Handle empty input

- **WHEN** empty string is provided
- **THEN** the function returns an empty array

### Requirement: Character counting

The system SHALL provide a function to count characters in text.

#### Scenario: Count characters

- **WHEN** text "Hello world" is provided
- **THEN** the function returns 11

#### Scenario: Handle empty input

- **WHEN** empty string is provided
- **THEN** the function returns 0
