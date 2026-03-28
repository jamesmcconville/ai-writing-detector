## 1. Setup

- [x] 1.1 Add commander dependency to package.json
- [x] 1.2 Create src/input/ directory structure
- [x] 1.3 Create src/output/ directory

## 2. Input Handling

- [x] 2.1 Implement readFileInput in src/input/file.ts
- [x] 2.2 Implement readStdinInput in src/input/stdin.ts
- [x] 2.3 Create EmptyInputError class in src/input/validator.ts
- [x] 2.4 Implement validateInput in src/input/validator.ts

## 3. Output Display

- [x] 3.1 Implement displayStatistics in src/output/display.ts
- [x] 3.2 Add "Text Statistics:" header to output

## 4. CLI Entry Point

- [x] 4.1 Create src/cli.ts with commander setup
- [x] 4.2 Add analyze command with file argument
- [x] 4.3 Add --stdin option to analyze command
- [x] 4.4 Wire up input handlers to CLI command
- [x] 4.5 Wire up validation and display to CLI command
- [x] 4.6 Add error handling for file not found

## 5. Testing

- [x] 5.1 Create tests/phase1.test.ts
- [x] 5.2 Add tests for readFileInput
- [x] 5.3 Add tests for readStdinInput
- [x] 5.4 Add tests for validateInput (empty and whitespace cases)
- [x] 5.5 Add tests for displayStatistics output format
- [x] 5.6 Add integration test for CLI analyze command
