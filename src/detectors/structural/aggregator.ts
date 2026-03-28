import { detectRuleOfThree, type RuleOfThreeMatch } from './rule-of-three.js';
import {
  detectNegativeParallelism,
  type NegativeParallelismMatch,
} from './negative-parallelism.js';
import { detectOutlineConclusions, type OutlineConclusionMatch } from './outline-conclusions.js';
import { detectFalseRanges, type FalseRangeMatch } from './false-ranges.js';

export interface StructuralMatches {
  ruleOfThree: RuleOfThreeMatch[];
  negativeParallelism: NegativeParallelismMatch[];
  outlineConclusions: OutlineConclusionMatch[];
  falseRanges: FalseRangeMatch[];
}

export function aggregateStructuralPatterns(text: string): StructuralMatches {
  return {
    ruleOfThree: detectRuleOfThree(text),
    negativeParallelism: detectNegativeParallelism(text),
    outlineConclusions: detectOutlineConclusions(text),
    falseRanges: detectFalseRanges(text),
  };
}
