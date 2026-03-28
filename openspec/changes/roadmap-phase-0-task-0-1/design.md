## Context

This is a greenfield TypeScript/NodeJS project for detecting AI-generated writing. The project requires a proper NodeJS setup with TypeScript compilation, testing infrastructure, and code quality tooling. No prior package.json exists.

## Goals / Non-Goals

**Goals:**

- Establish `package.json` with proper project metadata
- Configure TypeScript as the primary development language
- Set up Vitest as the testing framework
- Add ESLint and Prettier for code quality and formatting
- Define npm scripts for common development tasks

**Non-Goals:**

- TypeScript configuration (tsconfig.json) - covered by task 0.2
- Project structure creation - covered by task 0.3
- Git setup - covered by task 0.4

## Decisions

### TypeScript 5.x

Selected for strict type checking, modern ECMAScript features, and excellent IDE support. Using latest stable version for best DX.

### Vitest over Jest

Vitest is faster, has native TypeScript support without additional configuration, and provides better watch mode performance. Compatible with Jest API for easy migration if needed.

### ESLint + Prettier

ESLint for code quality (catching bugs, enforcing patterns), Prettier for formatting (opinionated, zero-config). Using eslint-config-prettier to avoid conflicts.

### Path Aliases

Will configure `@/` alias pointing to `src/` for clean imports. Requires TypeScript and build tool configuration (handled in subsequent tasks).

## Risks / Trade-offs

| Risk                         | Mitigation                        |
| ---------------------------- | --------------------------------- |
| Dependency version conflicts | Pin exact versions, use lockfile  |
| Breaking changes in future   | Review changelogs before upgrades |
