export interface OutlineConclusionMatch {
  text: string;
  position: number;
}

export function detectOutlineConclusions(text: string): OutlineConclusionMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: OutlineConclusionMatch[] = [];

  const patterns = [
    /\bdespite\s+(?:these|the|such)\s+\w+,\s*\w+\s+offers?\b/gi,
    /\bdespite\s+\w+,\s*\w+\s+(?:offers|provides|presents|brings|delivers)\b/gi,
    /\bin\s+conclusion\b[^.]*\./gi,
    /\bin\s+summary\b[^.]*\./gi,
    /\bto\s+conclude\b[^.]*\./gi,
    /\bto\s+summarize\b[^.]*\./gi,
    /\boverall,\s+[^.]*\b(?:provides|offers|demonstrates|shows|suggests)\b/gi,
    /\bwhile\s+\w+\s+(?:presents|poses)\s+\w+,\s*it\s+also\s+(?:offers|provides)\b/gi,
  ];

  for (const pattern of patterns) {
    const allMatches = text.matchAll(pattern);

    for (const match of allMatches) {
      if (match.index !== undefined) {
        matches.push({
          text: match[0],
          position: match.index,
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}
