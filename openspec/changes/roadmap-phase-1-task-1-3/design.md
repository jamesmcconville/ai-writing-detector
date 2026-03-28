## Context

Word counting is built on the existing tokenizer. The `tokenizeWords` function handles splitting text into words, so `countWords` simply returns the length.

## Goals / Non-Goals

**Goals:**

- Add `countWords` function to statistics module
- Use existing tokenizer for consistency

**Non-Goals:**

- Custom tokenization logic
- Advanced word analysis
