## Context

Statistics functions provide numeric analysis of text. Character counting is the most basic statistic, counting the raw character count including whitespace and punctuation.

## Goals / Non-Goals

**Goals:**

- Create `countCharacters` function in `src/utils/statistics.ts`
- Handle empty and null input

**Non-Goals:**

- Word counting (separate task)
- Sentence analysis

## Decisions

### Direct Length Property

Use the `length` property of strings for O(1) character count.

## Risks / Trade-offs

| Risk       | Mitigation                      |
| ---------- | ------------------------------- |
| Null input | Explicit null check returning 0 |
