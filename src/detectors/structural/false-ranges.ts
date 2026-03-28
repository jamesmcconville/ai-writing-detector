export interface FalseRangeMatch {
  text: string;
  position: number;
}

export function detectFalseRanges(text: string): FalseRangeMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: FalseRangeMatch[] = [];

  const pattern = /\bfrom\s+(\w+(?:\s+\w+){0,3})\s+to\s+(\w+(?:\s+\w+){0,3})\b/gi;

  const allMatches = text.matchAll(pattern);

  for (const match of allMatches) {
    if (match.index !== undefined) {
      matches.push({
        text: match[0],
        position: match.index,
      });
    }
  }

  return matches;
}
