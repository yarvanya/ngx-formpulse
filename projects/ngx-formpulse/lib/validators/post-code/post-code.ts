import {warnOnceInDevelopment} from '../../core/development-warning';
import {isBlankText, isEmptyValue} from '../../core/empty-value';
import type {FpError, FpErrorParameters} from '../../core/fp-error';
import type {FpBaseOptions} from '../../core/fp-options';
import {resolveMessage} from '../../core/message-resolver';
import {normalizeLetterCase, normalizeWhitespace} from '../../core/normalize';
import {FpCountry} from '../../enums/fp-country';
import {isString} from '../../utilities/core.utility';
import {POST_CODE_RULES, type PostCodeRule} from './post-code.data';

/**
 * Error of {@link fpPostCode}, reported under `errors.fpPostCode`.
 *
 * - `country`: the country the value was checked against, or `null` in any-country mode.
 * - `examples`: example postal codes of that country from Google libaddressinput; empty in
 *   any-country mode.
 * - `message`: the resolved, localized message.
 *
 * @example
 * ```ts
 * const postCodeError: FpPostCodeError | undefined = control.errors?.['fpPostCode'];
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export type FpPostCodeError = FpError<{country: FpCountry | null; examples: readonly string[]}>;

/**
 * Options of {@link fpPostCode}.
 *
 * - `locale`: message locale for this validator only.
 * - `message`: custom message (string, `{parameterName}` template or function).
 * - `strict`: match the value exactly as entered; by default surrounding whitespace is ignored and
 *   letters are compared case-insensitively.
 *
 * @example
 * ```ts
 * fpPostCode(FpCountry.GB, {strict: true, locale: FpLocale.En});
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export interface FpPostCodeOptions extends FpBaseOptions<FpPostCodeError> {
  readonly strict?: boolean;
}

export const POST_CODE_VALIDATOR_KEY = 'fpPostCode';

const NO_EXAMPLES: readonly string[] = [];

function formatEnglishMessage(error_parameters: FpErrorParameters<FpPostCodeError>): string {
  const [firstExample] = error_parameters.examples;
  return firstExample === undefined ? 'Enter a valid postal code.' : `Enter a valid postal code, e.g. ${firstExample}.`;
}

function normalizePostCode(post_code: string, is_strict: boolean): string {
  return normalizeLetterCase(normalizeWhitespace(post_code, is_strict), is_strict);
}

let allPostCodeRules: readonly PostCodeRule[] | undefined;
let countryCodes: ReadonlySet<string> | undefined;

function readAllPostCodeRules(): readonly PostCodeRule[] {
  allPostCodeRules ??= Object.values(POST_CODE_RULES);
  return allPostCodeRules;
}

function isCountryCode(country: string): boolean {
  countryCodes ??= new Set<string>(Object.values(FpCountry));
  return countryCodes.has(country);
}

function findPostCodeRule(country: FpCountry): PostCodeRule | undefined {
  if (!isCountryCode(country)) {
    warnOnceInDevelopment(`fpPostCode received "${country}", which is not an FpCountry member, so any value is accepted.`);
  }
  return Object.hasOwn(POST_CODE_RULES, country) ? POST_CODE_RULES[country] : undefined;
}

function matchesPostCode(post_code: string, post_code_rule: PostCodeRule | undefined): boolean {
  if (post_code_rule === undefined) {
    return readAllPostCodeRules().some((any_post_code_rule) => any_post_code_rule.pattern.test(post_code));
  }
  return post_code_rule.pattern.test(post_code);
}

export function readPostCodeArguments(
  country_or_options: FpCountry | FpPostCodeOptions | null | undefined,
  validator_options: FpPostCodeOptions | undefined
): readonly [FpCountry | null, FpPostCodeOptions] {
  if (isString(country_or_options) || country_or_options === null) {
    return [country_or_options, validator_options ?? {}];
  }
  return [null, country_or_options ?? validator_options ?? {}];
}

export function checkPostCode(control_value: unknown, country: FpCountry | null, validator_options: FpPostCodeOptions): FpPostCodeError | null {
  if (isEmptyValue(control_value)) {
    return null;
  }
  const postCodeRule = country === null ? undefined : findPostCodeRule(country);
  const isBlank = isBlankText(control_value);
  if (!isBlank && country !== null && postCodeRule === undefined) {
    return null;
  }
  if (!isBlank && isString(control_value) && matchesPostCode(normalizePostCode(control_value, validator_options.strict ?? false), postCodeRule)) {
    return null;
  }
  const errorParameters = {
    country,
    examples: postCodeRule?.examples ?? NO_EXAMPLES
  };
  const message = resolveMessage({
    validatorKey: POST_CODE_VALIDATOR_KEY,
    englishMessage: formatEnglishMessage,
    errorParameters,
    inlineLocale: validator_options.locale,
    inlineMessage: validator_options.message
  });
  return {...errorParameters, message};
}
