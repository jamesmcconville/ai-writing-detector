## Why

This project needs a properly configured NodeJS environment with TypeScript support and testing infrastructure before any implementation work can begin. Without these foundational dependencies, we cannot write type-safe code or verify correctness through automated tests.

## What Changes

- Create `package.json` with project metadata and scripts
- Add TypeScript as a development dependency
- Add Vitest as the testing framework
- Add ESLint and Prettier for code quality
- Configure npm scripts for build, test, lint, and format operations

## Capabilities

### New Capabilities

- `project-setup`: Establishes the NodeJS project structure with TypeScript compilation, testing framework, and linting tools

### Modified Capabilities

None - this is the initial project setup.

## Impact

- Creates `package.json` at the project root
- Establishes the dependency foundation for all future development
- Enables `npm install`, `npm run build`, `npm test`, `npm run lint` commands
- No breaking changes - this is greenfield setup
