## Purpose

Display pattern detections section showing all detector categories with their matches.

## Requirements

### Requirement: Display pattern detections section

The system SHALL display a patterns section showing all detector categories with their matches.

#### Scenario: Show all pattern categories

- **WHEN** report is generated
- **THEN** patterns section includes vocabulary, structural, vague claims, and promotional categories

#### Scenario: Show matches for each category

- **WHEN** a pattern category has matches
- **THEN** the specific matched terms or phrases are displayed

#### Scenario: Include subcategory breakdown

- **WHEN** a category has subcategories (e.g., structural has rule-of-three, negative-parallelism)
- **THEN** each subcategory's score and count is displayed
