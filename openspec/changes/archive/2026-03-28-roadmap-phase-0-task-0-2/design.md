## Context

TypeScript needs compiler configuration to enable strict type checking, modern JavaScript output, and path aliases for clean imports. This configuration will be used by all TypeScript files in the project.

## Goals / Non-Goals

**Goals:**

- Enable strict type checking for maximum type safety
- Configure ES2022 target for modern JavaScript features
- Set up `@/` path alias for clean imports
- Configure source maps for debugging
- Set proper include/exclude patterns

**Non-Goals:**

- Build tooling configuration (handled separately if needed)
- Runtime configuration

## Decisions

### Strict Mode Enabled

All strict options enabled (`strict: true`) for maximum type safety. This catches more bugs at compile time.

### ES2022 Target

Modern target supports top-level await, class fields, and other modern features while maintaining good Node.js compatibility.

### Node Module Resolution

Using `NodeNext` for proper ESM module resolution since package.json has `"type": "module"`.

### Path Aliases

`@/*` maps to `./src/*` for clean imports throughout the codebase.

## Risks / Trade-offs

| Risk                                        | Mitigation                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Strict mode may reveal existing type issues | Fix issues incrementally, use temporary `// @ts-expect-error` if needed |
