import {metadata, REQUIRED, type SchemaPath} from '@angular/forms/signals';
import {checkRequired, type FpRequiredOptions, REQUIRED_VALIDATOR_KEY} from '../validators/required/required';
import {isFunction} from '../utilities/core.utility';
import {applySignalValidator} from './apply-signal-validator';

/**
 * Requires a value of any type in a Signal Forms field and marks the field as required.
 *
 * Missing: `null`, `undefined`, an empty or blank string, `NaN`, an invalid `Date`, and an empty array,
 * `Set`, `Map` or `FileList`. Filled: every other value, including `0`, `false` and `{}`. Like Angular
 * `required()`, it sets the `REQUIRED` metadata, so `field().required()` is `true` and a bound input gets
 * the `required` attribute. The error has `kind: 'fpRequired'` and the same payload as in Reactive Forms.
 * Options may be a function, read on every validation.
 *
 * @param schema_path - Field to validate.
 * @param validator_options - Locale and custom message, or a function returning them.
 *
 * @example
 * ```ts
 * form(model, (path) => {
 *   fpRequired(path.name);
 *   fpRequired(path.quantity, {message: 'Enter a quantity.'});
 * });
 * ```
 *
 * @see https://github.com/yarvanya/ngx-formpulse#fprequired
 */
export function fpRequired<TValue>(schema_path: SchemaPath<TValue>, validator_options: FpRequiredOptions | (() => FpRequiredOptions) = {}): void {
  metadata(schema_path, REQUIRED, () => true);
  applySignalValidator(schema_path, REQUIRED_VALIDATOR_KEY, (control_value) => checkRequired(control_value, isFunction(validator_options) ? validator_options() : validator_options));
}
