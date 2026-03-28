import { detectVagueAttribution, type VagueAttributionMatch } from './attribution.js';
import { detectSuperficialAnalysis, type SuperficialMatch } from './superficial.js';
import { detectOvergeneralization, type OvergeneralizationMatch } from './overgeneralization.js';
import { countLegitimateCitations } from './legitimate-citations.js';

export interface VagueClaimsMatches {
  vagueAttributions: VagueAttributionMatch[];
  superficialAnalysis: SuperficialMatch[];
  overgeneralizations: OvergeneralizationMatch[];
  legitimateCitations: number;
}

export function aggregateVagueClaims(text: string): VagueClaimsMatches {
  return {
    vagueAttributions: detectVagueAttribution(text),
    superficialAnalysis: detectSuperficialAnalysis(text),
    overgeneralizations: detectOvergeneralization(text),
    legitimateCitations: countLegitimateCitations(text),
  };
}
