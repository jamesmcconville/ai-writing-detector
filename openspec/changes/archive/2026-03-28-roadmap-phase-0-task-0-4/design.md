## Context

This project needs a clear directory structure following TypeScript conventions. The structure separates concerns: detection logic, statistical analysis, utilities, and test data.

## Goals / Non-Goals

**Goals:**

- Create standard `src/` directory structure
- Organize by feature (detectors, analyzers, utils)
- Provide samples directory for test texts

**Non-Goals:**

- Creating files within directories (that's for implementation tasks)
- Configuring build outputs

## Decisions

### Feature-based organization

Detectors and analyzers in separate directories for clear separation of concerns. Each detector/analyzer gets its own subdirectory.

### Utils for shared code

Common utilities (tokenization, statistics) in `src/utils/` for reuse across detectors and analyzers.

### Samples directory structure

`samples/ai-generated/` and `samples/human-written/` for organized test data.

## Risks / Trade-offs

| Risk                          | Mitigation                                             |
| ----------------------------- | ------------------------------------------------------ |
| Structure may need adjustment | Keep directories focused, add subdirectories as needed |
