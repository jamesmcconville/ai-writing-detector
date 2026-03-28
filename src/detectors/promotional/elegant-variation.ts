export const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['company', 'organization', 'firm', 'enterprise', 'business', 'corporation', 'entity'],
  ['user', 'customer', 'client', 'consumer', 'patron', 'member', 'subscriber'],
  ['product', 'offering', 'solution', 'service', 'platform', 'tool', 'application'],
  ['team', 'group', 'squad', 'unit', 'division', 'department', 'crew'],
  ['leader', 'manager', 'director', 'head', 'chief', 'executive', 'principal'],
  ['goal', 'objective', 'target', 'aim', 'purpose', 'mission', 'ambition'],
  ['strategy', 'approach', 'method', 'technique', 'tactic', 'plan', 'methodology'],
  ['problem', 'issue', 'challenge', 'difficulty', 'obstacle', 'hurdle', 'barrier'],
  ['solution', 'answer', 'resolution', 'remedy', 'fix', 'cure', 'antidote'],
  ['benefit', 'advantage', 'pro', 'upside', 'perk', 'gain', 'value'],
  ['feature', 'capability', 'function', 'functionality', 'attribute', 'characteristic'],
  ['analysis', 'study', 'research', 'examination', 'investigation', 'review', 'assessment'],
  ['result', 'outcome', 'finding', 'conclusion', 'effect', 'impact', 'consequence'],
  ['process', 'procedure', 'workflow', 'system', 'method', 'practice', 'routine'],
  ['data', 'information', 'insights', 'intelligence', 'knowledge', 'facts', 'statistics'],
];

export interface ElegantVariationMatch {
  group: string[];
  found: string[];
  count: number;
}

export function detectElegantVariation(text: string): ElegantVariationMatch[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const matches: ElegantVariationMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const group of SYNONYM_GROUPS) {
    const found: string[] = [];

    for (const term of group) {
      const pattern = new RegExp(`\\b${escapeRegex(term)}s?\\b`, 'gi');
      if (pattern.test(lowerText)) {
        found.push(term);
      }
    }

    // Only count as elegant variation if 2+ DIFFERENT terms from the group are used
    if (found.length >= 2) {
      matches.push({
        group: [...group],
        found: found,
        count: found.length,
      });
    }
  }

  return matches;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
