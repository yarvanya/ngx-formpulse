import type {SchemaPath} from '@angular/forms/signals';
import type {FpCountry} from 'ngx-formpulse';
import {checkPostCode, type FpPostCodeOptions, POST_CODE_VALIDATOR_KEY, readPostCodeArguments} from '../validators/post-code/post-code';
import {isFunction} from '../utilities/core.utility';
import {applySignalValidator} from './apply-signal-validator';

type CountrySource = FpCountry | null | (() => FpCountry | null);
type OptionsSource = FpPostCodeOptions | (() => FpPostCodeOptions);

function readCountryOrOptions(value_source: CountrySource | OptionsSource | undefined): FpCountry | FpPostCodeOptions | null | undefined {
  return isFunction(value_source) ? value_source() : value_source;
}

function readOptions(options_source: OptionsSource | undefined): FpPostCodeOptions | undefined {
  return isFunction(options_source) ? options_source() : options_source;
}

/**
 * Validates a Signal Forms field as a postal code of any supported country.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. Checks the format,
 * not that the postal code exists. The error has `kind: 'fpPostCode'` and the same payload as in
 * Reactive Forms. Options may be a function, read on every validation, so they can follow signals.
 *
 * @param schema_path - Field to validate.
 * @param validator_options - Locale, custom message and strict matching, or a function returning them.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpPostCode(path.postCode);
 *   fpPostCode(path.billingPostCode, () => ({strict: isStrict()}));
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode<TValue extends string | null | undefined>(schema_path: SchemaPath<TValue>, validator_options?: OptionsSource): void;
/**
 * Validates a Signal Forms field as a postal code of one country, or of any country when the country
 * is `null`.
 *
 * Empty values (`''`, `null`, `undefined`) are valid; a blank string is invalid. A country without
 * postal codes in Google libaddressinput accepts any other value. The country and the options may
 * be functions, read on every validation, so the rule follows another field of the form.
 *
 * @param schema_path - Field to validate.
 * @param country - Country, `null` for any country, or a function returning one of them.
 * @param validator_options - Locale, custom message and strict matching, or a function returning them.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpPostCode(path.postCode, FpCountry.UA);
 *   fpPostCode(path.deliveryPostCode, () => model().deliveryCountry);
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode<TValue extends string | null | undefined>(schema_path: SchemaPath<TValue>, country: CountrySource, validator_options?: OptionsSource): void;
export function fpPostCode<TValue extends string | null | undefined>(
  schema_path: SchemaPath<TValue>,
  country_or_options?: CountrySource | OptionsSource,
  validator_options?: OptionsSource
): void {
  applySignalValidator(schema_path, POST_CODE_VALIDATOR_KEY, (control_value) => {
    const [country, postCodeOptions] = readPostCodeArguments(readCountryOrOptions(country_or_options), readOptions(validator_options));
    return checkPostCode(control_value, country, postCodeOptions);
  });
}
