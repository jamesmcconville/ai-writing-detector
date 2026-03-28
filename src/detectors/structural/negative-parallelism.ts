export interface NegativeParallelismMatch {
  text: string;
  position: number;
  type: string;
}

export function detectNegativeParallelism(text: string): NegativeParallelismMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: NegativeParallelismMatch[] = [];

  const patterns = [
    {
      pattern: /\bnot\s+only\b[^.]*?\bbut\s+also\b/gi,
      type: 'not-only-but-also',
    },
    {
      pattern: /\bnot\s+just\b[^.]*?\bbut\b[^.]*(?:\balso\b)?/gi,
      type: 'not-just-but',
    },
    {
      pattern: /\bnot\s+merely\b[^.]*?\bbut\b[^.]*(?:\balso\b)?/gi,
      type: 'not-merely-but',
    },
  ];

  for (const { pattern, type } of patterns) {
    const allMatches = text.matchAll(pattern);

    for (const match of allMatches) {
      if (match.index !== undefined) {
        matches.push({
          text: match[0],
          position: match.index,
          type,
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}
