const CITATION_PATTERNS = [
  /\b(19|20)\d{2}\b/,
  /\b[A-Z][a-z]+\s+et\s+al\.?/,
  /\b[A-Z][a-z]+\s*\(\d{4}\)/,
  /\baccording\s+to\s+[A-Z][a-z]+/i,
  /\b(?:published|reported|found)\s+in\s+[A-Z]/i,
  /\b(?:journal|nature|science|cell|lancet|bmj)\b/i,
  /\bdoi:/i,
  /https?:\/\//,
  /\b[A-Z][a-z]+\s+and\s+[A-Z][a-z]+\s+\(\d{4}\)/,
];

export function hasLegitimateCitation(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }

  return CITATION_PATTERNS.some((pattern) => pattern.test(text));
}

export function countLegitimateCitations(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  let count = 0;
  for (const pattern of CITATION_PATTERNS) {
    const matches = text.match(new RegExp(pattern.source, 'g'));
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}
