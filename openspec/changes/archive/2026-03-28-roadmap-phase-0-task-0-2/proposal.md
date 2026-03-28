## Why

TypeScript needs proper configuration to enable strict type checking, path aliases for clean imports, and correct compilation targets. Without these settings, the codebase will lack type safety and have inconsistent import paths.

## What Changes

- Create `tsconfig.json` with strict mode enabled
- Configure ES2022 target for modern JavaScript features
- Set up `@/` path alias pointing to `src/` directory
- Configure output directory (`dist/`) and root directory (`src/`)
- Enable source maps for debugging

## Capabilities

### New Capabilities

- `typescript-config`: TypeScript compiler configuration with strict mode and path aliases

### Modified Capabilities

None - this is foundational configuration.

## Impact

- Creates `tsconfig.json` at project root
- Enables strict type checking across all TypeScript files
- Allows `@/` prefixed imports instead of relative paths
- No breaking changes - this is initial configuration
