## ADDED Requirements

### Requirement: ESLint configuration exists

The project SHALL have an ESLint configuration file for TypeScript linting.

#### Scenario: ESLint config file exists

- **WHEN** the project is examined
- **THEN** .eslintrc.cjs exists at the project root
- **AND** it extends eslint:recommended

### Requirement: TypeScript ESLint parser configured

The ESLint configuration SHALL use the TypeScript ESLint parser for `.ts` files.

#### Scenario: TypeScript parser is configured

- **WHEN** .eslintrc.cjs is read
- **THEN** parser is set to "@typescript-eslint/parser"

### Requirement: Prettier configuration exists

The project SHALL have a Prettier configuration file for code formatting.

#### Scenario: Prettier config file exists

- **WHEN** the project is examined
- **THEN** .prettierrc exists at the project root

### Requirement: Consistent formatting rules

The Prettier configuration SHALL define consistent formatting rules (semicolons, quotes, trailing commas, print width).

#### Scenario: Formatting rules are defined

- **WHEN** .prettierrc is read
- **THEN** it contains semi, singleQuote, trailingComma, and printWidth settings

### Requirement: Lint script works

The npm scripts SHALL include a working lint command.

#### Scenario: Lint command runs successfully

- **WHEN** npm run lint is executed
- **THEN** the command completes without errors
