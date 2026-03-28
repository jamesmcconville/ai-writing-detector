## Why

Code quality tools ensure consistent code style across the project. ESLint catches bugs and enforces patterns, while Prettier handles formatting automatically.

## What Changes

- ESLint configuration with TypeScript support
- Prettier configuration for consistent formatting
- Integration between ESLint and Prettier to avoid conflicts

## Capabilities

### New Capabilities

- `code-quality`: ESLint and Prettier configuration for TypeScript code quality

### Modified Capabilities

None - this is foundational configuration.

## Impact

- Creates `.eslintrc.cjs` (already exists, may need updates)
- Creates `.prettierrc` (already exists)
- Enables `npm run lint` and `npm run format` commands
- No breaking changes
