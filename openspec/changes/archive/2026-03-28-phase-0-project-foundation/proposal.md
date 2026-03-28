## Why

The repository has planning artifacts (`REQUIREMENTS.md`, `ROADMAP.md`) but does not yet define an implementation-ready OpenSpec contract for foundational setup. Capturing Phase 0 now creates a clear, bounded starting point so implementation can begin with predictable tooling, structure, and quality gates.

## What Changes

- Define a new Phase 0 capability that formalizes project foundation requirements from ROADMAP tasks 0.1–0.6.
- Specify requirements for Node/TypeScript project setup, testing framework, project directory layout, lint/format tooling, and sample text corpus preparation.
- Add a design artifact describing sequencing/dependency handling for these foundation tasks.
- Add implementation tasks aligned to Phase 0 scope only, with no Phase 1+ behavior included.

## Capabilities

### New Capabilities
- `project-foundation`: Establishes baseline repository setup and standards covering package/tooling initialization, strict TypeScript configuration, test harness setup, required directory structure, lint/format configuration, and initial sample corpora.

### Modified Capabilities
- None.

## Impact

- Affected systems: project scaffolding and developer tooling configuration.
- Expected files/components: `package.json`, `tsconfig.json`, test config/files, base `src/` + `tests/` + `samples/` structure, lint/format configs, and sample text directories.
- No API/runtime feature changes and no source implementation beyond foundation setup scope.
