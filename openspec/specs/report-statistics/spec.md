## Purpose

Display text statistics section with character count, word count, sentence count, and averages.

## Requirements

### Requirement: Display text statistics section

The system SHALL display a statistics section with character count, word count, sentence count, and averages.

#### Scenario: Show basic counts

- **WHEN** report is generated for text
- **THEN** statistics section shows character count, word count, and sentence count

#### Scenario: Show calculated averages

- **WHEN** report is generated
- **THEN** statistics section includes average word length and average sentence length
