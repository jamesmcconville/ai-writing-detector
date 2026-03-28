import { detectUndueEmphasis, type EmphasisMatch } from './emphasis.js';
import { detectPromotionalLanguage, type PromotionalMatch } from './promotional.js';
import { detectElegantVariation, type ElegantVariationMatch } from './elegant-variation.js';

export interface PromotionalMatches {
  undueEmphasis: EmphasisMatch[];
  promotionalLanguage: PromotionalMatch[];
  elegantVariation: ElegantVariationMatch[];
}

export function aggregatePromotionalPatterns(text: string): PromotionalMatches {
  return {
    undueEmphasis: detectUndueEmphasis(text),
    promotionalLanguage: detectPromotionalLanguage(text),
    elegantVariation: detectElegantVariation(text),
  };
}
