import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileInput } from '@/input/file.js';
import { readStdinInput } from '@/input/stdin.js';
import { validateInput, EmptyInputError } from '@/input/validator.js';
import { displayStatistics } from '@/output/display.js';
import fs from 'fs';
import path from 'path';

// ============================================================================
// File Input Handler Tests (Task 1.5)
// ============================================================================

describe('readFileInput', () => {
  const testDir = path.join(process.cwd(), 'samples', 'test-fixtures');
  const testFile = path.join(testDir, 'test-input.txt');
  const testContent = 'Hello world this is a test.';

  beforeEach(() => {
    // Create test fixtures directory and file
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(testFile, testContent);
  });

  afterEach(() => {
    // Clean up test fixtures
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it('should read file content successfully', async () => {
    const result = await readFileInput(testFile);
    expect(result).toBe(testContent);
  });

  it('should throw error for non-existent file', async () => {
    const nonExistent = path.join(testDir, 'does-not-exist.txt');
    await expect(readFileInput(nonExistent)).rejects.toThrow(/not found|ENOENT/);
  });

  it('should read empty file', async () => {
    const emptyFile = path.join(testDir, 'empty.txt');
    fs.writeFileSync(emptyFile, '');
    const result = await readFileInput(emptyFile);
    expect(result).toBe('');
    fs.unlinkSync(emptyFile);
  });

  it('should read file with unicode content', async () => {
    const unicodeFile = path.join(testDir, 'unicode.txt');
    const unicodeContent = 'Hello 世界 🌍 café';
    fs.writeFileSync(unicodeFile, unicodeContent);
    const result = await readFileInput(unicodeFile);
    expect(result).toBe(unicodeContent);
    fs.unlinkSync(unicodeFile);
  });
});

// ============================================================================
// Stdin Input Handler Tests (Task 1.6)
// ============================================================================

describe('readStdinInput', () => {
  it('should read from stdin', async () => {
    const testInput = 'Test input from stdin';

    // Mock stdin
    const originalStdin = process.stdin;
    const mockStdin = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (chunk?: string) => void) => {
        if (event === 'data') {
          callback(testInput);
        }
        if (event === 'end') {
          callback();
        }
      }),
      resume: vi.fn(),
    };

    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true,
    });

    const result = await readStdinInput();
    expect(result).toBe(testInput);

    Object.defineProperty(process, 'stdin', {
      value: originalStdin,
      writable: true,
    });
  });

  it('should return empty string for empty stdin', async () => {
    const originalStdin = process.stdin;
    const mockStdin = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (chunk?: string) => void) => {
        if (event === 'end') {
          callback();
        }
      }),
      resume: vi.fn(),
    };

    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true,
    });

    const result = await readStdinInput();
    expect(result).toBe('');

    Object.defineProperty(process, 'stdin', {
      value: originalStdin,
      writable: true,
    });
  });

  it('should concatenate multiple chunks from stdin', async () => {
    const chunks = ['First chunk ', 'second chunk ', 'third chunk'];
    const expected = chunks.join('');

    const originalStdin = process.stdin;
    const dataCallbacks: Array<(chunk: string) => void> = [];
    const endCallbacks: Array<() => void> = [];
    const mockStdin = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (chunk?: string) => void) => {
        if (event === 'data') {
          dataCallbacks.push(callback as (chunk: string) => void);
        }
        if (event === 'end') {
          endCallbacks.push(callback as () => void);
        }
      }),
      resume: vi.fn(() => {
        setImmediate(() => {
          for (const chunk of chunks) {
            for (const cb of dataCallbacks) {
              cb(chunk);
            }
          }
          for (const cb of endCallbacks) {
            cb();
          }
        });
      }),
    };

    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true,
    });

    const result = await readStdinInput();
    expect(result).toBe(expected);

    Object.defineProperty(process, 'stdin', {
      value: originalStdin,
      writable: true,
    });
  });
});

// ============================================================================
// Input Validation Tests (Task 1.7)
// ============================================================================

describe('validateInput', () => {
  it('should throw EmptyInputError for empty string', () => {
    expect(() => validateInput('')).toThrow(EmptyInputError);
  });

  it('should throw EmptyInputError for whitespace-only string', () => {
    expect(() => validateInput('   ')).toThrow(EmptyInputError);
    expect(() => validateInput('\t\n')).toThrow(EmptyInputError);
    expect(() => validateInput('\n\n\n')).toThrow(EmptyInputError);
  });

  it('should not throw for valid text', () => {
    expect(() => validateInput('Hello world')).not.toThrow();
    expect(() => validateInput('a')).not.toThrow();
    expect(() => validateInput('  text with leading space  ')).not.toThrow();
  });

  it('should have correct error message', () => {
    try {
      validateInput('');
    } catch (error) {
      expect(error).toBeInstanceOf(EmptyInputError);
      expect((error as Error).message).toContain('empty');
    }
  });
});

describe('EmptyInputError', () => {
  it('should have correct name', () => {
    const error = new EmptyInputError();
    expect(error.name).toBe('EmptyInputError');
  });

  it('should have default message', () => {
    const error = new EmptyInputError();
    expect(error.message).toContain('empty');
  });

  it('should accept custom message', () => {
    const customMessage = 'Custom empty input message';
    const error = new EmptyInputError(customMessage);
    expect(error.message).toBe(customMessage);
  });
});

// ============================================================================
// Display Statistics Tests (Task 1.8)
// ============================================================================

describe('displayStatistics', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should display character count', () => {
    const text = 'Hello world';
    displayStatistics(text);

    const output = consoleSpy.mock.calls.map((call) => call.join('')).join('\n');
    expect(output).toContain('Characters: 11');
  });

  it('should display word count', () => {
    const text = 'Hello world this is a test';
    displayStatistics(text);

    const output = consoleSpy.mock.calls.map((call) => call.join('')).join('\n');
    expect(output).toContain('Words: 6');
  });

  it('should include "Text Statistics:" header', () => {
    const text = 'Test';
    displayStatistics(text);

    const output = consoleSpy.mock.calls.map((call) => call.join('')).join('\n');
    expect(output).toContain('Text Statistics:');
  });

  it('should handle empty text', () => {
    displayStatistics('');

    const output = consoleSpy.mock.calls.map((call) => call.join('')).join('\n');
    expect(output).toContain('Characters: 0');
    expect(output).toContain('Words: 0');
  });

  it('should handle unicode text', () => {
    const text = 'Hello 世界';
    displayStatistics(text);

    const output = consoleSpy.mock.calls.map((call) => call.join('')).join('\n');
    expect(output).toContain('Characters: 8');
  });
});
