import {checkSync} from 'recheck';
import type {FoundRegularExpression} from './regular-expression-finder';

export interface RegularExpressionVerdict {
  readonly expression: FoundRegularExpression;
  readonly status: 'safe' | 'vulnerable' | 'unknown';
}

export function checkRegularExpressions(found_expressions: readonly FoundRegularExpression[]): RegularExpressionVerdict[] {
  return found_expressions.map((expression) => ({
    expression,
    status: checkSync(expression.source, expression.flags).status
  }));
}

export function selectUnsafeVerdicts(verdicts: readonly RegularExpressionVerdict[]): RegularExpressionVerdict[] {
  return verdicts.filter((verdict) => verdict.status !== 'safe');
}
