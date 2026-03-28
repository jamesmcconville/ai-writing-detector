## Context

Vitest is already installed and has a basic configuration. This task adds path alias support for cleaner imports in test files, mirroring the TypeScript path aliases configured in tsconfig.json.

## Goals / Non-Goals

**Goals:**

- Add path alias configuration to vitest.config.ts
- Ensure tests can use `@/` imports

**Non-Goals:**

- Adding test utilities or libraries
- Changing test file location patterns

## Decisions

### Path Alias Configuration

Use Vitest's `alias` configuration to map `@/` to `./src/`, matching the TypeScript path configuration for consistent imports.

## Risks / Trade-offs

| Risk                              | Mitigation                                |
| --------------------------------- | ----------------------------------------- |
| Path alias mismatch with tsconfig | Use same mapping pattern as tsconfig.json |
