export class EmptyInputError extends Error {
  constructor(message = 'Input text cannot be empty') {
    super(message);
    this.name = 'EmptyInputError';
  }
}

export function validateInput(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new EmptyInputError();
  }
}
