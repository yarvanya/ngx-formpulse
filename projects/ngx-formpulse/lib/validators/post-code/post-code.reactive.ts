import type {ValidatorFn} from '@angular/forms';
import {toReactiveValidator} from '../../adapters/to-reactive-validator';
import type {FpCountry} from '../../enums/fp-country';
import {checkPostCode, type FpPostCodeOptions, POST_CODE_VALIDATOR_KEY, readPostCodeArguments} from './post-code';

/**
 * Validates a postal code against the format of any supported country.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. The value matches
 * when it fits the format of at least one country in Google libaddressinput. Checks the format, not
 * that the postal code exists.
 *
 * @param validator_options - Locale, custom message and strict matching.
 * @returns A Reactive Forms validator reporting {@link FpPostCodeError} under `errors.fpPostCode`.
 *
 * @example
 * ```ts
 * new FormControl('', [fpPostCode()]);
 * new FormControl('', [fpPostCode({message: 'Check the postal code.'})]);
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode(validator_options?: FpPostCodeOptions): ValidatorFn;
/**
 * Validates a postal code against the format of one country, or of any country when `country` is `null`.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. A country without
 * postal codes in Google libaddressinput accepts any other value. Checks the format, not that the
 * postal code exists.
 *
 * @param country - Country whose format the value must match; `null` means any country.
 * @param validator_options - Locale, custom message and strict matching.
 * @returns A Reactive Forms validator reporting {@link FpPostCodeError} under `errors.fpPostCode`.
 *
 * @example
 * ```ts
 * new FormControl('', [fpPostCode(FpCountry.UA)]);
 * new FormControl('', [fpPostCode(FpCountry.GB, {strict: true})]);
 * new FormControl('', [fpPostCode(selectedCountry ?? null)]);
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode(country: FpCountry | null, validator_options?: FpPostCodeOptions): ValidatorFn;
export function fpPostCode(country_or_options?: FpCountry | FpPostCodeOptions | null, validator_options?: FpPostCodeOptions): ValidatorFn {
  const [country, postCodeOptions] = readPostCodeArguments(country_or_options, validator_options);
  return toReactiveValidator(POST_CODE_VALIDATOR_KEY, (control_value) => checkPostCode(control_value, country, postCodeOptions));
}
