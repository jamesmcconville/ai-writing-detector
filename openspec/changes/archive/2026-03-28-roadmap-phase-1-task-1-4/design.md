## Context

The CLI is the primary user interface for the AI writing detector. It use commander for for easy command definition and help text parsing.

## Goals / Non-Goals

**Goals:**

- Create CLI with `analyze` command
- Display character and word counts
- Handle empty input gracefully
- Use commander for argument parsing

**Non-Goals:**

- Complex CLI features
- Text processing logic

## Decisions

### Commander Library

Using `commander` for argument parsing. It to use, well-documented and popular.

### Statistics Display

Use existing statistics functions for character and word counts.

## Risks / Trade-offs

| Risk                        | Mitigation                          |
| --------------------------- | ----------------------------------- |
| User provides invalid input | Show usage help and exit gracefully |
