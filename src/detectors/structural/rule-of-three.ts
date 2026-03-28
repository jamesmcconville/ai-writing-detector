export interface RuleOfThreeMatch {
  text: string;
  position: number;
}

export function detectRuleOfThree(text: string): RuleOfThreeMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: RuleOfThreeMatch[] = [];

  const pattern = /\b([^,]+),\s+([^,]+),\s+and\s+([^,.]+)/gi;

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
