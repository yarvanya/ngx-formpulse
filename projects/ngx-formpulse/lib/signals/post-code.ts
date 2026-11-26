import type {SchemaPath} from '@angular/forms/signals';
import type {FpCountry} from 'ngx-formpulse';
import {checkPostCode, type FpPostCodeOptions, POST_CODE_VALIDATOR_KEY, readPostCodeArguments} from '../validators/post-code/post-code';
import {applySignalValidator} from './apply-signal-validator';

/**
 * Validates a Signal Forms field as a postal code of any supported country.
 *
 * Empty values are valid. Checks the format, not that the postal code exists. The error has
 * `kind: 'fpPostCode'` and the same payload as in Reactive Forms.
 *
 * @param schema_path - Field to validate.
 * @param validator_options - Locale, custom message and strict matching.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpPostCode(path.postCode);
 *   fpPostCode(path.billingPostCode, {locale: FpLocale.En});
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode<TValue extends string | null | undefined>(schema_path: SchemaPath<TValue>, validator_options?: FpPostCodeOptions): void;
/**
 * Validates a Signal Forms field as a postal code of one country.
 *
 * Empty values are valid. A country without postal codes in Google libaddressinput accepts any
 * value. Checks the format, not that the postal code exists.
 *
 * @param schema_path - Field to validate.
 * @param country - Country whose format the value must match.
 * @param validator_options - Locale, custom message and strict matching.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpPostCode(path.postCode, FpCountry.UA);
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fppostcode
 */
export function fpPostCode<TValue extends string | null | undefined>(schema_path: SchemaPath<TValue>, country: FpCountry, validator_options?: FpPostCodeOptions): void;
export function fpPostCode<TValue extends string | null | undefined>(
  schema_path: SchemaPath<TValue>,
  country_or_options?: FpCountry | FpPostCodeOptions,
  validator_options?: FpPostCodeOptions
): void {
  const [country, postCodeOptions] = readPostCodeArguments(country_or_options, validator_options);
  applySignalValidator(schema_path, POST_CODE_VALIDATOR_KEY, (control_value) => checkPostCode(control_value, country, postCodeOptions));
}
